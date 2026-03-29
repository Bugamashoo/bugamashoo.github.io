// reactor3.js - CORE UTILITIES
// Load order: 3rd (after reactor1)
// Exports: addLog, doShake, doFlash, modPerf, modHeat, fmtTime


function addLog(m, t='') {
  const ts = new Date().toTimeString().slice(0,8);
  logEntries.push({ t:ts, m, c:t });
  if (logEntries.length > 20) logEntries.shift();
  const e = document.getElementById('logBox');
  if (e) {
    e.innerHTML = logEntries.map(x =>
      `<div class="log-entry"><span class="log-time">${x.t}</span> <span class="log-msg ${x.c}">${x.m}</span></div>`
    ).join('');
    e.scrollTop = e.scrollHeight;
  }
}

function doShake() {
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 300);
}

function doFlash(c) {
  const d = document.createElement('div');
  d.className = 'flash-ov';
  d.style.background = c || 'rgba(255,159,28,0.06)';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 500);
}

// Returns effective performance multiplier for a module
function modPerf(key) {
  const m = S.modules[key];
  if (!m || m.status === 'offline') return 0;
  // Bypass routes all module stress to backup systems - if backup is offline, the module cannot function
  if (m.mode === 'bypass' && key !== 'backup' && S.modules.backup.status === 'offline') return 0;
  const md = MODES[m.mode] || MODES.normal;
  let p = m.status === 'degraded' ? md.perfMult * 0.5 : md.perfMult;
  if (m.sysError) {
    // Efficiency upgrade raises the error penalty floor
    const effBonus = typeof getUpgradeEfficiencyBonus === 'function' ? getUpgradeEfficiencyBonus(key) : 0;
    p *= Math.min(1, m.errorPenalty + effBonus);
  }
  // Overclock boost: 2x perf when active
  if (typeof overclockBoostEnd !== 'undefined' && overclockBoostEnd > tick && m.mode === 'overclock') {
    p = (m.status === 'degraded' ? 0.5 : 1) * MODE_OVERCLOCK_PERF * 2;
    if (m.sysError) {
      const effBonus2 = typeof getUpgradeEfficiencyBonus === 'function' ? getUpgradeEfficiencyBonus(key) : 0;
      p *= Math.min(1, m.errorPenalty + effBonus2);
    }
  }
  return p;
}

// Returns heat modifier for a module's current mode
function modHeat(key) {
  const m = S.modules[key];
  if (!m) return 0;
  return (MODES[m.mode] || MODES.normal).heatMod;
}

function fmtTime(s) {
  const h  = Math.floor(s / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const sc = Math.floor(s % 60);
  return h.toString().padStart(2,'0') + ':' +
         m.toString().padStart(2,'0') + ':' +
         sc.toString().padStart(2,'0');
}
