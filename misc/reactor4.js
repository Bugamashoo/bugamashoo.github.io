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

// ── Knife switch geometry constants ──────────────────────────
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

// ── Switch banks ─────────────────────────────────────────────
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
    positionKnifeSwitch(ks, false);
    setupKnifeSwitch(ks, d.id);
  });
}

function positionKnifeSwitch(el, isOn, centerY) {
  if (centerY === undefined) centerY = isOn ? KS.DOWN_Y : KS.UP_Y;
  const handle = el.querySelector('.ks-handle');
  const arms   = el.querySelectorAll('.ks-arm');
  handle.style.top = (centerY - KS.H_H / 2) + 'px';

  // Left arm: hinge (PL_X, HINGE_Y) → handle left (HL_X, centerY)
  const ldx = KS.HL_X - KS.PL_X, ldy = centerY - KS.HINGE_Y;
  const lLen = Math.sqrt(ldx * ldx + ldy * ldy);
  arms[0].style.height = lLen + 'px';
  arms[0].style.transform = `rotate(${Math.atan2(ldx, ldy) * 180 / Math.PI}deg)`;

  // Right arm: hinge (PR_X, HINGE_Y) → handle right (HR_X, centerY)
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
  if (S.scramActive && !['auxPower','backupGen','emergVent','emergDump','rodSafetyOff'].includes(id)) return;
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
    S[id]    = Math.round(Math.round((1 - y / ht) * 100 / 5) * 5);
    y        = (1 - S[id] / 100) * ht;
    h.style.bottom = 'auto';
    h.style.top    = y + 'px';
    const ro = document.getElementById('readout_' + id);
    if (ro) ro.textContent = S[id] + '%';
    checkSeq();
  }

  h.addEventListener('mousedown',  e => { drag = 1; document.body.style.cursor = 'ns-resize'; e.preventDefault(); });
  h.addEventListener('touchstart', ()  => { drag = 1; }, { passive:1 });
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
      S[d.id] = Math.round(Math.max(5, Math.min(95, val)) / 5) * 5;
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
    S.corePressure = Math.max(PRESSURE_BASE, S.corePressure * EMERG_PURGE_PRES_MULT);
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
