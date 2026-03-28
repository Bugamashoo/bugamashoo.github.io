// reactor4.js - CONTROL UI BUILDERS
// Load order: 4th (after reactor1, reactor3)
// Builds: tabs, switch banks, lever rows, knobs, push buttons

// Tab navigation ───────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    b.classList.remove('tab-pulse');
    document.getElementById('tab-' + b.dataset.tab).classList.add('active');
    if (b.dataset.tab === 'systems') buildSys();
  });
});

// Hamburger menu for mobile ────────────────────────────────
(function() {
  const menuBtn = document.getElementById('tabMenuBtn');
  const dropdown = document.getElementById('tabMenuDropdown');
  if (!menuBtn || !dropdown) return;

  menuBtn.addEventListener('click', e => {
    e.stopPropagation();
    dropdown.classList.toggle('active');
    menuBtn.classList.toggle('active', dropdown.classList.contains('active'));
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('active');
    menuBtn.classList.remove('active');
  });

  dropdown.querySelectorAll('.tab-menu-item').forEach(item => {
    item.addEventListener('click', e => {
      e.stopPropagation();
      const tab = item.dataset.tab;
      // Deactivate all main tab buttons
      document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
      // Deactivate other menu items
      dropdown.querySelectorAll('.tab-menu-item').forEach(x => x.classList.remove('active'));
      // Activate selected
      item.classList.add('active');
      menuBtn.classList.add('active');
      document.getElementById('tab-' + tab).classList.add('active');
      dropdown.classList.remove('active');
      if (tab === 'systems') buildSys();
    });
  });

  // When a main tab button is clicked, clear menu item active states
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => {
      dropdown.querySelectorAll('.tab-menu-item').forEach(x => x.classList.remove('active'));
      menuBtn.classList.remove('active');
    });
  });
})();

// Knife switch geometry constants ──────────────────────────
const KS = {
  HINGE_Y: 42,       // pivot Y in switch coords
  UP_Y: 14,           // handle center Y when OFF (up)
  DOWN_Y: 70,         // handle center Y when ON (down)
  H_H: 12,            // handle height
  PL_X: 13,           // left pivot X (post center)
  PR_X: 37,           // right pivot X (post center)
  HL_X: 15,            // handle left attachment X (just inside red edge)
  HR_X: 35            // handle right attachment X (just inside red edge)
};

// Switch IDs that live on the main controls panel (blocked when comms offline)
const MAIN_PANEL_SWITCH_IDS = new Set([
  'auxPower','radShield','fuelPumps','coolantPumps','magCoils',
  'ignPrime','turbineEngage','gridSync','ventSystem','containField'
]);

// Switch banks ─────────────────────────────────────────────
function buildSB(cid, defs) {
  const c = document.getElementById(cid);
  if (!c) return;
  defs.forEach(d => {
    const g = document.createElement('div');
    g.className = 'switch-group';
    g.innerHTML =
      `<div class="switch-name">${d.label}</div>` +
      `<div class="knife-switch" data-switch="${d.id}">` +
        `<div class="ks-cap"></div>` +
        `<div class="ks-post ks-post-left"></div>` +
        `<div class="ks-post ks-post-right"></div>` +
        `<div class="ks-hinge"></div>` +
        `<div class="ks-arm ks-arm-left"></div>` +
        `<div class="ks-arm ks-arm-right"></div>` +
        `<div class="ks-handle"></div>` +
        `<div class="ks-contact"></div>` +
      `</div>` +
      `<div class="switch-indicator"></div>`;
    c.appendChild(g);
    const ks = g.querySelector('.knife-switch');
    const initOn = !!S[d.id];
    ks.classList.toggle('on', initOn);
    positionKnifeSwitch(ks, initOn);
    setupKnifeSwitch(ks, d.id);
  });
}

function positionKnifeSwitch(el, isOn, centerY) {
  if (centerY === undefined) centerY = isOn ? KS.DOWN_Y : KS.UP_Y;
  const handle = el.querySelector('.ks-handle');
  const arms   = el.querySelectorAll('.ks-arm');
  handle.style.top = (centerY - KS.H_H / 2) + 'px';

  // Left arm: hinge (PL_X, HINGE_Y) > handle left (HL_X, centerY)
  const ldx = KS.HL_X - KS.PL_X, ldy = centerY - KS.HINGE_Y;
  const lLen = Math.sqrt(ldx * ldx + ldy * ldy);
  arms[0].style.height = lLen + 'px';
  arms[0].style.transform = `rotate(${Math.atan2(ldx, ldy) * 180 / Math.PI}deg)`;

  // Right arm: hinge (PR_X, HINGE_Y) > handle right (HR_X, centerY)
  const rdx = KS.HR_X - KS.PR_X, rdy = centerY - KS.HINGE_Y;
  const rLen = Math.sqrt(rdx * rdx + rdy * rdy);
  arms[1].style.height = rLen + 'px';
  arms[1].style.transform = `rotate(${Math.atan2(rdx, rdy) * 180 / Math.PI}deg)`;
}

// Global helper so reactor9 can sync visuals after scram/reset
function syncKnifeSwitches() {
  document.querySelectorAll('.knife-switch').forEach(sw => {
    const on = !!S[sw.dataset.switch];
    sw.classList.toggle('on', on);
    positionKnifeSwitch(sw, on);
  });
}

function togSw(id, el) {
  if (S.modules.comms.status === 'offline' && MAIN_PANEL_SWITCH_IDS.has(id)) {
    if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
    return;
  }
  if (S.scramActive && !['auxPower','backupGen','emergVent','emergDump','rodSafetyOff'].includes(id)) return;
  const mm = { fuelPumps:'fuel', coolantPumps:'coolant', gridSync:'grid', magCoils:'magnetic' };
  if (mm[id]) {
    const m = S.modules[mm[id]];
    if (m.status === 'offline') { addLog('BLOCKED: ' + mm[id] + ' offline', 'err'); return; }
  }
  S[id] = S[id] ? 0 : 1;
  el.classList.toggle('on', !!S[id]);
  if (id === 'rodSafetyOff' && S.rodSafetyOff) {
    S.rodA = S.rodB = S.rodC = 0;
    document.querySelectorAll('[data-lever="rodA"],[data-lever="rodB"],[data-lever="rodC"]').forEach(tr => {
      const h = tr.querySelector('.lever-handle');
      h.style.top = ''; h.style.bottom = '4px';
      const ro = document.getElementById('readout_' + tr.dataset.lever);
      if (ro) ro.textContent = '0%';
    });
  }
  addLog(id.replace(/([A-Z])/g,' $1').toUpperCase() + ' > ' + (S[id] ? 'ON' : 'OFF'), S[id] ? 'ok' : 'warn');
  doFlash();
  checkSeq();
}

function animateKnifeSwitch(el, isOn) {
  const handle = el.querySelector('.ks-handle');
  const startCenterY = parseFloat(handle.style.top || 0) + KS.H_H / 2;
  const targetCenterY = isOn ? KS.DOWN_Y : KS.UP_Y;
  const t0 = performance.now();
  const DUR = 160;
  function step(now) {
    const t = Math.min(1, (now - t0) / DUR);
    const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out quad
    positionKnifeSwitch(el, null, startCenterY + (targetCenterY - startCenterY) * e);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setupKnifeSwitch(el, id) {
  let dragging = false, startY = 0, startState = 0, lastZone = -1;
  const range  = KS.DOWN_Y - KS.UP_Y;
  const ON_THRESHOLD = KS.DOWN_Y - 10;

  function startDrag(clientY) {
    dragging = true;
    startY = clientY;
    startState = S[id] || 0;
    lastZone = startState;
    document.body.style.cursor = 'ns-resize';
  }

  function moveDrag(clientY) {
    if (!dragging) return;
    const dy = clientY - startY;
    let centerY;
    if (startState === 0) centerY = KS.UP_Y + Math.max(0, Math.min(range, dy));
    else                  centerY = KS.DOWN_Y + Math.max(-range, Math.min(0, dy));
    positionKnifeSwitch(el, null, centerY);

    const wantOn = centerY >= ON_THRESHOLD ? 1 : 0;
    if (wantOn !== lastZone && wantOn !== (S[id] || 0)) {
      togSw(id, el);
      lastZone = wantOn;
    }
  }

  function endDrag(clientY) {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';

    if (Math.abs(clientY - startY) < 8) togSw(id, el);

    animateKnifeSwitch(el, !!S[id]);
  }

  el.addEventListener('mousedown',  e => { startDrag(e.clientY); e.preventDefault(); });
  el.addEventListener('touchstart', e => { startDrag(e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  document.addEventListener('mousemove', e => moveDrag(e.clientY));
  document.addEventListener('touchmove', e => { if (dragging) { e.preventDefault(); moveDrag(e.touches[0].clientY); } }, { passive: false });
  document.addEventListener('mouseup',  e => endDrag(e.clientY));
  document.addEventListener('touchend', e => endDrag(e.changedTouches[0].clientY));
}

buildSB('switchBank1', [
  { id:'auxPower',      label:'AUX PWR'    },
  { id:'radShield',     label:'RAD SHIELD' },
  { id:'fuelPumps',     label:'FUEL PUMP'  },
  { id:'coolantPumps',  label:'COOL PUMP'  },
  { id:'magCoils',      label:'MAG COILS'  },
  { id:'ignPrime',      label:'IGN PRIME'  },
  { id:'turbineEngage', label:'TURBINE'    },
  { id:'gridSync',      label:'GRID SYNC'  }
]);
buildSB('switchBank2', [
  { id:'ventSystem',  label:'VENT SYS' },
  { id:'backupGen',   label:'BACKUP GEN' },
  { id:'containField',label:'CONTAIN' }
]);
buildSB('auxCoolSwitches',   [{ id:'auxCoolPump', label:'AUX PUMP' }, { id:'auxCoolLoop', label:'AUX LOOP' }]);
buildSB('backupContSwitches',[{ id:'backupContA', label:'FIELD A'  }, { id:'backupContB', label:'FIELD B'  }]);
buildSB('emergSwitches',     [{ id:'emergVent',   label:'EMRG VENT'}, { id:'emergDump', label:'FUEL DUMP' }, { id:'rodSafetyOff', label:'ROD SAFETY' }]);

// Lever rows ────────────────────────────────────────────────
function buildLev(cid, defs) {
  const c = document.getElementById(cid);
  if (!c) return;
  defs.forEach(d => {
    const g   = document.createElement('div');
    g.className = 'lever-group';
    const tc  = d.big ? 'lever-track big-lever-track' : 'lever-track';
    const h   = d.big ? 220 : 160;
    g.innerHTML =
      `<div class="lever-name">${d.label}</div>` +
      `<div class="${tc}" data-lever="${d.id}" style="height:${h}px">` +
        `<div class="lever-handle"><div class="grip"></div></div>` +
      `</div>` +
      `<div class="lever-readout" id="readout_${d.id}">0%</div>`;
    c.appendChild(g);
    setupLev(g.querySelector('.lever-track'), d.id);
  });
}

function setupLev(tr, id) {
  const h = tr.querySelector('.lever-handle');
  let drag = 0;

  function setL(cy) {
    if (S.modules.comms.status === 'offline' && tr.closest('#tab-controls')) {
      if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
      return;
    }
    if (['rodA','rodB','rodC'].includes(id) && S.rodSafetyOff) {
      addLog('ROD SAFETY ON - disengage to move rods', 'warn'); return;
    }
    const r  = tr.getBoundingClientRect();
    const ht = r.height - 28;
    let y    = Math.max(0, Math.min(ht, cy - r.top - 14));
    S[id]    = Math.round(Math.round((1 - y / ht) * 100 / 5) * 5);
    y        = (1 - S[id] / 100) * ht;
    h.style.bottom = 'auto';
    h.style.top    = y + 'px';
    const ro = document.getElementById('readout_' + id);
    if (ro) ro.textContent = S[id] + '%';
    checkSeq();
  }

  h.addEventListener('mousedown',  e => { drag = 1; document.body.style.cursor = 'ns-resize'; e.preventDefault(); });
  h.addEventListener('touchstart', e  => { drag = 1; e.preventDefault(); }, { passive: false });
  tr.addEventListener('click',     e   => setL(e.clientY));
  document.addEventListener('mousemove', e => { if (drag) { e.preventDefault(); setL(e.clientY); } });
  document.addEventListener('touchmove', e => { if (drag) { e.preventDefault(); setL(e.touches[0].clientY); } }, { passive:0 });
  document.addEventListener('mouseup',  () => { drag = 0; document.body.style.cursor = ''; });
  document.addEventListener('touchend', () => drag = 0);
}

buildLev('leverRow', [
  { id:'containPower', label:'CONTAIN'  },
  { id:'fuelInject',   label:'FUEL INJ' },
  { id:'mainThrottle', label:'THROTTLE' },
  { id:'coolantFlow',  label:'COOLANT'  }
]);
buildLev('auxCoolLevers',    [{ id:'auxCoolRate',   label:'AUX RATE'  }]);
buildLev('backupContLevers', [{ id:'backupContPow', label:'FIELD PWR' }]);
buildLev('rodLevers',        [{ id:'rodA', label:'ROD A' }, { id:'rodB', label:'ROD B' }, { id:'rodC', label:'ROD C' }]);

// Knob panel ────────────────────────────────────────────────
// Knobs point toward the cursor/touch position (calculated from
// center of dial, snapped to 5% increments within angular limits).
// Angular range: -135° (5%) to +135° (95%), 0° = pointer up.
(function() {
  [
    { id:'pressureRelief', label:'PRESS RELIEF' },
    { id:'mixRatio',       label:'MIX RATIO'    },
    { id:'fieldTune',      label:'FIELD TUNE'   }
  ].forEach(d => {
    const g = document.createElement('div');
    g.className = 'knob-group';
    g.innerHTML =
      `<div class="switch-name">${d.label}</div>` +
      `<div class="knob-housing">` +
        `<div class="knob" style="transform:rotate(${(S[d.id]/100)*270-135}deg)">` +
          `<div class="knob-pointer"></div>` +
        `</div>` +
      `</div>` +
      `<div class="lever-readout" id="readout_${d.id}">${S[d.id]}%</div>`;
    document.getElementById('knobPanel').appendChild(g);

    const housing = g.querySelector('.knob-housing');
    const knobEl  = g.querySelector('.knob');
    let tracking = false;

    function updateKnobFromPosition(clientX, clientY) {
      if (S.modules.comms.status === 'offline') {
        if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
        return;
      }
      const rect = housing.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = cy - clientY; // inverted: screen Y down, we want Y up
      // Angle: 0° = up, positive = clockwise (matches CSS rotation)
      let angle = Math.atan2(dx, dy) * 180 / Math.PI;
      // Clamp to [-135, 135] — dead zone at bottom
      angle = Math.max(-135, Math.min(135, angle));
      // Map angle to value: -135° → 0%, 0° → 50%, +135° → 100%
      let val = (angle + 135) / 270 * 100;
      // Snap to 5% increments, clamp to [5, 95]
      val = Math.round(val / 5) * 5;
      S[d.id] = Math.max(5, Math.min(95, val));
      knobEl.style.transform = `rotate(${(S[d.id]/100)*270-135}deg)`;
      document.getElementById('readout_' + d.id).textContent = S[d.id] + '%';
    }

    // Mouse events
    housing.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      tracking = true;
      housing.classList.add('dragging');
      document.body.style.cursor = 'ew-resize';
      updateKnobFromPosition(e.clientX, e.clientY);
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!tracking) return;
      updateKnobFromPosition(e.clientX, e.clientY);
    });
    document.addEventListener('mouseup', () => {
      if (!tracking) return;
      tracking = false;
      housing.classList.remove('dragging');
      document.body.style.cursor = '';
    });

    // Touch events
    housing.addEventListener('touchstart', e => {
      tracking = true;
      housing.classList.add('dragging');
      updateKnobFromPosition(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', e => {
      if (!tracking) return;
      e.preventDefault();
      updateKnobFromPosition(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    document.addEventListener('touchend', () => {
      if (!tracking) return;
      tracking = false;
      housing.classList.remove('dragging');
    });
  });
})();

// Disable right-click on entire page ───────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());

// Push button panel (Ignite, Lamp Test, Line Purge) ─────────
(function() {
  const c = document.getElementById('buttonPanel');
  c.innerHTML =
    `<div class="flex-col gap-4" style="align-items:center">
       <div class="push-btn amber-btn" id="ignBtn" style="width:80px;height:80px">IGNITE</div>
       <div class="switch-name">HOLD 3s</div>
     </div>
     <div class="flex-col gap-4" style="align-items:center">
       <div class="push-btn amber-btn" id="testBtn" style="width:80px;height:80px">LAMP<br>TEST</div>
       <div class="switch-name">TEST</div>
     </div>`;

  const ib = document.getElementById('ignBtn');

  // Delegates to global sI/eI defined in reactor9.js (loaded later)
  const commsGuard = () => { if (S.modules.comms.status === 'offline') { if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; } return true; } return false; };
  ib.addEventListener('mousedown',  () => { if (commsGuard()) return; ib.classList.add('active-amber'); window.sI(); });
  ib.addEventListener('touchstart', (e) => { e.preventDefault(); if (commsGuard()) return; ib.classList.add('active-amber'); window.sI(); }, { passive: false });
  ib.addEventListener('mouseup',    () => { ib.classList.remove('active-amber'); window.eI(); });
  ib.addEventListener('touchend',   () => { ib.classList.remove('active-amber'); window.eI(); });
  ib.addEventListener('mouseleave', () => { ib.classList.remove('active-amber'); window.eI(); });

  document.getElementById('testBtn').addEventListener('click', () => {
    if (commsGuard()) return;
    if (lampTestActive) return;
    lampTestActive = true;
    const lights = document.querySelectorAll('.warning-light');
    const setAll = (cls) => lights.forEach(w => {
      w.classList.remove('active-amber', 'active-red', 'active-green');
      if (cls) w.classList.add(cls);
    });
    setAll('active-amber');
    setTimeout(() => setAll(''),             1000);
    setTimeout(() => setAll('active-red'),   1250);
    setTimeout(() => {
      lights.forEach(w => w.classList.remove('active-amber', 'active-red', 'active-green'));
      lampTestActive = false;
      addLog('LAMP TEST OK', 'ok');
    }, 2250);
  });

  document.getElementById('purgeBtn').addEventListener('click', () => {
    if (commsGuard()) return;
    S.corePressure = Math.max(PRESSURE_BASE, S.corePressure * EMERG_PURGE_PRES_MULT);
    addLog('LINE PURGE', 'sys');
    doFlash('rgba(0,229,255,0.1)');
  });
})();

// Emergency button panel (Plasma Dump, Cool Flood, Hard Reset) ─
(function() {
  const c = document.getElementById('emergButtons');
  ['PLASMA DUMP', 'COOL FLOOD', 'HARD RESET'].forEach((l, i) => {
    const b = document.createElement('div');
    b.innerHTML = `<div class="push-btn ${['red-btn','amber-btn','red-btn'][i]}" style="width:80px;height:80px">${l}</div>`;
    c.appendChild(b);
    b.querySelector('.push-btn').addEventListener('click', () => {
      if (i === 0) {
        S.igniting = 0;
        S.coreTemp *= EMERG_PLASMA_DUMP_TEMP;
        S.plasmaStability = 0;
        addLog('PLASMA DUMPED', 'err');
        doShake();
      }
      if (i === 1) {
        S.coolantFlow   = EMERG_COOL_FLOOD_COOLANT;
        S.auxCoolRate   = EMERG_COOL_FLOOD_AUX;
        S.coreTemp     *= EMERG_COOL_FLOOD_TEMP;
        // Engage all coolant switches and max all coolant levers
        S.coolantPumps = 1;
        S.auxCoolPump  = 1;
        S.auxCoolLoop  = 1;
        syncKnifeSwitches();
        ['coolantFlow', 'auxCoolRate'].forEach(id => {
          const tr = document.querySelector(`.lever-track[data-lever="${id}"]`);
          if (!tr) return;
          const ht = tr.getBoundingClientRect().height - 28;
          const h  = tr.querySelector('.lever-handle');
          h.style.bottom = 'auto';
          h.style.top    = '0px';
          const ro = document.getElementById('readout_' + id);
          if (ro) ro.textContent = '100%';
        });
        addLog('COOLANT FLOOD', 'sys');
      }
      if (i === 2) hardReset();
    });
  });
})();
