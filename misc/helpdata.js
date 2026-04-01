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
  fuelRemaining:    ['FUEL REMAINING',      'Current fuel reserve level - depleting fully shuts off plasma ignition and brings the reactor to a halt. Refueling costs money from the RESUPPLY tab.'],
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
  upgEfficiency: ['EFFICIENCY UPGRADE',     'G:+ Module performance', 'Boosts effective output regardless of system error state — T1/T2/T3 give +10%/+25%/+50% total'],
  upgDrain:      ['DURABILITY UPGRADE',     'G:- Module damage', 'Damage to module accumulates more slowly'],
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
  allNormal:    ['ALL NORMAL',              'Restores all compatible modules to Normal mode simultaneously'],
  allOverclock: ['ALL OVERCLOCK',           'G:+ 50% efficiency', 'R:+ 200% damage rate', 'R:+ Core temp', 'Sets all compatible modules to Overclock mode at once'],
  allEco:       ['ALL ECO',                 'G:- 40% damage rate', 'G:- Core temp', 'R:- 40% efficiency', 'Sets all compatible modules to Eco mode at once'],
  allBypass:    ['ALL BYPASS',              'R:+ 1500% Backup system damage rate', 'Sets all compatible modules to Bypass mode at once, pushing the backup system to its limits'],
};
