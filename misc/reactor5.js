// reactor5.js - DISPLAY & MONITOR BUILDERS
// Load order: 5th (after reactor1)
// Builds: display gauge groups, warning lights, sequence steps,
//         monitor canvas grid, drawG()

// Numeric gauge groups
function buildDG(cid, defs) {
  const c = document.getElementById(cid);
  if (!c) return;
  defs.forEach(d => {
    const b = document.createElement('div');
    b.className = 'display-box';
    b.innerHTML =
      `<div class="display-label">${d.label}</div>` +
      `<div class="display-value ${d.color}" id="disp_${d.id}">0</div>` +
      `<div class="bar-gauge"><div class="bar-fill ${d.color}" id="bar_${d.id}"></div></div>`;
    c.appendChild(b);
  });
}

buildDG('coreReadings', [
  { id:'coreTemp',         label:'CORE TEMP',    color:'amber' },
  { id:'corePressure',     label:'PRESSURE',     color:'cyan'  },
  { id:'plasmaStability',  label:'PLASMA STAB',  color:'green' },
  { id:'neutronDensity',   label:'NEUTRON FLUX', color:'cyan'  }
]);
buildDG('systemVitals', [
  { id:'coolantTemp',      label:'COOLANT TEMP', color:'cyan'  },
  { id:'coolantFlowRate',  label:'COOL FLOW',    color:'cyan'  },
  { id:'turbineRPM',       label:'TURBINE RPM',  color:'amber' },
  { id:'containIntegrity', label:'CONTAIN %',    color:'green' },
  { id:'magneticFlux',     label:'MAG FLUX',     color:'cyan'  },
  { id:'radiationLevel',   label:'RADIATION',    color:'amber' }
]);
buildDG('auxCoolReadings',   [{ id:'auxCoolTemp',    label:'AUX COOL',     color:'cyan'  }, { id:'auxCoolFlow',   label:'AUX FLOW',    color:'cyan'  }]);
buildDG('backupContReadings',[{ id:'backupFieldStr', label:'BACKUP FIELD', color:'green' }, { id:'secondaryPressure', label:'SEC PRESS', color:'cyan' }]);
buildDG('emergReadings',     [{ id:'rodPosition',    label:'ROD INS',      color:'amber' }, { id:'heatSinkTemp',  label:'HEAT SINK',   color:'cyan'  }]);

// Warning lights row
(function() {
  const labels = ['OVERTEMP','OVERPRESSURE','CONTAINMENT','COOLANT','FUEL LOW','RADIATION','SCRAM','ONLINE','MOD FAULT','SYS FAULT','EVENT'];
  const ids    = ['warnOvertemp','warnOverpressure','warnContainment','warnCoolant','warnFuel','warnRadiation','warnScram','warnOnline','warnModFault','warnSysFault','warnEvent'];
  labels.forEach((l, i) => {
    const w = document.createElement('div');
    w.className = 'warning-light';
    w.id = ids[i];
    w.innerHTML = `<div class="dot"></div>${l}`;
    document.getElementById('warningRow').appendChild(w);
  });
})();

// Startup sequence steps
(function() {
  // Map each seq step index to a CSS selector for the corresponding control
  const SEQ_CTRL_SEL = [
    '[data-switch="auxPower"]',    // 0 AUX POWER
    '[data-switch="radShield"]',   // 1 RAD SHIELDING
    '[data-switch="fuelPumps"]',   // 2 FUEL PUMPS
    '[data-switch="coolantPumps"]',// 3 COOLANT PUMPS
    '[data-lever="coolantFlow"]',  // 4 COOLANT >60%
    '[data-switch="magCoils"]',    // 5 MAG COILS
    '[data-lever="containPower"]', // 6 CONTAIN >60%
    '[data-lever="fuelInject"]',   // 7 FUEL INJ >10%
    '[data-switch="ignPrime"]',    // 8 IGN PRIME
    '#ignBtn',                     // 9 HOLD IGN 3s
    '[data-lever="mainThrottle"]', // 10 THROTTLE >20%
    '[data-switch="turbineEngage"]',// 11 TURBINE
    '[data-switch="gridSync"]'     // 12 GRID SYNC
  ];

  // Pointer arrow for off-screen targeting
  const arrow = document.createElement('div');
  arrow.id = 'seqPointerArrow';
  arrow.textContent = '▶';
  arrow.style.display = 'none';
  document.body.appendChild(arrow);

  let activeCtrl = null;
  let rafId = 0;

  function positionArrow() {
    if (!activeCtrl) return;
    const rect = activeCtrl.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
    const visible = rect.top >= 0 && rect.bottom <= h &&
                    rect.left >= 0 && rect.right <= w;
    if (visible) {
      arrow.style.display = 'none';
    } else {
      const tx = (rect.left + rect.right) / 2;
      const ty = (rect.top + rect.bottom) / 2;
      const pad = 18;
      // Closest point on viewport edge to the target
      const ax = Math.max(pad, Math.min(w - pad, tx));
      const ay = Math.max(pad, Math.min(h - pad, ty));
      const angle = Math.atan2(ty - ay, tx - ax) * 180 / Math.PI;
      arrow.style.display = 'block';
      arrow.style.left = (ax - 12) + 'px';
      arrow.style.top  = (ay - 12) + 'px';
      arrow.style.transform = `rotate(${angle}deg)`;
    }
  }

  function onScroll() {
    if (!activeCtrl) return;
    if (!rafId) {
      rafId = requestAnimationFrame(() => { rafId = 0; positionArrow(); });
    }
  }

  // Track scrolling on the controls tab to update the arrow direction
  const tabControls = document.getElementById('tab-controls');
  if (tabControls) tabControls.addEventListener('scroll', onScroll, { passive: true });

  const HOLD_IGN_INDEX = SEQUENCE.findIndex(s => s.label === 'HOLD IGN 3s');

  SEQUENCE.forEach((s, i) => {
    const e = document.createElement('div');
    e.className = 'seq-step';
    e.id = 'seq_' + i;
    let inner = `<div class="seq-dot"></div><div class="seq-label">${i+1}. ${s.label}</div>`;
    // Mobile arrow on the HOLD IGN step
    if (i === HOLD_IGN_INDEX) {
      inner += `<div class="seq-ign-arrow" id="seqIgnArrow">▼ HOLD IGN BUTTON ▼</div>`;
    }
    e.innerHTML = inner;
    document.getElementById('seqSteps').appendChild(e);

    // Seq step hover → highlight control + scroll-aware arrow
    const sel = SEQ_CTRL_SEL[i];
    e.addEventListener('mouseenter', function() {
      if (!sel) return;
      const ctrl = document.querySelector(sel);
      if (!ctrl) return;
      if (activeCtrl && activeCtrl !== ctrl) activeCtrl.classList.remove('seq-highlight');
      activeCtrl = ctrl;
      ctrl.classList.add('seq-highlight');
      positionArrow();
    });
    e.addEventListener('mouseleave', function() {
      if (!sel) return;
      if (activeCtrl) {
        activeCtrl.classList.remove('seq-highlight');
        activeCtrl = null;
      }
      arrow.style.display = 'none';
      if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    });
  });
})();


// Monitor canvas grid
(function() {
  [
    { id:'mon_temp',      t:'CORE TEMPERATURE' },
    { id:'mon_pressure',  t:'PRESSURE'         },
    { id:'mon_plasma',    t:'PLASMA STABILITY' },
    { id:'mon_power',     t:'POWER OUTPUT'     },
    { id:'mon_coolant',   t:'COOLANT FLOW'     },
    { id:'mon_radiation', t:'RADIATION'        }
  ].forEach(x => {
    const p = document.createElement('div');
    p.className = 'monitor-panel';
    p.innerHTML =
      `<div class="monitor-title">${x.t}</div>` +
      `<canvas id="${x.id}" style="width:100%;height:calc(100% - 24px)"></canvas>`;
    document.getElementById('monitorsGrid').appendChild(p);
  });
})();

// Graph renderer
// Draws a line graph with glowing stroke + filled area onto a canvas element.
function drawG(cid, data, col, max, unit) {
  const cv = document.getElementById(cid);
  if (!cv) return;
  cv.width  = cv.clientWidth  * 2;
  cv.height = cv.clientHeight * 2;
  const ctx = cv.getContext('2d');
  const w   = cv.width;
  const h   = cv.height;

  ctx.clearRect(0, 0, w, h);

  // Grid lines (3 lines: top, mid, bottom)
  ctx.strokeStyle = 'rgba(58,63,68,0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const y = h * (i / 2);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  if (data.length > 1) {
    // Line - thinner stroke for dense 1200-point history
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth   = 2;
    ctx.shadowColor = col;
    ctx.shadowBlur  = 4;
    const s = w / (MH - 1);
    data.forEach((v, i) => {
      const x = i * s;
      const y = h - Math.min(1, v / max) * h;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill area
    ctx.shadowBlur = 0;
    ctx.lineTo((data.length - 1) * s, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = col.replace(')', ',0.1)').replace('rgb', 'rgba');
    ctx.fill();
  }

  // Current value label - position proportional to canvas height
  if (data.length) {
    ctx.shadowBlur = 0;
    ctx.font       = 'bold 20px Share Tech Mono';
    ctx.fillStyle  = col;
    ctx.fillText(data[data.length - 1].toFixed(1) + ' ' + unit, w - 260, h * 0.4);
  }
}
