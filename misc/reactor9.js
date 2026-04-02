// reactor9.js - HELPERS + INIT
// Load order: 9th
// Contains: doScram, hardReset, sI/eI (ignition), checkSeq,
//           GAUGE_DANGERS, updD, updDN, setW, init log + interval

// SCRAM
document.getElementById('scramBtn').addEventListener('click', doScram);

function doScram() {
  S.scramActive = 1;
  S.reactorState = 'SCRAM';
  addLog('*** SCRAM ***', 'err');
  doShake();
  doFlash('rgba(255,46,46,0.2)');

  ['fuelPumps','coolantPumps','containField','ignPrime','turbineEngage','gridSync','magCoils','radShield','ventSystem']
    .forEach(k => S[k] = 0);

  S.igniting = 0; S.ignitionHeld = 0; S.startupComplete = 0; S.seqStep = 0;
  S.mainThrottle = 0; S.fuelInject = 0; S.containPower = 0;

  document.querySelectorAll('[data-lever]').forEach(t => {
    const id = t.dataset.lever;
    const r  = document.getElementById('readout_' + id);
    if (r && !['pressureRelief','mixRatio','fieldTune','auxCoolRate','backupContPow','rodA','rodB','rodC'].includes(id))
      r.textContent = '0%';
  });
  syncLeverPositions();
  syncKnifeSwitches();

  setTimeout(() => { S.scramActive = 0; addLog('SCRAM reset', 'ok'); }, SCRAM_LOCKOUT_MS);
}

// HARD RESET
function hardReset() {
  addLog('*** HARD RESET ***', 'err');
  doShake();
  Object.keys(S.modules).forEach(k => {
    S.modules[k].status = 'offline';
    S.modules[k].health = Math.max(HARD_RESET_MIN_HEALTH, S.modules[k].health);
    S.modules[k].sysError = false;
    S.modules[k].sysErrorVisible = false;
    S.modules[k].errorPenalty = 1;
    S.modules[k].errorCount = 0;
  });
  diagTarget = null; diagStart = 0;
  syncCommsLocks(); syncSensorFaults();
  Object.keys(modPowerTimers).forEach(k => { clearTimeout(modPowerTimers[k].id); delete modPowerTimers[k]; });
  S.igniting = 0; S.startupComplete = 0; S.scramActive = 0; S.seqStep = 0;
  ['fuelPumps','coolantPumps','containField','ignPrime','turbineEngage','gridSync','magCoils','radShield','ventSystem']
    .forEach(k => S[k] = 0);
  S.mainThrottle = 0; S.fuelInject = 0; S.containPower = 0; S.coolantFlow = 0;
  syncLeverPositions();
  syncKnifeSwitches();

  setTimeout(() => {
    Object.keys(S.modules).forEach(k => { S.modules[k].status = 'online'; S.modules[k].mode = 'normal'; });
    addLog('Modules restarted', 'ok');
  }, HARD_RESET_OFFLINE_MS);
}

// IGNITION hold logic
function sI() {
  if (!S.ignPrime || !S.auxPower) { addLog('IGN FAIL', 'err'); return; }
  S.ignitionHeld = 1;
  ignHoldStart   = Date.now();
  addLog('IGNITION...', 'warn');
}

function eI() {
  S.ignitionHeld = 0;
  if (S.igniting) return;
  if (ignHoldStart > 0 && Date.now() - ignHoldStart < IGN_HOLD_MS) addLog('IGN ABORT', 'err');
  ignHoldStart = 0;
}

// SEQUENCE check
function checkSeq() {
  if (S.startupComplete) return;
  let step = 0;
  for (let i = 0; i < SEQUENCE.length; i++) {
    if (SEQUENCE[i].check()) step = i + 1;
    else break;
  }
  if (step !== S.seqStep) {
    if (step > S.seqStep) {
      const next = step < SEQUENCE.length ? ' - next: ' + SEQUENCE[step].label : '';
      addLog('SEQ ' + step + '/' + SEQUENCE.length + next, 'ok');
      doFlash();
    }
    S.seqStep = step;
  }
  if (step >= SEQUENCE.length && !S.startupComplete) {
    S.startupComplete = 1;
    S.reactorState = 'ONLINE';
    addLog('*** REACTOR ONLINE ***', 'ok');
    doShake(); doFlash();
    document.querySelector('[data-tab="systems"]').classList.add('tab-pulse');
    document.querySelector('[data-tab="backup"]').classList.add('tab-pulse');
  }
}

// GAUGE DANGER > MODULE DAMAGE
// Each entry: gauge display name, danger condition, target module key.
// When a gauge is in danger, a timer arms (15–60s). On expiry the module
// takes 6–15% damage and the timer rearms. Timer disarms when safe again.
const GAUGE_DANGERS = [
  { id: 'coreTemp',     label: 'CORE TEMP',        check: () => S.coreTemp > GAUGE_TEMP_DANGER,                          mod: 'thermal'  },
  { id: 'corePres',     label: 'CORE PRESSURE',     check: () => S.corePressure > GAUGE_PRES_DANGER,                      mod: 'fuel'     },
  { id: 'plasma',       label: 'PLASMA STABILITY',  check: () => S.igniting && S.plasmaStability < GAUGE_PLASMA_DANGER,   mod: 'magnetic' },
  { id: 'coolTemp',     label: 'COOLANT TEMP',       check: () => S.coolantTemp > GAUGE_COOLANT_TEMP_DANGER,               mod: 'coolant'  },
  { id: 'coolFlow',     label: 'COOLANT FLOW',       check: () => S.igniting && S.coolantFlowRate < GAUGE_COOLANT_FLOW_DANGER, mod: 'coolant'  },
  { id: 'contain',      label: 'CONTAINMENT',        check: () => S.containIntegrity < GAUGE_CONTAIN_DANGER,               mod: 'magnetic' },
  { id: 'radiation',    label: 'RADIATION LEVEL',    check: () => S.radiationLevel > GAUGE_RADIATION_DANGER,               mod: 'sensor'   },
  { id: 'turbineRPM',   label: 'TURBINE RPM',        check: () => S.turbineRPM > getTurbineSafeMax(),                     mod: 'grid'     },
  { id: 'heatSink',     label: 'HEAT SINK TEMP',     check: () => S.heatSinkTemp > GAUGE_HEATSINK_DANGER,                 mod: 'coolant'  },
  { id: 'auxCoolTemp',  label: 'AUX COOL TEMP',      check: () => S.auxCoolTemp > GAUGE_AUXCOOL_DANGER,                   mod: 'backup'   },
];

// UI UPDATERS
// Update a display value + bar gauge.
// Optional colorFn(value) > 'red'|'amber'|'green' overrides the default %-based coloring.
function updD(id, t, mx, colorFn) {
  const e = document.getElementById('disp_' + id);
  const b = document.getElementById('bar_'  + id);
  if (e) e.textContent = t;
  if (b) {
    const v = parseFloat(t);
    const p = Math.min(100, Math.max(0, v / mx * 100));
    b.style.width = p + '%';
    b.className   = 'bar-fill ' + (colorFn ? colorFn(v) : (p > 80 ? 'red' : p > 60 ? 'amber' : 'green'));
  }
}

// Like updD but shows "Sensor ERR" text + randomised bar when sensor array is offline
// or when this specific gauge is in sensorFaultyGauges due to a sensor sysError
function updDN(id, t, mx, colorFn) {
  const off = S.modules.sensor.status !== 'online' || sensorFaultyGauges.includes(id);
  const e = document.getElementById('disp_' + id);
  const b = document.getElementById('bar_'  + id);
  if (off) {
    if (e) e.textContent = 'Sensor ERR';
    if (b && sensorNoise[id] !== undefined) {
      const v = parseFloat(sensorNoise[id]);
      const p = Math.min(100, Math.max(0, v / mx * 100));
      b.style.width = p + '%';
      b.className = 'bar-fill ' + (colorFn ? colorFn(v) : (p > 80 ? 'red' : p > 60 ? 'amber' : 'green'));
    }
  } else {
    updD(id, t, mx, colorFn);
  }
}

// Set a warning light colour class
let lampTestActive = false;
function setW(id, t) {
  if (lampTestActive) return;
  const e = document.getElementById(id);
  if (!e) return;
  e.classList.remove('active-amber','active-red','active-green');
  if (t) e.classList.add('active-' + t);
}

// Init console sequence
addLog('MKIV TOKAMAK v4.7.2', 'sys');
addLog('Manual: MANUAL tab', '');
addLog('Module modes: SYSTEMS tab', 'sys');
addLog('All systems nominal - flip AUX PWR to begin startup sequence', 'ok');
addLog('Fuel low - visit RESUPPLY tab to purchase fuel', 'warn');
