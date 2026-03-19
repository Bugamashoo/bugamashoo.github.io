// ============================================================
// reactor7.js — MANUAL TAB (static content + nav)
// Load order: 7th (after reactor1)
// Self-contained: no simulation deps, only SEQUENCE reference
// ============================================================

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
    `<div class="manual-header">II. SHUTDOWN</div>
     <div class="manual-step">
       <div class="manual-step-num">01</div>
       <div class="manual-step-text">Disengage GRID SYNC → reduce THROTTLE to 10% → disengage TURBINE → FUEL INJ to 0% → disengage IGN PRIME → CONTAINMENT to 0% after &lt;500°C → disengage MAG COILS, FUEL, COOLANT, RAD SHIELD, AUX POWER last.</div>
     </div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  emergency:
    `<div class="manual-header">III. EMERGENCY</div>
     <div class="manual-warning">⚠ FAILURE TO RESOLVE EVENTS RESULTS IN CATASTROPHIC REACTOR FAILURE. There is no second chance.</div>
     <div class="manual-step">
       <div class="manual-step-num">!!</div>
       <div class="manual-step-text">
         <b>SCRAM</b>: All systems killed. 5s lockout. Does NOT engage backups.
         <b>HARD RESET</b>: All modules restart (4s blackout).
         <b>PLASMA DUMP</b>: Kills plasma.
         <b>COOLANT FLOOD</b>: Max cooling.
       </div>
     </div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  malfunctions:
    `<div class="manual-header">IV. MALFUNCTIONS</div>

     <div class="manual-note" style="margin-bottom:8px">§ A — LATENT SYSTEM FAULTS</div>
     <div style="margin-bottom:12px">
       During sustained reactor operation, latent system faults develop without warning in subsystem firmware and mechanical assemblies. These faults are <b>not immediately observable</b> on the control panel and will not appear in the module status readout until a formal diagnostic is completed.<br><br>
       The event log will periodically emit a non-specific advisory — <i>"New non-critical system error detected"</i> — with no indication of which subsystem is affected. Operators are advised to treat all such advisories as actionable.<br><br>
       <b>Effects of an unresolved fault:</b><br>
       &nbsp;• Module efficiency silently reduced. Output loss may not be immediately apparent.<br>
       &nbsp;• Health deterioration rate increases. Module service life is shortened.<br>
       &nbsp;• If left unattended, the fault worsens at each subsequent error interval and may propagate to an adjacent subsystem.<br><br>
       <b>Diagnosis procedure:</b><br>
       Navigate to the SYSTEMS tab. Select DIAGNOSE on the suspect module. Only one module may be under active diagnosis at any time. Diagnosis requires a period of uninterrupted monitoring; results are not instantaneous. Upon completion, the module readout will indicate whether a fault was detected. Diagnosing a healthy module is not harmful.<br><br>
       <b>Remediation:</b><br>
       System faults cannot be resolved by the REPAIR function. The affected subsystem must be taken offline via RESTART, which will clear the fault and restore nominal parameters after the restart cycle completes. HARD RESET clears all faults across all modules simultaneously.<br><br>
       Operators are cautioned that restarting a module introduces a temporary service interruption. Plan accordingly.
     </div>

     <div class="manual-note" style="margin-bottom:8px">§ B — CRITICAL EVENTS</div>
     <div style="margin-bottom:12px">
       Events occur randomly during operation. Each has unique consequences if the timer expires:<br><br>
       <b style="color:var(--red)">COOLANT LEAK</b> → <b>MELTDOWN</b>: Core melts through containment floor<br>
       <b style="color:var(--red)">MAG COIL DRIFT</b> → <b>PLASMA ERUPTION</b>: Uncontained superheated plasma<br>
       <b style="color:var(--red)">FUEL CONTAMINATION</b> → <b>CHEMICAL EXPLOSION</b>: Volatile chain reaction<br>
       <b style="color:var(--red)">TURBINE VIBRATION</b> → <b>MECHANICAL DISINTEGRATION</b>: Centrifugal failure<br>
       <b style="color:var(--red)">SENSOR FAULT</b> → <b>BLIND CASCADE</b>: Undetected failures compound<br>
       <b style="color:var(--red)">PLASMA INSTABILITY</b> → <b>MAGNETIC IMPLOSION</b>: Field collapse crushes core<br>
       <b style="color:var(--red)">GRID FREQ DRIFT</b> → <b>EMP BLAST</b>: Massive electromagnetic pulse<br>
       <b style="color:var(--red)">RADIATION SPIKE</b> → <b>CONTAMINATION EVENT</b>: Radiological disaster
     </div>
     <div class="manual-warning">All failures are PERMANENT. Game over. Your uptime is your score.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  modes:
    `<div class="manual-header">V. MODULE MODES</div>
     <div style="margin-bottom:12px">
       Each subsystem on the SYSTEMS tab may be set to one of five operating modes. Mode selection governs output capacity, mechanical wear rate, and thermal contribution. Operators are advised to consider downstream effects on connected subsystems before changing any module's operating mode.<br><br>
       <b style="color:var(--green)">NORMAL</b>: Designed operating parameters. Output, wear, and heat generation are within certified tolerances. Recommended for sustained reactor operation. No stress imposed on interconnected subsystems.<br><br>
       <b style="color:var(--magenta)">OVERCLOCK</b>: Drives the subsystem beyond rated capacity, yielding substantially elevated output. Health deterioration is markedly accelerated and significant additional heat is introduced into the thermal circuit. The interconnected subsystem is placed under concurrent mechanical stress. Suitable only for brief periods when output must be maximized regardless of equipment cost.<br><br>
       <b style="color:var(--cyan)">ECO</b>: Reduces the subsystem to a conserved duty cycle. Output is considerably diminished, but wear is reduced to a very low rate and core heat contribution decreases. Recommended when reactor equilibrium must be restored or a module requires relief without a full shutdown.<br><br>
       <b style="color:#ffe047">BYPASS</b>: Routes operation around standard safety interlocks, maintaining approximately 90% of rated output while suspending the module's own health degradation. The subsystem receives accelerated repair rates equivalent to an offline module, allowing field repairs at near-full capacity. All mechanical stress that would normally be borne by the bypassed subsystem is instead redirected at 2× intensity to the BACKUP SYSTEMS module. The interconnected subsystem is <b>not</b> subjected to additional stress. BACKUP SYSTEMS cannot be placed in BYPASS mode. Employ with awareness that sustained bypass across multiple modules will rapidly degrade backup capacity.
     </div>
     <div class="manual-note">INTERCONNECTIONS: Each module affects one neighbor. Thermal↔Coolant, Magnetic↔Sensor, Fuel→Thermal, Turbine→Grid, Grid→Comms, Comms→Sensor. Operating any module in OVERCLOCK mode places the connected subsystem under additional stress each cycle. BYPASS mode redirects all stress to BACKUP SYSTEMS instead.</div>
     <div class="manual-note" style="margin-top:8px">DIAGNOSTICS: Use DIAGNOSE on any module to check for latent system faults. Only one module may be diagnosed at a time. Diagnosis takes a variable amount of time — do not cancel prematurely. A clean diagnostic does not guarantee the module will remain fault-free. See Section IV for full fault procedures.</div>
     <div class="stamp">DO NOT REMOVE FROM CONTROL ROOM</div>`,

  reference:
    `<div class="manual-header">VI. REFERENCE</div>
     <div class="manual-note">SAFE: Temp 1000-6000°C | Press 5-30 ATM | Plasma &gt;60% | Contain &gt;50% | Coolant &gt;200 L/min | RPM 3000-12000 | Rad &lt;40 mSv</div>
     <div class="manual-warning">DANGER: Temp &gt;8000°C | Press &gt;40 | Contain &lt;20% | Rad &gt;80 → AUTO-SCRAM/FAILURE</div>
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
