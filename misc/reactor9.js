// ============================================================
// reactor9.js — SIMULATION ENGINE + UI UPDATE + INIT
// Load order: 9th / last
// Contains: doScram, hardReset, sI/eI (ignition), checkSeq,
//           simulate (physics loop), updD/setW/updateUI, init log
// ============================================================

// ── SCRAM ─────────────────────────────────────────────────────
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
  if (ignHoldStart > 0 && Date.now() - ignHoldStart < 3000) addLog('IGN ABORT', 'err');
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

// ── SIMULATION LOOP ───────────────────────────────────────────
function simulate() {
  if (S.gameOver) return;
  tick++;
  const dt = 1 / 20;

  // Ignition hold timer
  if (S.ignitionHeld && !S.igniting && ignHoldStart > 0 && Date.now() - ignHoldStart >= 3000) {
    S.igniting = 1;
    addLog('PLASMA IGNITION', 'ok');
    doShake(); doFlash();
    checkSeq();
  }
  if (!S.ignPrime && S.igniting) { S.igniting = 0; addLog('PLASMA LOST', 'err'); }

  const aM = S.auxPower    ? 1 : 0;
  const fM = S.fuelPumps   ? 1 : 0;
  const cM = S.coolantPumps? 1 : 0;

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
  let tT = 20;
  if (S.igniting) {
    tT += eF * 120 + S.mainThrottle * 50;
    tT *= (0.5 + S.mixRatio / 200);
    tT *= (1 - rE * 0.7);
    tT += fH + tH + mH;
  }
  const cE = S.coolantFlow * cM * aM * 5.0 * cP + (S.auxCoolPump && S.auxCoolLoop ? S.auxCoolRate * 2.0 * bEff : 0);
  tT -= cE;
  if (S.emergVent) tT -= 200;
  tT = Math.max(20, tT);
  S.coreTemp += (tT - S.coreTemp) * 0.02;

  // ── Core pressure ──
  let tPr = 1;
  if (S.igniting) {
    tPr += (S.coreTemp - 20) / 100 - S.pressureRelief / 100 * 3 + S.mainThrottle / 30;
    tPr *= (1 - rE * 0.5);
  }
  if (S.emergVent) tPr *= 0.8;
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
    if (eF < 1) tSt -= 45; // No fuel flow — plasma cannot be sustained
    tSt *= (1 - rE * 0.3);
    tSt  = Math.max(0, Math.min(100, tSt));
  }
  S.plasmaStability += (tSt - S.plasmaStability) * 0.04;

  // ── Neutron density ──
  let tN = 0;
  if (S.igniting) tN = (S.coreTemp / 100) * (S.plasmaStability / 100) * eF * (1 - rE * 0.6);
  S.neutronDensity += (tN - S.neutronDensity) * 0.03;

  // ── Radiation ──
  S.radiationLevel = S.neutronDensity * 0.3
                   + (S.igniting && !S.radShield ? 20 : 0)
                   + (S.containIntegrity < 50 ? 15 : 0);

  // ── Containment integrity ──
  if (S.igniting && S.containPower < 30) S.containIntegrity -= 0.05;
  else if (S.containPower > 50 && S.containField) S.containIntegrity += 0.02;
  if (S.coreTemp > 8000) S.containIntegrity -= 0.03;
  if (S.backupFieldStr > 2) S.containIntegrity += 0.01;
  S.containIntegrity = Math.max(0, Math.min(100, S.containIntegrity));

  // ── Turbine + grid ──
  let tR = 0;
  if (S.turbineEngage && S.igniting && aM) tR = S.mainThrottle * 150 * (S.plasmaStability / 100);
  S.turbineRPM += (tR - S.turbineRPM) * 0.02;
  if (S.gridSync && S.turbineRPM > 1000) S.gridLoad += (80 - S.gridLoad) * 0.01 * gP;
  else S.gridLoad *= 0.95;

  // ── Power output ──
  let tW = 0;
  if (S.igniting && S.turbineEngage) {
    tW = (S.turbineRPM / 15000) * S.mainThrottle * (S.plasmaStability / 100) * 8.5 * (1 - rE * 0.4);
    if (!S.ventSystem) tW *= 0.85;
    if (S.backupGen)   tW += 0.5 * bEff;
  }
  S.powerOutput += (Math.max(0, tW) - S.powerOutput) * 0.03;
  if (S.powerOutput > S.peakPower) S.peakPower = S.powerOutput;

  S.heatSinkTemp = 20 + S.coreTemp * 0.005 - cE * 0.02;
  S.rodPosition  = S.rodSafetyOff ? (S.rodA + S.rodB + S.rodC) / 3 : 100;

  // ── Module health + interconnection drain ──
  if (S.igniting && tick % 60 === 0) {
    let bypassStress = 0; // accumulated stress to apply to backup systems
    Object.entries(S.modules).forEach(([k, m]) => {
      if (m.status === 'offline' || k === 'backup') return; // backup has its own drain logic
      const md = MODES[m.mode];
      const errMult = m.sysError ? 1.1 : 1;
      // Bypass: no self-drain (healthDrain=0), redirect 2× stress to backup
      if (m.mode === 'bypass') {
        bypassStress += Math.random() * 0.2 * 2 * errMult; // 2× equivalent stress
      } else {
        m.health = Math.max(0, m.health - Math.random() * 0.2 * md.healthDrain * errMult);
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
            addLog('System error spread to ' + sm.name, 'warn');
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
    nextErrorTime = S.uptime + 60 + Math.random() * 240;
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

  // ── Periodic warnings ──
  if (tick % 80 === 0 && S.igniting) {
    if (S.coreTemp > 7000)           addLog('WARN: Temp', 'warn');
    if (S.containIntegrity < 40)     addLog('WARN: Containment', 'err');
  }

  updateUI();
}

// ── UI UPDATERS ───────────────────────────────────────────────

// Update a display value + bar gauge
function updD(id, t, mx) {
  const e = document.getElementById('disp_' + id);
  const b = document.getElementById('bar_'  + id);
  if (e) e.textContent = t;
  if (b) {
    const p = Math.min(100, Math.max(0, parseFloat(t) / mx * 100));
    b.style.width = p + '%';
    b.className   = 'bar-fill ' + (p > 80 ? 'red' : p > 60 ? 'amber' : 'green');
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
  // Core readings
  updD('coreTemp',         S.coreTemp.toFixed(0),          10000);
  updD('corePressure',     S.corePressure.toFixed(1),       50);
  updD('plasmaStability',  S.plasmaStability.toFixed(1),    100);
  updD('neutronDensity',   S.neutronDensity.toFixed(1),     100);
  updD('coolantTemp',      S.coolantTemp.toFixed(0),        200);
  updD('coolantFlowRate',  S.coolantFlowRate.toFixed(0),    1200);
  updD('turbineRPM',       S.turbineRPM.toFixed(0),         15000);
  updD('containIntegrity', S.containIntegrity.toFixed(1),   100);
  updD('magneticFlux',     S.magneticFlux.toFixed(2),       8);
  updD('radiationLevel',   S.radiationLevel.toFixed(1),     100);
  updD('auxCoolTemp',      S.auxCoolTemp.toFixed(0),        100);
  updD('auxCoolFlow',      S.auxCoolFlow.toFixed(0),        800);
  updD('backupFieldStr',   S.backupFieldStr.toFixed(1),     8);
  updD('secondaryPressure',S.secondaryPressure.toFixed(1),  30);
  updD('rodPosition',      S.rodPosition.toFixed(0),        100);
  updD('heatSinkTemp',     S.heatSinkTemp.toFixed(0),       200);

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

  // Reactor core visual
  const core = document.getElementById('reactorCore');
  core.classList.toggle('active', !!S.igniting);
  if (S.igniting) {
    const intensity = Math.min(1, S.powerOutput / 200);
    core.style.width  = (24 + intensity * 18) + 'px';
    core.style.height = (24 + intensity * 18) + 'px';
  }
  document.getElementById('ring1').classList.toggle('active',   !!S.igniting);
  document.getElementById('ring1').classList.toggle('spinning', S.igniting && S.plasmaStability > 30);
  document.getElementById('ring2').classList.toggle('active',   !!S.magCoils);
  document.getElementById('ring2').classList.toggle('spinning', S.magneticFlux > 2);
  document.getElementById('ring3').classList.toggle('active',   S.containPower > 30);

  // Warning lights
  setW('warnOvertemp',    S.coreTemp > 7000       ? 'red'   : S.coreTemp > 4000     ? 'amber' : '');
  setW('warnOverpressure',S.corePressure > 35      ? 'red'   : S.corePressure > 20   ? 'amber' : '');
  setW('warnContainment', S.containIntegrity < 30  ? 'red'   : S.containIntegrity < 60 ? 'amber' : '');
  setW('warnCoolant',     S.igniting ? (S.coolantTemp > 150 ? 'red' : S.coolantFlowRate < 100 ? 'amber' : '') : '');
  setW('warnFuel',        S.fuelRemaining < 10     ? 'red'   : S.fuelRemaining < 25  ? 'amber' : '');
  setW('warnRadiation',   S.radiationLevel > 60    ? 'red'   : S.radiationLevel > 30  ? 'amber' : '');
  setW('warnScram',       S.scramActive            ? 'red'   : '');
  setW('warnOnline',      S.reactorState === 'ONLINE' ? 'green' : '');
  setW('warnModFault',    Object.values(S.modules).some(m => m.status !== 'online') ? 'amber' : '');
  const activeErrors = Object.values(S.modules).filter(m => m.sysError).length;
  setW('warnSysFault',    activeErrors >= 6 ? 'red' : activeErrors >= 2 ? 'amber' : '');
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

  // Warning indicator box
  const warnInd = document.getElementById('warnIndicator');
  const warnBox = document.getElementById('warnBox');
  const wLights = document.querySelectorAll('.warning-light');
  let hasRed = false, hasAmber = false;
  wLights.forEach(l => { if (l.classList.contains('active-red')) hasRed = true; if (l.classList.contains('active-amber')) hasAmber = true; });
  const wColor = hasRed ? 'var(--red)' : hasAmber ? 'var(--amber)' : '#2a2e35';
  warnInd.style.color = wColor;
  warnInd.style.textShadow = (hasRed || hasAmber) ? '0 0 10px' : 'none';
  warnBox.style.borderColor = hasRed ? 'var(--red-dim)' : hasAmber ? 'var(--amber-dim)' : 'var(--panel-border)';

  // Monitor graphs (only when tab is visible, throttled)
  if (document.getElementById('tab-monitors').classList.contains('active') && tick % 6 === 0) {
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
addLog('Manual: MANUAL tab', '');
addLog('Module modes: SYSTEMS tab', 'sys');
addLog('All systems nominal', 'ok');

setInterval(simulate, 50);
