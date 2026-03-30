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
  updDN('turbineRPM',       S.turbineRPM.toFixed(0),         DISP_TURBINE_MAX,      hi(SAFE_TURBINE_RED));
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
  if (fe) fe.textContent = sensorOff ? 'Sensor ERR' : S.fuelRemaining.toFixed(1);
  const fb = document.getElementById('bar_fuelRemaining');
  if (fb) { const fv = sensorOff && sensorNoise.fuelRemaining !== undefined ? parseFloat(sensorNoise.fuelRemaining) : S.fuelRemaining; fb.style.width = fv + '%'; fb.className = 'bar-fill ' + (fv < DISP_FUEL_RED ? 'red' : fv < DISP_FUEL_AMBER ? 'amber' : 'green'); }
  const fc = document.getElementById('disp_fuelConsump');
  if (fc) fc.textContent = sensorOff ? 'Sensor ERR' : S.fuelConsump.toFixed(1);

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

  // Core hex — during startup, gradually brighten border and tint fill
  const rvCore = document.getElementById('reactorCore');
  if (rvCore) {
    if (rvOn) {
      rvCore.setAttribute('fill', rvTempPct > 0.7 ? '#2a0808' : '#0a1520');
      rvCore.setAttribute('stroke', rvCoreClr);
      rvCore.setAttribute('stroke-width', (1 + rvIntens * 2.5).toFixed(1));
      rvCore.setAttribute('filter', 'url(#rGlow)');
    } else if (sq > 0) {
      // Pre-ignition: core gradually wakes up
      const startupClr = sq >= 8 ? '#00e5ff' : '#1e4860';
      rvCore.setAttribute('fill', sq >= 5 ? '#0a1218' : '#0d1418');
      rvCore.setAttribute('stroke', startupClr);
      rvCore.setAttribute('stroke-width', (1.5 + sqProg * 1).toFixed(1));
      if (sq >= 8) rvCore.setAttribute('filter', 'url(#rGlow)'); else rvCore.removeAttribute('filter');
    } else {
      rvCore.setAttribute('fill', '#0d1418');
      rvCore.setAttribute('stroke', '#1e2830');
      rvCore.setAttribute('stroke-width', '1.5');
      rvCore.removeAttribute('filter');
    }
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
      dot.setAttribute('fill', rvCoreClr); dot.setAttribute('filter', 'url(#rGlow)');
    } else if (sq > 0 && d < Math.ceil(sq / 2)) {
      dot.setAttribute('fill', sq >= 8 ? '#00e5ff' : '#1e5870'); dot.removeAttribute('filter');
    } else {
      dot.setAttribute('fill', '#1e2830'); dot.removeAttribute('filter');
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
      fuelFillEl.setAttribute('opacity', fuelActive ? (0.15 + fp * 0.7).toFixed(2) : '0');
      if (fuelActive) fuelFillEl.setAttribute('filter', 'url(#rGlow)'); else fuelFillEl.removeAttribute('filter');
    }
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
      coolFillEl.setAttribute('opacity', coolActive ? (0.15 + cp * 0.7).toFixed(2) : '0');
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
    } else {
      turbEl.style.animationPlayState = 'paused';
      turbEl.setAttribute('opacity', '0');
    }
  }

  // Pressure pulse - pulsing ring, frequency and intensity driven by core pressure
  const pressPulse = document.getElementById('pressPulse');
  if (pressPulse) {
    const pOp = rvPres > 0.1 ? (0.2 + rvPres * 0.55) * Math.abs(Math.sin(tick * (0.04 + rvPres * 0.18))) : 0;
    pressPulse.setAttribute('opacity', pOp.toFixed(3));
    pressPulse.setAttribute('stroke', rvPres > 0.83 ? '#ff2e2e' : rvPres > 0.67 ? '#ff9f1c' : '#00e5ff');
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
          // Two-segment arc from center
          const jx = rvCX + (ex - rvCX) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 20;
          const jy = rvCY + (ey - rvCY) * (0.3 + Math.random() * 0.4) + (Math.random() - 0.5) * 20;
          d = `M${rvCX} ${rvCY} L${jx.toFixed(1)} ${jy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`;
        } else if (arcType === 1) {
          // Three-segment jagged arc from center
          const t1 = 0.25 + Math.random() * 0.25;
          const t2 = 0.55 + Math.random() * 0.25;
          const j1x = rvCX + (ex - rvCX) * t1 + (Math.random() - 0.5) * 26;
          const j1y = rvCY + (ey - rvCY) * t1 + (Math.random() - 0.5) * 26;
          const j2x = rvCX + (ex - rvCX) * t2 + (Math.random() - 0.5) * 16;
          const j2y = rvCY + (ey - rvCY) * t2 + (Math.random() - 0.5) * 16;
          d = `M${rvCX} ${rvCY} L${j1x.toFixed(1)} ${j1y.toFixed(1)} L${j2x.toFixed(1)} ${j2y.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`;
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
  for (let i = 0; i < SEQUENCE.length; i++) {
    const e = document.getElementById('seq_' + i);
    if (!e) continue;
    e.classList.remove('active','complete');
    if (i < S.seqStep)        e.classList.add('complete');
    else if (i === S.seqStep) e.classList.add('active');
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
  document.getElementById('hdrOutput').textContent = (S.powerOutput + S.backupGenOutput).toFixed(2);
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

  // Systems tab (throttled rebuild)
  if (document.getElementById('tab-systems').classList.contains('active') && tick % 40 === 0) buildSys();

  // Resupply tab (patch values only — no DOM rebuild)
  if (document.getElementById('tab-resupply').classList.contains('active') && tick % 20 === 0) updateResupplyValues();
}
