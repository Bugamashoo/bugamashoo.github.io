// helpdata.js - HELP TEXT DATA
// Load order: before help.js
// Contains: all help description objects (HELP_CTRL, HELP_LEVER,
//           HELP_KNOB, HELP_GAUGE, HELP_BIGBTN, HELP_SCRAM,
//           HELP_SYS_BTN, HELP_BULK_BTN)

// Descriptions: switches
// First element = title (amber). Rest = effect lines (cyan, -> prefix).
// Prefix G: = desirable effect (green). R: = undesirable (red). No prefix = neutral (cyan).
const HELP_CTRL = {
  auxPower:         ['AUX POWER',           'Enables power to all reactor control systems', 'Required to power controls and gauges'],
  radShield:        ['RAD SHIELDING',       'G:- Radiation', 'Blocks most radiation leakage through the hull'],
  fuelPumps:        ['FUEL PUMPS',          'Controls power to fuel pumping systems', 'Required for any fuel flow to the core'],
  coolantPumps:     ['COOLANT PUMPS',       'Controls power to coolant pumping systems', 'Required for any coolant flow to the core'],
  magCoils:         ['MAG COILS',           'G:+ Magnetic flux', 'Required for plasma confinement field generation'],
  containField:     ['CONTAINMENT FLD',     'G:+ Plasma stability', 'G:+ Power output'],
  ignPrime:         ['IGN PRIME',           'Arms the ignition', 'Required before hold-ignition can start reactor'],
  turbineEngage:    ['TURBINE ENGAGE',      'Connects heat to the turbine for power', 'Required for any power output or money generation'],
  gridSync:         ['GRID SYNC',           'Connects reactor to power grid', 'Required for electricity delivery and money generation'],
  ventSystem:       ['VENT SYSTEM',         'G:+ Power output'],
  backupGen:        ['BACKUP GEN',          'G:+ Power output', 'R:- Fuel', 'R:- Backup system health'],
  auxCoolPump:      ['AUX COOL PUMP',       'G:- Core temp (when aux loop is enabled)', 'R:- Backup system health (when aux loop is enabled)', 'Required for the backup cooling system to operate'],
  auxCoolLoop:      ['AUX COOL LOOP',       'G:- Core temp (when aux pump is enabled)', 'R:- Backup system health (when aux pump is enabled)', 'Required for the backup cooling system to operate'],
  backupContA:      ['BACKUP FIELD A',      'G:+ Power output', 'G:+ Containment', 'G:+ Plasma stability', 'R:- Backup system health'],
  backupContB:      ['BACKUP FIELD B',      'G:+ Power output', 'G:+ Containment', 'G:+ Plasma stability', 'R:- Backup system health'],
  emergVent:        ['EMERG VENT',          'G:- Core temp', 'G:- Core pressure', 'R:- Backup system health'],
  emergDump:        ['FUEL DUMP',           'R:- Fuel (significant)', 'Required to resolve some events'],
  rodSafetyOff:     ['ROD SAFETY',          'Retracts all rods to 0% and locks the sliders', 'OFF unlocks control rod insertion controls'],
  turbineLimiter:   ['TURBINE LIMITER',     'Caps turbine RPM just below the current warning threshold (~84% of safe max)', 'R:- Max power output when active', 'Prevents turbine overspeed and protects the grid module from RPM damage', 'Upgrade Turbine Speed in STORE to raise the safe limit and unlock higher output', 'Turn OFF to remove the RPM cap and allow full turbine speed'],

  // Ignition panel push buttons
  ignBtn:           ['IGNITE',              'Hold continuously for 3 seconds to fire plasma ignition', 'Requires IGN PRIME and AUX POWER to be active', 'Ensure sufficient fuel flow to start'],
  testBtn:          ['LAMP TEST',           'Flashes all warning indicators orange, then red, for one second each', 'Confirms every warning light in the system is functional'],
  purgeBtn:         ['LINE PURGE',          'G:- Core pressure', 'Vents the fuel delivery lines to relieve pressure buildup', 'Temporarily drops core pressure'],
};

// Descriptions: levers
const HELP_LEVER = {
  mainThrottle:     ['MAIN THROTTLE',       'G:+ Power output', 'R:+ Core temp', 'R:+ Core pressure'],
  fuelInject:       ['FUEL INJECTION',      'G:+ Power output', 'G:+ Plasma stability', 'R:- Fuel', 'R:+ Core temp', 'R:+ Radiation'],
  coolantFlow:      ['COOLANT FLOW',        'G:- Core temp', 'G:- Core pressure', 'G:- Coolant temp'],
  containPower:     ['CONTAIN POWER',       'G:+ Containment', 'G:+ Plasma stability', 'G:+ Magnetic flux'],
  auxCoolRate:      ['AUX COOL RATE',       'G:- Core temp', 'G:- Aux coolant temp', 'G:+ Aux coolant flow', 'R:- Backup system health', 'Requires aux loop and aux pump to be enabled'],
  backupContPow:    ['BACKUP FIELD PWR',    'G:+ Power output', 'G:+ Containment', 'G:+ Plasma stability', 'R:- Backup system health', 'Requires aux field A or B to be enabled'],
  rodA:             ['CONTROL ROD A',       'G:- Core temp', 'G:- Core pressure', 'R:- Power output', 'R:- Plasma stability'],
  rodB:             ['CONTROL ROD B',       'G:- Core temp', 'G:- Core pressure', 'R:- Power output', 'R:- Plasma stability'],
  rodC:             ['CONTROL ROD C',       'G:- Core temp', 'G:- Core pressure', 'R:- Power output', 'R:- Plasma stability'],
};

// Descriptions: knobs
const HELP_KNOB = {
  pressureRelief:   ['PRESSURE RELIEF',     'G:- Core pressure'],
  mixRatio:         ['MIX RATIO',           'G:+ Power output', 'R:+ Core temp', 'Adjusts fuel-plasma mixture'],
  fieldTune:        ['FIELD TUNE',          'G:+ Power output', 'G:+ Plasma stability', 'R:+ Radiation'],
};

// Descriptions: gauges / readouts
// Format: ['GAUGE NAME', 'One sentence description.']
const HELP_GAUGE = {
  coreTemp:         ['CORE TEMP',           'Temperature of the reaction plasma - high values degrade containment integrity and destabilize plasma confinement.'],
  corePressure:     ['CORE PRESSURE',       'Internal pressure of the reaction chamber - excess pressure risks vessel breach and disrupts plasma stability.'],
  plasmaStability:  ['PLASMA STABILITY',    'How well the plasma is confined - low stability leads to loss of ignition, containment failure, or reactor damage.'],
  neutronDensity:   ['NEUTRON DENSITY',     'Density of neutrons produced by the reaction - indicates fusion intensity and is the primary source of radiation output.'],
  coolantTemp:      ['COOLANT TEMP',        'Temperature of the primary coolant loop - overheating reduces cooling effectiveness and risks thermal damage.'],
  coolantFlowRate:  ['COOLANT FLOW',        'Volume of coolant moving through the primary loop per minute - insufficient flow allows core heat to build unchecked.'],
  turbineRPM:       ['TURBINE RPM',         'Rotation speed of the turbine generator - drives all electrical power output and money generation; excessive speed risks major system damage.'],
  containIntegrity: ['CONTAIN INTEGRITY',   'Structural health of the magnetic containment field - loss at critical levels allows plasma contact with vessel walls.'],
  magneticFlux:     ['MAGNETIC FLUX',       'Strength of the active magnetic containment field - directly determines plasma stability and how well the plasma is held.'],
  radiationLevel:   ['RADIATION',           'Radiation escaping the reactor - elevated by high neutron flux, disabled shielding, or degraded containment integrity.'],
  auxCoolTemp:      ['AUX COOL TEMP',       'Temperature of the backup cooling circuit - indicates the heat load being handled by secondary cooling systems.'],
  auxCoolFlow:      ['AUX COOL FLOW',       'Flow rate through the auxiliary cooling loop - provides supplemental heat removal when primary cooling is under stress.'],
  backupFieldStr:   ['BACKUP FIELD STR',    'Strength of the backup magnetic containment field - supplements the main field and contributes to containment integrity recovery.'],
  secondaryPressure:['SECONDARY PRES',      'Pressure in the secondary containment circuit - driven by core pressure levels and backup field power settings.'],
  rodPosition:      ['ROD INSERTION',       'Average insertion depth of all control rods - control rods slow the chemical reaction, reducing core heat, neutron density, and power output.'],
  heatSinkTemp:     ['HEAT SINK TEMP',      'Temperature of the primary thermal heat sink - reflects the overall heat load being rejected from the cooling system.'],
  fuelRemaining:    ['FUEL REMAINING',      'Current fuel reserve level - depleting fully shuts off plasma ignition and brings the reactor to a halt. Refueling costs money from the STORE tab.'],
  fuelConsump:      ['FUEL CONSUMPTION',    'Rate at which fuel is being consumed - rises with injection rate. Higher consumption means more money spent on refueling.'],
  netOutput:        ['NET OUTPUT (MW)',     'Total electrical power being generated - directly determines money earned per second. Higher output earns money faster.'],
};

// Descriptions: emergency push buttons
const HELP_BIGBTN = {
  'PLASMA DUMP':    ['PLASMA DUMP',         'Immediately kills the reaction, extinguishing the core and shutting down the reactor'],
  'COOL FLOOD':     ['COOL FLOOD',          'Maximizes all primary and auxiliary coolant systems immediately; useful in scenarios where core heat is critical'],
  'HARD RESET':     ['HARD RESET',          'Shuts everything down and takes all modules offline, restoring broken systems to a minimum of 60% health, clearing all system errors in the process', 'Zeros all controls and resets lever positions', 'Use as a last resort to recover heavily damaged systems without spending money on repairs'],
};

// Descriptions: SCRAM button
const HELP_SCRAM =  ['SCRAM',               'Immediate reactor shutdown', 'Kills all main switches and zeros all controls', 'Technically for emergencies only, but useful as a way to easily turn off the reactor if a break from the action is needed'];

// Descriptions: systems tab per-module buttons
const HELP_SYS_BTN = {
  modeNormal:       ['MODE: NORMAL',        'Standard operating mode'],
  modeOverclock:    ['MODE: OVERCLOCK',     'G:+ 50% efficiency', 'R:+ 200% damage rate', 'R:+ Core temp'],
  modeEco:          ['MODE: ECO',           'G:- 40% damage rate', 'G:- Core temp', 'R:- 40% efficiency'],
  modeBypass:       ['MODE: BYPASS',        'G:- 100% damage rate', 'G:+ 200% repair speed', 'R:+ 300% backup system damage rate', 'BYPASS only works when backup systems are functional'],
  restart:          ['RESTART',             'Disables a module for a few seconds, fixing all errors in the process'],
  power:            ['POWER ON / OFF',      'Toggles the module offline or online', 'Offline modules disable their respective systems while off'],
  diagnose:         ['DIAGNOSE',            'Scans to reveal system errors', 'Only one module can be diagnosed at a time'],
  repair:           ['REPAIR',              'G:+ Module health', 'R:- Money', 'Offline and bypassed modules repair significantly faster than online ones'],
};

// Descriptions: resupply tab elements
const HELP_RESUPPLY = {
  buyFuel:       ['BUY FUEL',               'G:+ Fuel', 'Purchase fuel at the current market price', 'Price fluctuates between +/-50% normally, with rare spikes or drops'],
  sellFuel:      ['SELL FUEL',              'R:- Fuel', 'Sell spare fuel at 75% of current buy price'],
  fuelPrice:     ['FUEL MARKET PRICE',      'Current cost per kg of fuel', 'Fluctuates in price following first purchase'],
  upgHealth:     ['MAX HEALTH UPGRADE',     'G:+ Module max health', 'Allows module to survive longer between maintenance'],
  upgEfficiency: ['EFFICIENCY UPGRADE',     'G:+ Module performance', 'Boosts effective output regardless of system error state - T1/T2/T3 give +10%/+25%/+50% total'],
  upgDrain:      ['DURABILITY UPGRADE',     'G:- Module damage', 'Damage to module accumulates more slowly'],
  upgRepair:     ['REPAIR SPEED UPGRADE',   'G:+ Repair speed / cost', 'Increases repair rate and proportionally scales repair cost per tick'],
  itemFuel:      ['EMERGENCY FUEL',         'N/A'],
  itemRepair:    ['QUICK REPAIR KIT',       'G:+ 30HP', 'Select target module after purchase'],
  itemDiag:      ['DIAGNOSTIC SWEEP',       'Reveals all hidden system errors simultaneously', 'Saves time vs diagnosing each module individually'],
  itemOC:        ['OVERCLOCK BOOST',        'N/A'],
  itemContain:   ['CONTAINMENT PATCH',      'G:+ 25% containment', 'Use during containment emergencies to prevent reactor failure'],
  itemEvent:     ['EVENT EXTENDER',         'G:+ 30 seconds to current event', 'Provides extra valuable seconds to resolve an emergency', 'Only available while an event is active'],
};

// Descriptions: money header
const HELP_MONEY = ['FUNDS', 'Current available money earned from power output', 'Spend on fuel, repairs, upgrades, and items in the STORE tab'];

// Descriptions: systems tab bulk control buttons
const HELP_BULK_BTN = {
  powerAll:     ['POWER ALL ON / OFF',      'Toggles all modules online or offline simultaneously', 'Useful for a full system power cycle, clearing all errors in the process'],
  restartAll:   ['RESTART ALL',             'Restarts all modules at once', 'Clears all system errors across every module simultaneously', 'All systems will be temporarily offline'],
  diagAllBtn:   ['DIAG ALL',                'Diagnoses all modules in sequence, one by one', 'Reveals hidden system errors across every module', 'Purchase the DIAG SPEED upgrade in the Store to reduce sweep time'],
  allNormal:    ['ALL NORMAL',              'Restores all compatible modules to Normal mode simultaneously'],
  allOverclock: ['ALL OVERCLOCK',           'G:+ 50% efficiency', 'R:+ 200% damage rate', 'R:+ Core temp', 'Sets all compatible modules to Overclock mode at once'],
  allEco:       ['ALL ECO',                 'G:- 40% damage rate', 'G:- Core temp', 'R:- 40% efficiency', 'Sets all compatible modules to Eco mode at once'],
  allBypass:    ['ALL BYPASS',              'R:+ 1500% Backup system damage rate', 'Sets all compatible modules to Bypass mode at once, pushing the backup system to its limits'],
};

// Descriptions: startup sequence steps (indexed 0–12, matches SEQUENCE[])
const HELP_SEQ = [
  ['AUX POWER ON',    'Enables power to all reactor control systems — must be the first step', 'Turns on all instrumentation and control interfaces'],
  ['RAD SHIELDING',   'Activates radiation shielding around the reactor hull', 'Reduces radiation leakage during startup and operation'],
  ['FUEL PUMPS',      'Powers the fuel delivery pumps to enable fuel flow to the core', 'Required before fuel injection has any effect'],
  ['COOLANT PUMPS',   'Powers the primary coolant loop pumps', 'Required for any coolant flow to the reactor core'],
  ['COOLANT >60%',    'Set the COOLANT FLOW lever above 60% before continuing', 'Ensures adequate cooling capacity is ready before plasma ignition'],
  ['MAG COILS',       'Energises the magnetic coil array for plasma confinement', 'Required for generating any containment magnetic field'],
  ['CONTAIN >60%',    'Set the CONTAIN POWER lever above 60%', 'Builds minimum magnetic field strength before attempting ignition'],
  ['FUEL INJ >10%',   'Set the FUEL INJECTION lever above 10%', 'Ensures sufficient fuel flow to sustain ignition'],
  ['IGN PRIME',       'Flips the ignition prime switch to arm the ignition system', 'Safety interlock — prevents accidental ignition when not ready'],
  ['HOLD IGN 3s',     'Hold the IGNITE button continuously for 3 seconds', 'Initiates the plasma ignition sequence — release early and you must start again'],
  ['THROTTLE >20%',   'Raise the MAIN THROTTLE lever above 20%', 'Brings the reactor up to minimum operational power after ignition'],
  ['TURBINE',         'Engage the turbine to connect thermal output to the generator', 'Required for any electrical power output or money generation'],
  ['GRID SYNC',       'Synchronize the reactor output to the power grid', 'Completes startup — the reactor is now online and earning'],
];

// Descriptions: warning indicator (header STATUS box)
const HELP_WARN = ['STATUS / WARNING', 'Displays the most critical active reactor warning', 'Dark when all systems are normal — lights up with warning text and colour when an alert is active', 'Check the warning lights below the controls for detail on each condition'];

// Descriptions: individual warning lights (by element ID)
const HELP_WARN_LIGHTS = {
  warnOvertemp:     ['OVERTEMP WARNING',      'Core temperature exceeds safe levels. Reduce throttle and fuel injection, or increase coolant flow to bring temperature below 4000°C.'],
  warnOverpressure: ['OVERPRESSURE WARNING',  'Core pressure exceeds safe levels. Open the pressure relief knob, reduce fuel injection, or use LINE PURGE to vent excess pressure.'],
  warnContainment:  ['CONTAINMENT WARNING',   'Containment integrity is critically low. Increase contain power, enable backup containment fields, and fix thermal or magnetic module faults immediately.'],
  warnCoolant:      ['COOLANT WARNING',       'Coolant flow is critically low. Ensure coolant pumps are active and the coolant flow lever is raised above the minimum safe threshold.'],
  warnFuel:         ['FUEL WARNING',          'Fuel reserves are low. Purchase more fuel from the STORE tab before reserves run out and plasma extinguishes.'],
  warnRadiation:    ['RADIATION WARNING',     'Radiation levels are elevated. Enable rad shielding, reduce fuel injection, or improve containment integrity to bring radiation within safe limits.'],
  warnScram:        ['SCRAM STATUS',          'Reactor is in a SCRAM state. Re-enable AUX POWER and follow the startup sequence from the beginning to restart.'],
  warnOnline:       ['ONLINE STATUS',         'Turns green when the reactor is fully online and generating power. Dark when offline or in startup.'],
  warnModFault:     ['MODULE FAULT',          'One or more system modules are degraded or offline. Check the SYSTEMS tab to diagnose and repair affected modules.'],
  warnSysFault:     ['SYSTEM ERROR',          'Hidden system errors are degrading module performance. Go to the SYSTEMS tab and DIAGNOSE modules to reveal and clear the errors.'],
  warnEvent:        ['ACTIVE EVENT',          'A reactor incident is in progress. Read the event panel instructions carefully and complete all steps shown before the timer runs out.'],
};

// Descriptions: special upgrade cards (keyed by specCard_* element ID suffix)
const HELP_SPEC_UPGRADES = {
  eventSuppression:   ['EVENT SUPPRESSION',    'G:+ Time between reactor incidents', 'Each tier multiplies the minimum and maximum interval between events', 'Reduces how frequently emergencies interrupt normal reactor operation'],
  emergencyDelayer:   ['EMERGENCY DELAYER',    'G:+ Event resolve time', 'Each tier multiplies the countdown timer on all reactor incidents', 'Gives more time to diagnose and respond to each emergency'],
  backupGenerator:    ['BACKUP GENERATOR',     'G:+ Backup generator output (MW)', 'R:- Fuel consumption (when active)', 'Upgrades the BACKUP GEN switch output and reduces its fuel burn rate', 'Provides extra power output during emergencies or low-output situations'],
  turbineSpeedUpgrade:['TURBINE SPEED',        'G:+ Max turbine RPM', 'G:+ Max power output', 'Each tier raises the turbine safe speed limit, allowing higher RPM and more power generation', 'Also scales the turbine limiter cap so safe operation is always possible', 'Strongly recommended early — turbine RPM is the primary power multiplier'],
  diagSpeed:          ['DIAGNOSE SPEED',        'G:+ Diagnose All sweep speed per module', 'Reduces the time spent diagnosing each module during a DIAG ALL sweep', 'Does not affect individual manual diagnosis speed', 'T0 (base): 0.1× per module — T1: 0.2× — T2: 0.4×'],

  // Mode unlock cards
  mode_overclock:     ['OVERCLOCK MODE',       'G:+ Module efficiency', 'R:+ Module damage rate', 'R:+ Core temp', 'Unlocks OVERCLOCK mode in the SYSTEMS tab', 'T1/T2/T3: +20/+60/+100% perf at 1.8\u00d7/3\u00d7/4.5\u00d7 drain rate'],
  mode_eco:           ['ECO MODE',             'G:- Module damage rate', 'G:- Core temp', 'R:- Module efficiency', 'Unlocks ECO mode in the SYSTEMS tab', 'T1/T2/T3: 0.75\u00d7/0.5\u00d7/0.25\u00d7 drain at \u221230/\u221240/\u221250% perf'],
  mode_bypass:        ['BYPASS MODE',          'G:- Module self-damage (100%)', 'G:+ Repair speed (200%)', 'R:+ Backup system drain', 'Unlocks BYPASS mode in the SYSTEMS tab', 'T1/T2/T3: 55/70/85% perf \u2014 no self-drain, repairs 2\u00d7 faster'],
};
