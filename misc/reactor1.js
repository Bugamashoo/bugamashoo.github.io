// reactor1.js - STATE, MODES, SEQUENCE, SHARED VARS
// Load order: 1st

const S = {
  // Switches
  auxPower:0, fuelPumps:0, coolantPumps:0, containField:0, ignPrime:0,
  turbineEngage:0, gridSync:0, radShield:0, magCoils:0, ventSystem:0,
  backupGen:0, auxCoolPump:0, auxCoolLoop:0, backupContA:0, backupContB:0,
  emergVent:0, emergDump:0, rodSafetyOff:1,
  // Levers
  mainThrottle:0, fuelInject:0, coolantFlow:0, containPower:0,
  auxCoolRate:0, backupContPow:0, rodA:0, rodB:0, rodC:0,
  // Knobs
  pressureRelief:KNOB_DEFAULT, mixRatio:KNOB_DEFAULT, fieldTune:KNOB_DEFAULT,
  // Ignition state
  igniting:0, ignitionHeld:0,
  // Core readings
  coreTemp:TEMP_IDLE, corePressure:PRESSURE_BASE, coolantTemp:COOLANT_IDLE, fuelRemaining:FUEL_START,
  plasmaStability:0, magneticFlux:0, neutronDensity:0, powerOutput:0, backupGenOutput:0,
  turbineRPM:0, gridLoad:0, containIntegrity:100, coolantFlowRate:0,
  auxCoolTemp:AUX_COOL_IDLE, auxCoolFlow:0, backupFieldStr:0, rodPosition:0,
  // Reactor lifecycle
  reactorState:'OFFLINE', seqStep:0, startupComplete:0,
  scramActive:0, uptime:0, bestUptime:0, score:0, scoreTicks:0, fuelConsump:0,
  radiationLevel:0, heatSinkTemp:HEATSINK_IDLE, secondaryPressure:PRESSURE_BASE, peakPower:0,
  // Modules
  modules: {
    thermal:  { name:'THERMAL MGMT',   status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    coolant:  { name:'PRIMARY COOLANT',status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    fuel:     { name:'FUEL DELIVERY',  status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    magnetic: { name:'MAGNETIC CTRL',  status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    grid:     { name:'GRID INTERFACE', status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    backup:   { name:'BACKUP SYSTEMS', status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    sensor:   { name:'SENSOR ARRAY',   status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    comms:    { name:'COMMS UPLINK',   status:'online', health:100, mode:'normal', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 }
  },
  // Event tracking
  activeEvent:null, eventStepsComplete:[], eventsResolved:0, eventsFailed:0, gameOver:0,
  // Power averages
  bestAvg5m: 0,
  // Money system
  money: MONEY_START,
  totalEarned: 0,
  totalSpent: 0,
  fuelPriceMult: 1.0,         // current fuel price noise multiplier (lerps toward target)
  fuelPriceTarget: 1.0,       // target price multiplier (set by noise function)
  fuelFirstPurchase: false,   // price doesn't fluctuate until first buy
  fuelPriceNextChange: 0,     // tick when next price target change occurs
  fuelMoneyDeadTicks: 0       // ticks with fuel=0 AND money=0 (triggers game over after grace)
};

const MODES = {
  normal:   { label:'NORMAL',    perfMult:1.0,                    healthDrain:1,                      heatMod:0,                   desc:'+0% perf, normal drain'        },
  overclock:{ label:'OVERCLOCK', perfMult:MODE_OVERCLOCK_PERF,    healthDrain:MODE_OVERCLOCK_DRAIN,   heatMod:MODE_OVERCLOCK_HEAT, desc:'+50% perf, 3x drain, +heat'   },
  eco:      { label:'ECO',       perfMult:MODE_ECO_PERF,          healthDrain:MODE_ECO_DRAIN,         heatMod:MODE_ECO_HEAT,       desc:'-40% perf, slow drain, -heat' },
  bypass:   { label:'USING BACKUP SYSTEMS', perfMult:MODE_BYPASS_PERF, healthDrain:0,                heatMod:0,                   desc:'~90% perf, no self-drain, stress>backup' }
};

const SEQUENCE = [
  { label:'AUX POWER ON',   check:()=>S.auxPower                           },
  { label:'RAD SHIELDING',  check:()=>S.radShield                          },
  { label:'FUEL PUMPS',     check:()=>S.fuelPumps                          },
  { label:'COOLANT PUMPS',  check:()=>S.coolantPumps                       },
  { label:'MAG COILS',      check:()=>S.magCoils                           },
  { label:'CONTAIN >60%',   check:()=>S.containPower>=SEQ_CONTAIN_MIN       },
  { label:'FUEL INJ >10%',  check:()=>S.fuelInject>=SEQ_FUEL_INJ_MIN        },
  { label:'IGN PRIME',      check:()=>S.ignPrime                           },
  { label:'HOLD IGN 3s',    check:()=>S.igniting                           },
  { label:'THROTTLE >20%',  check:()=>S.mainThrottle>=SEQ_THROTTLE_MIN      },
  { label:'TURBINE',        check:()=>S.turbineEngage                      },
  { label:'GRID SYNC',      check:()=>S.gridSync                           }
];

// Shared mutable globals
let logEntries    = [];
let ignHoldStart  = 0;
let tick          = 0;
let nextEventTime = 0;
let monHist       = { temp:[], pressure:[], plasma:[], power:[], coolant:[], radiation:[] };
const MH          = MONITOR_HISTORY_LEN; // monitor history length (set in vars.js)
let repairTarget        = null; // module key currently being repaired (null = no active repair)
let diagTarget          = null; // module key currently being diagnosed (null = no active diag)
let bypassRestartTarget = null; // module key mid-bypass-restart (null = none)
let modPowerTimers = {};        // { [moduleKey]: { dir:'on'|'off', id:timeoutId } }
let rstTargets = new Set();     // module keys currently mid-restart
let gaugeDamageTimes = {};     // { [gaugeId]: next S.uptime to deal damage, or null if disarmed }
let diagStart     = 0;    // Date.now() when diagnosis started
let diagDuration  = 0;    // random 1-5s duration for current diagnosis
let nextErrorTime  = ERR_SPAWN_INIT_MIN + Math.random() * ERR_SPAWN_INIT_RANGE; // uptime threshold for next system error
let recentEventIds = []; // last 3 triggered event IDs - prevents same event repeating until 3 others have fired
let fuelPumpOffStart = 0; // Date.now() when fuel pumps went off; 0 = pumps are on or grace expired
let powerHist5m = []; // power samples every 60 ticks (3s), max 100 entries = 5 min rolling window
let sensorNoise       = {};   // randomised display strings shown when sensor array is offline
let lastCommsWarnTick = -100; // throttle "comms offline" log spam (1 message per 20 ticks)
let moduleHealthPrev = {}; // previous-tick health per module key, for threshold crossing detection
let plasmaOffTime    = 0;  // seconds plasma has been continuously off; resets uptime at 10s

// Money & resupply globals
let moduleUpgrades = {};    // { [moduleKey]: { health: 0, efficiency: 0, drain: 0 } } — tier purchased (0=none)
let overclockBoostEnd = 0;  // tick when overclock boost expires (0 = inactive)
let resupplyPulseDone = false; // true once resupply tab pulse has been clicked — never pulses again
// Initialize upgrade tracking for each module
Object.keys(S.modules).forEach(k => { moduleUpgrades[k] = { health: 0, efficiency: 0, drain: 0 }; });
