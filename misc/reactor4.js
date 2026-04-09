// reactor4.js - CONTROL UI BUILDERS
// Load order: 4th (after reactor1, reactor3)
// Builds: tabs, switch banks, lever rows, knobs, push buttons

// Tab navigation ─
document.querySelectorAll('.tab-btn').forEach(b => {
  b.addEventListener('click', () => {
    if (b.classList.contains('tab-locked')) { addLog('Unlock SUBSYSTEMS from the Controls tab to access this section', 'warn'); return; }
    document.querySelectorAll('.tab-btn').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    if (b.dataset.tab === 'resupply' && b.classList.contains('tab-pulse')) resupplyPulseDone = true;
    b.classList.remove('tab-pulse');
    document.getElementById('tab-' + b.dataset.tab).classList.add('active');
    if (b.dataset.tab === 'controls') syncLeverPositions();
    if (b.dataset.tab === 'systems') buildSys();
    if (b.dataset.tab === 'resupply' && typeof buildResupply === 'function') buildResupply();
  });
});

// Lock non-core tabs until subsystems unlocked
['manual','monitors','systems','backup'].forEach(t => {
  const btn = document.querySelector('.tab-btn[data-tab="' + t + '"]');
  if (btn) btn.classList.add('tab-locked');
});
['manual','monitors'].forEach(t => {
  const item = document.querySelector('.tab-menu-item[data-tab="' + t + '"]');
  if (item) item.classList.add('tab-locked');
});

// Hamburger menu for mobile 
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
      if (item.classList.contains('tab-locked')) return;
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

// Knife switch geometry constants 
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

// Switch banks ─
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

// ── Canvas-based switch spark system ─────────────────────────────────────────
// Each "bundle" = one physics object that renders as 3 parallel strands.
// Per toggle: 1-2 bundles total — far fewer objects than individual-spark approach.
const SPARK_GRAVITY   = 520;       // px/s²
const SPARK_COLOR     = '#ffe08a'; // amber strand color
const SPARK_ARC_COLOR = '#00e5ff'; // cyan arc color
let   sparkCanvas     = null;
let   sparkCtx        = null;
const sparkBundles    = [];  // { x, y, initVx, vy, len, maxLife, startTime, offsets:[f,f,f] }
const sparkArcPts     = [];  // { pts:[{x,y}], startTime, dur }
let   sparkLastMs     = 0;
let   sparkRafId      = null;

function ensureSparkCanvas() {
  if (sparkCanvas) return;
  sparkCanvas = document.createElement('canvas');
  sparkCanvas.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:12000';
  sparkCanvas.width  = window.innerWidth;
  sparkCanvas.height = window.innerHeight;
  document.body.appendChild(sparkCanvas);
  sparkCtx = sparkCanvas.getContext('2d');
  window.addEventListener('resize', () => {
    if (!sparkCanvas) return;
    sparkCanvas.width  = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
  });
}

function sparkLoop(now) {
  const dt = Math.min((now - sparkLastMs) / 1000, 0.05);
  sparkLastMs = now;
  sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);

  // Draw arcs (short-lived, fade out quickly)
  sparkCtx.lineCap  = 'round';
  sparkCtx.lineJoin = 'round';
  for (let i = sparkArcPts.length - 1; i >= 0; i--) {
    const a = sparkArcPts[i];
    const t = (now - a.startTime) / a.dur;
    if (t < 0) continue;
    if (t >= 1) { sparkArcPts.splice(i, 1); continue; }
    sparkCtx.globalAlpha = 1 - t;
    sparkCtx.strokeStyle = SPARK_ARC_COLOR;
    sparkCtx.lineWidth   = 1.5;
    sparkCtx.beginPath();
    sparkCtx.moveTo(a.pts[0].x, a.pts[0].y);
    for (let j = 1; j < a.pts.length; j++) sparkCtx.lineTo(a.pts[j].x, a.pts[j].y);
    sparkCtx.stroke();
  }

  // Draw bundles — one physics update per bundle, 3 parallel strands drawn from it
  sparkCtx.lineCap = 'round';
  for (let i = sparkBundles.length - 1; i >= 0; i--) {
    const b = sparkBundles[i];
    if (now < b.startTime) continue;
    const elapsed = now - b.startTime;
    if (elapsed >= b.maxLife) { sparkBundles.splice(i, 1); continue; }

    // Physics — one update for all 3 strands
    b.vy += SPARK_GRAVITY * dt;
    const vxNow = b.initVx * (1 - elapsed / b.maxLife);
    b.x += vxNow * dt;
    b.y += b.vy  * dt;

    const alpha = Math.max(0, 1 - (elapsed / b.maxLife) * 1.3);
    const angle = Math.atan2(b.vy, vxNow);
    const cos = Math.cos(angle), sin = Math.sin(angle);
    // Perpendicular unit vector for lateral strand offsets
    const px = -sin, py = cos;
    const hL = b.len / 2;

    // Amber outer strands (all 3 in one pass)
    sparkCtx.strokeStyle = SPARK_COLOR;
    sparkCtx.lineWidth   = 2;
    sparkCtx.globalAlpha = alpha;
    for (let s = 0; s < 3; s++) {
      const off = b.offsets[s];
      const cx = b.x + px * off, cy = b.y + py * off;
      sparkCtx.beginPath();
      sparkCtx.moveTo(cx - cos * hL, cy - sin * hL);
      sparkCtx.lineTo(cx + cos * hL, cy + sin * hL);
      sparkCtx.stroke();
    }
    // White core strands (all 3 in one pass)
    sparkCtx.strokeStyle = '#ffffff';
    sparkCtx.lineWidth   = 0.8;
    sparkCtx.globalAlpha = alpha * 0.7;
    for (let s = 0; s < 3; s++) {
      const off = b.offsets[s];
      const cx = b.x + px * off, cy = b.y + py * off;
      sparkCtx.beginPath();
      sparkCtx.moveTo(cx - cos * hL * 0.5, cy - sin * hL * 0.5);
      sparkCtx.lineTo(cx + cos * hL * 0.5, cy + sin * hL * 0.5);
      sparkCtx.stroke();
    }
  }

  if (sparkBundles.length === 0 && sparkArcPts.length === 0) {
    sparkCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    sparkRafId = null;
    return;
  }
  sparkRafId = requestAnimationFrame(sparkLoop);
}

function spawnSwitchSparks(el) {
  ensureSparkCanvas();
  const SNAP_VY = (KS.DOWN_Y - KS.UP_Y) / (160 / 1000) * 0.5;
  const now = performance.now();

  const ARM_DEFS = [
    { sel: '.ks-arm-left',  dir: -1 },
    { sel: '.ks-arm-right', dir: +1 }
  ];

  for (const armDef of ARM_DEFS) {
    const arm = el.querySelector(armDef.sel);
    if (!arm) continue;
    const armRect = arm.getBoundingClientRect();
    // Skip if arm has no layout (hidden/detached element)
    if (!armRect.width && !armRect.height) continue;
    const ox  = armRect.left + armRect.width / 2;
    const oy  = armRect.bottom;
    const dir = armDef.dir;

    // 1-2 bundles per arm, each bundle = 3 parallel strands
    const bundleCount = Math.random() < 0.5 ? 1 : 2;
    for (let b = 0; b < bundleCount; b++) {
      // Strands placed randomly within a ±9 px zone (farther apart, random positions)
      const offsets = Array.from({ length: 3 }, () => (Math.random() * 18 - 9));
      sparkBundles.push({
        x: ox, y: oy,
        initVx:    dir * (30 + Math.random() * 100),
        vy:        SNAP_VY + (Math.random() - 0.5) * 40,
        len:       (5 + Math.random() * 6) * 1.5,
        startTime: now + b * 45,
        maxLife:   900 + Math.random() * 600,
        offsets
      });
    }

    // 2 arc flashes per arm (4 total across both arms — original count)
    for (let a = 0; a < 2; a++) {
      const arcLen   = 18 + Math.random() * 24;
      const arcAngle = (Math.random() * 2 - 1) * (50 * Math.PI / 180) + (dir === -1 ? Math.PI : 0);
      const endX = ox + Math.cos(arcAngle) * arcLen;
      const endY = oy + Math.sin(arcAngle) * arcLen;
      const segs = 3 + Math.floor(Math.random() * 3);
      const pts  = [{ x: ox, y: oy }];
      for (let s = 1; s < segs; s++) {
        const t = s / segs;
        pts.push({
          x: ox + (endX - ox) * t + (Math.random() - 0.5) * 8,
          y: oy + (endY - oy) * t + (Math.random() - 0.5) * 8
        });
      }
      pts.push({ x: endX, y: endY });
      sparkArcPts.push({ pts, startTime: now + a * 20, dur: 120 + Math.random() * 140 });
    }
  }

  if (!sparkRafId) {
    sparkLastMs = now;
    sparkRafId  = requestAnimationFrame(sparkLoop);
  }
}

function togSw(id, el) {
  if (S.modules.comms.status === 'offline' && MAIN_PANEL_SWITCH_IDS.has(id)) {
    if (tick - lastCommsWarnTick > 20) { addLog('COMMS OFFLINE - controls locked', 'err'); lastCommsWarnTick = tick; }
    return;
  }
  if (S.modules.comms.sysError && commsLockedSwitches.includes(id)) {
    addLog('COMMS ERROR - control unresponsive, please restart system', 'err');
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
      const ro = document.getElementById('readout_' + tr.dataset.lever);
      if (ro) ro.textContent = '0%';
    });
    syncLeverPositions();
  }
  addLog(id.replace(/([A-Z])/g,' $1').toUpperCase() + ' > ' + (S[id] ? 'ON' : 'OFF'), S[id] ? 'ok' : 'warn');
  doFlash();
  checkSeq();
}

function animateKnifeSwitch(el, isOn, onContact) {
  const handle = el.querySelector('.ks-handle');
  const startCenterY = parseFloat(handle.style.top || 0) + KS.H_H / 2;
  const targetCenterY = isOn ? KS.DOWN_Y : KS.UP_Y;
  const t0 = performance.now();
  const DUR = 160;
  let contactFired = false;
  function step(now) {
    const t = Math.min(1, (now - t0) / DUR);
    const e = t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // ease in-out quad
    const centerY = startCenterY + (targetCenterY - startCenterY) * e;
    positionKnifeSwitch(el, null, centerY);
    if (onContact && !contactFired && isOn && centerY >= KS.DOWN_Y - 10) {
      contactFired = true;
      onContact();
    }
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
      if (S[id]) spawnSwitchSparks(el); // handle is at contact point
      lastZone = wantOn;
    }
  }

  function endDrag(clientY) {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';

    const isClick = Math.abs(clientY - startY) < 8;
    if (isClick) togSw(id, el);

    // For a click that turned the switch ON, fire sparks when animation reaches contact point
    const sparkCb = (isClick && S[id]) ? () => spawnSwitchSparks(el) : null;
    animateKnifeSwitch(el, !!S[id], sparkCb);
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
  { id:'ventSystem',    label:'VENT SYS'  },
  { id:'backupGen',     label:'BACKUP GEN'},
  { id:'containField',  label:'CONTAIN'   },
  { id:'turbineLimiter',label:'TURBINE LIMIT'}
]);
buildSB('auxCoolSwitches',   [{ id:'auxCoolPump', label:'AUX PUMP' }, { id:'auxCoolLoop', label:'AUX LOOP' }]);
buildSB('backupContSwitches',[{ id:'backupContA', label:'FIELD A'  }, { id:'backupContB', label:'FIELD B'  }]);
buildSB('emergSwitches',     [{ id:'emergVent',   label:'EMRG VENT'}, { id:'emergDump', label:'FUEL DUMP' }, { id:'rodSafetyOff', label:'ROD SAFETY' }]);

// Lever rows
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
    if (S.modules.comms.sysError && commsLockedControls.includes(id) && tr.closest('#tab-controls')) {
      addLog('COMMS ERROR - control unresponsive, please restart system', 'err');
      return;
    }
    if (['rodA','rodB','rodC'].includes(id) && S.rodSafetyOff) {
      addLog('ROD SAFETY ON - disengage to move rods', 'warn'); return;
    }
    const r  = tr.getBoundingClientRect();
    const hH = h.offsetHeight;
    const ht = r.height - hH;
    let y    = Math.max(0, Math.min(ht, cy - r.top - hH / 2));
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

// Reposition all lever handles to match their current state values.
// Called on viewport resize so handles stay correct after layout changes.
function syncLeverPositions() {
  document.querySelectorAll('.lever-track').forEach(tr => {
    const id = tr.dataset.lever;
    if (!id) return;
    const h  = tr.querySelector('.lever-handle');
    const hH = h.offsetHeight;
    const ht = tr.offsetHeight - hH;
    if (ht <= 0) return;
    const y  = (1 - S[id] / 100) * ht;
    h.style.bottom = 'auto';
    h.style.top    = y + 'px';
  });
}
window.addEventListener('resize', syncLeverPositions);

buildLev('leverRow', [
  { id:'containPower', label:'CONTAIN'  },
  { id:'fuelInject',   label:'FUEL INJ' },
  { id:'mainThrottle', label:'THROTTLE' },
  { id:'coolantFlow',  label:'COOLANT'  }
]);
buildLev('auxCoolLevers',    [{ id:'auxCoolRate',   label:'AUX RATE'  }]);
buildLev('backupContLevers', [{ id:'backupContPow', label:'FIELD PWR' }]);
buildLev('rodLevers',        [{ id:'rodA', label:'ROD A' }, { id:'rodB', label:'ROD B' }, { id:'rodC', label:'ROD C' }]);

// Knob panel
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
      if (S.modules.comms.sysError && commsLockedControls.includes(d.id)) {
        addLog('COMMS ERROR - control unresponsive, please restart system', 'err');
        return;
      }
      const rect = housing.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = clientX - cx;
      const dy = cy - clientY; // inverted: screen Y down, we want Y up
      // Angle: 0° = up, positive = clockwise (matches CSS rotation)
      let angle = Math.atan2(dx, dy) * 180 / Math.PI;
      // Clamp to [-135, 135] - dead zone at bottom
      angle = Math.max(-135, Math.min(135, angle));
      // Map angle to value: -135° -> 0%, 0° -> 50%, +135° -> 100%
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

// Disable right-click on entire page
document.addEventListener('contextmenu', e => e.preventDefault());

// Push button panel (Ignite, Lamp Test, Line Purge)
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
    if (FLASH_DISABLED) {
      // No-flash mode: single amber pass, no cycling
      setAll('active-amber');
      setTimeout(() => {
        lights.forEach(w => w.classList.remove('active-amber', 'active-red', 'active-green'));
        lampTestActive = false;
        addLog('LAMP TEST OK', 'ok');
      }, 1000);
    } else {
      setAll('active-amber');
      setTimeout(() => setAll(''),             1000);
      setTimeout(() => setAll('active-red'),   1250);
      setTimeout(() => {
        lights.forEach(w => w.classList.remove('active-amber', 'active-red', 'active-green'));
        lampTestActive = false;
        addLog('LAMP TEST OK', 'ok');
      }, 2250);
    }
  });

  document.getElementById('purgeBtn').addEventListener('click', () => {
    if (commsGuard()) return;
    S.corePressure = Math.max(PRESSURE_BASE, S.corePressure * EMERG_PURGE_PRES_MULT);
    addLog('LINE PURGE', 'sys');
    doFlash('rgba(0,229,255,0.1)');
  });
})();

// Emergency button panel (Plasma Dump, Cool Flood, Hard Reset)
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
        syncLeverPositions();
        ['coolantFlow', 'auxCoolRate'].forEach(id => {
          const ro = document.getElementById('readout_' + id);
          if (ro) ro.textContent = '100%';
        });
        addLog('COOLANT FLOOD', 'sys');
      }
      if (i === 2) hardReset();
    });
  });
})();

// Startup sequence steps pulse (stops on first completion)
document.getElementById('seqSteps').classList.add('seq-pulse');

// Panel lock overlays for gated sections
(function() {
  const LOCKS = [
    { panelId: 'ctrlSubsys',    label: 'SUBSYSTEMS', cost: 10000,  costLabel: '$10k',  key: 'unlockedSubsystems' },
    { panelId: 'ctrlEmergency', label: 'EMERGENCY',  cost: 50000,  costLabel: '$50k',  key: 'unlockedEmergency'  },
    { panelId: 'ctrlKnobs',     label: 'TUNING',     cost: 300000, costLabel: '$300k',  key: 'unlockedTuning'     }
  ];

  LOCKS.forEach(def => {
    const panel = document.getElementById(def.panelId);
    if (!panel) return;
    panel.style.position = 'relative';
    panel.style.zIndex = '5';
    const ov = document.createElement('div');
    ov.className = 'panel-lock-overlay';
    ov.id = 'lock_' + def.panelId;
    ov.innerHTML =
      '<div class="panel-lock-label">' + def.label + '</div>' +
      '<button class="panel-lock-btn" data-lock-cost="' + def.cost + '">UNLOCK<br><span class="panel-lock-price">' + def.costLabel + '</span></button>';
    panel.appendChild(ov);

    ov.querySelector('.panel-lock-btn').addEventListener('click', () => {
      if (S.money < def.cost) {
        addLog('Insufficient funds - need ' + def.costLabel, 'warn');
        return;
      }
      S.money -= def.cost;
      S.totalSpent += def.cost;
      window[def.key] = true;
      ov.remove();
      addLog(def.label + ' UNLOCKED', 'ok');
      doFlash();
      if (def.key === 'unlockedSubsystems') showToast(toastSubsystemsUnlocked);
      if (def.key === 'unlockedEmergency')  showToast(toastEmergencyUnlocked);

      // A2: When BOTH gates are now open for the first time, reset event/error timers from NOW
      if (unlockedSubsystems && unlockedEmergency) {
        nextEventTime = S.uptime + EVT_POST_CLOSE_MIN + Math.random() * EVT_POST_CLOSE_RANGE;
        nextErrorTime = S.uptime + ERR_SPAWN_INIT_MIN + Math.random() * ERR_SPAWN_INIT_RANGE;
      }

      if (def.key === 'unlockedSubsystems') {
        // Unlock gated tabs
        document.querySelectorAll('.tab-btn.tab-locked').forEach(b => b.classList.remove('tab-locked'));
        document.querySelectorAll('.tab-menu-item.tab-locked').forEach(b => b.classList.remove('tab-locked'));
        // Pulse systems/backup tabs if reactor already online
        if (S.startupComplete) {
          document.querySelector('[data-tab="systems"]').classList.add('tab-pulse');
          document.querySelector('[data-tab="backup"]').classList.add('tab-pulse');
        }
      }

      if (def.key === 'unlockedEmergency') {
        // Also remove the backup tab emergency panel lock
        const beLock = document.getElementById('lock_backupEmerg');
        if (beLock) beLock.remove();
      }
    });
  });

  // Lock #backupEmerg on the Backup tab if ctrlEmergency is not yet unlocked
  (() => {
    const bePanel = document.getElementById('backupEmerg');
    if (!bePanel) return;
    bePanel.style.position = 'relative';
    const beOv = document.createElement('div');
    beOv.className = 'panel-lock-overlay';
    beOv.id = 'lock_backupEmerg';
    beOv.innerHTML =
      '<div class="panel-lock-label">EMERGENCY</div>' +
      '<div class="panel-lock-note">Unlock EMERGENCY panel on Controls tab first</div>';
    bePanel.appendChild(beOv);
  })();
})();

// ── Warn Indicator Tooltip ───────────────────────────────────────────────────
// Shows a breakdown of active warning lights on hover/touch of the STATUS box.
const WARN_LABELS = [
  { id: 'warnOvertemp',    label: 'Overtemperature' },
  { id: 'warnOverpressure',label: 'Overpressure' },
  { id: 'warnContainment', label: 'Containment' },
  { id: 'warnCoolant',     label: 'Low Coolant Flow' },
  { id: 'warnFuel',        label: 'Low Fuel' },
  { id: 'warnRadiation',   label: 'High Radiation' },
  { id: 'warnScram',       label: 'SCRAM Active' },
  { id: 'warnOnline',      label: 'Reactor Online' },
  { id: 'warnModFault',    label: 'Module Fault' },
  { id: 'warnSysFault',    label: 'System Error' },
  { id: 'warnEvent',       label: 'Active Event' },
];

function updateWarnTooltip() {
  const tt = document.getElementById('warnTooltip');
  if (!tt) return;
  const rows = [];
  WARN_LABELS.forEach(w => {
    const el = document.getElementById(w.id);
    if (!el) return;
    let color = null;
    if (el.classList.contains('active-red'))   color = 'red';
    else if (el.classList.contains('active-amber')) color = 'amber';
    else if (el.classList.contains('active-green')) color = 'green';
    if (color) {
      rows.push(
        `<div class="warn-tooltip-row">` +
        `<span class="warn-tooltip-dot ${color}"></span>` +
        `<span>${w.label}</span>` +
        `</div>`
      );
    }
  });
  if (rows.length === 0) {
    tt.innerHTML = '<div class="warn-tooltip-row"><span>All systems nominal</span></div>';
  } else {
    tt.innerHTML = rows.join('');
  }
}

(() => {
  const box = document.getElementById('warnBox');
  const tt  = document.getElementById('warnTooltip');
  if (!box || !tt) return;
  box.addEventListener('mouseenter', () => { updateWarnTooltip(); tt.style.display = 'block'; });
  box.addEventListener('mouseleave', () => { tt.style.display = 'none'; });
  box.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (tt.style.display === 'block') { tt.style.display = 'none'; return; }
    updateWarnTooltip(); tt.style.display = 'block';
  }, { passive: false });
})();
