// ui.js - UI UPDATE FUNCTION
// Load order: 10th (after reactor9.js, before sim.js)
// Contains: updateUI()

function updateUI() {
  // Threshold color helpers: hi(d) = danger when above d; lo(d) = danger when below d
  const hi = (d) => (v) => v > d ? 'red' : v > d * 0.85 ? 'amber' : 'green';
  const lo = (d, active) => (v) => (!active || active()) ? (v < d ? 'red' : v < d * 1.15 ? 'amber' : 'green') : 'green';

  // No-power mode: aux off, backup gen off, output < 1 MW > gauges/status invisible
  const noPower = !S.auxPower && !S.backupGen && S.powerOutput < 1;

  // Core readings
  updDN('coreTemp',         S.coreTemp.toFixed(0),          DISP_TEMP_MAX,         hi(SAFE_TEMP_RED));
  updDN('corePressure',     S.corePressure.toFixed(1),       DISP_PRES_MAX,         hi(SAFE_PRES_RED));
  updDN('plasmaStability',  S.plasmaStability.toFixed(1),    DISP_PLASMA_MAX,       lo(SAFE_PLASMA_LOW, () => !!S.igniting));
  updDN('neutronDensity',   S.neutronDensity.toFixed(1),     DISP_NEUTRON_MAX);
  updDN('coolantTemp',      S.coolantTemp.toFixed(0),        DISP_COOLANT_TEMP_MAX, hi(SAFE_COOLANT_RED));
  updDN('coolantFlowRate',  S.coolantFlowRate.toFixed(0),    DISP_COOLANT_FLOW_MAX, lo(SAFE_COOLFLOW_AMBER, () => !!S.igniting));
  updDN('turbineRPM',       S.turbineRPM.toFixed(0),         DISP_TURBINE_MAX,      hi(getTurbineSafeMax()));
  updDN('containIntegrity', S.containIntegrity.toFixed(1),   DISP_CONTAIN_MAX,      lo(SAFE_CONTAIN_DISP));
  updDN('magneticFlux',     S.magneticFlux.toFixed(2),       DISP_FLUX_MAX);
  updDN('radiationLevel',   S.radiationLevel.toFixed(1),     DISP_RAD_MAX,          hi(SAFE_RAD_RED));
  updDN('auxCoolTemp',      S.auxCoolTemp.toFixed(0),        DISP_AUX_TEMP_MAX,     hi(SAFE_AUXCOOL_RED));
  updDN('auxCoolFlow',      S.auxCoolFlow.toFixed(0),        DISP_AUX_FLOW_MAX);
  updDN('backupFieldStr',   S.backupFieldStr.toFixed(1),     DISP_BACKUP_FIELD_MAX);
  updDN('secondaryPressure',S.secondaryPressure.toFixed(1),  DISP_SECONDARY_PRES_MAX);
  updDN('rodPosition',      S.rodPosition.toFixed(0),        100);
  updDN('heatSinkTemp',     S.heatSinkTemp.toFixed(0),       DISP_HEATSINK_MAX,     hi(SAFE_HEATSINK_RED));

  // Fuel
  const sensorOff = S.modules.sensor.status !== 'online';
  const fe = document.getElementById('disp_fuelRemaining');
  if (fe) fe.textContent = sensorOff ? 'Sensor ERR' : S.fuelRemaining.toFixed(1) + '%';
  const fb = document.getElementById('bar_fuelRemaining');
  if (fb) { const fv = sensorOff && sensorNoise.fuelRemaining !== undefined ? parseFloat(sensorNoise.fuelRemaining) : S.fuelRemaining; fb.style.width = fv + '%'; fb.className = 'bar-fill ' + (fv < DISP_FUEL_RED ? 'red' : fv < DISP_FUEL_AMBER ? 'amber' : 'green'); }
  const fc = document.getElementById('disp_fuelConsump');
  if (fc) fc.textContent = sensorOff ? 'Sensor ERR' : S.fuelConsump.toFixed(2) + '%/min';

  // Toggle no-power CSS class - hides display values, zeros bars, hides warning row + seq steps
  document.body.classList.toggle('no-power', noPower);

  // Net power output display
  const po = document.getElementById('netOutput');
  const totalPower = S.powerOutput + S.backupGenOutput;
  const poVal = sensorOff ? 'ERR' : totalPower.toFixed(2);
  po.textContent = poVal;
  po.style.color = sensorOff ? 'var(--red)' : parseFloat(poVal) > DISP_POWER_RED ? 'var(--red)' : parseFloat(poVal) > DISP_POWER_AMBER ? 'var(--amber)' : 'var(--green)';

  // Reactor core SVG visual
  const rvCX = 70, rvCY = 62.5;
  const rvOn       = !!S.igniting;
  const rvIntens   = Math.min(1, S.powerOutput / 200);
  const rvPlasma   = S.plasmaStability / 100;
  const rvFlux     = Math.min(1, S.magneticFlux / 8);
  const rvContain  = S.containIntegrity / 100;
  const rvTempPct  = Math.min(1, S.coreTemp / 10000);
  const rvRad     = Math.min(1, S.radiationLevel / 60);
  const rvPres    = Math.min(1, S.corePressure / SAFE_PRES_RED);
  const rvFuel    = S.fuelRemaining / 100;
  const rvRPM     = Math.min(1, S.turbineRPM / 15000);
  const rvNeutron = Math.min(1, S.neutronDensity / 80);
  const rvHeat    = Math.min(1, Math.max(0, (S.heatSinkTemp - 40) / 160));

  // Startup sequence progress (0–12): subtle visual cues before ignition
  const sq = S.seqStep || 0;
  const sqProg = sq / SEQUENCE.length; // 0–1

  // Derive glow colors from current readings
  const rvCoreClr  = S.coreTemp > 7000 ? '#ff2e2e' : S.coreTemp > 5950 ? '#ff9f1c' : '#00e5ff';
  const rvRingClr  = S.containIntegrity < 15 ? '#ff2e2e' : S.containIntegrity < 17.25 ? '#ff9f1c' : '#00e5ff';
  const rvArcClr   = S.plasmaStability < 20  ? '#ff2e2e' : S.plasmaStability < 23    ? '#ff9f1c' : '#00e5ff';

  // Core hex - during startup, gradually brighten border and tint fill
  const rvCore = document.getElementById('reactorCore');
  if (rvCore) {
    if (rvOn) {
      rvCore.setAttribute('fill', rvTempPct > 0.7 ? '#2a0808' : '#0a1520');
      rvCore.setAttribute('stroke', rvCoreClr);
      rvCore.setAttribute('stroke-width', (1 + rvIntens * 2.5).toFixed(1));
      rvCore.setAttribute('stroke-opacity', '1');
      rvCore.setAttribute('filter', 'url(#rGlow)');
    } else if (sq > 0) {
      // Pre-ignition: core gradually wakes up
      const startupClr = sq >= 8 ? '#00e5ff' : '#1e4860';
      rvCore.setAttribute('fill', sq >= 5 ? '#0a1218' : '#0d1418');
      rvCore.setAttribute('stroke', startupClr);
      if (S.ignPrime) {
        // ignPrime active: flicker stroke-width and opacity before ignition
        const flicker = 0.5 + 0.5 * Math.sin(tick * 0.25);
        rvCore.setAttribute('stroke-width', (1.5 + sqProg * 1 + flicker * 2.7).toFixed(1));
        rvCore.setAttribute('stroke-opacity', (0.5 + flicker * 0.5).toFixed(2));
        if (flicker > 0.85) rvCore.setAttribute('filter', 'url(#rGlow)');
        else if (sq < 8) rvCore.removeAttribute('filter');
      } else {
        rvCore.setAttribute('stroke-width', (1.5 + sqProg * 1).toFixed(1));
        rvCore.setAttribute('stroke-opacity', '1');
        if (sq >= 8) rvCore.setAttribute('filter', 'url(#rGlow)'); else rvCore.removeAttribute('filter');
      }
    } else {
      rvCore.setAttribute('fill', '#0d1418');
      rvCore.setAttribute('stroke', '#1e2830');
      rvCore.setAttribute('stroke-width', '1.5');
      rvCore.setAttribute('stroke-opacity', '1');
      rvCore.removeAttribute('filter');
    }
  }

  // Core glow halo (radial gradient circle, scales with power)
  const rvGlow = document.getElementById('coreGlowCirc');
  if (rvGlow) {
    // Throttle breathing: radius gently pulses with main throttle (2.6)
    // Mix ratio shifts glow radius slightly and tints s1 gradient color (2.8)
    const rvMix = S.mixRatio / 100;
    const rvThrottle = S.mainThrottle / 100;
    const throttleBreathe = rvOn ? Math.sin(tick * 0.1) * rvThrottle * 3 : 0;
    const mixRadBoost = rvMix * 3;
    rvGlow.setAttribute('r', rvOn ? (14 + rvIntens * 20 + throttleBreathe + mixRadBoost).toFixed(1) : '22');
    rvGlow.setAttribute('opacity', rvOn ? (0.25 + rvIntens * 0.75).toFixed(2) : '0');
    const s0 = document.getElementById('cgS0');
    const s1 = document.getElementById('cgS1');
    if (s0) s0.setAttribute('stop-color', rvOn && S.coreTemp > 7000 ? '#ffcc44' : '#ffffff');
    if (s1) {
      // Mix ratio shifts color: 0% = pure cyan (#00e5ff), 100% = warm teal (rgb(50,185,125))
      if (rvOn && S.coreTemp <= 5950) {
        const mr = S.mixRatio / 100;
        s1.setAttribute('stop-color', `rgb(${Math.round(mr*50)},${Math.round(229-mr*44)},${Math.round(255-mr*130)})`);
      } else {
        s1.setAttribute('stop-color', rvCoreClr);
      }
    }
    if (rvOn && rvIntens > 0.1) rvGlow.setAttribute('filter', 'url(#rGlowStr)');
    else rvGlow.removeAttribute('filter');
  }

  // Ring 1 - plasma (inner, spins fast with plasma stability)
  const rvR1 = document.getElementById('ring1');
  if (rvR1) {
    rvR1.setAttribute('stroke', rvOn ? rvCoreClr : '#1e2830');
    rvR1.setAttribute('stroke-opacity', rvOn ? (0.35 + rvPlasma * 0.65).toFixed(2) : '1');
    if (rvOn) rvR1.setAttribute('filter', 'url(#rGlow)'); else rvR1.removeAttribute('filter');
    const r1Spin = rvOn && S.plasmaStability > 30 ? ' rviz-spin-fast' : '';
    rvR1.setAttribute('class', 'rviz-ring' + r1Spin);
  }

  // Ring 2 - magnetic (counter-spins when flux is active)
  const rvR2 = document.getElementById('ring2');
  if (rvR2) {
    const magActive = S.magCoils && S.auxPower;
    rvR2.setAttribute('stroke', magActive ? rvRingClr : '#1e2830');
    rvR2.setAttribute('stroke-opacity', magActive ? (0.2 + rvFlux * 0.7).toFixed(2) : '1');
    if (magActive && rvFlux > 0.2) rvR2.setAttribute('filter', 'url(#rGlow)'); else rvR2.removeAttribute('filter');
    const r2Spin = S.magneticFlux > 2 ? ' rviz-spin-med' : '';
    rvR2.setAttribute('class', 'rviz-ring' + r2Spin);
    // Field tune jitter: ring2 trembles with fieldTune value (2.9)
    if (S.fieldTune > 0 && magActive) {
      const jit = (S.fieldTune / 100) * 1.5;
      rvR2.setAttribute('transform', `translate(${((Math.random()-0.5)*jit).toFixed(2)},${((Math.random()-0.5)*jit).toFixed(2)})`);
    } else {
      rvR2.removeAttribute('transform');
    }
  }

  // Ring 3 - containment field (outermost, slow spin)
  const rvR3 = document.getElementById('ring3');
  if (rvR3) {
    const contActive = S.containPower > 30;
    rvR3.setAttribute('stroke', contActive ? rvRingClr : '#1e2830');
    rvR3.setAttribute('stroke-opacity', contActive ? (0.15 + rvContain * 0.6).toFixed(2) : '1');
    const r3Spin = contActive && S.containIntegrity > 40 ? ' rviz-spin-slow' : '';
    rvR3.setAttribute('class', 'rviz-ring' + r3Spin);
  }

  // Contain field glow: blurred hex fill pulsing when containField switch active (3.2)
  const cfGlow = document.getElementById('containFieldGlow');
  if (cfGlow) {
    if (S.containField && S.containPower > 20) {
      const cfPulse = 0.5 + 0.5 * Math.sin(tick * 0.08);
      cfGlow.setAttribute('opacity', (0.04 + rvContain * 0.08 * cfPulse).toFixed(3));
      cfGlow.setAttribute('fill', rvContain < 0.3 ? '#ff2e2e' : '#00e5ff');
    } else {
      cfGlow.setAttribute('opacity', '0');
    }
  }

  // Backup containment field arcs: sliding dashed segments (3.3)
  ['backupFieldA', 'backupFieldB'].forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    const sw = i === 0 ? S.backupContA : S.backupContB;
    if (sw && S.backupContPow > 0) {
      const bStr = Math.min(1, S.backupFieldStr / 100);
      el.setAttribute('opacity', (0.3 + bStr * 0.6).toFixed(2));
      el.setAttribute('stroke-dashoffset', ((tick * 0.4 + i * 30) % 20).toFixed(1));
      el.setAttribute('stroke', bStr > 0.7 ? '#ff9f1c' : '#ffcc44');
    } else {
      el.setAttribute('opacity', '0');
    }
  });

  // Hex border + corner dots react to state + startup progress
  const rvBorder = document.getElementById('hexBorder');
  if (rvBorder) {
    if (rvOn) rvBorder.setAttribute('stroke', rvCoreClr + '50');
    else if (sq > 0) rvBorder.setAttribute('stroke', sq >= 5 ? '#1e486040' : '#1e384030');
    else rvBorder.setAttribute('stroke', '#1e2830');
  }
  // Corner dots: light up progressively during startup (1 per 2 steps)
  for (let d = 0; d < 6; d++) {
    const dot = document.getElementById('rDot' + d);
    if (!dot) continue;
    if (rvOn) {
      dot.setAttribute('fill', rvCoreClr);
      dot.setAttribute('filter', 'url(#rGlow)');
      // Grid sync: dots wave-pulse sequentially around hexagon (2.5)
      if (S.gridSync) {
        const wave = 0.5 + 0.5 * Math.sin(tick * 0.15 - d * Math.PI / 3);
        dot.setAttribute('r', (2.5 + wave * 1.5).toFixed(1));
        dot.setAttribute('opacity', (0.5 + wave * 0.5).toFixed(2));
      } else {
        dot.setAttribute('r', '2.5');
        dot.setAttribute('opacity', '1');
      }
    } else if (sq > 0 && d < Math.ceil(sq / 2)) {
      dot.setAttribute('fill', sq >= 8 ? '#00e5ff' : '#1e5870'); dot.removeAttribute('filter');
      dot.setAttribute('r', '2.5'); dot.setAttribute('opacity', '1');
    } else {
      dot.setAttribute('fill', '#1e2830'); dot.removeAttribute('filter');
      dot.setAttribute('r', '2.5'); dot.setAttribute('opacity', '1');
    }
  }

  // Fuel injection indicator (orange triangle, lower-left)
  const fuelInd = document.getElementById('fuelIndicator');
  const fuelFillEl = document.getElementById('fuelFill');
  const fuelFillRect = document.getElementById('fuelFillRect');
  {
    const fp = S.fuelInject / 100;
    const fuelActive = rvOn && fp > 0;
    const borderClr = rvOn ? rvCoreClr + '50' : '#1e2830';
    const triH = 36; // triangle height in SVG units (110.5 − 74.5)
    if (fuelInd) fuelInd.setAttribute('stroke', borderClr);
    if (fuelFillRect) {
      const fh = fp * triH;
      fuelFillRect.setAttribute('y', (110.5 - fh).toFixed(2));
      fuelFillRect.setAttribute('height', fh.toFixed(2));
    }
    if (fuelFillEl) {
      fuelFillEl.setAttribute('fill', '#ff9f1c');
      // fuelPumps pulse: active pumping throb visible on fuel fill (2.1)
      const fPumpPulse = S.fuelPumps ? (1 + 0.18 * Math.sin(tick * 0.28)) : 1;
      fuelFillEl.setAttribute('opacity', fuelActive ? ((0.15 + fp * 0.7) * fPumpPulse).toFixed(2) : '0');
      if (fuelActive) fuelFillEl.setAttribute('filter', 'url(#rGlow)'); else fuelFillEl.removeAttribute('filter');
    }
  }

  // Emergency dump: override fuel indicator to flash bright red (2.10)
  if (S.emergDump && fuelFillEl) {
    fuelFillEl.setAttribute('fill', '#ff2e2e');
    fuelFillEl.setAttribute('opacity', (0.6 + 0.4 * Math.abs(Math.sin(tick * 0.4))).toFixed(2));
    fuelFillEl.setAttribute('filter', 'url(#rGlow)');
  } else if (!S.emergDump && fuelFillEl) {
    fuelFillEl.setAttribute('fill', '#ff9f1c');
  }

  // Coolant flow indicator (blue triangle, lower-right) - color shifts with coolant temp
  const coolInd = document.getElementById('coolantIndicator');
  const coolFillEl = document.getElementById('coolFill');
  const coolFillRect = document.getElementById('coolFillRect');
  {
    const cp = S.coolantFlow / 100;
    const coolActive = rvOn && cp > 0;
    const borderClr2 = rvOn ? rvCoreClr + '50' : '#1e2830';
    const coolClr = S.coolantTemp > SAFE_COOLANT_RED ? '#ff2e2e' : S.coolantTemp > SAFE_COOLANT_RED * 0.75 ? '#ff9f1c' : '#00e5ff';
    const triH = 36;
    if (coolInd) coolInd.setAttribute('stroke', borderClr2);
    if (coolFillRect) {
      const ch = cp * triH;
      coolFillRect.setAttribute('y', (110.5 - ch).toFixed(2));
      coolFillRect.setAttribute('height', ch.toFixed(2));
    }
    if (coolFillEl) {
      coolFillEl.setAttribute('fill', coolClr);
      // coolantPumps pulse: active pumping throb on coolant fill (2.2)
      const cPumpPulse = S.coolantPumps ? (1 + 0.15 * Math.sin(tick * 0.22 + 1.5)) : 1;
      coolFillEl.setAttribute('opacity', coolActive ? ((0.15 + cp * 0.7) * cPumpPulse).toFixed(2) : '0');
      if (coolActive) coolFillEl.setAttribute('filter', 'url(#rGlow)'); else coolFillEl.removeAttribute('filter');
    }
  }

  // Additional reactor visual elements
  // Heat background - hex tints orange/red with heat sink temp
  const heatBg = document.getElementById('heatBg');
  if (heatBg) {
    heatBg.setAttribute('fill', rvHeat > 0.7 ? '#ff2e2e' : '#ff5500');
    heatBg.setAttribute('opacity', (rvHeat * 0.2).toFixed(3));
  }

  // Radiation aura - large blurred halo, color = green>amber>red with radiation level
  const radAura = document.getElementById('radAura');
  if (radAura) {
    const radColor = rvRad > 0.67 ? '#ff2e2e' : rvRad > 0.33 ? '#ff9f1c' : '#39ff14';
    radAura.setAttribute('fill', radColor);
    radAura.setAttribute('opacity', (rvRad * 0.25).toFixed(3));
  }

  // Rad shield hex: rotating dashed scan line, color/opacity scale with radiation (3.1)
  const shieldHex = document.getElementById('shieldHex');
  if (shieldHex) {
    if (S.radShield) {
      const shColor = rvRad > 0.67 ? '#ff2e2e' : rvRad > 0.33 ? '#ff9f1c' : '#39ff14';
      shieldHex.setAttribute('stroke', shColor);
      shieldHex.setAttribute('opacity', (0.35 + rvRad * 0.45).toFixed(2));
      shieldHex.setAttribute('stroke-dashoffset', (tick * 0.3 % 12).toFixed(1));
    } else {
      shieldHex.setAttribute('opacity', '0');
    }
  }

  // Fuel arc - stroke-dasharray progress ring showing remaining fuel
  const fuelArc = document.getElementById('fuelArc');
  if (fuelArc) {
    const circ = 314.2; // 2π × 50
    fuelArc.setAttribute('stroke-dasharray', (rvFuel * circ).toFixed(1) + ' ' + circ.toFixed(1));
    fuelArc.setAttribute('stroke', rvFuel < 0.15 ? '#ff2e2e' : '#ff9f1c');
    fuelArc.setAttribute('opacity', rvOn && rvFuel > 0.01 ? '0.55' : '0');
  }

  // Turbine spin ring - dashed ring spins at speed proportional to turbineRPM
  const turbEl = document.getElementById('turbineSpin');
  if (turbEl) {
    if (S.turbineRPM > 80) {
      turbEl.style.animationDuration = Math.max(0.25, 3600 / Math.max(1, S.turbineRPM)).toFixed(2) + 's';
      turbEl.style.animationPlayState = 'running';
      turbEl.setAttribute('opacity', (0.15 + rvRPM * 0.55).toFixed(2));
      turbEl.setAttribute('stroke', rvRPM > 0.87 ? '#ff9f1c' : '#00e5ff');
      // turbineEngage: engaged = normal dashes; disengaged = slipping drift (2.4)
      if (S.turbineEngage) {
        turbEl.setAttribute('stroke-dasharray', '3 7');
        turbEl.removeAttribute('stroke-dashoffset');
      } else {
        turbEl.setAttribute('stroke-dasharray', '2 9');
        turbEl.setAttribute('stroke-dashoffset', (tick * 0.4 % 22).toFixed(1));
      }
    } else {
      turbEl.style.animationPlayState = 'paused';
      turbEl.setAttribute('opacity', '0');
    }
  }

  // Turbine speed limiter ring: 3-tier warning with animated dashoffset (3.4)
  const limRing = document.getElementById('limiterRing');
  if (limRing) {
    const safeMax = getTurbineSafeMax();
    const rpmFrac = S.turbineRPM / safeMax;
    if (rpmFrac > 0.88) {
      // Near limit: red rapid flash + fast dashoffset
      const lFlash = 0.4 + 0.6 * Math.abs(Math.sin(tick * 0.5));
      limRing.setAttribute('opacity', lFlash.toFixed(2));
      limRing.setAttribute('stroke', '#ff2e2e');
      limRing.setAttribute('stroke-width', '2.5');
      limRing.setAttribute('stroke-dashoffset', (tick * 0.6 % 10).toFixed(1));
    } else if (rpmFrac > 0.75) {
      // Warning zone: amber medium pulse
      limRing.setAttribute('opacity', (0.4 + 0.3 * Math.sin(tick * 0.15)).toFixed(2));
      limRing.setAttribute('stroke', '#ff9f1c');
      limRing.setAttribute('stroke-width', '1.5');
      limRing.setAttribute('stroke-dashoffset', (tick * 0.2 % 10).toFixed(1));
    } else if (S.turbineRPM > 80) {
      // Normal running: dim teal slow drift
      limRing.setAttribute('opacity', '0.18');
      limRing.setAttribute('stroke', '#00bcd4');
      limRing.setAttribute('stroke-width', '1');
      limRing.setAttribute('stroke-dashoffset', (tick * 0.08 % 10).toFixed(1));
    } else {
      limRing.setAttribute('opacity', '0');
    }
  }

  // Vent system streaks: 6 radial exhaust lines, scale thickness with heat (3.5)
  for (let i = 0; i < 6; i++) {
    const vs = document.getElementById('vStr' + i);
    if (!vs) continue;
    if (S.ventSystem && S.auxPower) {
      const heatW = 1 + rvHeat * 3;
      const flicker = 0.6 + 0.4 * Math.sin(tick * 0.2 + i * 1.05);
      vs.setAttribute('opacity', (0.4 + rvHeat * 0.5 * flicker).toFixed(2));
      vs.setAttribute('stroke-width', heatW.toFixed(1));
      vs.setAttribute('stroke', rvHeat > 0.7 ? '#ff9f1c' : '#00e5ff');
    } else {
      vs.setAttribute('opacity', '0');
    }
  }

  // Emergency vent burst: pulsing spike lines at hex vertices (3.6)
  for (let i = 0; i < 6; i++) {
    const ev = document.getElementById('evb' + i);
    if (!ev) continue;
    if (S.emergVent) {
      const burst = 0.5 + 0.5 * Math.abs(Math.sin(tick * 0.35 + i * 1.05));
      ev.setAttribute('opacity', burst.toFixed(2));
      ev.setAttribute('stroke-width', (1.5 + burst * 2).toFixed(1));
    } else {
      ev.setAttribute('opacity', '0');
    }
  }

  // Pressure pulse - pulsing ring, frequency and intensity driven by core pressure
  // pressureRelief knob scales ring radius: higher relief = larger pulse radius (2.7)
  const pressPulse = document.getElementById('pressPulse');
  if (pressPulse) {
    const rvRelief = S.pressureRelief / 100;
    pressPulse.setAttribute('r', (16 + rvRelief * 12).toFixed(1));
    const pOp = rvPres > 0.1 ? (0.2 + rvPres * 0.55) * Math.abs(Math.sin(tick * (0.04 + rvPres * 0.18))) : 0;
    pressPulse.setAttribute('opacity', pOp.toFixed(3));
    pressPulse.setAttribute('stroke', rvPres > 0.83 ? '#ff2e2e' : rvPres > 0.67 ? '#ff9f1c' : '#00e5ff');
  }

  // Aux cooling orbit dots: 3 dots orbit at r=35 when auxCoolPump active (3.7)
  if (tick % 2 === 0) {
    const auxActive = S.auxCoolPump && S.auxPower;
    for (let i = 0; i < 3; i++) {
      const dot = document.getElementById('aOrb' + i);
      if (!dot) continue;
      if (auxActive && S.auxCoolFlow > 0) {
        const orbitSpeed = 0.015 + (S.auxCoolFlow / 100) * 0.055;
        const a = tick * orbitSpeed + (i * Math.PI * 2 / 3);
        dot.setAttribute('cx', (70 + 35 * Math.cos(a)).toFixed(1));
        dot.setAttribute('cy', (62.5 + 35 * Math.sin(a)).toFixed(1));
        dot.setAttribute('opacity', (0.5 + (S.auxCoolFlow / 100) * 0.5).toFixed(2));
        dot.setAttribute('fill', S.auxCoolTemp > SAFE_AUXCOOL_RED ? '#ff9f1c' : '#00bfff');
        dot.setAttribute('filter', 'url(#rGlow)');
      } else {
        dot.setAttribute('opacity', '0');
      }
    }
  }

  // Neutron cloud dots - 8 dots flicker with neutron density (updated every 2 ticks)
  if (tick % 2 === 0) {
    const nColor = rvNeutron > 0.7 ? '#ff9f1c' : S.coreTemp > 6000 ? '#ff6644' : '#00e5ff';
    for (let i = 0; i < 8; i++) {
      const nd = document.getElementById('nDot' + i);
      if (!nd) continue;
      const lit = rvNeutron > i / 8;
      const op  = lit ? (0.4 + Math.random() * 0.6) : (Math.random() < rvNeutron * 2 ? Math.random() * 0.3 : 0);
      nd.setAttribute('opacity', op.toFixed(2));
      nd.setAttribute('fill', nColor);
      if (lit) nd.setAttribute('filter', 'url(#rGlow)'); else nd.removeAttribute('filter');
    }
  }

  // Control rod lines - show insertion depth pointing toward center when rod safety is off
  [
    { id:'rodLineA', x1:70, y1:41.7, dx:0,   dy: 20.8 },
    { id:'rodLineB', x1:88, y1:72.9, dx:-18, dy:-10.4 },
    { id:'rodLineC', x1:52, y1:72.9, dx: 18, dy:-10.4 },
  ].forEach((r, i) => {
    const el = document.getElementById(r.id);
    if (!el) return;
    const pct = !S.rodSafetyOff ? [S.rodA, S.rodB, S.rodC][i] / 100 : 0;
    el.setAttribute('x2', (r.x1 + r.dx * pct).toFixed(1));
    el.setAttribute('y2', (r.y1 + r.dy * pct).toFixed(1));
    el.setAttribute('opacity', pct > 0 ? (0.5 + pct * 0.5).toFixed(2) : '0');
  });

  // Backup generator glow: amber halo + pulse ring behind core hex (3.8)
  const bkGlow = document.getElementById('backupGlow');
  const bkRing = document.getElementById('backupGlowRing');
  if (bkGlow && bkRing) {
    if (S.backupGen) {
      const bkOut = Math.min(1, (S.backupGenOutput || 0) / 2);
      const bkPhase = tick * 0.08;
      const bkPulse = 0.5 + 0.5 * Math.sin(bkPhase);
      const bkAnti  = 0.5 + 0.5 * Math.sin(bkPhase + Math.PI);
      bkGlow.setAttribute('r', (14 + bkOut * 6 + bkPulse * 4).toFixed(1));
      bkGlow.setAttribute('opacity', (0.30 + bkOut * 0.40 * bkPulse).toFixed(2));
      bkRing.setAttribute('r', (18 + bkAnti * 8).toFixed(1));
      bkRing.setAttribute('opacity', (0.25 + bkOut * 0.35 * bkAnti).toFixed(2));
    } else {
      bkGlow.setAttribute('opacity', '0');
      bkRing.setAttribute('opacity', '0');
    }
  }

  // Electrical arcs (updated every 3 ticks ~ 0.15s)
  if (tick % 3 === 0) {
    const instab   = rvOn ? Math.max(0, (100 - S.plasmaStability) / 100) : 0;
    const baseArcs = rvOn && rvIntens > 0.15 ? 2 : 0;             // 2 arcs always when running
    const numArcs  = Math.min(12, baseArcs + Math.round(instab * 10)); // up to 10 extra from instability
    for (let i = 0; i < 12; i++) {
      const arc = document.getElementById('arc' + i);
      if (!arc) continue;
      if (i < numArcs) {
        const angle  = Math.random() * Math.PI * 2;
        const reach  = (14 + rvNeutron * 8) + Math.random() * (28 + instab * 18);
        const ex     = rvCX + reach * Math.cos(angle);
        const ey     = rvCY + reach * Math.sin(angle);
        let d;
        const arcType = i % 3; // 0=2-seg thin, 1=3-seg jagged, 2=off-center branch
        if (arcType === 0) {
          // Two-segment arc from center; fork branch when arc reaches far (4.1)
          const jx = rvCX + (ex - rvCX) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 20;
          const jy = rvCY + (ey - rvCY) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 20;
          d = `M${rvCX} ${rvCY} L${jx.toFixed(1)} ${jy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`;
          if (reach > 30 && Math.random() < rvIntens * 0.7) {
            const fa = angle + (Math.random() - 0.5) * 1.2;
            const fr = reach * (0.3 + Math.random() * 0.35);
            const fx = (jx + fr * Math.cos(fa)).toFixed(1);
            const fy = (jy + fr * Math.sin(fa)).toFixed(1);
            d += ` M${jx.toFixed(1)} ${jy.toFixed(1)} L${fx} ${fy}`;
          }
        } else if (arcType === 1) {
          // Three-segment jagged arc from center; Y-fork from second joint when far (4.1)
          const t1 = 0.25 + Math.random() * 0.25;
          const t2 = 0.55 + Math.random() * 0.25;
          const j1x = rvCX + (ex - rvCX) * t1 + (Math.random() - 0.5) * 26;
          const j1y = rvCY + (ey - rvCY) * t1 + (Math.random() - 0.5) * 26;
          const j2x = rvCX + (ex - rvCX) * t2 + (Math.random() - 0.5) * 16;
          const j2y = rvCY + (ey - rvCY) * t2 + (Math.random() - 0.5) * 16;
          d = `M${rvCX} ${rvCY} L${j1x.toFixed(1)} ${j1y.toFixed(1)} L${j2x.toFixed(1)} ${j2y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`;
          if (reach > 30 && Math.random() < rvIntens * 0.6) {
            const fa1 = angle + 0.4 + Math.random() * 0.5;
            const fa2 = angle - 0.4 - Math.random() * 0.5;
            const fr = (reach - Math.hypot(j2x - rvCX, j2y - rvCY)) * (0.4 + Math.random() * 0.3);
            d += ` M${j2x.toFixed(1)} ${j2y.toFixed(1)} L${(j2x + fr*Math.cos(fa1)).toFixed(1)} ${(j2y + fr*Math.sin(fa1)).toFixed(1)}`;
            d += ` M${j2x.toFixed(1)} ${j2y.toFixed(1)} L${(j2x + fr*Math.cos(fa2)).toFixed(1)} ${(j2y + fr*Math.sin(fa2)).toFixed(1)}`;
          }
        } else {
          // Branch arc: starts offset from center, shorter reach
          const bAngle = Math.random() * Math.PI * 2;
          const bOff   = 6 + Math.random() * 10;
          const ox     = rvCX + bOff * Math.cos(bAngle);
          const oy     = rvCY + bOff * Math.sin(bAngle);
          const bReach = 10 + Math.random() * (18 + instab * 14);
          const bex    = ox + bReach * Math.cos(angle);
          const bey    = oy + bReach * Math.sin(angle);
          const jx     = ox + (bex - ox) * (0.4 + Math.random() * 0.3) + (Math.random() - 0.5) * 14;
          const jy     = oy + (bey - oy) * (0.4 + Math.random() * 0.3) + (Math.random() - 0.5) * 14;
          d = `M${ox.toFixed(1)} ${oy.toFixed(1)} L${jx.toFixed(1)} ${jy.toFixed(1)} L${bex.toFixed(1)} ${bey.toFixed(1)}`;
        }
        arc.setAttribute('d', d);
        arc.setAttribute('opacity', (0.25 + Math.random() * 0.75).toFixed(2));
        arc.setAttribute('stroke', rvArcClr);
        arc.setAttribute('stroke-width', (arcType === 1 ? 0.6 + Math.random() * 1.6 : 0.3 + Math.random() * 1.2).toFixed(1));
      } else {
        arc.setAttribute('opacity', '0');
      }
    }
  }

  // Warning lights
  setW('warnOvertemp',    S.coreTemp > SAFE_TEMP_RED        ? 'red'   : S.coreTemp > SAFE_TEMP_AMBER      ? 'amber' : '');
  setW('warnOverpressure',S.corePressure > SAFE_PRES_RED    ? 'red'   : S.corePressure > SAFE_PRES_AMBER   ? 'amber' : '');
  setW('warnContainment', S.containIntegrity < SAFE_CONTAIN_RED ? 'red' : S.containIntegrity < SAFE_CONTAIN_AMBER ? 'amber' : '');
  setW('warnCoolant',     S.igniting ? (S.coolantTemp > SAFE_COOLANT_RED ? 'red' : S.coolantFlowRate < SAFE_COOLFLOW_AMBER ? 'amber' : '') : '');
  setW('warnFuel',        S.fuelRemaining < SAFE_FUEL_RED   ? 'red'   : S.fuelRemaining < SAFE_FUEL_AMBER  ? 'amber' : '');
  setW('warnRadiation',   S.radiationLevel > SAFE_RAD_RED   ? 'red'   : S.radiationLevel > SAFE_RAD_AMBER   ? 'amber' : '');
  setW('warnScram',       S.scramActive            ? 'red'   : '');
  setW('warnOnline',      S.reactorState === 'ONLINE' ? 'green' : '');
  setW('warnModFault',    Object.values(S.modules).some(m => m.status !== 'online') ? 'amber' : '');
  const activeErrors = Object.values(S.modules).filter(m => m.sysError).length;
  setW('warnSysFault',    activeErrors >= 6 ? 'red' : activeErrors >= 2 ? 'amber' : '');
  setW('warnEvent',       S.activeEvent            ? 'red'   : '');
  // Sequence steps
  const HOLD_IGN_STEP = SEQUENCE.findIndex(s => s.label === 'HOLD IGN 3s');
  for (let i = 0; i < SEQUENCE.length; i++) {
    const e = document.getElementById('seq_' + i);
    if (!e) continue;
    e.classList.remove('active','complete');
    if (i < S.seqStep)        e.classList.add('complete');
    else if (i === S.seqStep) e.classList.add('active');
  }
  // Mobile IGN arrow: show when HOLD IGN step is the active pending step
  const ignArrow = document.getElementById('seqIgnArrow');
  if (ignArrow) {
    if (S.seqStep === HOLD_IGN_STEP && S.reactorState === 'STARTUP') {
      ignArrow.classList.add('mobile-show');
    } else {
      ignArrow.classList.remove('mobile-show');
    }
  }

  // Header status bar
  const hs = document.getElementById('headerStatus');
  switch (S.reactorState) {
    case 'OFFLINE':  hs.textContent = '■ OFFLINE';                              hs.style.color = '#5a5f66';       break;
    case 'STARTUP':  hs.textContent = '■ STARTUP';                              hs.style.color = 'var(--amber)';  break;
    case 'ONLINE':   hs.textContent = '■ ONLINE - ' + (S.powerOutput + S.backupGenOutput).toFixed(1) + ' MW'; hs.style.color = 'var(--green)'; break;
    case 'CRITICAL': hs.textContent = '■ CRITICAL';                             hs.style.color = 'var(--red)';    break;
    case 'SCRAM':    hs.textContent = '■ SCRAM';                                hs.style.color = 'var(--red)';    break;
  }

  // Stats
  document.getElementById('uptimeDisp').textContent  = fmtTime(S.uptime);
  document.getElementById('bestUptime').textContent  = fmtTime(S.bestUptime);
  document.getElementById('evtCount').textContent    = S.eventsResolved;
  document.getElementById('scoreDisp').textContent   = Math.round(S.score);

  // Header power output + money
  document.getElementById('hdrOutput').textContent = Math.round(S.powerOutput + S.backupGenOutput);
  document.getElementById('hdrMoney').textContent = fmtMoney(S.money);

  // Warning indicator box
  const warnInd = document.getElementById('warnIndicator');
  const warnBox = document.getElementById('warnBox');
  const wLights = document.querySelectorAll('.warning-light');
  let hasRed = false, hasAmber = false;
  wLights.forEach(l => { if (l.id === 'warnFuel') return; if (l.classList.contains('active-red')) hasRed = true; if (l.classList.contains('active-amber')) hasAmber = true; });
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
  if (document.getElementById('tab-monitors').classList.contains('active') && tick % MONITOR_SAMPLE_TICKS === 0) {
    drawG('mon_temp',      monHist.temp,      'rgb(255,159,28)',  DISP_TEMP_MAX,         '°C');
    drawG('mon_pressure',  monHist.pressure,  'rgb(0,229,255)',   DISP_PRES_MAX,         'ATM');
    drawG('mon_plasma',    monHist.plasma,    'rgb(57,255,20)',   DISP_PLASMA_MAX,       '%');
    drawG('mon_power',     monHist.power,     'rgb(57,255,20)',   600,                   'MW');
    drawG('mon_coolant',   monHist.coolant,   'rgb(0,229,255)',   DISP_COOLANT_FLOW_MAX, 'L/m');
    drawG('mon_radiation', monHist.radiation, 'rgb(255,46,46)',   DISP_RAD_MAX,          'mSv');
  }

  // Systems tab — rebuild on sysDirty flag (module status/health changed) or periodic tick
  if (document.getElementById('tab-systems').classList.contains('active') && (sysDirty || tick % 40 === 0)) {
    sysDirty = false;
    buildSys();
  }

  // Resupply tab (patch values only - no DOM rebuild)
  if (document.getElementById('tab-resupply').classList.contains('active') && tick % 20 === 0) updateResupplyValues();

  // Turbine arrow mobile scroll hint (every 20 ticks)
  if (tick % 20 === 0) updateTurbineArrow();

  // Panel lock affordability styling (throttled)
  if (tick % 10 === 0) {
    document.querySelectorAll('.panel-lock-btn').forEach(btn => {
      const cost = parseInt(btn.dataset.lockCost, 10);
      btn.classList.toggle('affordable', S.money >= cost);
    });
  }
}
