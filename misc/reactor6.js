// reactor6.js - SYSTEMS TAB (module management)
// Load order: 6th (after reactor1, reactor3)
// Exports: buildSys (called on init + every 40 ticks)

function buildSys() {
  const c = document.getElementById('systemsGrid');
  c.innerHTML = '';

  // Bulk control card (top-left cell) 
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
      `<button class="mod-btn${diagAllActive ? ' active-mode' : ''}" style="width:100%" onclick="${diagAllActive ? 'cancelDiagAll()' : 'showDiagAllConfirm()'}">${diagAllActive ? 'CANCEL SWEEP' : 'DIAGNOSE ALL (SLOW)'}</button>` +
      `<div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:2px">` +
        `<button class="mod-btn" onclick="setAllMode('normal')">ALL NORMAL</button>` +
        `<button class="mod-btn ${modeUnlocks.overclock<1?'locked':''}" onclick="${modeUnlocks.overclock<1?'showToast(toastLockedOverclock)':'setAllMode(\'overclock\')'}">${modeUnlocks.overclock<1?'LOCKED':'ALL OVERCLOCK'}</button>` +
        `<button class="mod-btn ${modeUnlocks.eco<1?'locked':''}" onclick="${modeUnlocks.eco<1?'showToast(toastLockedEco)':'setAllMode(\'eco\')'}">${modeUnlocks.eco<1?'LOCKED':'ALL ECO'}</button>` +
        `<button class="mod-btn ${modeUnlocks.bypass<1?'locked':''}" onclick="${modeUnlocks.bypass<1?'showToast(toastLockedBypass)':'setAllMode(\'bypass\')'}">${modeUnlocks.bypass<1?'LOCKED':'ALL BYPASS'}</button>` +
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
    const maxH = typeof getUpgradeMaxHealth === 'function' ? getUpgradeMaxHealth(k) : 100;
    const hPct = m.health / maxH * 100;
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
         <div class="display-label">HEALTH${maxH > 100 ? ' (MAX ' + maxH + ')' : ''}</div>
         <div class="display-value ${hColor}">${m.health.toFixed(0)}/${maxH}</div>
         <div class="bar-gauge">
           <div class="bar-fill ${hColor}" style="width:${hPct.toFixed(1)}%"></div>
         </div>
       </div>
       <div class="mode-effect" style="flex:1">
         ${MODES[m.mode]?.desc || ''}
       </div>
       <div style="display:flex;gap:4px;padding-top:6px">
         <div class="btn-group" style="flex:2;display:grid;grid-template-columns:1fr 1fr;gap:2px">
           <button class="mod-btn ${m.mode==='normal'   ?'active-mode':''}" ${!hasModes||isOff?'disabled':''} onclick="setMode('${k}','normal')">NORMAL</button>
           <button class="mod-btn ${modeUnlocks.overclock<1?'locked':''} ${m.mode==='overclock'?'active-mode':''}" ${!hasModes||isOff?'disabled':''} onclick="${modeUnlocks.overclock<1?'showToast(toastLockedOverclock)':'setMode(\''+k+'\',\'overclock\')'}">${modeUnlocks.overclock<1?'LOCKED':'OVERCLOCK'}</button>
           <button class="mod-btn ${modeUnlocks.eco<1?'locked':''} ${m.mode==='eco'?'active-mode':''}" ${!hasModes||k==='backup'||isOff?'disabled':''} onclick="${modeUnlocks.eco<1?'showToast(toastLockedEco)':'setMode(\''+k+'\',\'eco\')'}">${modeUnlocks.eco<1?'LOCKED':'ECO'}</button>
           <button class="mod-btn ${modeUnlocks.bypass<1?'locked':''} ${m.mode==='bypass'?'active-mode':''}" ${!hasModes||k==='backup'||isOff?'disabled':''} onclick="${modeUnlocks.bypass<1?'showToast(toastLockedBypass)':'setMode(\''+k+'\',\'bypass\')'}">${modeUnlocks.bypass<1?'LOCKED':'BYPASS'}</button>
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
  if (mode !== 'normal' && modeUnlocks[mode] < 1) return;
  if (m.status === 'offline') { addLog(m.name + ' is OFFLINE', 'err'); return; }
  if (mode === 'bypass' && k === 'backup') { addLog('BACKUP SYSTEMS cannot be bypassed', 'err'); return; }
  m.mode = mode;
  addLog(m.name + ' > ' + MODES[mode].label, 'sys');
  buildSys();
};

window.powerAllMods = function() {
  const allOnline = Object.values(S.modules).every(m => m.status !== 'offline');
  // Cancel all existing power transitions
  Object.keys(modPowerTimers).forEach(k => { delete modPowerTimers[k]; });
  if (allOnline) {
    addLog('ALL MODULES POWERING OFF...', 'warn');
    Object.entries(S.modules).forEach(([k]) => {
      modPowerTimers[k] = { dir: 'off', endTick: tick + MODULE_POWER_TRANSITION_TICKS };
    });
  } else {
    addLog('ALL MODULES POWERING ON...', 'ok');
    Object.entries(S.modules).forEach(([k, m]) => {
      if (m.status === 'offline') {
        modPowerTimers[k] = { dir: 'on', endTick: tick + MODULE_POWER_TRANSITION_TICKS };
      }
    });
  }
  buildSys();
};

window.rstAllMods = function() {
  addLog('RESTARTING ALL MODULES...', 'warn');
  Object.keys(modPowerTimers).forEach(k => { delete modPowerTimers[k]; });
  Object.keys(rstEndTicks).forEach(k => { delete rstEndTicks[k]; });
  if (diagTarget) { diagTarget = null; diagStart = 0; }
  if (diagAllActive) cancelDiagAll();
  bypassRestartTarget = null;
  rstTargets.clear();
  Object.entries(S.modules).forEach(([k, m]) => {
    m.status = 'offline'; m.mode = 'normal';
    m.sysError = false; m.sysErrorVisible = false;
    m.errorPenalty = 1; m.errorCount = 0;
    rstEndTicks[k] = tick + MODULE_RESTART_TICKS;
    rstTargets.add(k);
  });
  buildSys();
};

window.setAllMode = function(mode) {
  if (mode !== 'normal' && modeUnlocks[mode] < 1) return;
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
    delete modPowerTimers[k];
    addLog(m.name + ' power transition cancelled', 'sys');
    buildSys();
    return;
  }
  if (m.status !== 'offline') {
    addLog(m.name + ' powering off...', 'warn');
    modPowerTimers[k] = { dir: 'off', endTick: tick + MODULE_POWER_TRANSITION_TICKS };
  } else {
    addLog(m.name + ' powering on...', 'ok');
    modPowerTimers[k] = { dir: 'on', endTick: tick + MODULE_POWER_TRANSITION_TICKS };
  }
  buildSys();
};

window.rstMod = function(k) {
  const m = S.modules[k];
  const wasBypassed = m.mode === 'bypass';
  addLog('Restarting ' + m.name + (wasBypassed ? ' (bypass)' : '') + '...', 'sys');
  // Cancel power transition and diagnosis if targeting this module
  if (modPowerTimers[k]) { delete modPowerTimers[k]; }
  if (diagTarget === k) { diagTarget = null; diagStart = 0; }
  rstTargets.add(k);
  if (wasBypassed) {
    // Bypass restart: stays online in bypass mode, errors cleared after restart timer
    bypassRestartTarget = k;
    rstEndTicks[k] = tick + MODULE_RESTART_TICKS;
    buildSys();
  } else {
    m.status = 'offline';
    m.mode = 'normal';
    m.sysError = false;
    m.sysErrorVisible = false;
    m.errorPenalty = 1;
    m.errorCount = 0;
    if (k === 'comms') syncCommsLocks();
    if (k === 'sensor') syncSensorFaults();
    rstEndTicks[k] = tick + MODULE_RESTART_TICKS;
    buildSys();
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
    // Cancel current diagnosis (and sweep if it's part of one)
    diagTarget = null; diagStart = 0;
    addLog('Diagnosis cancelled: ' + m.name, 'sys');
    if (diagAllActive) cancelDiagAll();
    buildSys();
    return;
  }
  // If a sweep is active and the user tries to start a manual diag, show confirm to cancel sweep
  if (diagAllActive) {
    showDiagAllConfirm('interrupting', k);
    return;
  }
  if (diagTarget !== null) {
    addLog('Already diagnosing ' + S.modules[diagTarget].name, 'warn');
    return;
  }
  diagTarget = k;
  diagStart = tick;
  diagDuration = Math.round((DIAG_DURATION_BASE_TICKS + Math.random() * DIAG_DURATION_RANGE_TICKS) * (m.mode === 'bypass' ? DIAG_BYPASS_MULT : 1));
  addLog('Diagnosing ' + m.name + '...', 'sys');
  buildSys();
};

// ── Diagnose All sweep functions ─────────────────────────────────────────────

// Returns the diagnosis speed multiplier for the current diagSpeed upgrade tier
function getDiagAllSpeedMult() {
  const tier = specialUpgrades.diagSpeed || 0;
  return DIAG_ALL_SPEED_TIERS[Math.min(tier, DIAG_ALL_SPEED_TIERS.length - 1)] || DIAG_ALL_BASE_MULT;
}

// Show the confirm dialog before starting a sweep (or when interrupting one with a manual diag)
// mode: 'start' | 'interrupting' | 'sweepOverride'
window.showDiagAllConfirm = function(mode, pendingKey) {
  const overlay = document.getElementById('diagAllConfirm');
  const title   = document.getElementById('diagAllConfirmTitle');
  const msg     = document.getElementById('diagAllConfirmMsg');
  const yes     = document.getElementById('diagAllConfirmYes');
  const no      = document.getElementById('diagAllConfirmNo');
  if (!overlay) return;

  if (mode === 'interrupting') {
    // Manual diag was clicked while sweep is active
    title.textContent = 'INTERRUPT SWEEP?';
    msg.innerHTML = `Diagnosing <strong style="color:#e0e4ea">${S.modules[pendingKey].name}</strong> manually will cancel the current Diagnose All sweep. Continue?<br><br><span style="color:var(--amber)">Manual diagnosis is faster than a sweep.</span>`;
    yes.onclick = () => {
      cancelDiagAll();
      // Start the manual diag now
      diagTarget = pendingKey;
      diagStart = tick;
      const m = S.modules[pendingKey];
      diagDuration = Math.round((DIAG_DURATION_BASE_TICKS + Math.random() * DIAG_DURATION_RANGE_TICKS) * (m.mode === 'bypass' ? DIAG_BYPASS_MULT : 1));
      addLog('Diagnosing ' + m.name + '...', 'sys');
      overlay.style.display = 'none';
      buildSys();
    };
  } else if (mode === 'sweepOverride') {
    // Diag All was clicked while a manual diagnosis was in progress
    title.textContent = 'START SWEEP?';
    msg.innerHTML = `A diagnosis of <strong style="color:#e0e4ea">${S.modules[diagTarget].name}</strong> is in progress. Starting a sweep will cancel it and diagnose all modules in sequence.<br><br><span style="color:var(--amber)">⚠ Sweep diagnosis is slower than manual — proceed?</span>`;
    yes.onclick = () => {
      overlay.style.display = 'none';
      _launchDiagAll();
    };
  } else {
    // Normal start — no second argument needed
    const speedMult  = getDiagAllSpeedMult();
    const count      = Object.keys(S.modules).length;
    const avgDiagTicks = (DIAG_DURATION_BASE_TICKS + DIAG_DURATION_RANGE_TICKS / 2) / speedMult;
    const estTotalSec  = Math.round(avgDiagTicks * count / 20);
    const estFmt = estTotalSec >= 60
      ? Math.floor(estTotalSec / 60) + 'm ' + (estTotalSec % 60) + 's'
      : estTotalSec + 's';
    title.textContent = 'DIAGNOSE ALL MODULES?';
    msg.innerHTML =
      `<span style="color:var(--amber);font-weight:700">⚠ Each module takes significantly longer to diagnose during a sweep than when diagnosing manually — individual diagnosis is always faster.</span>` +
      `<br><br>` +
      `Scans all ${count} modules one-by-one and reveals any hidden system errors.` +
      `<br><br>` +
      `Estimated sweep time: <strong style="color:#e0e4ea">~${estFmt}</strong>`;
    yes.onclick = () => {
      overlay.style.display = 'none';
      if (diagTarget !== null) {
        showDiagAllConfirm('sweepOverride');
        return;
      }
      _launchDiagAll();
    };
  }

  no.onclick = () => { overlay.style.display = 'none'; };
  overlay.style.display = 'flex';

  // Show first-use tutorial toast
  if (!diagAllToasted) {
    diagAllToasted = true;
    showToast(toastDiagAllFirstUse);
  }
};

// Called when the confirm dialog is accepted — initializes the sweep
function _launchDiagAll() {
  if (diagTarget !== null) { diagTarget = null; diagStart = 0; }
  diagAllActive  = true;
  diagAllQueue   = Object.keys(S.modules);
  diagAllIndex   = 0;
  diagAllResults = [];
  addLog('DIAGNOSE ALL: sweep started (' + diagAllQueue.length + ' modules)', 'sys');
  _startNextDiagAllModule();
  buildSys();
}

// Start diagnosis on the next module in the queue
function _startNextDiagAllModule() {
  // Skip offline modules
  while (diagAllIndex < diagAllQueue.length) {
    const k = diagAllQueue[diagAllIndex];
    if (S.modules[k].status !== 'offline') break;
    diagAllResults.push({ key: k, skipped: true });
    diagAllIndex++;
  }
  if (diagAllIndex >= diagAllQueue.length) {
    _finishDiagAll();
    return;
  }
  const k = diagAllQueue[diagAllIndex];
  const m = S.modules[k];
  const spd = getDiagAllSpeedMult();
  diagTarget   = k;
  diagStart    = tick;
  diagDuration = Math.round((DIAG_DURATION_BASE_TICKS + Math.random() * DIAG_DURATION_RANGE_TICKS) / spd * (m.mode === 'bypass' ? DIAG_BYPASS_MULT : 1));
  addLog('Sweep: diagnosing ' + m.name + ' (' + (diagAllIndex + 1) + '/' + diagAllQueue.length + ')...', 'sys');
  buildSys();
}

// Called when user explicitly cancels the sweep
function cancelDiagAll() {
  if (!diagAllActive) return;
  if (diagTarget !== null) { diagTarget = null; diagStart = 0; }
  diagAllActive = false;
  diagAllQueue  = [];
  diagAllResults = [];
  addLog('DIAGNOSE ALL: sweep cancelled', 'warn');
  buildSys();
}
window.cancelDiagAll = cancelDiagAll;

// Called from sim.js when a diagnosis completes and diagAllActive is true.
// hadError: true if the module had a hidden sysError that was just revealed.
function _advanceDiagAll(k, hadError) {
  if (!diagAllActive) return;
  diagAllResults.push({ key: k, hadError: hadError });
  diagAllIndex++;
  if (diagAllIndex >= diagAllQueue.length) {
    _finishDiagAll();
  } else {
    _startNextDiagAllModule();
  }
}

// Reveal all buffered results and log summary
function _finishDiagAll() {
  const errModules = diagAllResults.filter(r => r.hadError).map(r => S.modules[r.key].name);
  const skipped    = diagAllResults.filter(r => r.skipped).map(r => S.modules[r.key].name);
  diagAllActive  = false;
  diagAllQueue   = [];
  diagAllResults = [];
  diagTarget     = null;
  diagStart      = 0;
  if (errModules.length === 0) {
    addLog('DIAGNOSE ALL: sweep complete — no errors found', 'ok');
  } else {
    addLog('DIAGNOSE ALL: sweep complete — errors in: ' + errModules.join(', '), 'err');
  }
  if (skipped.length > 0) {
    addLog('DIAGNOSE ALL: skipped offline modules: ' + skipped.join(', '), 'sys');
  }
  buildSys();
}

buildSys();
