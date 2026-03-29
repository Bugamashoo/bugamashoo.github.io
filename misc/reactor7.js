// reactor7.js - MANUAL TAB (static content + nav)
// Load order: 7th (after reactor1)
// Self-contained: no simulation deps, only SEQUENCE reference

const MP = {
  startup:
    `<div class="manual-header">I. STARTUP</div>` +
    SEQUENCE.map((s, i) =>
      `<div class="manual-step">` +
        `<div class="manual-step-num">${(i+1).toString().padStart(2,'0')}</div>` +
        `<div class="manual-step-text">${s.label}</div>` +
      `</div>`
    ).join('') +
    `<div class="manual-note">First-hour throttle 30-50%. Allow equilibrium.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  shutdown:
    `<div class="manual-header">II. CONTROLLED SHUTDOWN</div>
     <div class="manual-step">
       <div class="manual-step-num">01</div>
       <div class="manual-step-text"><b>GRID SYNC OFF</b> - Decouple from grid before reducing output.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">02</div>
       <div class="manual-step-text"><b>THROTTLE > 20%</b> - Reduce main throttle gradually to avoid thermal shock.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">03</div>
       <div class="manual-step-text"><b>TURBINE OFF</b> - Disengage turbine once RPM can drop safely.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">04</div>
       <div class="manual-step-text"><b>FUEL INJ > 0%</b>, then <b>IGN PRIME OFF</b> - Terminate plasma. Coolant pumps must remain on during cooldown.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">05</div>
       <div class="manual-step-text"><b>CONTAIN PWR > 0%</b> once core temp drops below 500°C. Then <b>MAG COILS OFF</b>.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">06</div>
       <div class="manual-step-text"><b>FUEL PUMPS OFF</b> - 8-second fuel flow grace period applies. Plasma will extinguish automatically if flow drops with low stability.</div>
     </div>
     <div class="manual-step">
       <div class="manual-step-num">07</div>
       <div class="manual-step-text"><b>COOLANT PUMPS OFF > RAD SHIELD OFF > AUX POWER OFF</b> - In that order, after temperatures are nominal.</div>
     </div>
     <div class="manual-note">⚠ Do not shut off coolant pumps while core temp exceeds 500°C. Thermal runaway is possible without active cooling.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  emergency:
    `<div class="manual-header">III. EMERGENCY PROCEDURES</div>
     <div class="manual-warning">⚠ FAILURE TO RESOLVE EVENTS RESULTS IN CATASTROPHIC AND PERMANENT REACTOR FAILURE.</div>

     <div class="manual-note" style="margin-bottom:6px">SCRAM (red button, top panel)</div>
     <div style="margin-bottom:10px">
       Immediately kills: FUEL PUMPS, COOLANT PUMPS, CONTAIN FIELD, IGN PRIME, TURBINE, GRID SYNC, MAG COILS, RAD SHIELD, VENT SYSTEM. Zeroes THROTTLE, FUEL INJ, CONTAIN PWR.<br>
       <b>Does NOT kill:</b> AUX POWER, BACKUP GEN, EMERG VENT, EMERG DUMP, ROD SAFETY.<br>
       5-second lockout: all non-whitelisted switches are blocked. During lockout, only AUX POWER, BACKUP GEN, EMERG VENT, EMERG DUMP, and ROD SAFETY OFF may be toggled. Startup sequence resets - full restart required afterward.
     </div>

     <div class="manual-note" style="margin-bottom:6px">PLASMA DUMP (Emergency tab)</div>
     <div style="margin-bottom:10px">
       Halves core temperature instantly and terminates plasma ignition. Use when temperature is unrecoverable and time does not permit a controlled shutdown. Side effect: fuel remaining decreases rapidly while EMERG DUMP switch is held active (~0.1%/sec drain). Disengage after plasma is extinguished.
     </div>

     <div class="manual-note" style="margin-bottom:6px">COOLANT FLOOD (Emergency tab)</div>
     <div style="margin-bottom:10px">
       Forces coolant flow to maximum. Use when primary coolant is critically low or coolant temp is climbing toward failure. Does not engage auxiliary cooling - activate AUX PUMP and AUX LOOP separately if primary loop is compromised.
     </div>

     <div class="manual-note" style="margin-bottom:6px">EMERG VENT (Emergency switches)</div>
     <div style="margin-bottom:10px">
       While active: reduces core temperature target by an additional 15% and 100°C, and reduces pressure target by 30%. Use when thermal and pressure readings are elevated but plasma should be preserved. Leave on until values stabilize.
     </div>

     <div class="manual-note" style="margin-bottom:6px">HARD RESET (Emergency tab)</div>
     <div style="margin-bottom:10px">
       4-second full blackout. All modules go offline, then restart online in NORMAL mode. Health floored at 50% for each module - will not restore a module below 50% health. <b>Clears all system errors across all modules.</b> Clears any active diagnosis. All controls zeroed. Use as a last resort to eliminate cascading system faults when diagnosis and targeted restart are no longer viable.
     </div>

     <div class="manual-warning">Backup systems (AUX COOLING, BACKUP CONTAINMENT, BACKUP GEN, CONTROL RODS) remain active through SCRAM. They are your primary mitigation tools during emergencies - engage them before or immediately after SCRAM.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  malfunctions:
    `<div class="manual-header">IV. MALFUNCTIONS</div>

     <div class="manual-note" style="margin-bottom:8px">§ A - LATENT SYSTEM FAULTS</div>
     <div style="margin-bottom:12px">
       During sustained operation, hidden faults develop in subsystem firmware and mechanical assemblies. These faults are <b>not immediately observable</b> and do not appear in the module status readout until a formal diagnostic is completed.<br><br>
       The event log will emit a non-specific advisory - <i>"New non-critical system error detected"</i> - with no indication of which subsystem is affected. The first fault typically appears within 30–90 seconds of ONLINE status. Subsequent intervals are also 30–90 seconds each.<br><br>
       <b>Effects of an unresolved fault:</b><br>
       &nbsp;• Module efficiency silently reduced to 85–90% on first occurrence.<br>
       &nbsp;• Health drain rate increases by 10% per tick while faulty.<br>
       &nbsp;• At each subsequent error interval: 75% chance the fault worsens (efficiency drops further, minimum 50%); 25% chance it spreads to a new module. A fault that has compounded 8 times will always spread.<br><br>
       <b>Diagnosis procedure:</b><br>
       Navigate to the SYSTEMS tab. Select DIAGNOSE on the suspect module. Only one module may be diagnosed at a time (1–5 seconds). Do not cancel prematurely. Upon completion, the module card will display SYSTEM ERROR if a fault is found. Diagnosing a healthy module is not harmful.<br><br>
       <b>Remediation options:</b><br>
       &nbsp;• <b>RESTART</b> - Takes module offline, clears the fault, returns online after 5 seconds. Temporary service interruption.<br>
       &nbsp;• <b>BYPASS + RESTART</b> - If the module is in BYPASS mode when RESTART is selected, the module remains online at ~90% capacity while the fault is cleared over 5 seconds. No service interruption, but BACKUP SYSTEMS absorbs the stress. The log entry confirms success: <i>"errors cleared (bypass)"</i>.<br>
       &nbsp;• <b>HARD RESET</b> - Clears all faults on all modules simultaneously. 4-second full outage. See Section III.<br><br>
       The REPAIR function does not clear system faults. Repairing a module with an active fault will restore health but efficiency and health-drain penalty will persist until a restart is performed.
     </div>

     <div class="manual-note" style="margin-bottom:8px">§ B - GAUGE DANGER / MODULE DAMAGE</div>
     <div style="margin-bottom:12px">
       Sustained out-of-range gauge readings cause direct hardware damage independent of event timers. When a critical threshold is crossed, a damage timer arms (15–60 seconds). On expiry, the linked module takes 4–13% health damage and the timer rearms. The timer disarms only when the reading returns to safe range.<br><br>
       <b>Danger conditions and affected modules:</b><br>
       &nbsp;• Core Temp &gt;7000°C > THERMAL MGMT<br>
       &nbsp;• Core Pressure &gt;35 ATM > FUEL DELIVERY<br>
       &nbsp;• Plasma Stability &lt;20% (while igniting) > MAGNETIC CTRL<br>
       &nbsp;• Coolant Temp &gt;150°C > PRIMARY COOLANT<br>
       &nbsp;• Coolant Flow &lt;100 L/min (while igniting) > PRIMARY COOLANT<br>
       &nbsp;• Containment Integrity &lt;15% > MAGNETIC CTRL<br>
       &nbsp;• Radiation Level &gt;60 mSv > SENSOR ARRAY<br>
       &nbsp;• Turbine RPM &gt;13,000 > GRID INTERFACE<br>
       &nbsp;• Heat Sink Temp &gt;150°C > PRIMARY COOLANT<br>
       &nbsp;• Aux Cool Temp &gt;70°C > BACKUP SYSTEMS<br><br>
       Multiple simultaneous danger conditions deal damage to multiple modules concurrently. There is no warning before the timer expires.
     </div>

     <div class="manual-note" style="margin-bottom:8px">§ C - CRITICAL EVENTS</div>
     <div style="margin-bottom:12px">
       Events trigger randomly after reactor goes ONLINE (first event: 60–300 seconds after startup; subsequent events: 30–120 seconds after the previous one closes). The same event will not repeat until at least 3 other events have fired. Steps must be completed in sequence - each unlocks only after the previous is done.<br><br>
       <table style="width:100%;font-size:11px;border-collapse:collapse">
         <tr style="color:#5a5f66"><td style="padding:2px 6px 2px 0">EVENT</td><td style="padding:2px 6px">TIMER</td><td style="padding:2px 0">FAILURE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">COOLANT LEAK</td><td style="padding:2px 6px">40s</td><td>MELTDOWN</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">MAG COIL DRIFT</td><td style="padding:2px 6px">20s</td><td>PLASMA ERUPTION</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">FUEL CONTAMINATION</td><td style="padding:2px 6px">30s</td><td>CHEMICAL EXPLOSION</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">TURBINE VIBRATION</td><td style="padding:2px 6px">25s</td><td>MECHANICAL DISINTEGRATION</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">SENSOR FAULT</td><td style="padding:2px 6px">25s</td><td>BLIND CASCADE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">PLASMA INSTABILITY</td><td style="padding:2px 6px">45s</td><td>MAGNETIC IMPLOSION</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">GRID FREQ DRIFT</td><td style="padding:2px 6px">30s</td><td>EMP BLAST</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">RADIATION SPIKE</td><td style="padding:2px 6px">50s</td><td>CONTAMINATION EVENT</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">VACUUM BREACH</td><td style="padding:2px 6px">35s</td><td>VACUUM VESSEL BREACH</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">COOLANT OVERHEAT</td><td style="padding:2px 6px">40s</td><td>SECONDARY LOOP FAILURE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">GRID POWER SURGE</td><td style="padding:2px 6px">25s</td><td>GRID RESONANCE CASCADE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">TRITIUM LEAK</td><td style="padding:2px 6px">50s</td><td>TRITIUM RELEASE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">MAGNET QUENCH</td><td style="padding:2px 6px">30s</td><td>SUPERCONDUCTOR QUENCH</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">STEAM HAMMER</td><td style="padding:2px 6px">35s</td><td>STEAM LINE RUPTURE</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">DIVERTOR OVERLOAD</td><td style="padding:2px 6px">40s</td><td>DIVERTOR MELTDOWN</td></tr>
         <tr><td style="padding:2px 6px 2px 0;color:var(--cyan)">AUX POWER FAULT</td><td style="padding:2px 6px">30s</td><td>POWER SYSTEM COLLAPSE</td></tr>
       </table>
     </div>
     <div class="manual-warning">All failures are PERMANENT. There is no recovery. Your uptime and score are your record.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  modes:
    `<div class="manual-header">V. MODULE MODES &amp; SYSTEMS</div>
     <div style="margin-bottom:12px">
       Each subsystem may be set to one of four operating modes governing output capacity, wear rate, and thermal contribution. Changes take effect immediately.<br><br>
       <b style="color:var(--green)">NORMAL</b> - 100% performance, standard wear rate, no heat modifier. Certified operating envelope. No stress on interconnected modules.<br><br>
       <b style="color:var(--magenta)">OVERCLOCK</b> - 150% performance, 3× wear rate, +15°C heat contribution. Also deals ~0.4% health damage per minute to the interconnected module. Use only in short bursts when maximum output is required regardless of equipment cost. Not available on BACKUP SYSTEMS.<br><br>
       <b style="color:var(--cyan)">ECO</b> - 60% performance, 0.3× wear rate, −5°C heat contribution. Does not stress interconnected modules. Use to relieve thermal load or protect a degrading module without restarting it. Not available on BACKUP SYSTEMS or SENSOR ARRAY or COMMS UPLINK.<br><br>
       <b style="color:#ffe047">BYPASS</b> - 90% performance, no self-wear, no heat modifier. The module's own health drain is suspended. Repair rate increases to 4× (same as offline). All mechanical stress is redirected at 2× intensity to BACKUP SYSTEMS instead of the interconnected module. BACKUP SYSTEMS cannot be bypassed. Sustained use across multiple modules will rapidly degrade backup capacity.<br><br>
       &nbsp;&nbsp;> If RESTART is triggered while a module is in BYPASS mode, the module stays online and clears its system error over 5 seconds (bypass restart). No service interruption.
     </div>

     <div class="manual-note" style="margin-bottom:6px">MODULE INTERCONNECTIONS</div>
     <div style="margin-bottom:10px">
       Each module affects one adjacent subsystem. OVERCLOCK stress is applied to the listed target each minute of operation. BYPASS redirects this stress to BACKUP SYSTEMS instead.<br><br>
       &nbsp;• FUEL DELIVERY > THERMAL MGMT<br>
       &nbsp;• THERMAL MGMT > PRIMARY COOLANT<br>
       &nbsp;• PRIMARY COOLANT > THERMAL MGMT<br>
       &nbsp;• MAGNETIC CTRL > SENSOR ARRAY<br>
       &nbsp;• SENSOR ARRAY > MAGNETIC CTRL<br>
       &nbsp;• GRID INTERFACE > COMMS UPLINK<br>
       &nbsp;• COMMS UPLINK > SENSOR ARRAY<br>
       &nbsp;• BACKUP SYSTEMS - no interconnection
     </div>

     <div class="manual-note" style="margin-bottom:6px">HEALTH &amp; WEAR</div>
     <div style="margin-bottom:10px">
       Health drains during operation. The drain rate is multiplied by the active mode's wear factor and additionally scaled by the module's lever position (0% lever = 0.5× drain; 50% lever = 1.0×; 100% lever = 1.5×). A module with an active system error takes an additional 10% wear penalty per cycle.<br><br>
       Health thresholds: log warnings are generated automatically at 75%, 50%, 25%, and 10%. A module below 25% health has a 3% chance per second of becoming DEGRADED (50% performance penalty). A module at 0% health fails OFFLINE automatically and must be restarted.<br><br>
       BACKUP SYSTEMS drains continuously based on active load: each of BACKUP GEN, AUX COOL PUMP+LOOP, BACKUP CONT A, and BACKUP CONT B contributes up to 0.02%/tick at maximum setting. OVERCLOCK triples this drain.
     </div>

     <div class="manual-note" style="margin-bottom:6px">DIAGNOSTICS &amp; REPAIR</div>
     <div style="margin-bottom:6px">
       DIAGNOSE: 1–5 second timed scan. Only one module at a time. Cancel by clicking DIAGNOSE again on the same module - but do not cancel prematurely or the result is lost.<br>
       REPAIR: Continuous health restoration at ~1% per 1.5 seconds while online; 4× faster if module is offline or in BYPASS. Cannot clear system faults - restart is required for fault clearance.
     </div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  reference:
    `<div class="manual-header">VI. QUICK REFERENCE</div>

     <div class="manual-note" style="margin-bottom:6px">SAFE OPERATING RANGES</div>
     <div style="margin-bottom:10px;font-size:12px">
       Core Temp: 1,000–6,000°C &nbsp;|&nbsp; Core Pressure: 5–30 ATM<br>
       Plasma Stability: &gt;60% &nbsp;|&nbsp; Containment: &gt;50%<br>
       Coolant Flow: &gt;200 L/min &nbsp;|&nbsp; Turbine RPM: 3,000–12,000<br>
       Radiation: &lt;30 mSv &nbsp;|&nbsp; Coolant Temp: &lt;120°C<br>
       Heat Sink Temp: &lt;120°C &nbsp;|&nbsp; Aux Cool Temp: &lt;60°C
     </div>

     <div class="manual-note" style="margin-bottom:6px">WARNING THRESHOLDS (amber / red)</div>
     <div style="margin-bottom:10px;font-size:12px">
       Core Temp: &gt;5,950°C amber / &gt;7,000°C red > module damage begins<br>
       Core Pressure: &gt;20 ATM amber / &gt;35 ATM red > module damage begins<br>
       Plasma Stability: &lt;23% amber / &lt;20% red (while igniting)<br>
       Containment: &lt;60% amber / &lt;30% red<br>
       Coolant Flow: &lt;115 L/min amber / &lt;100 L/min red (while igniting)<br>
       Coolant Temp: &gt;128°C amber / &gt;150°C red<br>
       Turbine RPM: &gt;11,050 amber / &gt;13,000 red<br>
       Radiation: &gt;30 mSv amber / &gt;60 mSv red<br>
       Fuel: &lt;25% amber / &lt;10% red
     </div>

     <div class="manual-note" style="margin-bottom:6px">AUTO-SCRAM</div>
     <div style="margin-bottom:10px;font-size:12px">
       Automatic SCRAM triggers at <b>Containment Integrity ≤ 5%</b> while igniting. No other condition triggers auto-scram - all other dangerous readings require manual SCRAM judgment. A manual SCRAM can be initiated at any time via the red SCRAM button.
     </div>

     <div class="manual-note" style="margin-bottom:6px">WARNING LIGHTS</div>
     <div style="margin-bottom:10px;font-size:12px">
       OVERTEMP / OVERPRES / CONTAINMENT / COOLANT / FUEL / RADIATION - gauge alerts<br>
       SCRAM - active during 5s lockout<br>
       ONLINE - green when reactor state is ONLINE<br>
       MOD FAULT - any module not fully online<br>
       SYS FAULT - amber: >=2 hidden system errors; red: >=6 errors<br>
       EVENT - active critical event in progress
     </div>

     <div class="manual-note" style="margin-bottom:6px">SCORE</div>
     <div style="margin-bottom:10px;font-size:12px">
       Score accumulates continuously while ONLINE based on power output. Higher MW output = faster score accumulation. Score interval = floor(3000 ÷ MW output) ticks. At 300 MW: ~1 point/0.5s. At 30 MW: ~1 point/5s. Peak power is tracked in the header. Funds earned from power generation are displayed in the FUNDS header box.
     </div>

     <div class="manual-note" style="margin-bottom:6px">FUEL PUMP GRACE PERIOD</div>
     <div style="margin-bottom:6px;font-size:12px">
       When FUEL PUMPS are turned off, a residual 8-second flow grace period applies before fuel delivery actually stops. A warning is logged at the start of the grace period. Plasma will extinguish automatically if fuel flow drops and plasma stability falls below 5%.
     </div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  resupply:
    `<div class="manual-header">VII. RESUPPLY &amp; ECONOMY</div>

     <div class="manual-note" style="margin-bottom:6px">REVENUE</div>
     <div style="margin-bottom:12px">
       The facility earns revenue from electrical power delivered to the grid. Income scales linearly with MW output, with an additional scaling multiplier of up to 1.5× at higher power levels. Revenue only accrues while the reactor is ONLINE and producing power. The current balance is displayed in the header as FUNDS.<br><br>
       <b>No power = no income.</b> The reactor starts with $0 and 5% fuel. Earn money by generating power, then reinvest in fuel, repairs, and upgrades.
     </div>

     <div class="manual-note" style="margin-bottom:6px">FUEL MARKET</div>
     <div style="margin-bottom:12px">
       Fuel can be purchased from the RESUPPLY tab at a fluctuating market price. Price is displayed as $/kg and changes gradually over 5–10 minute intervals.<br><br>
       <b>Normal fluctuation:</b> ±25% around base price.<br>
       <b>Extreme swings:</b> Rare — prices can spike to +100% or drop to −50%. Watch for green prices (below average) and buy in bulk.<br>
       <b>Price changes begin</b> after your first fuel purchase. Before that, the price remains at base rate.<br><br>
       <b>Buy options:</b> BUY MAX (spend all available funds), +1%, +5%, +25%, FULL REFILL. Each button shows its cost.<br>
       <b>Sell fuel:</b> You may sell your remaining fuel at 60% of the current buy price. This is a last resort — fuel is more valuable as reactor input.
     </div>

     <div class="manual-note" style="margin-bottom:6px">REPAIR COSTS</div>
     <div style="margin-bottom:12px">
       Active repair (via the SYSTEMS tab REPAIR button) costs money continuously while in progress. If funds are insufficient, repair halts automatically. Budget for ongoing maintenance.
     </div>

     <div class="manual-note" style="margin-bottom:6px">SYSTEM UPGRADES</div>
     <div style="margin-bottom:12px">
       Each module can be upgraded in three categories, each with 3 tiers:<br><br>
       <b style="color:var(--green)">MAX HEALTH</b> — Increases the module's maximum health pool (+10, +15, +20 per tier, cumulative +45 at T3). Higher max health means longer operation between repairs.<br><br>
       <b style="color:var(--green)">EFFICIENCY</b> — Raises the minimum efficiency when system errors occur. Reduces the performance penalty from hidden faults.<br><br>
       <b style="color:var(--green)">DURABILITY</b> — Reduces the module's health drain rate during operation. At T3, drain is reduced by 45%. Significant long-term cost savings on repairs.<br><br>
       Upgrades are permanent and persist through restarts and hard resets.
     </div>

     <div class="manual-note" style="margin-bottom:6px">SPECIAL ITEMS</div>
     <div style="margin-bottom:12px">
       One-time-use items available from the RESUPPLY tab:<br><br>
       &nbsp;• <b>EMERGENCY FUEL CELL</b> — Instantly adds 3% fuel. Use when reserves are critically low.<br>
       &nbsp;• <b>QUICK REPAIR KIT</b> — Instantly restores 30 health to a selected module.<br>
       &nbsp;• <b>DIAGNOSTIC SWEEP</b> — Reveals all hidden system errors across every module simultaneously.<br>
       &nbsp;• <b>OVERCLOCK BOOST</b> — For 60 seconds, all overclocked modules produce 2× performance at normal drain rate.<br>
       &nbsp;• <b>CONTAINMENT PATCH</b> — Instantly restores 25% containment integrity.<br>
       &nbsp;• <b>EVENT TIME EXTENSION</b> — Adds 15 seconds to the active event countdown. Only available during an active event.
     </div>

     <div class="manual-note" style="margin-bottom:6px">FUEL &amp; MONEY EXHAUSTION</div>
     <div style="margin-bottom:12px">
       If fuel reserves reach 0% and you have insufficient funds to purchase more, the reactor enters a terminal state. After a short grace period, the facility is condemned — GAME OVER. Manage your fuel budget carefully. When fuel runs low, reduce throttle to extend burn time while accumulating funds for resupply.
     </div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`
};

// Nav button wiring
document.querySelectorAll('.manual-nav-btn').forEach(b => {
  b.addEventListener('click', () => {
    document.querySelectorAll('.manual-nav-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('manualBody').innerHTML = MP[b.dataset.manual] || '';
  });
});

// Default page on load
document.getElementById('manualBody').innerHTML = MP.startup;
