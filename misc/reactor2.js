// ============================================================
// reactor2.js — EVENTS & CATASTROPHES
// Load order: 2nd (after reactor1)
// ============================================================

const CATASTROPHES = {
  coolant_leak: {
    anim:'meltdown', title:'MELTDOWN', subtitle:'CORE BREACH — TOTAL LOSS',
    color:'var(--red)',
    narrative:`The coolant leak you failed to address cascaded into a full thermal runaway. Without adequate cooling, the plasma-facing components exceeded 15,000°C in under forty seconds. The tungsten divertor plates liquefied. Molten material breached the vacuum vessel, burning through three meters of biological shielding before emergency concrete injection halted its descent. The facility is a total loss. A 2-kilometer exclusion zone has been established. No personnel casualties thanks to automated evacuation, but the reactor will take eleven years and $47 billion to decommission. Your operating license has been permanently revoked.`
  },
  mag_drift: {
    anim:'nukeFlash', title:'PLASMA ERUPTION', subtitle:'UNCONTAINED SUPERHEATED PLASMA',
    color:'var(--amber)',
    narrative:`The magnetic confinement field drifted beyond recovery. Without stable field geometry, the 150-million-degree plasma touched the inner wall of the tokamak for 0.003 seconds. That was enough. The resulting energy release vaporized the vacuum vessel and sent a column of superheated gas through the roof of the containment building. The thermal plume was visible from orbit. Emergency responders found the reactor hall had been converted into a glass-lined crater. Surrounding structures suffered severe thermal damage in a 400-meter radius. The incident has been classified as an INES Level 5 event. Congressional hearings begin next month.`
  },
  fuel_contam: {
    anim:'nukeFlash', title:'CHEMICAL EXPLOSION', subtitle:'VOLATILE CHAIN REACTION',
    color:'var(--amber)',
    narrative:`The contaminated fuel line introduced carbon particulates into the fusion chamber at a critical moment. The impurities created localized hotspots that destabilized the fuel pellet injection timing. A cascading series of micro-detonations propagated through the fuel delivery system, rupturing the tritium storage tanks. The resulting hydrogen explosion leveled the fuel processing wing and sent a tritium cloud drifting southeast. 14,000 residents were evacuated. The cleanup will take years, and the groundwater monitoring program has been extended indefinitely. You will be called to testify.`
  },
  turbine_vib: {
    anim:'empBlast', title:'MECHANICAL DISINTEGRATION', subtitle:'CENTRIFUGAL FAILURE',
    color:'var(--cyan)',
    narrative:`The harmonic resonance you ignored amplified until the primary turbine shaft exceeded its rated RPM by 340%. The first-stage turbine blades separated from the rotor at supersonic velocity, shredding the turbine housing like paper. A 200kg blade fragment penetrated the generator hall wall and embedded itself in the backup transformer, causing an electrical fire. The chain reaction of mechanical failures propagated through the steam system, rupturing two heat exchangers. The facility is structurally compromised and has been condemned. Three maintenance robots were destroyed. The insurance company is asking questions you won't enjoy answering.`
  },
  sensor_fault: {
    anim:'meltdown', title:'BLIND CASCADE', subtitle:'UNDETECTED FAILURES COMPOUND',
    color:'var(--amber)',
    narrative:`With the sensor array offline, you were flying blind. What you couldn't see was the coolant flow rate dropping, the containment field weakening, and the core temperature climbing — all simultaneously. By the time secondary indicators made the situation obvious, seven independent safety thresholds had been exceeded. The automated safety systems, receiving no sensor data, did not trigger. The reactor entered an uncontrolled state for 47 seconds before manual intervention was possible. By then, the damage was done. Partial fuel melt, containment degradation, and a significant radiological release within the building. The facility will require two years of decontamination before anyone can enter the reactor hall without a hazmat suit.`
  },
  plasma_instab: {
    anim:'implode', title:'MAGNETIC IMPLOSION', subtitle:'FIELD COLLAPSE CRUSHES CORE',
    color:'var(--magenta)',
    narrative:`The plasma instability grew beyond the confinement field's ability to compensate. In a catastrophic feedback loop, the magnetic field lines snapped inward, compressing the reactor vessel with enormous electromagnetic force. The vacuum vessel crumpled like aluminum foil. The resulting implosion created a pressure wave that shattered every window within 300 meters and knocked personnel off their feet throughout the facility. The reactor core is now a compressed mass of exotic metal alloys fused together at the molecular level. Scientists are actually quite interested in studying it, but the 200-year decommissioning timeline puts a damper on the research enthusiasm.`
  },
  grid_drift: {
    anim:'empBlast', title:'EMP BLAST', subtitle:'ELECTROMAGNETIC PULSE',
    color:'var(--cyan)',
    narrative:`The frequency mismatch between the reactor output and the power grid created a resonance cascade in the main transformer bank. The resulting energy discharge sent a massive electromagnetic pulse through the grid infrastructure. Every electronic device within a 5-kilometer radius was destroyed instantly. The regional power grid collapsed, triggering blackouts affecting 2.3 million people. Hospital backup generators survived, but traffic systems, communications, water treatment, and banking systems were knocked offline for 72 hours. The economic damage is estimated at $8.4 billion. Your name is now a verb meaning 'to catastrophically fail at a simple task.' Congratulations.`
  },
  rad_spike: {
    anim:'nukeFlash', title:'CONTAMINATION EVENT', subtitle:'RADIOLOGICAL DISASTER',
    color:'var(--green)',
    narrative:`The neutron flux exceeded the biological shielding capacity by a factor of twelve. The radiation burst lasted only 9 seconds, but it was enough to activate structural materials throughout the reactor building, turning steel beams, concrete walls, and copper wiring into radioactive sources. The facility is now emitting 50 times the allowable dose rate. A 10-kilometer exclusion zone has been established. 340 workers received doses exceeding annual limits and are undergoing medical monitoring. The site has been added to the national nuclear waste registry. Environmental monitoring stations detect elevated readings in local waterways. The decommissioning authority estimates 60 years before the site returns to background levels.`
  },
  vacuum_breach: {
    anim:'meltdown', title:'VACUUM VESSEL BREACH', subtitle:'PLASMA WALL CONTACT',
    color:'var(--red)',
    narrative:`The pressure excursion you failed to vent breached the primary vacuum boundary. Atmospheric gases flooded the reaction chamber in milliseconds, quenching the plasma in a violent thermal event. The rapid pressure equalization shattered three viewing ports and ruptured the cooling manifold along the outer wall. The resulting steam explosion tore through two equipment bays. Four maintenance drones were destroyed. The vacuum vessel requires full replacement — a 30-month procurement process. The facility license has been suspended pending a root-cause investigation that everyone already knows the answer to.`
  },
  coolant_overheat: {
    anim:'meltdown', title:'SECONDARY LOOP FAILURE', subtitle:'THERMAL RUNAWAY IN COOLING CIRCUIT',
    color:'var(--red)',
    narrative:`The secondary coolant loop reached critical temperature while you deliberated. Steam voids formed throughout the heat exchanger network, eliminating thermal transfer at the exact moment it was most needed. Core temperature climbed 400 degrees in eleven seconds. The automatic quench system fired but could not overcome the heat load without a functioning coolant circuit. The fuel pellets partially melted, fusing to the divertor assembly. Cleanup requires remote handling only. Nobody will be allowed inside this building for at least eighteen months. The post-incident report runs to 847 pages, and your name appears 23 times.`
  },
  power_surge: {
    anim:'empBlast', title:'GRID RESONANCE CASCADE', subtitle:'UNCONTROLLED POWER FEEDBACK',
    color:'var(--cyan)',
    narrative:`You left the grid synchronized while the frequency drifted into resonance. The feedback loop escalated faster than any manual intervention could halt. The main transformer bank saturated and failed catastrophically, sending a surge back into the reactor control systems. Every programmable logic controller in the facility latched into a fault state simultaneously. With no instrumentation and no control authority, the reactor operated unattended for 38 seconds before mechanical safety interlocks physically tripped the fuel supply. The resulting uncontrolled shutdown warped the vacuum vessel. The power grid bill for the surge damage is $220 million. You will be paying legal fees for longer than the reactor would have run.`
  },
  tritium_leak: {
    anim:'nukeFlash', title:'TRITIUM RELEASE', subtitle:'RADIOACTIVE FUEL BREACH',
    color:'var(--green)',
    narrative:`The tritium inventory breached containment while the ventilation system was inadequate to manage the release. 14 grams of tritium — enough to contaminate a watershed — dispersed through the facility HVAC and into the surrounding environment. The isotope's low energy makes it invisible to standard radiation surveys, which is exactly why the evacuation took eleven hours longer than it should have. Three nearby municipalities issued boil-water advisories. The NRC was notified. The IAEA was notified. Your investors were notified by the IAEA. Environmental remediation will continue for two decades. The facility's operating permit has been revoked and the site reclassified as a legacy waste disposal problem.`
  },
  mag_quench: {
    anim:'implode', title:'SUPERCONDUCTOR QUENCH', subtitle:'MAGNETIC CONFINEMENT LOST',
    color:'var(--magenta)',
    narrative:`The superconducting magnet lost its critical temperature threshold and underwent a catastrophic quench. In 0.4 seconds, twelve tonnes of liquid helium boiled off in an uncontrolled flash, producing a pressure wave equivalent to a large detonation. The magnet bore crumpled. The quench protection system had insufficient time to dump the stored energy safely, and the resulting arc discharge fused the bus bars into a single mass of copper and insulation. The plasma, robbed of confinement, contacted the vessel wall and deposited its energy in a single microsecond pulse. Investigators later noted that the backup confinement system was available but not engaged. That observation features prominently in the wrongful termination lawsuit.`
  },
  steam_hammer: {
    anim:'empBlast', title:'STEAM LINE RUPTURE', subtitle:'MECHANICAL FAILURE IN SECONDARY LOOP',
    color:'var(--cyan)',
    narrative:`The harmonic pressure cycling you ignored induced water hammer events throughout the secondary loop. Sections of steam pipe rated for 180 bar experienced repeated dynamic loads exceeding 400 bar during each hammer pulse. The third rupture severed the main feed line to the turbine hall. A wall of superheated steam at 320°C swept through the generator deck at 60 meters per second. Every surface was scoured clean. The turbine, starved of drive steam, entered an overspeed condition and shed blades through the housing. The resulting shrapnel destroyed the main electrical switchgear. The facility lost all power and has been dark ever since.`
  },
  divertor_overload: {
    anim:'nukeFlash', title:'DIVERTOR MELTDOWN', subtitle:'PLASMA EXHAUST SYSTEM FAILED',
    color:'var(--amber)',
    narrative:`The plasma exhaust load exceeded the divertor's thermal handling capacity. The tungsten tiles, rated for 10 megawatts per square meter, were receiving 47. The first tile cracked after 8 seconds. The crack propagated through the tile array in a chain reaction, exposing the underlying copper cooling channels to direct plasma contact. The copper sublimated. The impurities injected into the plasma disrupted confinement, and the resulting disruption deposited the plasma's entire stored energy into the vessel wall in a single halo current event. The vessel wall is now a monument to consequences. Metallurgists from three universities have requested samples. You have declined all interview requests.`
  },
  aux_power_fault: {
    anim:'meltdown', title:'POWER SYSTEM COLLAPSE', subtitle:'LOSS OF CONTROL AUTHORITY',
    color:'var(--red)',
    narrative:`The auxiliary power fault cascaded into a complete loss of facility electrical control. Safety systems, instrumentation, and actuators all lost power simultaneously. The reactor, now without any control signals, continued operating at its last commanded state — full throttle, no adjustments, no oversight. For 94 seconds, a fusion reaction ran without human control in a facility with no working instruments. When emergency power restored, operators found the core temperature at 11,400°C, coolant flow at zero, and containment integrity at 12%. The reactor had been 8 seconds from automatic scram when control was recovered. That 8 seconds is now the subject of a congressional safety review. The review will take four years. The facility will not reopen.`
  }
};

const EVENTS = [
  {
    id:'coolant_leak', title:'⚠ COOLANT LEAK', time:EVT_TIME_COOLANT_LEAK,
    desc:'Primary coolant pressure dropping. Micro-fracture in segment 7.',
    viz:`<div style="color:var(--cyan);text-align:center;font-size:11px">COOLANT PRESSURE<br><span style="font-size:36px;color:var(--red)">▼ DROPPING</span></div>`,
    steps:[
      { text:'AUX PUMP ON (Backup)',  check:()=>S.auxCoolPump },
      { text:'AUX LOOP ON (Backup)',  check:()=>S.auxCoolLoop },
      { text:'AUX RATE >50%',         check:()=>S.auxCoolRate>=50,  cont:true },
      { text:'LINE PURGE',            check:()=>S.corePressure<15||!S.ing }
    ]
  },
  {
    id:'mag_drift', title:'⚠ MAG COIL DRIFT', time:EVT_TIME_MAG_DRIFT,
    desc:'Harmonic resonance in confinement field.',
    viz:`<div style="color:var(--magenta);text-align:center"><span style="font-size:28px;animation:blink .3s step-end infinite">HARMONICS UNSTABLE</span></div>`,
    steps:[
      { text:'FIELD TUNE 70-80%',  check:()=>S.fieldTune>=70&&S.fieldTune<=80, cont:true },
      { text:'CONTAIN >80%',       check:()=>S.containPower>=80,               cont:true },
      { text:'CONTAIN switch ON',  check:()=>S.containField }
    ]
  },
  {
    id:'fuel_contam', title:'⚠ FUEL CONTAMINATION', time:EVT_TIME_FUEL_CONTAM,
    desc:'Impurities in deuterium feed line.',
    viz:`<div style="text-align:center"><div style="font-size:36px;color:var(--red);font-family:Share Tech Mono">${Math.floor(Math.random()*900+1200)} PPM</div><div style="font-size:9px;color:#5a5f66">MAX SAFE: 200 PPM</div></div>`,
    steps:[
      { text:'FUEL PUMPS OFF',      check:()=>!S.fuelPumps },
      { text:'FUEL INJ <10%',       check:()=>S.fuelInject<=10,               cont:true },
      { text:'MIX RATIO 30-40%',    check:()=>S.mixRatio>=30&&S.mixRatio<=40, cont:true },
      { text:'FUEL PUMPS ON',       check:()=>S.fuelPumps }
    ]
  },
  {
    id:'turbine_vib', title:'⚠ TURBINE VIBRATION', time:EVT_TIME_TURBINE_VIB,
    desc:'Dangerous harmonic vibration in turbine.',
    viz:`<div style="text-align:center;color:var(--amber)"><div style="display:flex;justify-content:center;gap:2px;margin:6px 0">${Array.from({length:24},()=>`<div style="width:5px;height:${Math.floor(Math.random()*45+8)}px;background:var(--amber);border-radius:1px"></div>`).join('')}</div><div style="font-size:9px;color:#5a5f66">847 Hz</div></div>`,
    steps:[
      { text:'THROTTLE <30%',          check:()=>S.mainThrottle<=30,                        cont:true },
      { text:'TURBINE OFF',            check:()=>!S.turbineEngage },
      { text:'PRESS RELIEF 60-80%',    check:()=>S.pressureRelief>=60&&S.pressureRelief<=80, cont:true },
      { text:'TURBINE ON',             check:()=>S.turbineEngage }
    ]
  },
  {
    id:'sensor_fault', title:'⚠ SENSOR FAULT', time:EVT_TIME_SENSOR_FAULT,
    desc:'Sensor array offline. Restart from Systems tab.',
    viz:`<div style="text-align:center;font-size:42px;color:var(--red);animation:blink .3s step-end infinite">NO SIGNAL</div>`,
    steps:[
      { text:'CHECK SYSTEMS TAB',         check:()=>document.querySelector('[data-tab="systems"]').classList.contains('active') },
      { text:'SENSOR ARRAY ONLINE?',      check:()=>S.modules.sensor.status==='online'&&S.modules.sensor.health>20 }
    ]
  },
  {
    id:'plasma_instab', title:'⚠ PLASMA INSTABILITY', time:EVT_TIME_PLASMA_INSTAB,
    desc:'Edge-localized mode. Boundary oscillating.',
    viz:`<div style="text-align:center"><div style="width:70px;height:70px;margin:0 auto;border-radius:50%;background:radial-gradient(circle,var(--cyan),transparent 70%);animation:coreGlow .3s ease-in-out infinite"></div><div style="font-size:10px;color:var(--red);margin-top:6px;animation:blink .5s step-end infinite">UNSTABLE</div></div>`,
    steps:[
      { text:'FIELD TUNE 80-95%',  check:()=>S.fieldTune>=80&&S.fieldTune<=95, cont:true },
      { text:'CONTAIN >90%',       check:()=>S.containPower>=90,               cont:true },
      { text:'FIELD A ON (Backup)',check:()=>S.backupContA },
      { text:'FIELD B ON (Backup)',check:()=>S.backupContB },
      { text:'FIELD >50% (Backup)',check:()=>S.backupContPow>=50,              cont:true }
    ]
  },
  {
    id:'grid_drift', title:'⚠ GRID FREQ DRIFT', time:EVT_TIME_GRID_DRIFT,
    desc:'60Hz sync lost.',
    viz:`<div style="text-align:center;color:var(--amber)"><div style="font-size:32px;font-family:Share Tech Mono">${(57+Math.random()*6).toFixed(1)} Hz</div><div style="font-size:9px;color:var(--red)">TARGET: 60.0</div></div>`,
    steps:[
      { text:'GRID SYNC OFF',      check:()=>!S.gridSync },
      { text:'THROTTLE 40-60%',    check:()=>S.mainThrottle>=40&&S.mainThrottle<=60, cont:true },
      { text:'GRID SYNC ON',       check:()=>S.gridSync }
    ]
  },
  {
    id:'rad_spike', title:'☢ RADIATION SPIKE', time:EVT_TIME_RAD_SPIKE,
    desc:'Neutron flux exceeding shielding.',
    viz:`<div style="text-align:center"><div style="font-size:56px;animation:blink .4s step-end infinite">☢</div><div style="color:var(--red);font-size:13px;letter-spacing:2px">ALERT</div></div>`,
    steps:[
      { text:'RAD SHIELD ON',    check:()=>S.radShield },
      { text:'FIELD A ON (Backup)',   check:()=>S.backupContA },
      { text:'FIELD A ON (Backup)',   check:()=>S.backupContB },
      { text:'THROTTLE <20%',    check:()=>S.mainThrottle<=20, cont:true },
      { text:'ROD A >50% (Backup)',       check:()=>S.rodA>=50,  cont:true },
      { text:'ROD B >50% (Backup)',       check:()=>S.rodB>=50,  cont:true },
      { text:'ROD C >50% (Backup)',       check:()=>S.rodC>=50,  cont:true }
    ]
  },
  {
    id:'vacuum_breach', title:'⚠ VACUUM BREACH', time:EVT_TIME_VACUUM_BREACH,
    desc:'Primary vacuum boundary compromised. Pressure rising in vessel.',
    viz:`<div style="text-align:center;color:var(--red)"><div style="font-size:13px;letter-spacing:2px;margin-bottom:6px">VESSEL PRESSURE</div><div style="font-size:40px;font-family:Share Tech Mono;animation:blink .4s step-end infinite">${(1.8+Math.random()*2.2).toFixed(2)} mbar</div><div style="font-size:9px;color:#5a5f66">NOMINAL: &lt;0.001 mbar</div></div>`,
    steps:[
      { text:'VENT SYSTEM ON',         check:()=>S.ventSystem },
      { text:'THROTTLE <25%',          check:()=>S.mainThrottle<=25,  cont:true },
      { text:'PRESS RELIEF >70%',      check:()=>S.pressureRelief>=70, cont:true },
      { text:'FUEL INJ <15%',          check:()=>S.fuelInject<=15,     cont:true }
    ]
  },
  {
    id:'coolant_overheat', title:'⚠ COOLANT OVERHEAT', time:EVT_TIME_COOLANT_OVERHEAT,
    desc:'Secondary coolant loop temperature critical. Heat exchanger at limit.',
    viz:`<div style="text-align:center"><div style="font-size:11px;color:var(--amber);margin-bottom:4px">SECONDARY LOOP TEMP</div><div style="font-size:44px;font-family:Share Tech Mono;color:var(--red)">${Math.floor(Math.random()*80+310)}°C</div><div style="font-size:9px;color:#5a5f66">MAX SAFE: 280°C</div></div>`,
    steps:[
      { text:'AUX PUMP ON (Backup)',   check:()=>S.auxCoolPump },
      { text:'AUX LOOP ON (Backup)',   check:()=>S.auxCoolLoop },
      { text:'AUX RATE >70%',         check:()=>S.auxCoolRate>=70, cont:true },
      { text:'COOLANT FLOW >70%',     check:()=>S.coolantFlow>=70, cont:true }
    ]
  },
  {
    id:'power_surge', title:'⚠ GRID POWER SURGE', time:EVT_TIME_POWER_SURGE,
    desc:'Output frequency drifting. Resonance detected in transformer bank.',
    viz:`<div style="text-align:center;color:var(--amber)"><div style="font-size:32px;font-family:Share Tech Mono">${(61.5+Math.random()*4).toFixed(1)} Hz</div><div style="font-size:9px;color:var(--red)">RESONANCE THRESHOLD: 63.0 Hz</div><div style="font-size:10px;margin-top:6px;animation:blink .3s step-end infinite">TRANSFORMER OVERLOAD</div></div>`,
    steps:[
      { text:'GRID SYNC OFF',          check:()=>!S.gridSync },
      { text:'THROTTLE 40-60%',        check:()=>S.mainThrottle>=40&&S.mainThrottle<=60, cont:true },
      { text:'GRID SYNC ON',           check:()=>S.gridSync }
    ]
  },
  {
    id:'tritium_leak', title:'☢ TRITIUM LEAK', time:EVT_TIME_TRITIUM_LEAK,
    desc:'Radioactive fuel detected in secondary circuit. Isolate and vent.',
    viz:`<div style="text-align:center"><div style="font-size:42px;animation:blink .5s step-end infinite">☢</div><div style="color:var(--green);font-size:11px;letter-spacing:2px;margin-top:4px">TRITIUM DETECTED</div><div style="font-size:9px;color:#5a5f66;margin-top:3px">${(0.3+Math.random()*2.7).toFixed(2)} GBq/m³ — LIMIT: 0.1</div></div>`,
    steps:[
      { text:'FUEL PUMPS OFF',         check:()=>!S.fuelPumps },
      { text:'RAD SHIELD ON',          check:()=>S.radShield },
      { text:'VENT SYSTEM ON',         check:()=>S.ventSystem },
      { text:'EMERG VENT ON',          check:()=>S.emergVent },
      { text:'FUEL PUMPS ON',          check:()=>S.fuelPumps }
    ]
  },
  {
    id:'mag_quench', title:'⚠ MAGNET QUENCH', time:EVT_TIME_MAG_QUENCH,
    desc:'Superconducting coils losing critical temp. Quench imminent.',
    viz:`<div style="text-align:center"><div style="font-size:11px;color:var(--magenta);margin-bottom:4px;letter-spacing:2px">COIL TEMP</div><div style="font-size:40px;font-family:Share Tech Mono;color:var(--red);animation:blink .4s step-end infinite">${(4.6+Math.random()*1.8).toFixed(1)} K</div><div style="font-size:9px;color:#5a5f66">CRITICAL THRESHOLD: 4.2 K</div></div>`,
    steps:[
      { text:'CONTAIN PWR <20%',       check:()=>S.containPower<=20,  cont:true },
      { text:'MAG COILS OFF',          check:()=>!S.magCoils },
      { text:'FIELD A ON (Backup)',    check:()=>S.backupContA },
      { text:'FIELD B ON (Backup)',    check:()=>S.backupContB },
      { text:'BACKUP FIELD >60%',      check:()=>S.backupContPow>=60, cont:true },
      { text:'MAG COILS ON',           check:()=>S.magCoils }
    ]
  },
  {
    id:'steam_hammer', title:'⚠ STEAM HAMMER', time:EVT_TIME_STEAM_HAMMER,
    desc:'Water hammer detected in secondary loop. Pipe stress critical.',
    viz:`<div style="text-align:center;color:var(--amber)"><div style="display:flex;justify-content:center;gap:3px;margin:4px 0">${Array.from({length:18},(_,i)=>`<div style="width:6px;height:${20+Math.abs(Math.sin(i*1.3)*40)}px;background:var(--cyan);border-radius:1px;margin-top:${40-Math.abs(Math.sin(i*1.3)*40)}px"></div>`).join('')}</div><div style="font-size:9px;color:var(--red);margin-top:4px;animation:blink .3s step-end infinite">PIPE STRESS ${Math.floor(Math.random()*120+280)}%</div></div>`,
    steps:[
      { text:'TURBINE OFF',            check:()=>!S.turbineEngage },
      { text:'PRESS RELIEF 50-70%',    check:()=>S.pressureRelief>=50&&S.pressureRelief<=70, cont:true },
      { text:'COOLANT FLOW <30%',      check:()=>S.coolantFlow<=30,                           cont:true },
      { text:'TURBINE ON',             check:()=>S.turbineEngage }
    ]
  },
  {
    id:'divertor_overload', title:'⚠ DIVERTOR OVERLOAD', time:EVT_TIME_DIVERTOR_OVERLOAD,
    desc:'Plasma exhaust load exceeding tile thermal limit. Divertor at risk.',
    viz:`<div style="text-align:center"><div style="font-size:11px;color:var(--amber);margin-bottom:4px">EXHAUST HEAT FLUX</div><div style="font-size:38px;font-family:Share Tech Mono;color:var(--red)">${(10.2+Math.random()*8).toFixed(1)} MW/m²</div><div style="font-size:9px;color:#5a5f66">TILE LIMIT: 10.0 MW/m²</div></div>`,
    steps:[
      { text:'THROTTLE <35%',          check:()=>S.mainThrottle<=35, cont:true },
      { text:'ROD SAFETY OFF (Backup)',check:()=>S.rodSafetyOff },
      { text:'ROD A >40% (Backup)',    check:()=>S.rodA>=40,         cont:true },
      { text:'ROD B >40% (Backup)',    check:()=>S.rodB>=40,         cont:true },
      { text:'ROD C >40% (Backup)',    check:()=>S.rodC>=40,         cont:true }
    ]
  },
  {
    id:'aux_power_fault', title:'⚠ AUX POWER FAULT', time:EVT_TIME_AUX_POWER_FAULT,
    desc:'Auxiliary bus voltage collapse. Control systems losing power.',
    viz:`<div style="text-align:center;color:var(--red)"><div style="font-size:13px;letter-spacing:3px;margin-bottom:6px">BUS VOLTAGE</div><div style="font-size:48px;font-family:Share Tech Mono;animation:blink .3s step-end infinite">${(180+Math.random()*40).toFixed(0)}V</div><div style="font-size:9px;color:#5a5f66">NOMINAL: 480V</div></div>`,
    steps:[
      { text:'BACKUP GEN ON',          check:()=>S.backupGen },
      { text:'AUX POWER OFF',          check:()=>!S.auxPower },
      { text:'AUX POWER ON',           check:()=>S.auxPower },
      { text:'AUX COOL PUMP ON',       check:()=>S.auxCoolPump }
    ]
  }
];

nextEventTime = EVT_FIRST_DELAY_MIN + Math.random() * EVT_FIRST_DELAY_RANGE;
