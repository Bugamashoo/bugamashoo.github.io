
// reactor9.js — SIMULATION ENGINE + UI UPDATE + INIT
// Load order: 9th / last
// Contains: doScram, hardReset, sI/eI (ignition), checkSeq,
//           simulate (physics loop), updD/setW/updateUI, init log


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

  document.querySelectorAll('.lever-handle').forEach(h => { h.style.top = ''; h.style.bottom = '4px'; });
  document.querySelectorAll('[data-lever]').forEach(t => {
    const id = t.dataset.lever;
    const r  = document.getElementById('readout_' + id);
    if (r && !['pressureRelief','mixRatio','fieldTune','auxCoolRate','backupContPow','rodA','rodB','rodC'].includes(id))
      r.textContent = '0%';
  });
  document.querySelectorAll('.toggle-switch').forEach(sw => sw.classList.toggle('on', !!S[sw.dataset.switch]));

  setTimeout(() => { S.scramActive = 0; addLog('SCRAM reset', 'ok'); }, 5000);
}

// ── HARD RESET ────────────────────────────────────────────────
function hardReset() {
  addLog('*** HARD RESET ***', 'err');
  doShake();
  Object.keys(S.modules).forEach(k => {
    S.modules[k].status = 'offline';
    S.modules[k].health = Math.max(50, S.modules[k].health);
    S.modules[k].sysError = false;
    S.modules[k].sysErrorVisible = false;
    S.modules[k].errorPenalty = 1;
    S.modules[k].errorCount = 0;
  });
  diagTarget = null; diagStart = 0;
  Object.keys(modPowerTimers).forEach(k => { clearTimeout(modPowerTimers[k].id); delete modPowerTimers[k]; });
  S.igniting = 0; S.startupComplete = 0; S.scramActive = 0; S.seqStep = 0;
  ['fuelPumps','coolantPumps','containField','ignPrime','turbineEngage','gridSync','magCoils','radShield','ventSystem']
    .forEach(k => S[k] = 0);
  S.mainThrottle = 0; S.fuelInject = 0; S.containPower = 0; S.coolantFlow = 0;
  document.querySelectorAll('.lever-handle').forEach(h => { h.style.top = ''; h.style.bottom = '4px'; });
  document.querySelectorAll('.toggle-switch').forEach(sw => sw.classList.toggle('on', !!S[sw.dataset.switch]));

  setTimeout(() => {
    Object.keys(S.modules).forEach(k => { S.modules[k].status = 'online'; S.modules[k].mode = 'normal'; });
    addLog('Modules restarted', 'ok');
  }, 4000);
}

// ── IGNITION hold logic ───────────────────────────────────────
function sI() {
  if (!S.ignPrime || !S.auxPower) { addLog('IGN FAIL', 'err'); return; }
  S.ignitionHeld = 1;
  ignHoldStart   = Date.now();
  addLog('IGNITION...', 'warn');
}

function eI() {
  S.ignitionHeld = 0;
  if (S.igniting) return;
  if (ignHoldStart > 0 && Date.now() - ignHoldStart < 2500) addLog('IGN ABORT', 'err');
  ignHoldStart = 0;
}

// ── SEQUENCE check ────────────────────────────────────────────
function checkSeq() {
  if (S.startupComplete) return;
  let step = 0;
  for (let i = 0; i < SEQUENCE.length; i++) {
    if (SEQUENCE[i].check()) step = i + 1;
    else break;
  }
  if (step !== S.seqStep) {
    if (step > S.seqStep) { addLog('SEQ ' + step + '/' + SEQUENCE.length, 'ok'); doFlash(); }
    S.seqStep = step;
  }
  if (step >= SEQUENCE.length && !S.startupComplete) {
    S.startupComplete = 1;
    S.reactorState = 'ONLINE';
    addLog('*** REACTOR ONLINE ***', 'ok');
    doShake(); doFlash();
  }
}

// ── GAUGE DANGER → MODULE DAMAGE ──────────────────────────────
// Each entry: gauge display name, danger condition, target module key.
// When a gauge is in danger, a timer arms (15–45s). On expiry the module
// takes 6–15% damage and the timer rearms. Timer disarms when safe again.
const GAUGE_DANGERS = [
  { id: 'coreTemp',     label: 'CORE TEMP',        check: () => S.coreTemp > 6000,                     mod: 'thermal'  },
  { id: 'corePres',     label: 'CORE PRESSURE',     check: () => S.corePressure > 35,                   mod: 'fuel'     },
  { id: 'plasma',       label: 'PLASMA STABILITY',  check: () => S.igniting && S.plasmaStability < 20,  mod: 'magnetic' },
  { id: 'coolTemp',     label: 'COOLANT TEMP',       check: () => S.coolantTemp > 150,                   mod: 'coolant'  },
  { id: 'coolFlow',     label: 'COOLANT FLOW',       check: () => S.igniting && S.coolantFlowRate < 100, mod: 'coolant'  },
  { id: 'contain',      label: 'CONTAINMENT',        check: () => S.containIntegrity < 20,               mod: 'magnetic' },
  { id: 'radiation',    label: 'RADIATION LEVEL',    check: () => S.radiationLevel > 60,                 mod: 'sensor'   },
  { id: 'turbineRPM',   label: 'TURBINE RPM',        check: () => S.turbineRPM > 13000,                  mod: 'grid'     },
  { id: 'heatSink',     label: 'HEAT SINK TEMP',     check: () => S.heatSinkTemp > 150,                  mod: 'coolant'  },
  { id: 'auxCoolTemp',  label: 'AUX COOL TEMP',      check: () => S.auxCoolTemp > 70,                    mod: 'backup'   },
];

// ── SIMULATION LOOP ───────────────────────────────────────────
function simulate() {
  if (S.gameOver) return;
  tick++;
  const dt = 1 / 20;

  // Ignition hold timer
  if (S.ignitionHeld && !S.igniting && ignHoldStart > 0 && Date.now() - ignHoldStart >= 2500) {
    S.igniting = 1;
    addLog('PLASMA IGNITION', 'ok');
    doShake(); doFlash();
    checkSeq();
  }
  if (!S.ignPrime && S.igniting) { S.igniting = 0; addLog('PLASMA LOST', 'err'); }

  const aM = S.auxPower    ? 1 : 0;
  const cM = S.coolantPumps? 1 : 0;

  // Fuel pump grace period — pumps must be off for 15s before fuel flow cuts
  if (S.fuelPumps) {
    if (fuelPumpOffStart !== 0) { fuelPumpOffStart = 0; }
  } else {
    if (fuelPumpOffStart === 0) {
      fuelPumpOffStart = Date.now();
      if (S.igniting) addLog('WARN: Fuel pumps offline — shutdown in 15s', 'warn');
    }
  }
  const fuelPumpGrace = !S.fuelPumps && fuelPumpOffStart > 0 && (Date.now() - fuelPumpOffStart) < 15000;
  const fM = (S.fuelPumps || fuelPumpGrace) ? 1 : 0;

  const fP = modPerf('fuel');   const cP = modPerf('coolant');
  const bP = modPerf('backup'); const mP = modPerf('magnetic');
  const gP = modPerf('grid');   // sP = modPerf('sensor') — reserved
  // Backup effectiveness: 2x when overclocked; degrades/zeroes with module health
  const bEff = bP * (S.modules.backup.mode === 'overclock' ? 2 : 1);

  const fH = modHeat('fuel');   const cH = modHeat('coolant');
  const tH = modHeat('thermal');const mH = modHeat('magnetic');

  // ── Fuel consumption ──
  if (S.igniting && fM) {
    S.fuelRemaining = Math.max(0, S.fuelRemaining - (S.fuelInject / 100) * 0.005 * fP * dt);
    S.fuelConsump   = S.fuelInject * 0.3 * fM * fP;
  } else {
    S.fuelConsump  *= 0.9;
  }
  if (S.emergDump) { S.fuelRemaining = Math.max(0, S.fuelRemaining - 0.1 * dt); S.fuelConsump += 6; }

  const eF = S.fuelInject * fM * aM * fP * (S.fuelRemaining > 0 ? 1 : 0);

  if (S.igniting && eF < 1 && S.plasmaStability < 5) {
    S.igniting = 0;
    addLog('PLASMA EXTINGUISHED: No fuel flow', 'err');
    doShake();
  }
  const rE = S.rodSafetyOff ? (S.rodA + S.rodB + S.rodC) / 300 : 0;

  // ── Core temperature ──
  // Heat generation: sqrt-compressed so fuel/throttle contribute meaningfully
  // without runaway. Typical operation: 2000–5000°C. Danger above 7000.
  let tT = 20;
  if (S.igniting) {
    const rawHeat = eF * 120 + S.mainThrottle * 50;
    // Diminishing returns — sqrt compresses high values while preserving low-end feel
    tT += Math.sqrt(rawHeat) * 70;
    tT *= (0.5 + S.mixRatio / 200);
    tT *= (1 - rE * 0.7);
    tT += fH + tH + mH;
  }
  // Cooling: scales proportionally to current heat (percentage-based removal)
  // so it stays relevant at high temps instead of being a fixed subtraction
  const cE_flat = S.coolantFlow * cM * aM * 3.0 * cP
                + (S.auxCoolPump && S.auxCoolLoop ? S.auxCoolRate * 1.5 * bEff : 0);
  const cE_pct  = (S.coolantFlow / 100) * cM * aM * 0.12 * cP
                + (S.auxCoolPump && S.auxCoolLoop ? (S.auxCoolRate / 100) * 0.05 * bEff : 0);
  tT = tT * (1 - cE_pct) - cE_flat;
  if (S.emergVent) tT = tT * 0.85 - 100;
  tT = Math.max(20, tT);
  // Thermal runaway: with no active cooling, heat cannot escape — temperature climbs continuously
  const noActiveCooling = cM === 0 && !(S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate > 0);
  if (S.igniting && noActiveCooling) tT = Math.max(tT, S.coreTemp + 200);
  S.coreTemp += (tT - S.coreTemp) * 0.02;

  // ── Core pressure ──
  // Pressure rises from temp and throttle, relieved by the knob and coolant flow.
  // Target range: 8–18 ATM normal, amber >20, red >35. Gauge max 50.
  let tPr = 1;
  if (S.igniting) {
    // Temp contribution: sqrt-compressed but scaled for meaningful range
    // ~3000°C → 8.2, ~5000°C → 10.6, ~7000°C → 12.5
    tPr += Math.sqrt(S.coreTemp) * 0.15;
    // Throttle adds direct pressure (plasma confinement stress)
    tPr += S.mainThrottle / 12;
    // Fuel injection adds moderate pressure
    tPr += eF / 50;
    // Pressure relief knob: now removes up to 40% of generated pressure
    tPr *= (1 - S.pressureRelief / 100 * 0.4);
    // Coolant flow relieves pressure (thermal contraction)
    tPr *= (1 - (S.coolantFlow / 100) * cM * aM * 0.15 * cP);
    // Rod insertion dampens pressure
    tPr *= (1 - rE * 0.5);
  }
  if (S.emergVent) tPr *= 0.7;
  S.corePressure += (Math.max(0.5, tPr) - S.corePressure) * 0.03;

  S.secondaryPressure = S.corePressure * 0.6 + S.backupContPow * 0.05;

  // ── Coolant ──
  let tC = 15;
  if (S.igniting) tC += S.coreTemp * 0.02;
  if (cM) tC -= S.coolantFlow * 0.5 * cP;
  S.coolantTemp    += (Math.max(10, tC) - S.coolantTemp) * 0.05;
  S.coolantFlowRate = S.coolantFlow * cM * aM * 12 * cP;
  S.auxCoolTemp     = 12 + (S.igniting ? S.coreTemp * 0.01 : 0) - (S.auxCoolPump && S.auxCoolLoop ? S.auxCoolRate * 0.2 * bEff : 0);
  S.auxCoolFlow     = (S.auxCoolPump && S.auxCoolLoop) ? S.auxCoolRate * 8 * bEff : 0;

  // ── Magnetic field ──
  let tF = 0;
  if (S.magCoils && aM) tF = (S.containPower / 100) * 8 * (0.7 + S.fieldTune / 300) * mP;
  S.magneticFlux     += (tF - S.magneticFlux) * 0.05;
  S.backupFieldStr    = ((S.backupContA ? 1 : 0) + (S.backupContB ? 1 : 0))
                      * (S.backupContPow / 100) * 4 * bEff;

  // ── Plasma stability ──
  let tSt = 0;
  if (S.igniting) {
    tSt  = 50 + S.magneticFlux * 5 + S.backupFieldStr * 2
           - Math.max(0, S.coreTemp - 5000) / 100
           - Math.abs(S.corePressure - 15) * 2;
    tSt *= (0.8 + S.fieldTune / 500);
    if (S.containField) tSt += 10;
    // Low containment integrity destabilises plasma
    if (S.containIntegrity < 60) tSt -= (60 - S.containIntegrity) * 0.4;
    // Fuel sustains and enriches plasma — too little destabilises, more adds stability
    if (eF < 1) tSt -= 45; // No fuel flow — plasma cannot be sustained
    else if (eF > 10) tSt += Math.min(12, (eF - 10) / 8); // up to +12 at eF≈100
    tSt *= (1 - rE * 0.3);
    tSt  = Math.max(0, Math.min(100, tSt));
  }
  S.plasmaStability += (tSt - S.plasmaStability) * 0.04;

  // ── Neutron density ──
  // Normalised so typical operation (eF~40, temp~3500, plasma~80%) ≈ 50–70
  let tN = 0;
  if (S.igniting) {
    const tempFactor    = Math.sqrt(S.coreTemp) / 10;       // ~5.9 at 3500, ~7.7 at 6000
    const plasmaFactor  = S.plasmaStability / 100;           // 0.7–0.9
    const fuelFactor    = Math.sqrt(eF);                     // ~6.3 at 40, ~7.7 at 60
    tN = tempFactor * plasmaFactor * fuelFactor * 1.5 * (1 - rE * 0.6);
    // ≈ 5.9 × 0.8 × 6.3 × 1.5 ≈ 45 at moderate operation
  }
  S.neutronDensity += (tN - S.neutronDensity) * 0.03;

  // ── Radiation ──
  // Normal shielded operation: ~15–25 mSv. Warning at >30, danger at >60
  S.radiationLevel = S.neutronDensity * 0.4
                   + (S.igniting && !S.radShield ? 25 : 0)
                   + (S.containIntegrity < 50 ? (50 - S.containIntegrity) * 0.5 : 0);

  // ── Containment integrity ──
  if (S.igniting) {
    // Drain scales with how far containPower is below safe threshold (50)
    if (S.containPower < 50) {
      const deficit = (50 - S.containPower) / 50; // 1.0 at 0%, 0.0 at 50%
      S.containIntegrity -= 0.02 + deficit * 0.04; // 0.02–0.06/tick
    }
    // Regen when containPower > 50 with field on; scales with power level
    if (S.containPower > 50 && S.containField) {
      const surplus = (S.containPower - 50) / 50; // 0.0 at 50%, 1.0 at 100%
      S.containIntegrity += 0.01 + surplus * 0.03; // 0.01–0.04/tick
    }
    // Overtemp drain scales with severity
    if (S.coreTemp > 8000) {
      S.containIntegrity -= 0.02 + (S.coreTemp - 8000) / 5000 * 0.06;
    }
  }
  // Backup field regen scales with strength (max ~8)
  if (S.backupFieldStr > 0) S.containIntegrity += S.backupFieldStr * 0.003;
  S.containIntegrity = Math.max(0, Math.min(100, S.containIntegrity));

  // ── Turbine + grid ──
  // Fuel injection boosts RPM — hotter, denser plasma spins the turbine harder
  const fuelRPMBoost = 0.7 + (eF / 100) * 0.6; // 0.7× at eF=0, 1.3× at eF=100
  let tR = 0;
  if (S.turbineEngage && S.igniting && aM) tR = S.mainThrottle * 150 * (S.plasmaStability / 100) * fuelRPMBoost;
  S.turbineRPM += (tR - S.turbineRPM) * 0.02;
  if (S.gridSync && S.turbineRPM > 1000) S.gridLoad += (80 - S.gridLoad) * 0.01 * gP;
  else S.gridLoad *= 0.95;

  // ── Power output ──
  // Fuel injection directly scales power — more fuel = denser plasma = more energy extraction
  const fuelPowerMult = 0.6 + (eF / 100) * 0.8; // 0.6× at eF=0, 1.4× at eF=100
  let tW = 0;
  if (S.igniting && S.turbineEngage) {
    tW = (S.turbineRPM / 15000) * S.mainThrottle * (S.plasmaStability / 100) * 8.5 * fuelPowerMult * (1 - rE * 0.4);
    if (!S.ventSystem) tW *= 0.85;
    if (S.backupGen)   tW += 0.5 * bEff;
  }
  S.powerOutput += (Math.max(0, tW) - S.powerOutput) * 0.03;
  if (S.powerOutput > S.peakPower) S.peakPower = S.powerOutput;

  S.heatSinkTemp = 20 + S.coreTemp * 0.005 - cE_flat * 0.02;
  S.rodPosition  = S.rodSafetyOff ? (S.rodA + S.rodB + S.rodC) / 3 : 100;

  // ── Module health + interconnection drain ──
  if (S.igniting && tick % 60 === 0) {
    // Slider load per module: 0→0.5x drain, 50→1.0x, 100→1.5x
    const sliderLoad = {
      fuel:     S.fuelInject,
      thermal:  S.mainThrottle,
      coolant:  S.coolantFlow,
      magnetic: S.containPower,
      grid:     S.mainThrottle,
    };
    let bypassStress = 0; // accumulated stress to apply to backup systems
    Object.entries(S.modules).forEach(([k, m]) => {
      if (m.status === 'offline' || k === 'backup') return; // backup has its own drain logic
      const md = MODES[m.mode];
      const errMult = m.sysError ? 1.1 : 1;
      const sliderMult = 0.5 + (sliderLoad[k] ?? 50) / 100;
      // Bypass: no self-drain (healthDrain=0), redirect 2× stress to backup
      if (m.mode === 'bypass') {
        bypassStress += Math.random() * 0.2 * 2.5 * errMult * sliderMult; // 2.5× equivalent stress
      } else {
        m.health = Math.max(0, m.health - Math.random() * 0.2 * md.healthDrain * errMult * sliderMult);
      }
      // Only overclock stresses interconnected module (bypass does not)
      if (m.mode === 'overclock' && m.affects) {
        const t = S.modules[m.affects];
        if (t.status !== 'offline') t.health = Math.max(0, t.health - Math.random() * 0.4);
      }
      if (m.health < 25 && m.status === 'online' && Math.random() < 0.03) {
        m.status = 'degraded'; addLog(m.name + ' DEGRADED', 'warn');
      }
      if (m.health < 5 && m.status !== 'offline') {
        m.status = 'offline'; m.mode = 'normal';
        addLog(m.name + ' FAILED — restart required', 'err');
      }
    });
    // Apply accumulated bypass stress to backup systems
    if (bypassStress > 0 && S.modules.backup.status !== 'offline') {
      S.modules.backup.health = Math.max(0, S.modules.backup.health - bypassStress);
    }
  }

  // ── Backup systems health drain (usage-proportional, always active) ──
  if (S.modules.backup.status !== 'offline') {
    // Each active system at max contributes 0.02%/tick → all four maxed = ~1 min to empty
    const bLoad = (S.backupGen ? 0.02 : 0)
      + (S.auxCoolPump && S.auxCoolLoop ? (S.auxCoolRate / 100) * 0.02 : 0)
      + (S.backupContA ? (S.backupContPow / 100) * 0.02 : 0)
      + (S.backupContB ? (S.backupContPow / 100) * 0.02 : 0);
    if (bLoad > 0) {
      const bDrainMult = S.modules.backup.mode === 'overclock' ? 3 : 1;
      S.modules.backup.health = Math.max(0, S.modules.backup.health - bLoad * bDrainMult);
    }
    if (tick % 60 === 0) {
      if (S.modules.backup.health < 25 && S.modules.backup.status === 'online' && Math.random() < 0.03) {
        S.modules.backup.status = 'degraded'; addLog('BACKUP SYSTEMS DEGRADED', 'warn');
      }
      if (S.modules.backup.health < 5) {
        S.modules.backup.status = 'offline'; S.modules.backup.mode = 'normal';
        addLog('BACKUP SYSTEMS FAILED — restart required', 'err');
      }
    }
  }

  // ── Gauge danger → module damage ──
  GAUGE_DANGERS.forEach(gd => {
    if (gd.check()) {
      if (gaugeDamageTimes[gd.id] == null) {
        // Just entered danger — arm the timer
        gaugeDamageTimes[gd.id] = S.uptime + 15 + Math.random() * 15;
      } else if (S.uptime >= gaugeDamageTimes[gd.id]) {
        // Timer expired — deal damage and rearm
        const m = S.modules[gd.mod];
        if (m && m.status !== 'offline') {
          const dmg = 6 + Math.random() * 9;
          m.health = Math.max(0, m.health - dmg);
          addLog(gd.label + ' value critical, ' + m.name + ' system damaged', 'err');
        }
        gaugeDamageTimes[gd.id] = S.uptime + 15 + Math.random() * 30;
      }
    } else {
      gaugeDamageTimes[gd.id] = null; // safe — disarm
    }
  });

  // ── System error spawning ──
  if (S.startupComplete && S.uptime > nextErrorTime) {
    // Pick a random overclock-capable module (not comms/sensor — they have no modes)
    const errCandidates = Object.keys(S.modules).filter(k => k !== 'comms' && k !== 'sensor');
    const hasAnyError = errCandidates.some(k => S.modules[k].sysError);

    if (!hasAnyError) {
      // No active errors: apply hidden error to a random module
      const pick = errCandidates[Math.floor(Math.random() * errCandidates.length)];
      const m = S.modules[pick];
      m.sysError = true;
      m.sysErrorVisible = false;
      m.errorPenalty = 0.85 + Math.random() * 0.05; // 85-90% efficiency
      m.errorCount = 1;
      addLog('New non-critical system error detected', 'warn');
    } else {
      if (Math.random() < 0.75) {
        // 75%: worsen a random existing error (reduce penalty further)
        const affected = errCandidates.filter(k => S.modules[k].sysError);
        const pick = affected[Math.floor(Math.random() * affected.length)];
        const pm = S.modules[pick];
        if (pm.errorCount >= 8) {
          // At max compounded errors — spread to another module
          const unaffected = errCandidates.filter(k => !S.modules[k].sysError);
          if (unaffected.length > 0) {
            const sp = unaffected[Math.floor(Math.random() * unaffected.length)];
            const sm = S.modules[sp];
            sm.sysError = true;
            sm.sysErrorVisible = false;
            sm.errorPenalty = 0.85 + Math.random() * 0.05;
            sm.errorCount = 1;
            addLog('System error propegation detected', 'warn');
          }
        } else {
          pm.errorPenalty = Math.max(0.5, pm.errorPenalty - (0.05 + Math.random() * 0.05));
          pm.errorCount++;
        }
      } else {
        // 25%: apply error to a new unaffected module if any
        const unaffected = errCandidates.filter(k => !S.modules[k].sysError);
        if (unaffected.length > 0) {
          const pick = unaffected[Math.floor(Math.random() * unaffected.length)];
          const m = S.modules[pick];
          m.sysError = true;
          m.sysErrorVisible = false;
          m.errorPenalty = 0.85 + Math.random() * 0.05;
          m.errorCount = 1;
          addLog('New non-critical system error detected', 'warn');
        }
      }
    }
    nextErrorTime = S.uptime + 30 + Math.random() * 60;
  }

  // ── Diagnosis completion ──
  if (diagTarget && diagStart > 0 && Date.now() - diagStart >= diagDuration) {
    const dm = S.modules[diagTarget];
    if (dm.sysError && !dm.sysErrorVisible) {
      dm.sysErrorVisible = true;
      addLog(dm.name + ': SYSTEM ERROR — restart required', 'err');
    } else {
      addLog('Diag ' + dm.name + ': ' + dm.health.toFixed(0) + '% ' + dm.mode + (dm.sysErrorVisible ? ' [SYS ERROR]' : ' — no errors'), 'sys');
    }
    diagTarget = null;
    diagStart = 0;
    buildSys();
  }

  // ── Active repair ──
  if (repairTarget) {
    const rm = S.modules[repairTarget];
    if (rm) {
      if (rm.health < 100) {
        // Online: 1% per ~1.5s; offline or bypass: 4x faster
        const rate = (rm.status === 'offline' || rm.mode === 'bypass' ? 4 : 1) / 30;
        rm.health = Math.min(100, rm.health + rate);
      } else {
        addLog(rm.name + ' repair complete', 'ok');
        repairTarget = null;
      }
    }
  }

  // ── Reactor state ──
  if (S.reactorState === 'ONLINE') {
    S.uptime += dt;
    if (S.uptime > S.bestUptime) S.bestUptime = S.uptime;
    // Score accumulation: +1 every floor(3000/MW) ticks
    if (S.powerOutput > 0) {
      S.scoreTicks++;
      const interval = Math.floor(3000 / S.powerOutput);
      if (interval > 0 && S.scoreTicks >= interval) {
        S.score++;
        S.scoreTicks -= interval;
      }
    }
  }
  if (S.scramActive)                              S.reactorState = 'SCRAM';
  else if (S.startupComplete && S.powerOutput>1)  S.reactorState = (S.coreTemp>9000||S.containIntegrity<20) ? 'CRITICAL' : 'ONLINE';
  else if (S.auxPower && !S.startupComplete)       S.reactorState = 'STARTUP';
  else if (!S.auxPower) {
    S.reactorState = 'OFFLINE';
    S.startupComplete = 0; S.igniting = 0; S.seqStep = 0;
  }

  // ── Auto-scram on containment loss ──
  if (S.containIntegrity <= 5 && !S.scramActive && S.igniting) {
    doScram(); addLog('AUTO-SCRAM: Containment', 'err');
  }

  // ── Event tick ──
  if (S.activeEvent) updateEvt();
  else if (S.startupComplete && S.uptime > nextEventTime) triggerEvent();

  // ── Monitor history ──
  if (tick % 3 === 0) {
    monHist.temp.push(S.coreTemp);
    monHist.pressure.push(S.corePressure);
    monHist.plasma.push(S.plasmaStability);
    monHist.power.push(S.powerOutput);
    monHist.coolant.push(S.coolantFlowRate);
    monHist.radiation.push(S.radiationLevel);
    Object.values(monHist).forEach(h => { if (h.length > MH) h.shift(); });
  }

  // ── 5-min avg power history (every 60 ticks = 3s, 100 entries = 5 min) ──
  if (tick % 60 === 0) {
    powerHist5m.push(S.powerOutput);
    if (powerHist5m.length > 100) powerHist5m.shift();
    if (powerHist5m.length > 0) {
      const avg = powerHist5m.reduce((a, b) => a + b, 0) / powerHist5m.length;
      if (avg > S.bestAvg5m) S.bestAvg5m = avg;
    }
  }

  // ── Module health threshold alerts ──
  {
    const THRESHOLDS = [75, 50, 25, 10];
    Object.entries(S.modules).forEach(([k, m]) => {
      const prev = moduleHealthPrev[k] ?? 100;
      THRESHOLDS.forEach(t => {
        if (prev > t && m.health <= t) {
          const sev = t <= 25 ? 'err' : 'warn';
          addLog(m.name + ': health at ' + t + '%', sev);
        }
      });
      moduleHealthPrev[k] = m.health;
    });
  }

  // ── Periodic warnings ──
  if (tick % 80 === 0 && S.igniting) {
    if (S.coreTemp > 6000)           addLog('WARN: Temp', 'warn');
    if (S.containIntegrity < 40)     addLog('WARN: Containment', 'err');
  }

  updateUI();
}

// ── UI UPDATERS ───────────────────────────────────────────────

// Update a display value + bar gauge.
// Optional colorFn(value) → 'red'|'amber'|'green' overrides the default %-based coloring.
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

// Set a warning light colour class
function setW(id, t) {
  const e = document.getElementById(id);
  if (!e) return;
  e.classList.remove('active-amber','active-red','active-green');
  if (t) e.classList.add('active-' + t);
}

function updateUI() {
  // Threshold color helpers: hi(d) = danger when above d; lo(d) = danger when below d
  const hi = (d) => (v) => v > d ? 'red' : v > d * 0.85 ? 'amber' : 'green';
  const lo = (d, active) => (v) => (!active || active()) ? (v < d ? 'red' : v < d * 1.15 ? 'amber' : 'green') : 'green';

  // Core readings
  updD('coreTemp',         S.coreTemp.toFixed(0),          10000, hi(7000));
  updD('corePressure',     S.corePressure.toFixed(1),       50,    hi(35));
  updD('plasmaStability',  S.plasmaStability.toFixed(1),    100,   lo(20, () => !!S.igniting));
  updD('neutronDensity',   S.neutronDensity.toFixed(1),     100);
  updD('coolantTemp',      S.coolantTemp.toFixed(0),        200,   hi(150));
  updD('coolantFlowRate',  S.coolantFlowRate.toFixed(0),    1200,  lo(100, () => !!S.igniting));
  updD('turbineRPM',       S.turbineRPM.toFixed(0),         20000, hi(13000));
  updD('containIntegrity', S.containIntegrity.toFixed(1),   100,   lo(15));
  updD('magneticFlux',     S.magneticFlux.toFixed(2),       8);
  updD('radiationLevel',   S.radiationLevel.toFixed(1),     100,   hi(60));
  updD('auxCoolTemp',      S.auxCoolTemp.toFixed(0),        100,   hi(70));
  updD('auxCoolFlow',      S.auxCoolFlow.toFixed(0),        800);
  updD('backupFieldStr',   S.backupFieldStr.toFixed(1),     8);
  updD('secondaryPressure',S.secondaryPressure.toFixed(1),  30);
  updD('rodPosition',      S.rodPosition.toFixed(0),        100);
  updD('heatSinkTemp',     S.heatSinkTemp.toFixed(0),       200,   hi(150));

  // Fuel
  const fe = document.getElementById('disp_fuelRemaining');
  if (fe) fe.textContent = S.fuelRemaining.toFixed(1);
  const fb = document.getElementById('bar_fuelRemaining');
  if (fb) { fb.style.width = S.fuelRemaining + '%'; fb.className = 'bar-fill ' + (S.fuelRemaining < 20 ? 'red' : S.fuelRemaining < 50 ? 'amber' : 'green'); }
  const fc = document.getElementById('disp_fuelConsump');
  if (fc) fc.textContent = S.fuelConsump.toFixed(1);

  // Net power output display
  const po = document.getElementById('netOutput');
  po.textContent = S.powerOutput.toFixed(2);
  po.style.color = S.powerOutput > 500 ? 'var(--red)' : S.powerOutput > 100 ? 'var(--amber)' : 'var(--green)';

  // ── Reactor core SVG visual ──
  const rvCX = 70, rvCY = 62.5;
  const rvOn       = !!S.igniting;
  const rvIntens   = Math.min(1, S.powerOutput / 200);
  const rvPlasma   = S.plasmaStability / 100;
  const rvFlux     = Math.min(1, S.magneticFlux / 8);
  const rvContain  = S.containIntegrity / 100;
  const rvTempPct  = Math.min(1, S.coreTemp / 10000);

  // Derive glow colors from current readings
  const rvCoreClr  = S.coreTemp > 7000 ? '#ff2e2e' : S.coreTemp > 5950 ? '#ff9f1c' : '#00e5ff';
  const rvRingClr  = S.containIntegrity < 15 ? '#ff2e2e' : S.containIntegrity < 17.25 ? '#ff9f1c' : '#00e5ff';
  const rvArcClr   = S.plasmaStability < 20  ? '#ff2e2e' : S.plasmaStability < 23    ? '#ff9f1c' : '#00e5ff';

  // Core hex
  const rvCore = document.getElementById('reactorCore');
  if (rvCore) {
    rvCore.setAttribute('fill', rvOn ? (rvTempPct > 0.7 ? '#2a0808' : '#0a1520') : '#0d1418');
    rvCore.setAttribute('stroke', rvOn ? rvCoreClr : '#1e2830');
    rvCore.setAttribute('stroke-width', rvOn ? (1 + rvIntens * 2.5).toFixed(1) : '1.5');
    if (rvOn) rvCore.setAttribute('filter', 'url(#rGlow)'); else rvCore.removeAttribute('filter');
  }

  // Core glow halo (radial gradient circle, scales with power)
  const rvGlow = document.getElementById('coreGlowCirc');
  if (rvGlow) {
    rvGlow.setAttribute('r', rvOn ? (14 + rvIntens * 20).toFixed(1) : '22');
    rvGlow.setAttribute('opacity', rvOn ? (0.25 + rvIntens * 0.75).toFixed(2) : '0');
    const s0 = document.getElementById('cgS0');
    const s1 = document.getElementById('cgS1');
    if (s0) s0.setAttribute('stop-color', rvOn && S.coreTemp > 7000 ? '#ffcc44' : '#ffffff');
    if (s1) s1.setAttribute('stop-color', rvCoreClr);
    if (rvOn && rvIntens > 0.1) rvGlow.setAttribute('filter', 'url(#rGlowStr)');
    else rvGlow.removeAttribute('filter');
  }

  // Ring 1 — plasma (inner, spins fast with plasma stability)
  const rvR1 = document.getElementById('ring1');
  if (rvR1) {
    rvR1.setAttribute('stroke', rvOn ? rvCoreClr : '#1e2830');
    rvR1.setAttribute('stroke-opacity', rvOn ? (0.35 + rvPlasma * 0.65).toFixed(2) : '1');
    if (rvOn) rvR1.setAttribute('filter', 'url(#rGlow)'); else rvR1.removeAttribute('filter');
    const r1Spin = rvOn && S.plasmaStability > 30 ? ' rviz-spin-fast' : '';
    rvR1.setAttribute('class', 'rviz-ring' + r1Spin);
  }

  // Ring 2 — magnetic (counter-spins when flux is active)
  const rvR2 = document.getElementById('ring2');
  if (rvR2) {
    const magActive = S.magCoils && S.auxPower;
    rvR2.setAttribute('stroke', magActive ? rvRingClr : '#1e2830');
    rvR2.setAttribute('stroke-opacity', magActive ? (0.2 + rvFlux * 0.7).toFixed(2) : '1');
    if (magActive && rvFlux > 0.2) rvR2.setAttribute('filter', 'url(#rGlow)'); else rvR2.removeAttribute('filter');
    const r2Spin = S.magneticFlux > 2 ? ' rviz-spin-med' : '';
    rvR2.setAttribute('class', 'rviz-ring' + r2Spin);
  }

  // Ring 3 — containment field (outermost, slow spin)
  const rvR3 = document.getElementById('ring3');
  if (rvR3) {
    const contActive = S.containPower > 30;
    rvR3.setAttribute('stroke', contActive ? rvRingClr : '#1e2830');
    rvR3.setAttribute('stroke-opacity', contActive ? (0.15 + rvContain * 0.6).toFixed(2) : '1');
    const r3Spin = contActive && S.containIntegrity > 40 ? ' rviz-spin-slow' : '';
    rvR3.setAttribute('class', 'rviz-ring' + r3Spin);
  }

  // Hex border + corner dots react to state
  const rvBorder = document.getElementById('hexBorder');
  if (rvBorder) rvBorder.setAttribute('stroke', rvOn ? rvCoreClr + '50' : '#1e2830');
  const rvDotClr = rvOn ? rvCoreClr : '#1e2830';
  for (let d = 0; d < 6; d++) {
    const dot = document.getElementById('rDot' + d);
    if (dot) { dot.setAttribute('fill', rvDotClr); if (rvOn) dot.setAttribute('filter', 'url(#rGlow)'); else dot.removeAttribute('filter'); }
  }

  // ── Electrical arcs (updated every 3 ticks ≈ 0.15s) ──
  if (tick % 3 === 0) {
    const instab   = rvOn ? Math.max(0, (100 - S.plasmaStability) / 100) : 0;
    const baseArcs = rvOn && rvIntens > 0.15 ? 1 : 0;           // always 1 arc when running
    const numArcs  = Math.min(9, baseArcs + Math.round(instab * 5)); // up to 5 extra from instability
    for (let i = 0; i < 9; i++) {
      const arc = document.getElementById('arc' + i);
      if (!arc) continue;
      if (i < numArcs) {
        const angle  = Math.random() * Math.PI * 2;
        const reach  = 18 + Math.random() * 40;                 // 14–48 px from center
        const ex     = rvCX + reach * Math.cos(angle);
        const ey     = rvCY + reach * Math.sin(angle);
        // Two-segment jagged arc: center → jag → endpoint
        const jx     = rvCX + (ex - rvCX) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 22;
        const jy     = rvCY + (ey - rvCY) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 22;
        arc.setAttribute('d', `M${rvCX} ${rvCY} L${jx.toFixed(1)} ${jy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`);
        arc.setAttribute('opacity', (0.35 + Math.random() * 0.65).toFixed(2));
        arc.setAttribute('stroke', rvArcClr);
        arc.setAttribute('stroke-width', (0.4 + Math.random() * 1.4).toFixed(1));
      } else {
        arc.setAttribute('opacity', '0');
      }
    }
  }

  // Warning lights
  setW('warnOvertemp',    S.coreTemp > 7000       ? 'red'   : S.coreTemp > 4000     ? 'amber' : '');
  setW('warnOverpressure',S.corePressure > 25      ? 'red'   : S.corePressure > 15   ? 'amber' : '');
  setW('warnContainment', S.containIntegrity < 30  ? 'red'   : S.containIntegrity < 60 ? 'amber' : '');
  setW('warnCoolant',     S.igniting ? (S.coolantTemp > 150 ? 'red' : S.coolantFlowRate < 100 ? 'amber' : '') : '');
  setW('warnFuel',        S.fuelRemaining < 10     ? 'red'   : S.fuelRemaining < 25  ? 'amber' : '');
  setW('warnRadiation',   S.radiationLevel > 60    ? 'red'   : S.radiationLevel > 30  ? 'amber' : '');
  setW('warnScram',       S.scramActive            ? 'red'   : '');
  setW('warnOnline',      S.reactorState === 'ONLINE' ? 'green' : '');
  setW('warnModFault',    Object.values(S.modules).some(m => m.status !== 'online') ? 'amber' : '');
  const activeErrors = Object.values(S.modules).filter(m => m.sysError).length;
  setW('warnSysFault',    activeErrors >= 10 ? 'red' : activeErrors >= 4 ? 'amber' : '');
  setW('warnEvent',       S.activeEvent            ? 'red'   : '');

  // Sequence steps
  for (let i = 0; i < SEQUENCE.length; i++) {
    const e = document.getElementById('seq_' + i);
    if (!e) continue;
    e.classList.remove('active','complete');
    if (i < S.seqStep)      e.classList.add('complete');
    else if (i === S.seqStep) e.classList.add('active');
  }

  // Header status bar
  const hs = document.getElementById('headerStatus');
  switch (S.reactorState) {
    case 'OFFLINE':  hs.textContent = '■ OFFLINE';                              hs.style.color = '#5a5f66';       break;
    case 'STARTUP':  hs.textContent = '■ STARTUP';                              hs.style.color = 'var(--amber)';  break;
    case 'ONLINE':   hs.textContent = '■ ONLINE — ' + S.powerOutput.toFixed(1) + ' MW'; hs.style.color = 'var(--green)'; break;
    case 'CRITICAL': hs.textContent = '■ CRITICAL';                             hs.style.color = 'var(--red)';    break;
    case 'SCRAM':    hs.textContent = '■ SCRAM';                                hs.style.color = 'var(--red)';    break;
  }

  // Stats
  document.getElementById('uptimeDisp').textContent  = fmtTime(S.uptime);
  document.getElementById('bestUptime').textContent  = fmtTime(S.bestUptime);
  document.getElementById('evtCount').textContent    = S.eventsResolved;
  document.getElementById('evtFail').textContent     = S.eventsFailed;
  document.getElementById('scoreDisp').textContent   = Math.round(S.score);

  // Header power output + 5-min avg
  document.getElementById('hdrOutput').textContent = S.powerOutput.toFixed(2);
  const cur5mAvg = powerHist5m.length
    ? powerHist5m.reduce((a, b) => a + b, 0) / powerHist5m.length
    : 0;
  document.getElementById('hdrAvg5m').textContent = powerHist5m.length >= 5
    ? cur5mAvg.toFixed(2)
    : '—';

  // Warning indicator box
  const warnInd = document.getElementById('warnIndicator');
  const warnBox = document.getElementById('warnBox');
  const wLights = document.querySelectorAll('.warning-light');
  let hasRed = false, hasAmber = false;
  wLights.forEach(l => { if (l.classList.contains('active-red')) hasRed = true; if (l.classList.contains('active-amber')) hasAmber = true; });
  const wColor = hasRed ? 'var(--red)' : hasAmber ? 'var(--amber)' : '#2a2e35';
  warnInd.style.color = wColor;
  warnInd.style.textShadow = hasRed   ? '0 0 20px rgba(255,46,46,1),0 0 40px rgba(255,46,46,0.6)'
                           : hasAmber ? '0 0 20px rgba(255,159,28,1),0 0 40px rgba(255,159,28,0.6)'
                           : 'none';
  warnBox.style.borderColor = hasRed ? 'var(--red)' : hasAmber ? 'var(--amber)' : 'var(--panel-border)';
  warnBox.style.boxShadow   = hasRed   ? 'inset 0 1px 6px rgba(0,0,0,.8),0 0 32px rgba(255,46,46,0.7),0 0 64px rgba(255,46,46,0.3)'
                             : hasAmber ? 'inset 0 1px 6px rgba(0,0,0,.8),0 0 32px rgba(255,159,28,0.7),0 0 64px rgba(255,159,28,0.3)'
                             : 'inset 0 1px 6px rgba(0,0,0,.8)';

  // Monitor graphs (only when tab is visible, throttled)
  if (document.getElementById('tab-monitors').classList.contains('active') && tick % 3 === 0) {
    drawG('mon_temp',      monHist.temp,      'rgb(255,159,28)',  10000, '°C');
    drawG('mon_pressure',  monHist.pressure,  'rgb(0,229,255)',   50,    'ATM');
    drawG('mon_plasma',    monHist.plasma,    'rgb(57,255,20)',   100,   '%');
    drawG('mon_power',     monHist.power,     'rgb(57,255,20)',   600,   'MW');
    drawG('mon_coolant',   monHist.coolant,   'rgb(0,229,255)',   1200,  'L/m');
    drawG('mon_radiation', monHist.radiation, 'rgb(255,46,46)',   100,   'mSv');
  }

  // Systems tab (throttled rebuild)
  if (document.getElementById('tab-systems').classList.contains('active') && tick % 40 === 0) buildSys();
}

// ── INIT ──────────────────────────────────────────────────────
addLog('MKIV TOKAMAK v4.7.2', 'sys');
addLog('Manual: MANUAL tab', 'sys');
addLog('Module modes: SYSTEMS tab', 'sys');
addLog('All systems nominal', 'ok');

setInterval(simulate, 50);
