// reactor6.js - SYSTEMS TAB (module management)
// Load order: 6th (after reactor1, reactor3)
// Exports: buildSys (called on init + every 40 ticks)

function buildSys() {
  const c = document.getElementById('systemsGrid');
  c.innerHTML = '';

  // Bulk control card (top-left cell) ──
  const allOnline = Object.values(S.modules).every(m => m.status !== 'offline');
  const ctrl = document.createElement('div');
  ctrl.className = 'module-card';
  ctrl.style.cssText = 'display:flex;flex-direction:column;justify-content:space-between';
  ctrl.innerHTML =
    `<div class="module-title"><span>BULK CONTROL</span></div>` +
    `<div style="color:var(--${allOnline ? 'green' : 'amber'});font-size:11px;letter-spacing:1px;text-shadow:0 0 6px currentColor;margin:6px 0">` +
      `${allOnline ? 'ALL MODULES ONLINE' : 'SOME MODULES OFFLINE'}` +
    `</div>` +
    `<div style="display:flex;flex-direction:column;gap:6px">` +
      `<button class="mod-btn" style="width:100%" onclick="powerAllMods()">${allOnline ? 'POWER ALL OFF' : 'POWER ALL ON'}</button>` +
      `<button class="mod-btn" style="width:100%" onclick="rstAllMods()">RESTART ALL</button>` +
      `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px">` +
        `<button class="mod-btn" onclick="setAllMode('normal')">ALL NORMAL</button>` +
        `<button class="mod-btn" onclick="setAllMode('overclock')">ALL OVERCLOCK</button>` +
        `<button class="mod-btn" onclick="setAllMode('eco')">ALL ECO</button>` +
        `<button class="mod-btn" onclick="setAllMode('bypass')">ALL BYPASS</button>` +
      `</div>` +
    `</div>`;
  c.appendChild(ctrl);

  Object.entries(S.modules).forEach(([k, m]) => {
    const d = document.createElement('div');
    d.className = 'module-card';

    const isPoweringOn  = modPowerTimers[k]?.dir === 'on';
    const isPoweringOff = modPowerTimers[k]?.dir === 'off';
    const isBypassRestarting = bypassRestartTarget === k;
    const isRestarting = rstTargets.has(k);
    const sc = isPoweringOn || isPoweringOff ? 'degraded' : (m.mode !== 'normal' && m.status !== 'offline') ? m.mode : m.status;
    const hColor = m.health > MOD_HEALTH_GREEN ? 'green' : m.health > MOD_HEALTH_AMBER ? 'amber' : 'red';
    const isRepairing = repairTarget === k;
    const isDiagnosing = diagTarget === k;
    const isOff = m.status === 'offline';
    // sensor and comms have no meaningful configurable modes; backup only supports normal/overclock
    const hasModes = k !== 'comms' && k !== 'sensor';
    const statusExtra = m.sysErrorVisible ? ' <span style="color:var(--red);font-size:0.8em">SYSTEM ERROR</span>' :
                        isRepairing ? ' <span style="color:var(--cyan);font-size:0.8em">REPAIRING...</span>' :
                        isDiagnosing ? ' <span style="color:var(--amber);font-size:0.8em">DIAGNOSING...</span>' :
                        isBypassRestarting ? ' <span style="color:var(--magenta);font-size:0.8em">RESTARTING (BYPASS)...</span>' :
                        isPoweringOn  ? ' <span style="color:var(--green);font-size:0.8em">POWERING ON...</span>' :
                        isPoweringOff ? ' <span style="color:var(--amber);font-size:0.8em">POWERING OFF...</span>' : '';

    d.innerHTML =
      `<div class="module-title">
         <span>${m.name}${statusExtra}</span>
         <span class="module-status ${sc}">
           ${isPoweringOn ? 'PWR ON' : isPoweringOff ? 'PWR OFF' : isOff ? 'OFFLINE' : m.sysErrorVisible ? 'SYS ERROR' : (MODES[m.mode]?.label || 'NORMAL')}
         </span>
       </div>
       <div class="display-box">
         <div class="display-label">HEALTH</div>
         <div class="display-value ${hColor}">${m.health.toFixed(0)}%</div>
         <div class="bar-gauge">
           <div class="bar-fill ${hColor}" style="width:${m.health}%"></div>
         </div>
       </div>
       <div class="mode-effect" style="flex:1">
         ${MODES[m.mode]?.desc || ''}
       </div>
       <div style="display:flex;gap:4px;padding-top:6px">
         <div class="btn-group" style="flex:2;display:grid;grid-template-columns:1fr 1fr;gap:2px">
           <button class="mod-btn ${m.mode==='normal'   ?'active-mode':''}" ${!hasModes||isOff?'disabled':''} onclick="setMode('${k}','normal')">NORMAL</button>
           <button class="mod-btn ${m.mode==='overclock'?'active-mode':''}" ${!hasModes||isOff?'disabled':''} onclick="setMode('${k}','overclock')">OVERCLOCK</button>
           <button class="mod-btn ${m.mode==='eco'      ?'active-mode':''}" ${!hasModes||k==='backup'||isOff?'disabled':''} onclick="setMode('${k}','eco')">ECO</button>
           <button class="mod-btn ${m.mode==='bypass'   ?'active-mode':''}" ${!hasModes||k==='backup'||isOff?'disabled':''} onclick="setMode('${k}','bypass')">BYPASS</button>
         </div>
         <div class="btn-group" style="flex:1;display:flex;flex-direction:column;gap:2px">
           <button class="mod-btn ${isRestarting?'active-mode':''}" ${isOff&&!isRestarting?'disabled':''} onclick="rstMod('${k}')">RESTART</button>
           <button class="mod-btn ${(isPoweringOn||isPoweringOff)?'active-mode':''}" onclick="powerMod('${k}')">${modPowerTimers[k]?'CANCEL':(isOff?'POWER ON':'POWER OFF')}</button>
         </div>
         <div class="btn-group" style="flex:1;display:flex;flex-direction:column;gap:2px">
           <button class="mod-btn ${isDiagnosing?'active-mode':''}" ${isOff?'disabled':''} onclick="diagMod('${k}')">${isDiagnosing?'DIAGNOSING':'DIAGNOSE'}</button>
           <button class="mod-btn ${isRepairing ?'active-mode':''}" onclick="toggleRepair('${k}')">${isRepairing?'STOP REPAIR':'REPAIR'}</button>
         </div>
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
  addLog(m.name + ' > ' + MODES[mode].label, 'sys');
  buildSys();
};

window.powerAllMods = function() {
  const allOnline = Object.values(S.modules).every(m => m.status !== 'offline');
  // Cancel all existing power transitions
  Object.keys(modPowerTimers).forEach(k => { clearTimeout(modPowerTimers[k].id); delete modPowerTimers[k]; });
  if (allOnline) {
    addLog('ALL MODULES POWERING OFF...', 'warn');
    Object.entries(S.modules).forEach(([k, m]) => {
      modPowerTimers[k] = { dir: 'off', id: setTimeout(() => {
        m.status = 'offline'; m.mode = 'normal';
        m.sysError = false; m.sysErrorVisible = false;
        m.errorPenalty = 1; m.errorCount = 0;
        delete modPowerTimers[k];
        buildSys();
      }, MODULE_POWER_TRANSITION_MS) };
    });
  } else {
    addLog('ALL MODULES POWERING ON...', 'ok');
    Object.entries(S.modules).forEach(([k, m]) => {
      if (m.status === 'offline') {
        modPowerTimers[k] = { dir: 'on', id: setTimeout(() => {
          m.status = 'online';
          delete modPowerTimers[k];
          buildSys();
        }, MODULE_POWER_TRANSITION_MS) };
      }
    });
  }
  buildSys();
};

window.rstAllMods = function() {
  addLog('RESTARTING ALL MODULES...', 'warn');
  Object.keys(modPowerTimers).forEach(k => { clearTimeout(modPowerTimers[k].id); delete modPowerTimers[k]; });
  if (diagTarget) { diagTarget = null; diagStart = 0; }
  bypassRestartTarget = null;
  rstTargets.clear();
  Object.entries(S.modules).forEach(([k, m]) => {
    m.status = 'offline'; m.mode = 'normal';
    m.sysError = false; m.sysErrorVisible = false;
    m.errorPenalty = 1; m.errorCount = 0;
  });
  buildSys();
  setTimeout(() => {
    Object.entries(S.modules).forEach(([, m]) => { m.status = 'online'; });
    addLog('ALL MODULES ONLINE', 'ok');
    buildSys();
  }, MODULE_RESTART_MS);
};

window.setAllMode = function(mode) {
  // Eligibility mirrors per-module rules: comms/sensor have no modes; backup skips eco/bypass
  let count = 0;
  Object.entries(S.modules).forEach(([k, m]) => {
    if (m.status === 'offline') return;
    if (k === 'comms' || k === 'sensor') return;
    if (k === 'backup' && (mode === 'eco' || mode === 'bypass')) return;
    m.mode = mode;
    count++;
  });
  addLog('ALL MODULES > ' + MODES[mode].label + ' (' + count + ' updated)', 'sys');
  buildSys();
};

window.powerMod = function(k) {
  const m = S.modules[k];
  // If already transitioning, cancel it
  if (modPowerTimers[k]) {
    clearTimeout(modPowerTimers[k].id);
    delete modPowerTimers[k];
    addLog(m.name + ' power transition cancelled', 'sys');
    buildSys();
    return;
  }
  if (m.status !== 'offline') {
    addLog(m.name + ' powering off...', 'warn');
    modPowerTimers[k] = { dir: 'off', id: setTimeout(() => {
      m.status = 'offline'; m.mode = 'normal';
      m.sysError = false; m.sysErrorVisible = false;
      m.errorPenalty = 1; m.errorCount = 0;
      delete modPowerTimers[k];
      addLog(m.name + ' POWERED OFF', 'warn');
      buildSys();
    }, MODULE_POWER_TRANSITION_MS) };
  } else {
    addLog(m.name + ' powering on...', 'ok');
    modPowerTimers[k] = { dir: 'on', id: setTimeout(() => {
      m.status = 'online';
      delete modPowerTimers[k];
      addLog(m.name + ' POWERED ON', 'ok');
      buildSys();
    }, MODULE_POWER_TRANSITION_MS) };
  }
  buildSys();
};

window.rstMod = function(k) {
  const m = S.modules[k];
  const wasBypassed = m.mode === 'bypass';
  addLog('Restarting ' + m.name + (wasBypassed ? ' (bypass)' : '') + '...', 'sys');
  // Cancel power transition and diagnosis if targeting this module
  if (modPowerTimers[k]) { clearTimeout(modPowerTimers[k].id); delete modPowerTimers[k]; }
  if (diagTarget === k) { diagTarget = null; diagStart = 0; }
  rstTargets.add(k);
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
      rstTargets.delete(k);
      addLog(m.name + ' errors cleared (bypass)', 'ok');
      buildSys();
    }, MODULE_RESTART_MS);
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
      rstTargets.delete(k);
      addLog(m.name + ' ONLINE', 'ok');
      buildSys();
    }, MODULE_RESTART_MS);
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
  diagDuration = (DIAG_DURATION_BASE_MS + Math.random() * DIAG_DURATION_RANGE_MS) * (m.mode === 'bypass' ? DIAG_BYPASS_MULT : 1); // 1-5s normal; 0.5-2.5s in bypass
  addLog('Diagnosing ' + m.name + '...', 'sys');
  buildSys();
};

buildSys();
