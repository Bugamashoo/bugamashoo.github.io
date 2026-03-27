// ============================================================
// sim.js — SIMULATION LOOP
// Load order: 11th (after ui.js)
// Contains: simulate()
// ============================================================

function simulate() {
  if (S.gameOver) return;
  tick++;
  const dt = SIM_DT;

  // Ignition hold timer
  if (S.ignitionHeld && !S.igniting && ignHoldStart > 0 && Date.now() - ignHoldStart >= IGN_HOLD_MS) {
    S.igniting = 1;
    addLog('PLASMA IGNITION', 'ok');
    doShake(); doFlash();
    checkSeq();
  }
  if (!S.ignPrime && S.igniting) { S.igniting = 0; addLog('PLASMA LOST', 'err'); }

  const aM = S.auxPower    ? 1 : 0;
  const cM = S.coolantPumps? 1 : 0;

  // Fuel pump grace period — pumps must be off for 8s before fuel flow cuts
  if (S.fuelPumps) {
    if (fuelPumpOffStart !== 0) { fuelPumpOffStart = 0; }
  } else {
    if (fuelPumpOffStart === 0) {
      fuelPumpOffStart = Date.now();
      if (S.igniting) addLog('WARN: Fuel pumps offline — shutdown in 8s', 'warn');
    }
  }
  const fuelPumpGrace = !S.fuelPumps && fuelPumpOffStart > 0 && (Date.now() - fuelPumpOffStart) < FUEL_PUMP_GRACE_MS;
  const fM = (S.fuelPumps || fuelPumpGrace) ? 1 : 0;

  const fP = modPerf('fuel');   const cP = modPerf('coolant');
  const tP = modPerf('thermal');
  const bP = modPerf('backup'); const mP = modPerf('magnetic');
  const gP = modPerf('grid');   // sP = modPerf('sensor') — reserved
  // Backup effectiveness: 2x when overclocked; degrades/zeroes with module health
  const bEff = bP * (S.modules.backup.mode === 'overclock' ? BACKUP_OVERCLOCK_MULT : 1);

  const fH = modHeat('fuel');   const cH = modHeat('coolant');
  const tH = modHeat('thermal');const mH = modHeat('magnetic');

  // ── Fuel consumption ──
  if (S.igniting && fM) {
    S.fuelRemaining = Math.max(0, S.fuelRemaining - (S.fuelInject / 100) * FUEL_CONSUME_RATE * fP * dt);
    S.fuelConsump   = S.fuelInject * FUEL_CONSUME_DISPLAY * fM * fP;
  } else {
    S.fuelConsump  *= FUEL_CONSUME_DECAY;
  }
  if (S.emergDump) { S.fuelRemaining = Math.max(0, S.fuelRemaining - FUEL_DUMP_DRAIN * dt); S.fuelConsump += 6; }

  const eF = S.fuelInject * fM * aM * fP * (S.fuelRemaining > 0 ? 1 : 0);

  if (S.igniting && eF < PLASMA_EXTINGUISH_EF && S.plasmaStability < PLASMA_EXTINGUISH_STABILITY) {
    S.igniting = 0;
    addLog('PLASMA EXTINGUISHED: No fuel flow', 'err');
    doShake();
  }
  const rE = !S.rodSafetyOff ? (S.rodA + S.rodB + S.rodC) / 300 : 0;

  // ── Core temperature ──
  // Heat generation: sqrt-compressed so fuel/throttle contribute meaningfully
  // without runaway. Typical operation: 2000–5000°C. Danger above 7000.
  let tT = TEMP_IDLE;
  if (S.igniting) {
    const rawHeat = eF * TEMP_HEAT_FUEL + S.mainThrottle * TEMP_HEAT_THROTTLE;
    // Diminishing returns — sqrt compresses high values while preserving low-end feel
    tT += Math.sqrt(rawHeat) * TEMP_HEAT_SCALE;
    tT *= (TEMP_MIX_BASE + S.mixRatio / TEMP_MIX_SCALE);
    tT *= (1 - rE * TEMP_ROD_REDUCTION);
    tT += fH + tH + mH;
  }
  // Cooling: scales proportionally to current heat (percentage-based removal)
  // so it stays relevant at high temps instead of being a fixed subtraction
  // Primary cooling scaled by both coolant module perf (cP) and thermal management perf (tP).
  // Aux cooling uses backup systems (bEff) and is independent of the thermal module.
  const cE_flat = S.coolantFlow * cM * aM * COOL_FLAT_RATE * cP * tP
                + (S.auxCoolPump && S.auxCoolLoop ? S.auxCoolRate * COOL_AUX_FLAT * bEff : 0);
  const cE_pct  = (S.coolantFlow / 100) * cM * aM * COOL_PCT_RATE * cP * tP
                + (S.auxCoolPump && S.auxCoolLoop ? (S.auxCoolRate / 100) * COOL_AUX_PCT * bEff : 0);
  tT = tT * (1 - cE_pct) - cE_flat;
  if (S.emergVent) tT = tT * EMERG_VENT_TEMP_MULT - EMERG_VENT_TEMP_OFFSET;
  tT = Math.max(TEMP_IDLE, tT);
  // Thermal runaway: with no active cooling, heat cannot escape — temperature climbs continuously
  const noActiveCooling = cM === 0 && !(S.auxCoolPump && S.auxCoolLoop && S.auxCoolRate > 0);
  if (S.igniting && noActiveCooling) tT = Math.max(tT, S.coreTemp + TEMP_RUNAWAY_STEP);
  S.coreTemp += (tT - S.coreTemp) * TEMP_LERP;

  // ── Core pressure ──
  // Pressure rises from temp and throttle, relieved by the knob and coolant flow.
  // Target range: 8–18 ATM normal, amber >20, red >35. Gauge max 50.
  let tPr = PRESSURE_BASE;
  if (S.igniting) {
    // Temp contribution: sqrt-compressed but scaled for meaningful range
    // ~3000°C → 8.2, ~5000°C → 10.6, ~7000°C → 12.5
    tPr += Math.sqrt(S.coreTemp) * PRES_TEMP_SCALE;
    // Throttle adds direct pressure (plasma confinement stress)
    tPr += S.mainThrottle / PRES_THROTTLE_DIV;
    // Fuel injection adds moderate pressure
    tPr += eF / PRES_FUEL_DIV;
    // Pressure relief knob: removes up to PRES_RELIEF_EFFECT of generated pressure
    tPr *= (1 - S.pressureRelief / 100 * PRES_RELIEF_EFFECT);
    // Coolant flow relieves pressure (thermal contraction)
    tPr *= (1 - (S.coolantFlow / 100) * cM * aM * PRES_COOLANT_RELIEF * cP);
    // Rod insertion dampens pressure
    tPr *= (1 - rE * PRES_ROD_DAMPENING);
  }
  if (S.emergVent) tPr *= EMERG_VENT_PRES_MULT;
  S.corePressure += (Math.max(PRES_FLOOR, tPr) - S.corePressure) * PRES_LERP;

  S.secondaryPressure = S.corePressure * SECONDARY_PRES_CORE_SCALE + S.backupContPow * SECONDARY_PRES_BACKUP_SCALE;

  // ── Coolant ──
  let tC = COOLANT_IDLE;
  if (S.igniting) tC += S.coreTemp * COOLANT_CORE_TRANSFER;
  if (cM) tC -= S.coolantFlow * COOLANT_FLOW_COOLING * cP;
  S.coolantTemp    += (Math.max(COOLANT_FLOOR, tC) - S.coolantTemp) * COOLANT_LERP;
  S.coolantFlowRate = S.coolantFlow * cM * aM * COOLANT_FLOW_SCALE * cP;
  S.auxCoolTemp     = AUX_COOL_IDLE + (S.igniting ? S.coreTemp * AUX_COOL_CORE_TRANSFER : 0) - (S.auxCoolPump && S.auxCoolLoop ? S.auxCoolRate * AUX_COOL_RATE_COOLING * bEff : 0);
  S.auxCoolFlow     = (S.auxCoolPump && S.auxCoolLoop) ? S.auxCoolRate * AUX_COOL_FLOW_SCALE * bEff : 0;

  // ── Magnetic field ──
  let tF = 0;
  if (S.magCoils && aM) tF = (S.containPower / 100) * MAG_FIELD_SCALE * (MAG_TUNE_OFFSET + S.fieldTune / MAG_TUNE_SCALE) * mP;
  S.magneticFlux     += (tF - S.magneticFlux) * MAG_FLUX_LERP;
  S.backupFieldStr    = ((S.backupContA ? 1 : 0) + (S.backupContB ? 1 : 0))
                      * (S.backupContPow / 100) * MAG_BACKUP_POWER_SCALE * bEff;

  // ── Plasma stability ──
  let tSt = 0;
  if (S.igniting) {
    tSt  = PLASMA_BASE + S.magneticFlux * PLASMA_FLUX_SCALE + S.backupFieldStr * PLASMA_BACKUP_SCALE
           - Math.max(0, S.coreTemp - PLASMA_OVERTEMP_THRESHOLD) / PLASMA_OVERTEMP_SCALE
           - Math.abs(S.corePressure - PLASMA_PRESSURE_TARGET) * PLASMA_PRESSURE_PENALTY;
    tSt *= (PLASMA_TUNE_BASE + S.fieldTune / PLASMA_TUNE_SCALE);
    if (S.containField) tSt += PLASMA_CONTAIN_FIELD_BOOST;
    // Low containment integrity destabilises plasma
    if (S.containIntegrity < PLASMA_LOW_CONTAIN_THRESHOLD) tSt -= (PLASMA_LOW_CONTAIN_THRESHOLD - S.containIntegrity) * PLASMA_LOW_CONTAIN_SCALE;
    // Fuel sustains and enriches plasma — too little destabilises, more adds stability
    if (eF < PLASMA_EXTINGUISH_EF) tSt -= PLASMA_NO_FUEL_PENALTY; // No fuel flow — plasma cannot be sustained
    else if (eF > PLASMA_FUEL_BONUS_THRESHOLD) tSt += Math.min(PLASMA_FUEL_BONUS_MAX, (eF - PLASMA_FUEL_BONUS_THRESHOLD) / PLASMA_FUEL_BONUS_SCALE);
    tSt *= (1 - rE * PLASMA_ROD_REDUCTION);
    tSt  = Math.max(0, Math.min(100, tSt));
  }
  S.plasmaStability += (tSt - S.plasmaStability) * PLASMA_LERP;

  // ── Neutron density ──
  // Normalised so typical operation (eF~40, temp~3500, plasma~80%) ≈ 50–70
  let tN = 0;
  if (S.igniting) {
    const tempFactor    = Math.sqrt(S.coreTemp) / NEUTRON_TEMP_SCALE; // ~5.9 at 3500, ~7.7 at 6000
    const plasmaFactor  = S.plasmaStability / 100;                     // 0.7–0.9
    const fuelFactor    = Math.sqrt(eF);                               // ~6.3 at 40, ~7.7 at 60
    tN = tempFactor * plasmaFactor * fuelFactor * NEUTRON_MULT * (1 - rE * NEUTRON_ROD_REDUCTION);
    // ≈ 5.9 × 0.8 × 6.3 × 1.5 ≈ 45 at moderate operation
  }
  S.neutronDensity += (tN - S.neutronDensity) * NEUTRON_LERP;

  // ── Radiation ──
  // Normal shielded operation: ~15–25 mSv. Warning at >30, danger at >60
  S.radiationLevel = S.neutronDensity * RAD_NEUTRON_MULT
                   + (S.igniting && !S.radShield ? RAD_NO_SHIELD_BONUS : 0)
                   + (S.containIntegrity < RAD_LOW_CONTAIN_THRESHOLD ? (RAD_LOW_CONTAIN_THRESHOLD - S.containIntegrity) * RAD_LOW_CONTAIN_SCALE : 0);

  // ── Containment integrity ──
  if (S.igniting) {
    // Drain scales with how far containPower is below safe threshold
    if (S.containPower < CONTAIN_POWER_THRESHOLD) {
      const deficit = (CONTAIN_POWER_THRESHOLD - S.containPower) / CONTAIN_POWER_THRESHOLD; // 1.0 at 0%, 0.0 at threshold
      S.containIntegrity -= CONTAIN_DRAIN_MIN + deficit * CONTAIN_DRAIN_MAX;
    }
    // Regen when containPower > threshold with field on; scales with power level
    if (S.containPower > CONTAIN_POWER_THRESHOLD && S.containField) {
      const surplus = (S.containPower - CONTAIN_POWER_THRESHOLD) / CONTAIN_POWER_THRESHOLD; // 0.0 at threshold, 1.0 at 100%
      S.containIntegrity += CONTAIN_REGEN_MIN + surplus * CONTAIN_REGEN_MAX;
    }
    // Overtemp drain scales with severity
    if (S.coreTemp > CONTAIN_OVERTEMP_THRESHOLD) {
      S.containIntegrity -= CONTAIN_OVERTEMP_DRAIN_MIN + (S.coreTemp - CONTAIN_OVERTEMP_THRESHOLD) / 5000 * CONTAIN_OVERTEMP_DRAIN_MAX;
    }
  }
  // Backup field regen scales with strength (max ~8)
  if (S.backupFieldStr > 0) S.containIntegrity += S.backupFieldStr * CONTAIN_BACKUP_REGEN_SCALE;
  S.containIntegrity = Math.max(0, Math.min(100, S.containIntegrity));

  // ── Turbine + grid ──
  // Fuel injection boosts RPM — hotter, denser plasma spins the turbine harder
  const fuelRPMBoost = TURB_FUEL_BOOST_BASE + (eF / 100) * TURB_FUEL_BOOST_RANGE;
  let tR = 0;
  if (S.turbineEngage && S.igniting && aM) tR = S.mainThrottle * TURB_RPM_SCALE * (S.plasmaStability / 100) * fuelRPMBoost;
  S.turbineRPM += (tR - S.turbineRPM) * TURB_LERP;
  if (S.gridSync && S.turbineRPM > 1000) S.gridLoad += (GRID_TARGET - S.gridLoad) * GRID_LERP * gP;
  else S.gridLoad *= GRID_DECAY;

  // ── Power output ──
  // Fuel injection directly scales power — more fuel = denser plasma = more energy extraction
  const fuelPowerMult = POWER_FUEL_MULT_BASE + (eF / 100) * POWER_FUEL_MULT_RANGE;
  let tW = 0;
  if (S.igniting && S.turbineEngage) {
    tW = (S.turbineRPM / POWER_RPM_SCALE) * S.mainThrottle * (S.plasmaStability / 100) * POWER_OUTPUT_SCALE * fuelPowerMult * (1 - rE * POWER_ROD_REDUCTION);
    if (!S.ventSystem) tW *= POWER_NO_VENT_MULT;
    tW *= gP; // Grid interface module — degraded/offline grid cuts power delivery
  }
  S.powerOutput += (Math.max(0, tW) - S.powerOutput) * POWER_LERP;
  // Backup generator: always 2 MW, independent of reactor state — excluded from score/uptime
  S.backupGenOutput += ((S.backupGen ? POWER_BACKUP_GEN_BONUS : 0) - S.backupGenOutput) * POWER_LERP;
  if (S.powerOutput > S.peakPower) S.peakPower = S.powerOutput;

  S.heatSinkTemp = HEATSINK_IDLE + S.coreTemp * HEATSINK_CORE_SCALE - cE_flat * HEATSINK_COOL_SCALE;
  S.rodPosition  = !S.rodSafetyOff ? (S.rodA + S.rodB + S.rodC) / 3 : 0;

  // ── Module health + interconnection drain ──
  if (S.igniting && tick % MOD_DRAIN_INTERVAL === 0) {
    // Slider load per module: 0→0.5x drain, 50→1.0x, 100→1.5x
    const sliderLoad = {
      fuel:     S.fuelInject,
      thermal:  S.mainThrottle,
      coolant:  S.coolantFlow,
      magnetic: S.containPower,
      grid:     S.mainThrottle,
    };
    // Warning severity score: amber=+1, red=+2 (only operational warnings)
    let warnX = 0;
    warnX += S.coreTemp > WARN_TEMP_RED ? 2 : S.coreTemp > WARN_TEMP_AMBER ? 1 : 0;
    warnX += S.corePressure > WARN_PRES_RED ? 2 : S.corePressure > WARN_PRES_AMBER ? 1 : 0;
    warnX += S.containIntegrity < WARN_CONTAIN_RED ? 2 : S.containIntegrity < WARN_CONTAIN_AMBER ? 1 : 0;
    warnX += S.igniting ? (S.coolantTemp > WARN_COOLANT_TEMP_RED ? 2 : S.coolantFlowRate < WARN_COOLANT_FLOW_AMB ? 1 : 0) : 0;
    warnX += S.fuelRemaining < WARN_FUEL_RED ? 2 : S.fuelRemaining < WARN_FUEL_AMBER ? 1 : 0;
    warnX += S.radiationLevel > WARN_RAD_RED ? 2 : S.radiationLevel > WARN_RAD_AMBER ? 1 : 0;
    const warnMult = 1 + warnX / WARN_SEVERITY_SCALE;

    let bypassStress = 0; // accumulated stress to apply to backup systems
    Object.entries(S.modules).forEach(([k, m]) => {
      if (m.status === 'offline' || k === 'backup') return; // backup has its own drain logic
      const md = MODES[m.mode];
      const errMult = m.sysError ? MOD_ERROR_DRAIN_MULT : 1;
      const sliderMult = MOD_SLIDER_BASE + (sliderLoad[k] ?? 50) / MOD_SLIDER_SCALE;
      // Bypass: no self-drain, redirect bypass stress to backup
      if (m.mode === 'bypass') {
        bypassStress += Math.random() * MOD_BASE_DRAIN_ROLL * MOD_BYPASS_STRESS_MULT * errMult * sliderMult * warnMult;
      } else {
        m.health = Math.max(0, m.health - Math.random() * MOD_BASE_DRAIN_ROLL * md.healthDrain * errMult * sliderMult * warnMult);
      }
      if (m.health < MOD_DEGRADE_HEALTH && m.status === 'online' && Math.random() < MOD_DEGRADE_CHANCE) {
        m.status = 'degraded'; addLog(m.name + ' DEGRADED', 'warn');
      }
      if (m.health < MOD_OFFLINE_HEALTH && m.status !== 'offline') {
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
    // Each active system at max contributes BACKUP_*_DRAIN/tick → all four maxed = ~1 min to empty
    const bLoad = (S.backupGen ? BACKUP_GEN_DRAIN : 0)
      + (S.auxCoolPump && S.auxCoolLoop ? (S.auxCoolRate / 100) * BACKUP_AUX_DRAIN : 0)
      + (S.backupContA ? (S.backupContPow / 100) * BACKUP_FIELD_A_DRAIN : 0)
      + (S.backupContB ? (S.backupContPow / 100) * BACKUP_FIELD_B_DRAIN : 0);
    if (bLoad > 0) {
      const bDrainMult = S.modules.backup.mode === 'overclock' ? BACKUP_OVERCLOCK_DRAIN : 1;
      S.modules.backup.health = Math.max(0, S.modules.backup.health - bLoad * bDrainMult);
    }
    if (tick % MOD_DRAIN_INTERVAL === 0) {
      if (S.modules.backup.health < MOD_DEGRADE_HEALTH && S.modules.backup.status === 'online' && Math.random() < MOD_DEGRADE_CHANCE) {
        S.modules.backup.status = 'degraded'; addLog('BACKUP SYSTEMS DEGRADED', 'warn');
      }
      if (S.modules.backup.health < MOD_OFFLINE_HEALTH) {
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
        gaugeDamageTimes[gd.id] = S.uptime + GAUGE_DANGER_ARM_MIN + Math.random() * GAUGE_DANGER_ARM_RANGE;
      } else if (S.uptime >= gaugeDamageTimes[gd.id]) {
        // Timer expired — deal damage and rearm
        const m = S.modules[gd.mod];
        if (m && m.status !== 'offline') {
          const dmg = GAUGE_DANGER_DMG_MIN + Math.random() * GAUGE_DANGER_DMG_RANGE;
          m.health = Math.max(0, m.health - dmg);
          addLog(gd.label + ' value critical, ' + m.name + ' system damaged', 'err');
        }
        gaugeDamageTimes[gd.id] = S.uptime + GAUGE_DANGER_ARM_MIN + Math.random() * GAUGE_DANGER_ARM_RANGE;
      }
    } else {
      gaugeDamageTimes[gd.id] = null; // safe — disarm
    }
  });

  // ── System error spawning ──
  if (S.startupComplete && S.uptime > nextErrorTime) {
    // Pick a random overclock-capable module (not comms/sensor — they have no modes)
    const errCandidates = Object.keys(S.modules).filter(k => k !== 'comms' && k !== 'sensor' && S.modules[k].status !== 'offline');
    const hasAnyError = errCandidates.some(k => S.modules[k].sysError);

    if (!hasAnyError) {
      // No active errors: apply hidden error to a random module
      const pick = errCandidates[Math.floor(Math.random() * errCandidates.length)];
      const m = S.modules[pick];
      m.sysError = true;
      m.sysErrorVisible = false;
      m.errorPenalty = ERR_PENALTY_INIT_MIN + Math.random() * ERR_PENALTY_INIT_RANGE;
      m.errorCount = 1;
      addLog('New non-critical system error detected', 'warn');
    } else {
      if (Math.random() < ERR_WORSEN_CHANCE) {
        // Worsen a random existing error (reduce penalty further)
        const affected = errCandidates.filter(k => S.modules[k].sysError);
        const pick = affected[Math.floor(Math.random() * affected.length)];
        const pm = S.modules[pick];
        if (pm.errorCount >= ERR_SPREAD_THRESHOLD) {
          // Spread to a new module instead
          const clean = errCandidates.filter(k => !S.modules[k].sysError);
          if (clean.length > 0) {
            const np = clean[Math.floor(Math.random() * clean.length)];
            const nm = S.modules[np];
            nm.sysError = true; nm.sysErrorVisible = false;
            nm.errorPenalty = ERR_PENALTY_INIT_MIN + Math.random() * ERR_PENALTY_INIT_RANGE;
            nm.errorCount = 1;
            addLog('System error spreading — multiple faults detected', 'err');
          }
        } else {
          pm.errorPenalty = Math.max(ERR_PENALTY_FLOOR, pm.errorPenalty - ERR_WORSEN_STEP - Math.random() * ERR_WORSEN_STEP_RANGE);
          pm.errorCount++;
          addLog('Existing system error worsening', 'warn');
        }
      } else {
        // Spread to a new module
        const clean = errCandidates.filter(k => !S.modules[k].sysError);
        if (clean.length > 0) {
          const np = clean[Math.floor(Math.random() * clean.length)];
          const nm = S.modules[np];
          nm.sysError = true; nm.sysErrorVisible = false;
          nm.errorPenalty = ERR_PENALTY_INIT_MIN + Math.random() * ERR_PENALTY_INIT_RANGE;
          nm.errorCount = 1;
          addLog('System error spreading — multiple faults detected', 'err');
        }
      }
    }
    nextErrorTime = S.uptime + ERR_SPAWN_NEXT_MIN + Math.random() * ERR_SPAWN_NEXT_RANGE;
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
        // Online: 1/30; bypass: 3/30; offline: 5/30
        const rate = rm.status === 'offline' ? REPAIR_OFFLINE_RATE : (rm.mode === 'bypass' ? REPAIR_BYPASS_RATE : REPAIR_ONLINE_RATE);
        rm.health = Math.min(100, rm.health + rate);
      } else {
        addLog(rm.name + ' repair complete', 'ok');
        repairTarget = null;
        buildSys();
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
      const interval = Math.floor(SCORE_DIVISOR / S.powerOutput);
      if (interval > 0 && S.scoreTicks >= interval) {
        S.score++;
        S.scoreTicks -= interval;
      }
    }
  }
  if (S.scramActive)                              S.reactorState = 'SCRAM';
  else if (S.startupComplete && S.powerOutput>1)  S.reactorState = (S.coreTemp>STATE_CRITICAL_TEMP||S.containIntegrity<STATE_CRITICAL_CONTAIN) ? 'CRITICAL' : 'ONLINE';
  else if (S.auxPower && !S.startupComplete)       S.reactorState = 'STARTUP';
  else if (!S.auxPower) {
    S.reactorState = 'OFFLINE';
    S.startupComplete = 0; S.igniting = 0; S.seqStep = 0;
  }

  // ── Plasma-off uptime reset (10s without igniting → reset uptime) ──
  if (S.igniting) {
    plasmaOffTime = 0;
  } else {
    plasmaOffTime += dt;
    if (plasmaOffTime >= PLASMA_OFF_RESET_SECS && S.uptime > 0) {
      S.uptime = 0;
      plasmaOffTime = 0;
    }
  }

  // ── Auto-scram on containment loss ──
  if (S.containIntegrity <= AUTO_SCRAM_CONTAIN && !S.scramActive && S.igniting) {
    doScram(); addLog('AUTO-SCRAM: Containment', 'err');
  }

  // ── Event tick ──
  if (S.activeEvent) updateEvt();
  else if (S.startupComplete && S.uptime > nextEventTime) triggerEvent();

  // ── Monitor history ──
  if (tick % MONITOR_SAMPLE_TICKS === 0) {
    monHist.temp.push(S.coreTemp);
    monHist.pressure.push(S.corePressure);
    monHist.plasma.push(S.plasmaStability);
    monHist.power.push(S.powerOutput);
    monHist.coolant.push(S.coolantFlowRate);
    monHist.radiation.push(S.radiationLevel);
    Object.values(monHist).forEach(h => { if (h.length > MH) h.shift(); });
  }

  // ── 5-min avg power history ──
  if (tick % POWER_HIST_TICKS === 0) {
    powerHist5m.push(S.powerOutput);
    if (powerHist5m.length > POWER_HIST_MAX) powerHist5m.shift();
    if (powerHist5m.length > 0) {
      const avg = powerHist5m.reduce((a, b) => a + b, 0) / powerHist5m.length;
      if (avg > S.bestAvg5m) S.bestAvg5m = avg;
    }
  }

  // ── Module health threshold alerts ──
  {
    const THRESHOLDS = HEALTH_ALERT_THRESHOLDS;
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
  if (tick % PERIODIC_WARN_TICKS === 0 && S.igniting) {
    if (S.coreTemp > SAFE_TEMP_RED)           addLog('WARN: Temp', 'warn');
    if (S.containIntegrity < WARN_CONTAIN_AMBER) addLog('WARN: Containment', 'err');
  }

  // ── Sensor noise (randomise display values every 10 ticks when offline) ──
  if (tick % 10 === 0 && S.modules.sensor.status !== 'online') {
    sensorNoise = {
      coreTemp:         (Math.random() * DISP_TEMP_MAX).toFixed(0),
      corePressure:     (Math.random() * DISP_PRES_MAX).toFixed(1),
      plasmaStability:  (Math.random() * DISP_PLASMA_MAX).toFixed(1),
      neutronDensity:   (Math.random() * DISP_NEUTRON_MAX).toFixed(1),
      coolantTemp:      (Math.random() * DISP_COOLANT_TEMP_MAX).toFixed(0),
      coolantFlowRate:  (Math.random() * DISP_COOLANT_FLOW_MAX).toFixed(0),
      turbineRPM:       (Math.random() * DISP_TURBINE_MAX).toFixed(0),
      containIntegrity: (Math.random() * DISP_CONTAIN_MAX).toFixed(1),
      magneticFlux:     (Math.random() * DISP_FLUX_MAX).toFixed(2),
      radiationLevel:   (Math.random() * DISP_RAD_MAX).toFixed(1),
      auxCoolTemp:      (Math.random() * DISP_AUX_TEMP_MAX).toFixed(0),
      auxCoolFlow:      (Math.random() * DISP_AUX_FLOW_MAX).toFixed(0),
      backupFieldStr:   (Math.random() * DISP_BACKUP_FIELD_MAX).toFixed(1),
      secondaryPressure:(Math.random() * DISP_SECONDARY_PRES_MAX).toFixed(1),
      rodPosition:      (Math.random() * 100).toFixed(0),
      heatSinkTemp:     (Math.random() * DISP_HEATSINK_MAX).toFixed(0),
      fuelRemaining:    (Math.random() * 100).toFixed(1),
      fuelConsump:      (Math.random() * 50).toFixed(1),
      powerOutput:      (Math.random() * 600).toFixed(2),
    };
  } else if (S.modules.sensor.status === 'online') {
    sensorNoise = {};
  }

  updateUI();
}

setInterval(simulate, SIM_INTERVAL_MS);
