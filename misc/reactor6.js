// ============================================================
// reactor6.js — SYSTEMS TAB (module management)
// Load order: 6th (after reactor1, reactor3)
// Exports: buildSys (called on init + every 40 ticks)
// ============================================================

function buildSys() {
  const c = document.getElementById('systemsGrid');
  c.innerHTML = '';

  // ── Bulk power control ──
  const allOnline = Object.values(S.modules).every(m => m.status !== 'offline');
  const bar = document.createElement('div');
  bar.style.cssText = 'grid-column:1/-1;display:flex;gap:8px;margin-bottom:4px;align-items:center';
  bar.innerHTML =
    `<button class="mod-btn" style="font-size:13px;padding:5px 14px" onclick="powerAllMods()">${allOnline ? 'POWER ALL OFF' : 'POWER ALL ON'}</button>` +
    `<span style="font-size:12px;color:#5a5f66;letter-spacing:1px">${allOnline ? 'ALL MODULES ONLINE' : 'SOME MODULES OFFLINE'}</span>`;
  c.appendChild(bar);

  Object.entries(S.modules).forEach(([k, m]) => {
    const d = document.createElement('div');
    d.className = 'module-card';

    const sc = (m.mode !== 'normal' && m.status !== 'offline') ? m.mode : m.status;
    const affectsLabel = m.affects ? '→ ' + S.modules[m.affects].name : '';
    const hColor = m.health > 70 ? 'green' : m.health > 40 ? 'amber' : 'red';
    const isRepairing = repairTarget === k;
    const isDiagnosing = diagTarget === k;
    const isOff = m.status === 'offline';
    // sensor and comms have no meaningful configurable modes; backup only supports normal/overclock
    const hasModes = k !== 'comms' && k !== 'sensor';

    const isBypassRestarting = bypassRestartTarget === k;
    const statusExtra = m.sysErrorVisible ? ' <span style="color:var(--red);font-size:0.8em">SYSTEM ERROR</span>' :
                        isRepairing ? ' <span style="color:var(--cyan);font-size:0.8em">REPAIRING...</span>' :
                        isDiagnosing ? ' <span style="color:var(--amber);font-size:0.8em">DIAGNOSING...</span>' :
                        isBypassRestarting ? ' <span style="color:var(--magenta);font-size:0.8em">RESTARTING (BYPASS)...</span>' : '';

    d.innerHTML =
      `<div class="module-title">
         <span>${m.name}${statusExtra}</span>
         <span class="module-status ${sc}">
           ${isOff ? 'OFFLINE' : m.sysErrorVisible ? 'SYS ERROR' : (MODES[m.mode]?.label || 'NORMAL')}
         </span>
       </div>
       <div class="display-box">
         <div class="display-label">HEALTH</div>
         <div class="display-value ${hColor}">${m.health.toFixed(0)}%</div>
         <div class="bar-gauge">
           <div class="bar-fill ${hColor}" style="width:${m.health}%"></div>
         </div>
       </div>
       <div class="mode-effect">
         <span class="link">AFFECTS: ${affectsLabel}</span><br>
         ${MODES[m.mode]?.desc || ''}
       </div>
       <div class="mode-row">
         ${!hasModes
           ? '<span class="link">No configurable modes</span>'
           : k === 'backup'
           ? `<button class="mod-btn ${m.mode==='normal'    ?'active-mode':''}" onclick="setMode('${k}','normal')">NORMAL</button>
              <button class="mod-btn ${m.mode==='overclock' ?'active-mode':''}" onclick="setMode('${k}','overclock')">OVERCLOCK</button>`
           : `<button class="mod-btn ${m.mode==='normal'    ?'active-mode':''}" onclick="setMode('${k}','normal')">NORMAL</button>
              <button class="mod-btn ${m.mode==='overclock' ?'active-mode':''}" onclick="setMode('${k}','overclock')">OVERCLOCK</button>
              <button class="mod-btn ${m.mode==='eco'       ?'active-mode':''}" onclick="setMode('${k}','eco')">ECO</button>
              <button class="mod-btn ${m.mode==='bypass'    ?'active-mode':''}" onclick="setMode('${k}','bypass')">BYPASS</button>`
         }
       </div>
       <div class="mode-row" style="margin-top:4px">
         <button class="mod-btn" onclick="powerMod('${k}')">${isOff ? 'POWER ON' : 'POWER OFF'}</button>
         <button class="mod-btn" onclick="rstMod('${k}')">RESTART</button>
         <button class="mod-btn ${isRepairing ? 'active-mode' : ''}" onclick="toggleRepair('${k}')">${isRepairing ? 'STOP REPAIR' : 'REPAIR'}</button>
         <button class="mod-btn ${isDiagnosing ? 'active-mode' : ''}" onclick="diagMod('${k}')">${isDiagnosing ? 'DIAGNOSING...' : 'DIAGNOSE'}</button>
       </div>`;

    c.appendChild(d);
  });
}

window.setMode = function(k, mode) {
  const m = S.modules[k];
  if (!MODES[mode]) return;
  if (m.status === 'offline') { addLog(m.name + ' is OFFLINE', 'err'); return; }
  if (mode === 'bypass' && k === 'backup') { addLog('BACKUP SYSTEMS cannot be bypassed', 'err'); return; }
  m.mode = mode;
  addLog(m.name + ' → ' + MODES[mode].label, 'sys');
  if (m.affects && mode === 'overclock') {
    const t = S.modules[m.affects];
    if (t.status === 'online') t.health = Math.max(0, t.health - 3);
    addLog(t.name + ' stressed by overclock', 'warn');
  }
  buildSys();
};

window.powerAllMods = function() {
  const allOnline = Object.values(S.modules).every(m => m.status !== 'offline');
  Object.entries(S.modules).forEach(([k, m]) => {
    if (allOnline) {
      m.status = 'offline';
      m.mode = 'normal';
    } else {
      if (m.status === 'offline') m.status = 'online';
    }
  });
  addLog(allOnline ? 'ALL MODULES POWERED OFF' : 'ALL MODULES POWERED ON', allOnline ? 'warn' : 'ok');
  buildSys();
};

window.powerMod = function(k) {
  const m = S.modules[k];
  if (m.status === 'offline') {
    m.status = 'online';
    addLog(m.name + ' POWERED ON', 'ok');
  } else {
    m.status = 'offline';
    m.mode = 'normal';
    addLog(m.name + ' POWERED OFF', 'warn');
  }
  buildSys();
};

window.rstMod = function(k) {
  const m = S.modules[k];
  const wasBypassed = m.mode === 'bypass';
  addLog('Restarting ' + m.name + (wasBypassed ? ' (bypass)' : '') + '...', 'sys');
  // Cancel diagnosis if targeting this module
  if (diagTarget === k) { diagTarget = null; diagStart = 0; }
  if (wasBypassed) {
    // Bypass restart: stays online in bypass mode, errors cleared after 5s
    bypassRestartTarget = k;
    buildSys();
    setTimeout(() => {
      m.sysError = false;
      m.sysErrorVisible = false;
      m.errorPenalty = 1;
      m.errorCount = 0;
      bypassRestartTarget = null;
      addLog(m.name + ' errors cleared (bypass)', 'ok');
      buildSys();
    }, 5000);
  } else {
    m.status = 'offline';
    m.mode = 'normal';
    m.sysError = false;
    m.sysErrorVisible = false;
    m.errorPenalty = 1;
    m.errorCount = 0;
    buildSys();
    setTimeout(() => {
      m.status = 'online';
      addLog(m.name + ' ONLINE', 'ok');
      buildSys();
    }, 5000);
  }
};

window.toggleRepair = function(k) {
  if (repairTarget === k) {
    repairTarget = null;
    addLog('Repair halted: ' + S.modules[k].name, 'sys');
  } else {
    repairTarget = k;
    addLog('Repairing: ' + S.modules[k].name + (S.modules[k].status === 'offline' ? ' (fast)' : ''), 'sys');
  }
  buildSys();
};

window.diagMod = function(k) {
  const m = S.modules[k];
  if (diagTarget === k) {
    // Cancel current diagnosis
    diagTarget = null; diagStart = 0;
    addLog('Diagnosis cancelled: ' + m.name, 'sys');
    buildSys();
    return;
  }
  if (diagTarget !== null) {
    addLog('Already diagnosing ' + S.modules[diagTarget].name, 'warn');
    return;
  }
  diagTarget = k;
  diagStart = Date.now();
  diagDuration = (1 + Math.random() * 4) * 1000; // 1-5s
  addLog('Diagnosing ' + m.name + '...', 'sys');
  buildSys();
};

buildSys();
