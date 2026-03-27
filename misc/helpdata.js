// helpdata.js - HELP TEXT DATA
// Load order: before help.js
// Contains: all help description objects (HELP_CTRL, HELP_LEVER,
//           HELP_KNOB, HELP_GAUGE, HELP_BIGBTN, HELP_SCRAM,
//           HELP_SYS_BTN, HELP_BULK_BTN)

// Descriptions: switches
// First element = title (amber). Rest = effect lines (cyan, -> prefix).
// Prefix G: = desirable effect (green). R: = undesirable (red). No prefix = neutral (cyan).
const HELP_CTRL = {
  auxPower:      ['AUX POWER',       'Enables auxiliary power to all reactor systems', 'Required before any other systems can be activated'],
  radShield:     ['RAD SHIELDING',   'G:- radiation level (significant)', 'Prevents ambient neutron leakage through the hull'],
  fuelPumps:     ['FUEL PUMPS',      'Pressurizes fuel delivery lines to the injector', 'Required for any fuel flow to the core'],
  coolantPumps:  ['COOLANT PUMPS',   'G:- core temperature (significant)', 'G:- core pressure (moderate)', 'G:- coolant temperature'],
  magCoils:      ['MAG COILS',       'G:+ magnetic flux when containment power is set', 'Required for plasma confinement field generation'],
  containField:  ['CONTAINMENT FLD', 'G:+ plasma stability (moderate)', 'Active field reinforcement on top of coil flux'],
  ignPrime:      ['IGN PRIME',       'Arms the ignition sequence', 'Required before hold-ignition can start plasma'],
  turbineEngage: ['TURBINE ENGAGE',  'Connects plasma heat to the turbine generator', 'Required for any power output'],
  gridSync:      ['GRID SYNC',       'G:+ grid load when turbine is spinning', 'Required for electricity delivery to the grid'],
  ventSystem:    ['VENT SYSTEM',     'G:+ power output efficiency (slight)'],
  backupGen:     ['BACKUP GEN',      'G:+ power output (slight)'],
  auxCoolPump:   ['AUX COOL PUMP',   'Enables the auxiliary coolant pump', 'Required for the backup cooling loop to operate'],
  auxCoolLoop:   ['AUX COOL LOOP',   'G:- core temperature (moderate)', 'G:- aux coolant temperature', 'Requires aux pump to be on'],
  backupContA:   ['BACKUP FIELD A',  'G:+ backup field strength', 'G:+ plasma stability', 'G:+ containment integrity regen'],
  backupContB:   ['BACKUP FIELD B',  'G:+ backup field strength', 'G:+ plasma stability', 'G:+ containment integrity regen'],
  emergVent:     ['EMERG VENT',      'G:- core temperature (significant)', 'G:- core pressure (significant)'],
  emergDump:     ['FUEL DUMP',       'R:Drains fuel reserves rapidly', 'Reduces heat generation at the cost of all fuel'],
  rodSafetyOff:  ['ROD SAFETY',      'Engages the control rod safety interlock (ON by default)', 'Turn OFF to unlock rod insertion sliders - turning back ON resets all rods to 0%'],

  // Ignition panel push buttons
  ignBtn:  ['IGNITE',    'Hold continuously for 3 seconds to fire plasma ignition', 'Requires IGN PRIME and AUX POWER to be active'],
  testBtn: ['LAMP TEST', 'Flashes all warning indicators amber for one second', 'Confirms every warning light in the system is functional'],
  purgeBtn:['LINE PURGE','G:- core pressure (significant)', 'Vents the fuel delivery lines to relieve pressure buildup'],
};

// Descriptions: levers
const HELP_LEVER = {
  mainThrottle:  ['MAIN THROTTLE',   'G:+ power output (significant)', 'R:+ core temperature', 'R:+ core pressure', 'G:+ turbine RPM'],
  fuelInject:    ['FUEL INJECTION',  'R:+ core temperature (significant)', 'R:+ core pressure (moderate)', 'G:+ plasma stability', 'G:+ power output', 'R:+ fuel consumption rate'],
  coolantFlow:   ['COOLANT FLOW',    'G:- core temperature (significant)', 'G:- core pressure (moderate)', 'G:- coolant temperature'],
  containPower:  ['CONTAIN POWER',   'G:+ magnetic flux', 'G:+ plasma stability', 'G:+ containment integrity regen when above threshold', 'R:- plasma stability and integrity if set too low'],
  auxCoolRate:   ['AUX COOL RATE',   'G:- core temperature (moderate)', 'G:- aux coolant temperature', 'G:+ aux coolant flow'],
  backupContPow: ['BACKUP FIELD PWR','G:+ backup field strength', 'G:+ plasma stability', 'G:+ containment integrity regen', 'G:+ secondary pressure'],
  rodA:          ['CONTROL ROD A',   'G:- core temperature (significant)', 'G:- neutron density', 'R:- plasma stability', 'R:- power output'],
  rodB:          ['CONTROL ROD B',   'G:- core temperature (significant)', 'G:- neutron density', 'R:- plasma stability', 'R:- power output'],
  rodC:          ['CONTROL ROD C',   'G:- core temperature (significant)', 'G:- neutron density', 'R:- plasma stability', 'R:- power output'],
};

// Descriptions: knobs
const HELP_KNOB = {
  pressureRelief: ['PRESSURE RELIEF', 'G:- core pressure (moderate)', 'No direct effect on temperature or plasma'],
  mixRatio:       ['MIX RATIO',        'R:+ core temperature (slight)', 'Adjusts fuel-plasma mixture for heat efficiency'],
  fieldTune:      ['FIELD TUNE',       'G:+ magnetic flux efficiency', 'G:+ plasma stability', 'Fine-tunes the confinement field geometry'],
};

// Descriptions: gauges / readouts
// Format: ['GAUGE NAME', 'One sentence description.']
const HELP_GAUGE = {
  coreTemp:         ['CORE TEMP',         'Temperature of the reaction plasma - high values degrade containment integrity and destabilize plasma confinement.'],
  corePressure:     ['CORE PRESSURE',     'Internal pressure of the reaction chamber - excess pressure risks vessel breach and disrupts plasma stability.'],
  plasmaStability:  ['PLASMA STABILITY',  'How well the plasma is confined - low stability leads to loss of ignition, containment failure, or reactor damage.'],
  neutronDensity:   ['NEUTRON DENSITY',   'Density of neutrons produced by the reaction - indicates fusion intensity and is the primary source of radiation output.'],
  coolantTemp:      ['COOLANT TEMP',      'Temperature of the primary coolant circuit - overheating reduces cooling effectiveness and risks thermal damage to the loop.'],
  coolantFlowRate:  ['COOLANT FLOW',      'Volume of coolant moving through the primary loop per minute - insufficient flow allows core heat to build unchecked.'],
  turbineRPM:       ['TURBINE RPM',       'Rotation speed of the turbine generator - drives all electrical power output; excessive speed risks mechanical disintegration.'],
  containIntegrity: ['CONTAIN INTEGRITY', 'Structural health of the magnetic containment field - loss at critical levels allows plasma contact with vessel walls.'],
  magneticFlux:     ['MAGNETIC FLUX',     'Strength of the active magnetic confinement field - directly determines plasma stability and how well the plasma is held.'],
  radiationLevel:   ['RADIATION',         'Radiation escaping the reactor - elevated by high neutron flux, disabled shielding, or degraded containment integrity.'],
  auxCoolTemp:      ['AUX COOL TEMP',     'Temperature of the backup cooling circuit - indicates the heat load being handled by secondary cooling systems.'],
  auxCoolFlow:      ['AUX COOL FLOW',     'Flow rate through the auxiliary cooling loop - provides supplemental heat removal when primary cooling is under stress.'],
  backupFieldStr:   ['BACKUP FIELD STR',  'Strength of the backup magnetic containment field - supplements the main field and contributes to containment integrity recovery.'],
  secondaryPressure:['SECONDARY PRES',    'Pressure in the secondary containment circuit - driven by core pressure levels and backup field power settings.'],
  rodPosition:      ['ROD INSERTION',     'Average insertion depth of all control rods - rods absorb neutrons to reduce core heat, neutron density, and power output.'],
  heatSinkTemp:     ['HEAT SINK TEMP',    'Temperature of the primary thermal heat sink - reflects the overall heat load being rejected from the cooling system.'],
  fuelRemaining:    ['FUEL REMAINING',    'Current fuel reserve level - depleting fully shuts off plasma ignition and brings the reactor to a halt.'],
  fuelConsump:      ['FUEL CONSUMPTION',  'Rate at which fuel is being consumed - rises with injection rate and reactor load.'],
  netOutput:        ['NET OUTPUT (MW)',    'Total electrical power being generated - the primary measure of reactor performance and scoring.'],
};

// Descriptions: emergency push buttons
const HELP_BIGBTN = {
  'PLASMA DUMP': ['PLASMA DUMP',  'G:- core temperature (significant)', 'Immediately terminates plasma ignition'],
  'COOL FLOOD':  ['COOL FLOOD',   'Maximizes all primary and backup coolant systems instantly', 'G:- core temperature (significant)'],
  'HARD RESET':  ['HARD RESET',   'Takes all modules offline briefly and clears system errors', 'Zeros all controls and resets lever positions'],
};

// Descriptions: SCRAM button
const HELP_SCRAM = ['SCRAM', 'Emergency reactor shutdown - kills all main switches, zeros all controls, and locks out the main panel for several seconds.'];

// Descriptions: systems tab per-module buttons
const HELP_SYS_BTN = {
  modeNormal:    ['MODE: NORMAL',    'Standard operating mode', '+ balanced performance', '+ normal health drain rate'],
  modeOverclock: ['MODE: OVERCLOCK', 'G:+ performance by 50%', 'R:- tripled health drain rate', 'R:- adds significant heat to the core'],
  modeEco:       ['MODE: ECO',       'R:- performance reduced to 60%', 'G:+ very slow health drain', 'G:+ slight reduction in core heat'],
  modeBypass:    ['MODE: BYPASS',    'G:+ runs at 90% performance with no self-drain', 'R:- redirects all stress to backup systems instead'],
  restart:       ['RESTART',         'Takes the module fully offline to clear all system errors', 'Module is unavailable for several seconds during restart'],
  power:         ['POWER ON / OFF',  'Toggles the module offline or online without affecting health', 'Module is unavailable while transitioning'],
  diagnose:      ['DIAGNOSE',        'Runs a scan to reveal any hidden system errors', 'Takes a few seconds - only one module can be diagnosed at a time'],
  repair:        ['REPAIR',          'Gradually restores module health over time', 'Offline modules repair significantly faster than online ones'],
};

// Descriptions: systems tab bulk control buttons
const HELP_BULK_BTN = {
  powerAll:     ['POWER ALL ON / OFF', 'Toggles all modules online or offline simultaneously', 'Useful for a full system power cycle'],
  restartAll:   ['RESTART ALL',        'Restarts all modules at once', 'Clears all system errors across every module simultaneously'],
  allNormal:    ['ALL NORMAL',         'Sets all compatible modules to Normal mode at once'],
  allOverclock: ['ALL OVERCLOCK',      'Sets all compatible modules to Overclock mode at once', 'R:- significantly accelerates health drain across the board'],
  allEco:       ['ALL ECO',            'Sets all compatible modules to Eco mode at once', 'G:+ significantly slows health drain across the board'],
  allBypass:    ['ALL BYPASS',         'Sets all compatible modules to Bypass mode at once', 'R:- concentrates all stress onto backup systems'],
};
