// ============================================================
// reactor5.js — DISPLAY & MONITOR BUILDERS
// Load order: 5th (after reactor1)
// Builds: display gauge groups, warning lights, sequence steps,
//         monitor canvas grid, drawG()
// ============================================================

// ── Numeric gauge groups ──────────────────────────────────────
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
buildDG('emergReadings',     [{ id:'rodPosition',    label:'ROD POS',      color:'amber' }, { id:'heatSinkTemp',  label:'HEAT SINK',   color:'cyan'  }]);

// ── Warning lights row ────────────────────────────────────────
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

// ── Startup sequence steps ────────────────────────────────────
(function() {
  SEQUENCE.forEach((s, i) => {
    const e = document.createElement('div');
    e.className = 'seq-step';
    e.id = 'seq_' + i;
    e.innerHTML = `<div class="seq-dot"></div><div class="seq-label">${i+1}. ${s.label}</div>`;
    document.getElementById('seqSteps').appendChild(e);
  });
})();

// ── Monitor canvas grid ───────────────────────────────────────
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

// ── Graph renderer ────────────────────────────────────────────
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

  // Grid lines
  ctx.strokeStyle = 'rgba(58,63,68,0.4)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = h * (i / 4);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  if (data.length > 1) {
    // Line
    ctx.beginPath();
    ctx.strokeStyle = col;
    ctx.lineWidth   = 3;
    ctx.shadowColor = col;
    ctx.shadowBlur  = 6;
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

  // Current value label
  if (data.length) {
    ctx.shadowBlur = 0;
    ctx.font       = 'bold 24px Share Tech Mono';
    ctx.fillStyle  = col;
    ctx.fillText(data[data.length - 1].toFixed(1) + ' ' + unit, w - 280, 30);
  }
}
