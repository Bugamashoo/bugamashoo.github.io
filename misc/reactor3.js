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
  if (FLASH_DISABLED) return;
  document.body.classList.add('shake');
  setTimeout(() => document.body.classList.remove('shake'), 300);
}

function doFlash(c) {
  if (FLASH_DISABLED) return;
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
    p *= m.errorPenalty;
  }
  // Efficiency upgrade: flat multiplier on overall performance
  const effBonus = typeof getUpgradeEfficiencyBonus === 'function' ? getUpgradeEfficiencyBonus(key) : 0;
  if (effBonus > 0) p *= (1 + effBonus);
  // Overclock boost: 2x perf when active
  if (typeof overclockBoostEnd !== 'undefined' && overclockBoostEnd > tick && m.mode === 'overclock') {
    p = (m.status === 'degraded' ? 0.5 : 1) * MODE_OVERCLOCK_PERF * 2;
    if (m.sysError) p *= m.errorPenalty;
    if (effBonus > 0) p *= (1 + effBonus);
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

// Returns the current multiplier for a special tiered upgrade (1.0 if not purchased)
function getSpecialUpgradeMult(key) {
  const tier = specialUpgrades[key] || 0;
  return tier > 0 ? SPEC_UPG_MULT_STEPS[tier - 1] : 1.0;
}

// Pools for comms/sensor error effects (controls and gauges on the main panel)
const COMMS_LOCKABLE_SWITCHES = ['auxPower','radShield','fuelPumps','coolantPumps','magCoils','ignPrime','turbineEngage','gridSync','ventSystem','containField','backupGen','turbineLimiter'];
const COMMS_LOCKABLE_CONTROLS = ['mainThrottle','fuelInject','coolantFlow','containPower','pressureRelief','mixRatio','fieldTune'];
const SENSOR_FAULTY_GAUGE_POOL = ['coreTemp','corePressure','plasmaStability','neutronDensity','coolantTemp','coolantFlowRate','turbineRPM','containIntegrity','magneticFlux','radiationLevel'];

// Reconcile commsLockedSwitches / commsLockedControls to match current comms errorCount.
// Only appends new random picks when errorCount increased; clears when sysError is false.
function syncCommsLocks() {
  const m = S.modules.comms;
  if (!m.sysError) { commsLockedSwitches = []; commsLockedControls = []; return; }
  const needed = Math.min(m.errorCount, Math.min(COMMS_LOCKABLE_SWITCHES.length, COMMS_LOCKABLE_CONTROLS.length));
  while (commsLockedSwitches.length < needed) {
    const avail = COMMS_LOCKABLE_SWITCHES.filter(id => !commsLockedSwitches.includes(id));
    if (!avail.length) break;
    commsLockedSwitches.push(avail[Math.floor(Math.random() * avail.length)]);
  }
  while (commsLockedControls.length < needed) {
    const avail = COMMS_LOCKABLE_CONTROLS.filter(id => !commsLockedControls.includes(id));
    if (!avail.length) break;
    commsLockedControls.push(avail[Math.floor(Math.random() * avail.length)]);
  }
}

// Reconcile sensorFaultyGauges to match current sensor errorCount.
function syncSensorFaults() {
  const m = S.modules.sensor;
  if (!m.sysError) { sensorFaultyGauges = []; return; }
  const needed = Math.min(m.errorCount, SENSOR_FAULTY_GAUGE_POOL.length);
  while (sensorFaultyGauges.length < needed) {
    const avail = SENSOR_FAULTY_GAUGE_POOL.filter(id => !sensorFaultyGauges.includes(id));
    if (!avail.length) break;
    sensorFaultyGauges.push(avail[Math.floor(Math.random() * avail.length)]);
  }
  sensorFaultyGauges = sensorFaultyGauges.slice(0, needed);
}

// Returns current turbine safe RPM threshold based on turbineSpeedUpgrade tier
function getTurbineSafeMax() {
  const tier = specialUpgrades.turbineSpeedUpgrade || 0;
  return SPEC_UPG_TURBINE_SPEED_BASE + tier * (SPEC_UPG_TURBINE_SPEED_MAX - SPEC_UPG_TURBINE_SPEED_BASE) / SPEC_UPG_TURBINE_SPEED_TIERS;
}

// Returns current backup generator power output (MW) based on upgrade tier
function getBackupGenOutput() {
  const tier = specialUpgrades.backupGenerator || 0;
  return POWER_BACKUP_GEN_BONUS + tier * (SPEC_UPG_BACKUP_GEN_MAX_MW - POWER_BACKUP_GEN_BONUS) / SPEC_UPG_BACKUP_GEN_TIERS;
}

// Returns current backup generator fuel consumption multiplier (1.0 at T0, 0.5 at T9)
function getBackupGenFuelMult() {
  const tier = specialUpgrades.backupGenerator || 0;
  return 1.0 - tier * (1.0 - SPEC_UPG_BACKUP_GEN_MIN_FUEL) / SPEC_UPG_BACKUP_GEN_TIERS;
}
