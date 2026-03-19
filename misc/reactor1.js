// ============================================================
// reactor1.js — STATE, MODES, SEQUENCE, SHARED VARS
// Load order: 1st
// ============================================================

const S = {
  // Switches
  auxPower:0, fuelPumps:0, coolantPumps:0, containField:0, ignPrime:0,
  turbineEngage:0, gridSync:0, radShield:0, magCoils:0, ventSystem:0,
  backupGen:0, auxCoolPump:0, auxCoolLoop:0, backupContA:0, backupContB:0,
  emergVent:0, emergDump:0, rodSafetyOff:0,
  // Levers
  mainThrottle:0, fuelInject:0, coolantFlow:0, containPower:0,
  auxCoolRate:0, backupContPow:0, rodA:0, rodB:0, rodC:0,
  // Knobs
  pressureRelief:50, mixRatio:50, fieldTune:50,
  // Ignition state
  igniting:0, ignitionHeld:0,
  // Core readings
  coreTemp:20, corePressure:1, coolantTemp:15, fuelRemaining:100,
  plasmaStability:0, magneticFlux:0, neutronDensity:0, powerOutput:0,
  turbineRPM:0, gridLoad:0, containIntegrity:100, coolantFlowRate:0,
  auxCoolTemp:12, auxCoolFlow:0, backupFieldStr:0, rodPosition:100,
  // Reactor lifecycle
  reactorState:'OFFLINE', seqStep:0, startupComplete:0,
  scramActive:0, uptime:0, bestUptime:0, score:0, scoreTicks:0, fuelConsump:0,
  radiationLevel:0, heatSinkTemp:20, secondaryPressure:1, peakPower:0,
  // Modules
  modules: {
    thermal:  { name:'THERMAL MGMT',   status:'online', health:100, mode:'normal', affects:'coolant',  sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    magnetic: { name:'MAGNETIC CTRL',  status:'online', health:100, mode:'normal', affects:'sensor',   sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    fuel:     { name:'FUEL DELIVERY',  status:'online', health:100, mode:'normal', affects:'thermal',  sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    coolant:  { name:'PRIMARY COOLANT',status:'online', health:100, mode:'normal', affects:'thermal',  sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    backup:   { name:'BACKUP SYSTEMS', status:'online', health:100, mode:'normal', affects:null,       sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    grid:     { name:'GRID INTERFACE', status:'online', health:100, mode:'normal', affects:'comms',    sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    sensor:   { name:'SENSOR ARRAY',   status:'online', health:100, mode:'normal', affects:'magnetic', sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 },
    comms:    { name:'COMMS UPLINK',   status:'online', health:100, mode:'normal', affects:'sensor',   sysError:false, sysErrorVisible:false, errorPenalty:1, errorCount:0 }
  },
  // Event tracking
  activeEvent:null, eventStepsComplete:[], eventsResolved:0, eventsFailed:0, gameOver:0,
  // Power averages
  bestAvg5m: 0
};

const MODES = {
  normal:   { label:'NORMAL',    perfMult:1.0, healthDrain:1,   heatMod:0,  desc:'+0% perf, normal drain'        },
  overclock:{ label:'OVERCLOCK', perfMult:1.5, healthDrain:3,   heatMod:15, desc:'+50% perf, 3x drain, +heat'   },
  eco:      { label:'ECO',       perfMult:0.6, healthDrain:0.3, heatMod:-5, desc:'-40% perf, slow drain, -heat' },
  bypass:   { label:'BYPASS',    perfMult:0.9, healthDrain:0,   heatMod:0,  desc:'~90% perf, no self-drain, stress→backup' }
};

const SEQUENCE = [
  { label:'AUX POWER ON',   check:()=>S.auxPower                           },
  { label:'RAD SHIELDING',  check:()=>S.radShield                          },
  { label:'FUEL PUMPS',     check:()=>S.fuelPumps                          },
  { label:'COOLANT PUMPS',  check:()=>S.coolantPumps                       },
  { label:'MAG COILS',      check:()=>S.magCoils                           },
  { label:'CONTAIN >60%',   check:()=>S.containPower>=60                   },
  { label:'FUEL INJ >10%',  check:()=>S.fuelInject>=10                     },
  { label:'IGN PRIME',      check:()=>S.ignPrime                           },
  { label:'HOLD IGN 3s',    check:()=>S.igniting                           },
  { label:'THROTTLE >20%',  check:()=>S.mainThrottle>=20                   },
  { label:'TURBINE',        check:()=>S.turbineEngage                      },
  { label:'GRID SYNC',      check:()=>S.gridSync                           }
];

// Shared mutable globals
let logEntries    = [];
let ignHoldStart  = 0;
let tick          = 0;
let nextEventTime = 0;
let monHist       = { temp:[], pressure:[], plasma:[], power:[], coolant:[], radiation:[] };
const MH          = 1200; // monitor history length (~9 min at 20Hz, sampled every 3 ticks)
let repairTarget        = null; // module key currently being repaired (null = no active repair)
let diagTarget          = null; // module key currently being diagnosed (null = no active diag)
let bypassRestartTarget = null; // module key mid-bypass-restart (null = none)
let modPowerTimers = {};        // { [moduleKey]: { dir:'on'|'off', id:timeoutId } }
let gaugeDamageTimes = {};     // { [gaugeId]: next S.uptime to deal damage, or null if disarmed }
let diagStart     = 0;    // Date.now() when diagnosis started
let diagDuration  = 0;    // random 1-5s duration for current diagnosis
let nextErrorTime  = 30 + Math.random() * 60; // uptime threshold for next system error (30-90s)
let recentEventIds = []; // last 3 triggered event IDs — prevents same event repeating until 3 others have fired
let fuelPumpOffStart = 0; // Date.now() when fuel pumps went off; 0 = pumps are on or grace expired
let powerHist5m = []; // power samples every 60 ticks (3s), max 100 entries = 5 min rolling window
let moduleHealthPrev = {}; // previous-tick health per module key, for threshold crossing detection
