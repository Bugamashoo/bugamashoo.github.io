// ============================================================
// ui.js — UI UPDATE FUNCTION
// Load order: 10th (after reactor9.js, before sim.js)
// Contains: updateUI()
// ============================================================

function updateUI() {
  // Threshold color helpers: hi(d) = danger when above d; lo(d) = danger when below d
  const hi = (d) => (v) => v > d ? 'red' : v > d * 0.85 ? 'amber' : 'green';
  const lo = (d, active) => (v) => (!active || active()) ? (v < d ? 'red' : v < d * 1.15 ? 'amber' : 'green') : 'green';

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
  if (fe) fe.textContent = sensorOff && sensorNoise.fuelRemaining !== undefined ? sensorNoise.fuelRemaining : S.fuelRemaining.toFixed(1);
  const fb = document.getElementById('bar_fuelRemaining');
  if (fb) { const fv = sensorOff && sensorNoise.fuelRemaining !== undefined ? parseFloat(sensorNoise.fuelRemaining) : S.fuelRemaining; fb.style.width = fv + '%'; fb.className = 'bar-fill ' + (fv < DISP_FUEL_RED ? 'red' : fv < DISP_FUEL_AMBER ? 'amber' : 'green'); }
  const fc = document.getElementById('disp_fuelConsump');
  if (fc) fc.textContent = sensorOff && sensorNoise.fuelConsump !== undefined ? sensorNoise.fuelConsump : S.fuelConsump.toFixed(1);

  // Net power output display
  const po = document.getElementById('netOutput');
  const poVal = sensorOff && sensorNoise.powerOutput !== undefined ? sensorNoise.powerOutput : S.powerOutput.toFixed(2);
  po.textContent = poVal;
  po.style.color = parseFloat(poVal) > DISP_POWER_RED ? 'var(--red)' : parseFloat(poVal) > DISP_POWER_AMBER ? 'var(--amber)' : 'var(--green)';

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

  // Fuel injection indicator (orange triangle, lower-left)
  const fuelInd = document.getElementById('fuelIndicator');
  if (fuelInd) {
    const fp = S.fuelInject / 100;
    const fuelActive = rvOn && fp > 0;
    const borderClr = rvOn ? rvCoreClr + '50' : '#1e2830';
    fuelInd.setAttribute('fill',   fuelActive ? '#ff9f1c' : 'url(#bgGrad)');
    fuelInd.setAttribute('stroke', borderClr);
    fuelInd.setAttribute('opacity', fuelActive ? (0.15 + fp * 0.7).toFixed(2) : '1');
    if (fuelActive) fuelInd.setAttribute('filter', 'url(#rGlow)'); else fuelInd.removeAttribute('filter');
  }

  // Coolant flow indicator (blue triangle, lower-right)
  const coolInd = document.getElementById('coolantIndicator');
  if (coolInd) {
    const cp = S.coolantFlow / 100;
    const coolActive = rvOn && cp > 0;
    const borderClr2 = rvOn ? rvCoreClr + '50' : '#1e2830';
    coolInd.setAttribute('fill',   coolActive ? '#00e5ff' : 'url(#bgGrad)');
    coolInd.setAttribute('stroke', borderClr2);
    coolInd.setAttribute('opacity', coolActive ? (0.15 + cp * 0.7).toFixed(2) : '1');
    if (coolActive) coolInd.setAttribute('filter', 'url(#rGlow)'); else coolInd.removeAttribute('filter');
  }

  // ── Electrical arcs (updated every 3 ticks ≈ 0.15s) ──
  if (tick % 3 === 0) {
    const instab   = rvOn ? Math.max(0, (100 - S.plasmaStability) / 100) : 0;
    const baseArcs = rvOn && rvIntens > 0.15 ? 1 : 0;           // always 1 arc when running
    const numArcs  = Math.min(6, baseArcs + Math.round(instab * 5)); // up to 5 extra from instability
    for (let i = 0; i < 6; i++) {
      const arc = document.getElementById('arc' + i);
      if (!arc) continue;
      if (i < numArcs) {
        const angle  = Math.random() * Math.PI * 2;
        const reach  = 14 + Math.random() * 34;                 // 14–48 px from center
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
}
