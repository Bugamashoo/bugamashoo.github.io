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

// Show an informational toast explaining why the plasma just went out / reactor just scrammed.
// Throttled to once per 5 seconds to avoid spam during rapid oscillation.
// reasons: 'ignPrime' | 'fuelEmpty' | 'lowFlow' | 'stability' | 'autoScram'
function buildShutdownToast(reason) {
  if (tick - lastShutdownToastTick < 100) return; // 100 ticks = 5s at 20Hz
  lastShutdownToastTick = tick;
  const msgs = {
    ignPrime:  '⚛ IGN PRIME switched off — plasma lost',
    fuelEmpty: '⛽ Fuel depleted — plasma extinguished',
    lowFlow:   '🌊 Fuel flow too low — plasma extinguished',
    stability: '⚡ Plasma instability — magnetic confinement lost',
    autoScram: '🔴 Containment critical — auto-SCRAM triggered',
  };
  const msg = msgs[reason];
  if (msg) showToast(msg);
}

// ─── CRITICAL GAUGE CONTROL HINTS ────────────────────────────────────────────
// getCritHints(gaugeId): returns up to 3 actionable hint strings for a gauge
// that has entered its critical range. Only suggests controls that are
// currently unlocked, not comms-locked, and where the action would help.

function getCritHints(gaugeId) {
  const hints = [];

  // Comms-lock checks
  const swFree = (id) => !commsLockedSwitches.includes(id);
  const lvFree = (id) => !commsLockedControls.includes(id);

  // Conditional push — only adds if condition is met and we still have room
  const h = (cond, msg) => { if (cond && hints.length < 3) hints.push(msg); };

  switch (gaugeId) {

    case 'coreTemp': {
      // Priority: increase cooling → reduce heat input → emergency → rods
      h(!S.coolantPumps && swFree('coolantPumps'),
        'Enable COOLANT PUMPS switch to restore primary cooling');
      h(S.coolantPumps && S.coolantFlow < 85 && lvFree('coolantFlow'),
        'Raise COOLANT FLOW lever for more primary cooling');
      h(!S.coolantPumps && S.coolantFlow < 85 && lvFree('coolantFlow'),
        'Also raise COOLANT FLOW lever once pumps are on');
      h(unlockedSubsystems && !S.auxCoolPump && swFree('auxCoolPump'),
        'Enable AUX COOL PUMP switch for supplemental cooling');
      h(unlockedSubsystems && S.auxCoolPump && !S.auxCoolLoop && swFree('auxCoolLoop'),
        'Enable AUX COOL LOOP switch to activate aux cooling circuit');
      h(unlockedSubsystems && S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate < 80 && lvFree('auxCoolRate'),
        'Raise AUX COOL RATE lever for more auxiliary cooling');
      h(S.mainThrottle > 20 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE to reduce heat generation');
      h(S.fuelInject > 20 && lvFree('fuelInject'),
        'Lower FUEL INJECT lever to reduce plasma heat output');
      h(unlockedTuning && Math.abs(S.mixRatio - 50) > 20 && lvFree('mixRatio'),
        'Move MIX RATIO knob toward 50% to reduce core heat');
      h(unlockedEmergency,
        'Use COOL FLOOD emergency action for rapid temperature reduction');
      h(unlockedEmergency && !S.emergVent && swFree('emergVent'),
        'Enable EMERG VENT switch to vent excess heat');
      h(unlockedEmergency && S.rodSafetyOff && swFree('rodSafetyOff'),
        'Turn OFF ROD SAFETY switch then raise ROD A/B/C levers to absorb neutrons');
      h(unlockedEmergency && !S.rodSafetyOff && (S.rodA < 80 || S.rodB < 80 || S.rodC < 80),
        'Raise ROD A/B/C levers to increase neutron absorption');
      break;
    }

    case 'corePres': {
      // Priority: vent pressure → reduce drivers → emergency → rods
      h(unlockedTuning && S.pressureRelief < 85 && lvFree('pressureRelief'),
        'Raise PRESSURE RELIEF knob to vent excess core pressure');
      h(S.mainThrottle > 20 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE to reduce plasma confinement pressure');
      h(S.fuelInject > 20 && lvFree('fuelInject'),
        'Lower FUEL INJECT lever to reduce pressure contribution');
      h(S.coolantFlow < 80 && lvFree('coolantFlow'),
        'Raise COOLANT FLOW to carry heat away and relieve pressure');
      h(!S.coolantPumps && swFree('coolantPumps'),
        'Enable COOLANT PUMPS for coolant-assisted pressure relief');
      h(unlockedEmergency,
        'Use PURGE emergency button to rapidly vent core pressure');
      h(unlockedEmergency && !S.emergVent && swFree('emergVent'),
        'Enable EMERG VENT switch for additional pressure venting');
      h(unlockedEmergency && S.rodSafetyOff && swFree('rodSafetyOff'),
        'Turn OFF ROD SAFETY switch then raise ROD A/B/C levers to dampen reaction');
      h(unlockedEmergency && !S.rodSafetyOff && (S.rodA < 80 || S.rodB < 80 || S.rodC < 80),
        'Raise ROD A/B/C levers to reduce reaction rate and pressure');
      break;
    }

    case 'plasma': {
      // Priority: containment power → containment field → field tune → backup → root causes
      h(S.containPower < 75 && lvFree('containPower'),
        'Raise CONTAINMENT POWER lever to strengthen magnetic confinement');
      h(!S.containField && swFree('containField'),
        'Enable CONTAINMENT FIELD switch for plasma stability boost');
      h(unlockedTuning && S.fieldTune < 80 && lvFree('fieldTune'),
        'Raise FIELD TUNE knob for better plasma confinement geometry');
      h(unlockedSubsystems && (!S.backupContA || !S.backupContB),
        'Enable BACKUP CONT A and B switches for additional field support');
      h(unlockedSubsystems && S.backupContA && S.backupContB && S.backupContPow < 70 && lvFree('backupContPow'),
        'Raise BACKUP CONT POWER lever to boost backup containment field');
      h(!S.magCoils && swFree('magCoils'),
        'Enable MAG COILS switch — required for magnetic field generation');
      h(S.coreTemp > SAFE_TEMP_RED,
        'Reduce core temperature — overtemp actively degrades plasma stability');
      h(S.containIntegrity < SAFE_CONTAIN_RED,
        'Improve CONTAINMENT INTEGRITY — low integrity destabilises plasma');
      h(S.modules.magnetic.status !== 'online',
        'MAGNETIC CTRL module is offline — restart it from the SYSTEMS tab');
      break;
    }

    case 'coolFlow': {
      // Priority: get pumps on → raise flow → aux cool → module health
      h(!S.coolantPumps && swFree('coolantPumps'),
        'Enable COOLANT PUMPS switch to restore coolant flow');
      h(S.coolantFlow < 80 && lvFree('coolantFlow'),
        'Raise COOLANT FLOW lever to increase flow rate');
      h(unlockedSubsystems && !S.auxCoolPump && swFree('auxCoolPump'),
        'Enable AUX COOL PUMP for supplemental coolant flow');
      h(unlockedSubsystems && S.auxCoolPump && !S.auxCoolLoop && swFree('auxCoolLoop'),
        'Enable AUX COOL LOOP to activate aux cooling circuit');
      h(unlockedSubsystems && S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate < 70 && lvFree('auxCoolRate'),
        'Raise AUX COOL RATE lever for more auxiliary flow');
      h(!S.auxPower && swFree('auxPower'),
        'Enable AUX POWER — required for coolant system to function');
      h(S.modules.coolant.status !== 'online',
        'PRIMARY COOLANT module degraded — restart from the SYSTEMS tab');
      break;
    }

    case 'coolTemp': {
      // Priority: increase flow → increase cooling capacity → reduce heat input
      h(S.coolantFlow < 85 && lvFree('coolantFlow'),
        'Raise COOLANT FLOW lever to improve heat exchange');
      h(!S.coolantPumps && swFree('coolantPumps'),
        'Enable COOLANT PUMPS switch to restore coolant circulation');
      h(unlockedSubsystems && (!S.auxCoolPump || !S.auxCoolLoop),
        'Enable AUX COOL PUMP + LOOP to assist the primary coolant loop');
      h(unlockedSubsystems && S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate < 70 && lvFree('auxCoolRate'),
        'Raise AUX COOL RATE lever for more aux cooling power');
      h(S.mainThrottle > 25 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE to reduce the core heat fed into coolant');
      h(S.fuelInject > 25 && lvFree('fuelInject'),
        'Lower FUEL INJECT lever to reduce plasma heat contribution');
      h(unlockedEmergency,
        'Use COOL FLOOD emergency action to rapidly reduce coolant temperature');
      break;
    }

    case 'contain': {
      // Priority: get above 50% threshold → field → backup → root cause
      h(S.containPower < CONTAIN_POWER_THRESHOLD && lvFree('containPower'),
        'Raise CONTAINMENT POWER above ' + CONTAIN_POWER_THRESHOLD + '% — required to stop integrity drain and begin regeneration');
      h(S.containPower >= CONTAIN_POWER_THRESHOLD && S.containPower < 80 && lvFree('containPower'),
        'Raise CONTAINMENT POWER lever further to accelerate integrity regeneration');
      h(!S.containField && swFree('containField'),
        'Enable CONTAINMENT FIELD switch — required for active containment regeneration');
      h(unlockedSubsystems && (!S.backupContA || !S.backupContB),
        'Enable BACKUP CONT A and B switches for emergency containment support');
      h(unlockedSubsystems && S.backupContA && S.backupContB && S.backupContPow < 70 && lvFree('backupContPow'),
        'Raise BACKUP CONT POWER lever to boost backup containment field');
      h(S.coreTemp > SAFE_TEMP_RED,
        'Reduce core temperature — temps above ' + SAFE_TEMP_RED + '°C actively drain containment integrity');
      h(S.modules.magnetic.status !== 'online',
        'MAGNETIC CTRL module offline — containment integrity cannot regenerate');
      break;
    }

    case 'radiation': {
      // Priority: shielding → contain → reduce neutron source
      h(!S.radShield && swFree('radShield'),
        'Enable RAD SHIELD switch to block radiation output');
      h(!S.radShield && !swFree('radShield'),
        'RAD SHIELD is COMMS-LOCKED — diagnose/restart COMMS module to regain control');
      h(S.containIntegrity < 60,
        'Improve CONTAINMENT INTEGRITY — low integrity allows radiation to escape');
      h(S.containPower < 50 && lvFree('containPower'),
        'Raise CONTAINMENT POWER above 50% to stop integrity drain');
      h(unlockedTuning && S.pressureRelief > 40 && lvFree('pressureRelief'),
        'Lower PRESSURE RELIEF knob — high venting increases neutron escapement');
      h(S.fuelInject > 35 && lvFree('fuelInject'),
        'Lower FUEL INJECT lever to reduce neutron production');
      h(unlockedTuning && S.mixRatio < 45 && lvFree('mixRatio'),
        'Raise MIX RATIO knob toward 50–95% to reduce neutron output');
      break;
    }

    case 'turbineRPM': {
      // Priority: limiter switch → reduce throttle → reduce inject
      h(unlockedSubsystems && !S.turbineLimiter && swFree('turbineLimiter'),
        'Enable TURBINE LIMITER switch to automatically cap RPM at safe maximum');
      h(S.mainThrottle > 20 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE lever to reduce turbine drive');
      h(S.fuelInject > 20 && lvFree('fuelInject'),
        'Lower FUEL INJECT lever to reduce plasma power to turbine');
      h(S.turbineEngage && swFree('turbineEngage'),
        'Disengage TURBINE ENGAGE switch to cut turbine drive entirely');
      break;
    }

    case 'heatSink': {
      // Priority: coolant flow → aux cool → reduce heat generation
      h(S.coolantFlow < 80 && lvFree('coolantFlow'),
        'Raise COOLANT FLOW lever — coolant cools the heat sink');
      h(!S.coolantPumps && swFree('coolantPumps'),
        'Enable COOLANT PUMPS switch to restore heat sink cooling');
      h(unlockedSubsystems && (!S.auxCoolPump || !S.auxCoolLoop),
        'Enable AUX COOL PUMP + LOOP for additional heat sink cooling');
      h(unlockedSubsystems && S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate < 70 && lvFree('auxCoolRate'),
        'Raise AUX COOL RATE lever for more cooling capacity');
      h(S.mainThrottle > 35 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE to reduce overall heat generation');
      h(S.fuelInject > 35 && lvFree('fuelInject'),
        'Lower FUEL INJECT to reduce plasma heat output');
      break;
    }

    case 'auxCoolTemp': {
      // Aux coolant temp rises from core heat; aux system COOLS it, not heats it
      // Priority: run aux cooling at max → reduce core heat → check backup module
      h(unlockedSubsystems && !S.auxCoolPump && swFree('auxCoolPump'),
        'Enable AUX COOL PUMP — aux cooling circuit must run to manage aux temp');
      h(unlockedSubsystems && S.auxCoolPump && !S.auxCoolLoop && swFree('auxCoolLoop'),
        'Enable AUX COOL LOOP to complete the aux cooling circuit');
      h(unlockedSubsystems && S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate < 90 && lvFree('auxCoolRate'),
        'Raise AUX COOL RATE lever to maximum to cool the aux circuit');
      h(S.coreTemp > 4000,
        'Reduce core temperature — high core temp is driving the aux coolant hot');
      h(S.mainThrottle > 30 && lvFree('mainThrottle'),
        'Lower MAIN THROTTLE to reduce core heat feeding the aux circuit');
      h(S.modules.backup.status !== 'online',
        'BACKUP SYSTEMS module degraded — aux cooling performance is reduced');
      break;
    }
  }

  return hints.slice(0, 3);
}

// Logs all critical hints for a gauge as individual 'warn' log entries.
// Each line is prefixed with the gauge label for quick scanning.
function fireCritHints(gaugeId, label) {
  const hints = getCritHints(gaugeId);
  hints.forEach(h => addLog('[' + label + '] ' + h, 'warn'));
}
