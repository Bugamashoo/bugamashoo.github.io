// keybinds.js — Keyboard shortcuts for Controls tab
// Load order: after reactor4 (switches/levers/knobs built), after reactor9 (doScram/sI/eI)

(function() {
  // ── Switch bank 1 (keys 1-8) ──
  const SWITCH_BANK = [
    'auxPower','radShield','fuelPumps','coolantPumps',
    'magCoils','ignPrime','turbineEngage','gridSync'
  ];

  // ── Lever mappings: key → [leverId, value] ──
  const LEVER_KEYS = {
    q:['containPower',100], a:['containPower',50], z:['containPower',0],
    w:['fuelInject',100],   s:['fuelInject',50],   x:['fuelInject',0],
    e:['mainThrottle',100], d:['mainThrottle',50],  c:['mainThrottle',0],
    r:['coolantFlow',100],  f:['coolantFlow',50],   v:['coolantFlow',0]
  };

  // ── Knob mappings: key → [knobId, value] ──
  const KNOB_KEYS = {
    t:['pressureRelief',5],  y:['pressureRelief',50], u:['pressureRelief',95],
    g:['mixRatio',5],        h:['mixRatio',50],       j:['mixRatio',95],
    b:['fieldTune',5],       n:['fieldTune',50],      m:['fieldTune',95]
  };

  // ── Money cheat: hold K+L+9+0 simultaneously ──
  const cheatKeys = { k: false, l: false, '9': false, '0': false };
  let cheatCooldown = false;
  function checkCheat() {
    if (cheatKeys.k && cheatKeys.l && cheatKeys['9'] && cheatKeys['0'] && !cheatCooldown) {
      cheatCooldown = true;
      S.money += 100000000;
      S.totalEarned += 100000000;
      addLog('DEBUG: +$100m', 'sys');
      setTimeout(() => { cheatCooldown = false; }, 500);
    }
  }

  // ── Selected control tracking ──
  let selectedLever = null;  // lever id
  let selectedKnob  = null;  // knob id

  // ── Visual highlight helpers ──
  function highlightLever(id) {
    // Remove previous highlight
    document.querySelectorAll('.lever-handle.kb-selected').forEach(el => el.classList.remove('kb-selected'));
    if (!id) return;
    const tr = document.querySelector('#leverRow [data-lever="' + id + '"]');
    if (tr) tr.querySelector('.lever-handle').classList.add('kb-selected');
  }

  function highlightKnob(id) {
    document.querySelectorAll('.knob.kb-selected-knob').forEach(el => el.classList.remove('kb-selected-knob'));
    if (!id) return;
    const groups = document.querySelectorAll('#knobPanel .knob-group');
    const knobIds = ['pressureRelief','mixRatio','fieldTune'];
    const idx = knobIds.indexOf(id);
    if (idx >= 0 && groups[idx]) groups[idx].querySelector('.knob').classList.add('kb-selected-knob');
  }

  // ── Tab check ──
  function controlsTabActive() {
    const btn = document.querySelector('.tab-btn[data-tab="controls"]');
    return btn && btn.classList.contains('active');
  }

  // ── Lever accessibility check (mirrors setupLev guards) ──
  function leverBlocked(id) {
    if (S.modules.comms.status === 'offline') {
      if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
      return true;
    }
    if (S.modules.comms.sysError && commsLockedControls.includes(id)) {
      addLog('COMMS ERROR - control unresponsive, please restart system', 'err');
      return true;
    }
    return false;
  }

  // ── Knob accessibility check (mirrors knob guards + tuning lock) ──
  function knobBlocked(id) {
    if (!unlockedTuning) return true;
    if (S.modules.comms.status === 'offline') {
      if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
      return true;
    }
    if (S.modules.comms.sysError && commsLockedControls.includes(id)) {
      addLog('COMMS ERROR - control unresponsive, please restart system', 'err');
      return true;
    }
    return false;
  }

  // ── Set lever value + sync visual ──
  function setLever(id, val) {
    if (leverBlocked(id)) return;
    S[id] = val;
    const tr = document.querySelector('#leverRow [data-lever="' + id + '"]');
    if (tr) {
      const h  = tr.querySelector('.lever-handle');
      const hH = h.offsetHeight;
      const ht = tr.offsetHeight - hH;
      if (ht > 0) {
        h.style.bottom = 'auto';
        h.style.top = (1 - val / 100) * ht + 'px';
      }
    }
    const ro = document.getElementById('readout_' + id);
    if (ro) ro.textContent = val + '%';
    checkSeq();
  }

  // ── Set knob value + sync visual ──
  function setKnob(id, val) {
    if (knobBlocked(id)) return;
    S[id] = val;
    // Find the knob element by matching knob group order
    const knobIds = ['pressureRelief','mixRatio','fieldTune'];
    const idx = knobIds.indexOf(id);
    const groups = document.querySelectorAll('#knobPanel .knob-group');
    if (idx >= 0 && groups[idx]) {
      const knobEl = groups[idx].querySelector('.knob');
      knobEl.style.transform = 'rotate(' + ((val / 100) * 270 - 135) + 'deg)';
    }
    const ro = document.getElementById('readout_' + id);
    if (ro) ro.textContent = val + '%';
  }

  // ── SCRAM hold state ──
  let escHoldStart = 0;
  let escHoldTimer = null;

  // ── Ignition hold state ──
  let spaceHeld = false;

  // ── Intercept mouse interactions to update selected lever/knob ──
  // Levers: detect mousedown/touchstart on lever handles in #leverRow
  document.getElementById('leverRow').addEventListener('mousedown', function(e) {
    const tr = e.target.closest('[data-lever]');
    if (tr) { selectedLever = tr.dataset.lever; highlightLever(selectedLever); }
  }, true);
  document.getElementById('leverRow').addEventListener('touchstart', function(e) {
    const tr = e.target.closest('[data-lever]');
    if (tr) { selectedLever = tr.dataset.lever; highlightLever(selectedLever); }
  }, true);

  // Knobs: detect mousedown/touchstart on knob housings in #knobPanel
  document.getElementById('knobPanel').addEventListener('mousedown', function(e) {
    const housing = e.target.closest('.knob-housing');
    if (housing) {
      const group = housing.closest('.knob-group');
      const groups = document.querySelectorAll('#knobPanel .knob-group');
      const knobIds = ['pressureRelief','mixRatio','fieldTune'];
      groups.forEach((g, i) => { if (g === group) { selectedKnob = knobIds[i]; highlightKnob(selectedKnob); } });
    }
  }, true);
  document.getElementById('knobPanel').addEventListener('touchstart', function(e) {
    const housing = e.target.closest('.knob-housing');
    if (housing) {
      const group = housing.closest('.knob-group');
      const groups = document.querySelectorAll('#knobPanel .knob-group');
      const knobIds = ['pressureRelief','mixRatio','fieldTune'];
      groups.forEach((g, i) => { if (g === group) { selectedKnob = knobIds[i]; highlightKnob(selectedKnob); } });
    }
  }, true);

  // ── Keydown handler ──
  document.addEventListener('keydown', function(e) {
    // Not started or game over — ignore everything
    if (!window.introStarted || S.gameOver) return;

    // Cheat key tracking
    const ck = e.key.toLowerCase();
    if (ck in cheatKeys) { cheatKeys[ck] = true; checkCheat(); }

    // ESC — SCRAM hold (works regardless of tab)
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!escHoldStart && !S.scramActive) {
        escHoldStart = Date.now();
        escHoldTimer = setTimeout(function() {
          if (escHoldStart) {
            doScram();
            escHoldStart = 0;
            escHoldTimer = null;
          }
        }, 3000);
      }
      return;
    }

    // Space — Ignition hold (controls tab only)
    if (e.key === ' ') {
      e.preventDefault();
      if (!controlsTabActive()) return;
      if (spaceHeld) return;
      // Same comms guard as ignBtn
      if (S.modules.comms.status === 'offline') {
        if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
        return;
      }
      spaceHeld = true;
      document.getElementById('ignBtn').classList.add('active-amber');
      sI();
      return;
    }

    // All remaining keybinds require controls tab
    if (!controlsTabActive()) return;

    const key = e.key.toLowerCase();

    // ── 1-8: switch bank toggles ──
    const switchIdx = parseInt(key, 10) - 1;
    if (switchIdx >= 0 && switchIdx < 8) {
      e.preventDefault();
      const id = SWITCH_BANK[switchIdx];
      const el = document.querySelector('#switchBank1 [data-switch="' + id + '"]');
      if (!el) return;
      // togSw handles all blocking checks internally
      togSw(id, el);
      // Animate + sparks (mirrors setupKnifeSwitch click path)
      const sparkCb = S[id] ? function() { spawnSwitchSparks(el); } : null;
      animateKnifeSwitch(el, !!S[id], sparkCb);
      return;
    }

    // ── Lever keys ──
    if (LEVER_KEYS[key]) {
      e.preventDefault();
      const def = LEVER_KEYS[key];
      selectedLever = def[0];
      highlightLever(selectedLever);
      setLever(def[0], def[1]);
      return;
    }

    // ── Knob keys ──
    if (KNOB_KEYS[key]) {
      e.preventDefault();
      const def = KNOB_KEYS[key];
      selectedKnob = def[0];
      highlightKnob(selectedKnob);
      setKnob(def[0], def[1]);
      return;
    }

    // ── Arrow keys: increment/decrement selected control ──
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      if (!selectedLever) return;
      if (leverBlocked(selectedLever)) return;
      const delta = e.key === 'ArrowUp' ? 5 : -5;
      const newVal = Math.max(0, Math.min(100, S[selectedLever] + delta));
      setLever(selectedLever, newVal);
      return;
    }

    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (!selectedKnob) return;
      if (knobBlocked(selectedKnob)) return;
      // Left = decrement, Right = increment
      const delta = e.key === 'ArrowRight' ? 5 : -5;
      const newVal = Math.max(5, Math.min(95, S[selectedKnob] + delta));
      setKnob(selectedKnob, newVal);
      return;
    }
  });

  // ── Keyup handler ──
  document.addEventListener('keyup', function(e) {
    const ckUp = e.key.toLowerCase();
    if (ckUp in cheatKeys) cheatKeys[ckUp] = false;
    if (!window.introStarted) return;
    if (e.key === 'Escape') {
      if (escHoldTimer) { clearTimeout(escHoldTimer); escHoldTimer = null; }
      escHoldStart = 0;
      return;
    }

    if (e.key === ' ') {
      if (spaceHeld) {
        spaceHeld = false;
        document.getElementById('ignBtn').classList.remove('active-amber');
        eI();
      }
      return;
    }
  });
})();
