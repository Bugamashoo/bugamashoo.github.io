// ============================================================
// reactor4.js — CONTROL UI BUILDERS
// Load order: 4th (after reactor1, reactor3)
// Builds: tabs, switch banks, lever rows, knobs, push buttons
// ============================================================

// ── Tab navigation ───────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-' + b.dataset.tab).classList.add('active');
    if (b.dataset.tab === 'systems') buildSys();
  });
});

// ── Switch banks ─────────────────────────────────────────────
function buildSB(cid, defs) {
  const c = document.getElementById(cid);
  if (!c) return;
  defs.forEach(d => {
    const g = document.createElement('div');
    g.className = 'switch-group';
    g.innerHTML =
      `<div class="switch-name">${d.label}</div>` +
      `<div class="toggle-switch" data-switch="${d.id}"><div class="toggle-handle"></div></div>` +
      `<div class="switch-indicator"></div>`;
    c.appendChild(g);
    g.querySelector('.toggle-switch').addEventListener('click', function() { togSw(d.id, this); });
  });
}

function togSw(id, el) {
  if (S.scramActive && !['auxPower','backupGen','emergVent','emergDump','rodSafetyOff'].includes(id)) return;
  // Block if linked module is offline
  const mm = { fuelPumps:'fuel', coolantPumps:'coolant', gridSync:'grid', magCoils:'magnetic' };
  if (mm[id]) {
    const m = S.modules[mm[id]];
    if (m.status === 'offline') { addLog('BLOCKED: ' + mm[id] + ' offline', 'err'); return; }
  }
  S[id] = S[id] ? 0 : 1;
  el.classList.toggle('on', !!S[id]);
  addLog(id.replace(/([A-Z])/g,' $1').toUpperCase() + ' → ' + (S[id] ? 'ON' : 'OFF'), S[id] ? 'ok' : 'warn');
  doFlash();
  checkSeq();
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
buildSB('emergSwitches',     [{ id:'emergVent',   label:'EMRG VENT'}, { id:'emergDump', label:'FUEL DUMP' }, { id:'rodSafetyOff', label:'ROD SAFE' }]);

// ── Lever rows ────────────────────────────────────────────────
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
    const r  = tr.getBoundingClientRect();
    const ht = r.height - 28;
    let y    = Math.max(0, Math.min(ht, cy - r.top - 14));
    S[id]    = Math.round((1 - y / ht) * 100);
    h.style.bottom = 'auto';
    h.style.top    = y + 'px';
    const ro = document.getElementById('readout_' + id);
    if (ro) ro.textContent = S[id] + '%';
    checkSeq();
  }

  h.addEventListener('mousedown',  e => { drag = 1; e.preventDefault(); });
  h.addEventListener('touchstart', ()  => { drag = 1; }, { passive:1 });
  tr.addEventListener('click',     e   => setL(e.clientY));
  document.addEventListener('mousemove', e => { if (drag) { e.preventDefault(); setL(e.clientY); } });
  document.addEventListener('touchmove', e => { if (drag) { e.preventDefault(); setL(e.touches[0].clientY); } }, { passive:0 });
  document.addEventListener('mouseup',  () => drag = 0);
  document.addEventListener('touchend', () => drag = 0);
}

buildLev('leverRow', [
  { id:'containPower', label:'CONTAIN'  },
  { id:'fuelInject',   label:'FUEL INJ' },
  { id:'mainThrottle', label:'THROTTLE', big:1 },
  { id:'coolantFlow',  label:'COOLANT'  }
]);
buildLev('auxCoolLevers',    [{ id:'auxCoolRate',   label:'AUX RATE'  }]);
buildLev('backupContLevers', [{ id:'backupContPow', label:'FIELD PWR' }]);
buildLev('rodLevers',        [{ id:'rodA', label:'ROD A' }, { id:'rodB', label:'ROD B' }, { id:'rodC', label:'ROD C' }]);

// ── Knob panel ────────────────────────────────────────────────
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
    let dragging = false, startX = 0, startVal = 0;

    function updateKnob(val) {
      S[d.id] = Math.max(0, Math.min(100, val));
      knobEl.style.transform = `rotate(${(S[d.id]/100)*270-135}deg)`;
      document.getElementById('readout_' + d.id).textContent = S[d.id] + '%';
    }

    housing.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startVal = S[d.id];
      housing.classList.add('dragging');
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      const delta = Math.round((e.clientX - startX) / 2);
      updateKnob(startVal + delta);
    });

    document.addEventListener('mouseup', e => {
      if (!dragging) return;
      dragging = false;
      housing.classList.remove('dragging');
      document.body.style.cursor = '';
    });
  });
})();

// ── Disable right-click on entire page ───────────────────────
document.addEventListener('contextmenu', e => e.preventDefault());

// ── Push button panel (Ignite, Lamp Test, Line Purge) ─────────
(function() {
  const c = document.getElementById('buttonPanel');
  c.innerHTML =
    `<div class="flex-col gap-4" style="align-items:center">
       <div class="push-btn amber-btn" id="ignBtn" style="width:64px;height:64px;font-size:8px">IGNITE</div>
       <div class="switch-name">HOLD 3s</div>
     </div>
     <div class="flex-col gap-4" style="align-items:center">
       <div class="push-btn green-btn" id="testBtn" style="width:50px;height:50px;font-size:7px">LAMP<br>TEST</div>
       <div class="switch-name">TEST</div>
     </div>
     <div class="flex-col gap-4" style="align-items:center">
       <div class="push-btn cyan-btn" id="purgeBtn" style="width:50px;height:50px;font-size:7px">LINE<br>PURGE</div>
       <div class="switch-name">PURGE</div>
     </div>`;

  const ib = document.getElementById('ignBtn');

  // Delegates to global sI/eI defined in reactor9.js (loaded later)
  ib.addEventListener('mousedown',  () => { ib.classList.add('active-amber'); window.sI(); });
  ib.addEventListener('touchstart', (e) => { e.preventDefault(); ib.classList.add('active-amber'); window.sI(); }, { passive: false });
  ib.addEventListener('mouseup',    () => { ib.classList.remove('active-amber'); window.eI(); });
  ib.addEventListener('touchend',   () => { ib.classList.remove('active-amber'); window.eI(); });
  ib.addEventListener('mouseleave', () => { ib.classList.remove('active-amber'); window.eI(); });

  document.getElementById('testBtn').addEventListener('click', () => {
    document.querySelectorAll('.warning-light').forEach(w => {
      w.classList.add('active-amber');
      setTimeout(() => w.classList.remove('active-amber'), 1000);
    });
    addLog('LAMP TEST OK', 'ok');
  });

  document.getElementById('purgeBtn').addEventListener('click', () => {
    S.corePressure = Math.max(1, S.corePressure * 0.6);
    addLog('LINE PURGE', 'sys');
    doFlash('rgba(0,229,255,0.1)');
  });
})();

// ── Emergency button panel (Plasma Dump, Cool Flood, Hard Reset) ─
(function() {
  const c = document.getElementById('emergButtons');
  ['PLASMA DUMP', 'COOL FLOOD', 'HARD RESET'].forEach((l, i) => {
    const b = document.createElement('div');
    b.innerHTML = `<div class="push-btn ${['red-btn','cyan-btn','amber-btn'][i]}" style="width:52px;height:52px;font-size:7px">${l}</div>`;
    c.appendChild(b);
    b.querySelector('.push-btn').addEventListener('click', () => {
      if (i === 0) {
        S.igniting = 0;
        S.coreTemp *= 0.5;
        S.plasmaStability = 0;
        addLog('PLASMA DUMPED', 'err');
        doShake();
      }
      if (i === 1) {
        S.coolantFlow   = 100;
        S.auxCoolRate   = 100;
        S.coreTemp     *= 0.3;
        addLog('COOLANT FLOOD', 'sys');
      }
      if (i === 2) hardReset();
    });
  });
})();
