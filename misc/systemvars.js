// systemvars.js - SYSTEMS TAB / MODULE CONSTANTS
// Load order: 2nd (after vars.js and resupplyvars.js, before all reactor scripts)

// MODULE MODES
// Performance multiplier, health drain rate, and heat modifier for each mode.
// healthDrain is a multiplier applied to the per-interval drain roll (MOD_BASE_DRAIN_ROLL).
const MODE_OVERCLOCK_PERF  = 1.5;   // Performance multiplier in overclock (+50%)
const MODE_OVERCLOCK_DRAIN = 3;     // Health drain multiplier in overclock (3× normal)
const MODE_OVERCLOCK_HEAT  = 110;    // Extra °C added to core temp target in overclock
const MODE_ECO_PERF        = 0.6;   // Performance multiplier in eco mode (-40%)
const MODE_ECO_DRAIN       = 0.3;   // Health drain multiplier in eco mode (0.3× normal)
const MODE_ECO_HEAT        = -40;    // Heat reduction in eco mode (°C)
const MODE_BYPASS_PERF     = 0.9;   // Performance multiplier in bypass mode (-10%)

// MODULE HEALTH & DEGRADATION
// Raise DRAIN_INTERVAL or lower BASE_DRAIN_ROLL to make modules last longer.
const MOD_DRAIN_INTERVAL    = 60;   // Ticks between module health drain calculations (every 3s at 20Hz)
const MOD_BASE_DRAIN_ROLL   = 0.2;  // Max random health drained per interval (before multipliers)
const MOD_SLIDER_BASE       = 0.5;  // Slider load multiplier at 0% lever position
const MOD_SLIDER_SCALE      = 100;  // sliderLoad / this added to MOD_SLIDER_BASE (max 1.5× at 100%)
const MOD_BYPASS_STRESS_MULT = 3; // Bypass mode redirects this × normal stress to backup systems
const MOD_ERROR_DRAIN_MULT  = 1.1;  // System errors multiply health drain by this

const MOD_DEGRADE_HEALTH    = 25;   // Health % below which a module can randomly degrade to 'degraded'
const MOD_DEGRADE_CHANCE    = 0.03; // Probability per drain-interval of degrading when below threshold
const MOD_OFFLINE_HEALTH    = 5;    // Health % below which a module automatically goes offline

// Warning-severity multiplier applied to health drain
// warnX: +1 per amber warning, +2 per red warning active
const WARN_SEVERITY_SCALE   = 8;   // warnMult = 1 + warnX / this, Lower means more impact!!

// Warning thresholds used by the severity scoring in the drain loop
const WARN_TEMP_RED         = 6000; // Core temp (°C) for red severity score
const WARN_TEMP_AMBER       = 4000; // Core temp (°C) for amber severity score
const WARN_PRES_RED         = 24;   // Core pressure (ATM) for red severity score
const WARN_PRES_AMBER       = 18;   // Core pressure (ATM) for amber severity score
const WARN_CONTAIN_RED      = 30;   // Containment (%) below which red severity score
const WARN_CONTAIN_AMBER    = 60;   // Containment (%) below which amber severity score
const WARN_COOLANT_TEMP_RED = 150;  // Coolant temp (°C) for red severity score
const WARN_COOLANT_FLOW_AMB = 100;  // Coolant flow (L/min) below this = amber severity score
const WARN_FUEL_RED         = 10;   // Fuel remaining (%) below which red severity score
const WARN_FUEL_AMBER       = 25;   // Fuel remaining (%) below which amber severity score
const WARN_RAD_RED          = 60;   // Radiation (mSv) above which red severity score
const WARN_RAD_AMBER        = 30;   // Radiation (mSv) above which amber severity score

// BACKUP SYSTEMS HEALTH DRAIN
// Each active backup load drains backup health per tick.
// All four maxed out = ~1 minute to deplete from full.
const BACKUP_GEN_DRAIN        = 0.005;  // Health drained/tick when backupGen is on
const BACKUP_AUX_DRAIN        = 0.02;  // Health drained/tick per % auxCoolRate / 100 when aux loop active
const BACKUP_FIELD_A_DRAIN    = 0.02;  // Health drained/tick per % backupContPow / 100 when Field A on
const BACKUP_FIELD_B_DRAIN    = 0.02;  // Health drained/tick per % backupContPow / 100 when Field B on
const BACKUP_OVERCLOCK_DRAIN  = 2;     // Backup drain multiplied by this when backup is in overclock mode

// GAUGE DANGER -> MODULE DAMAGE
// When a gauge stays in danger, a timer arms. On expiry, the linked module takes damage.
// Lower ARM_MIN / ARM_RANGE for faster punishment; lower DMG values for softer consequences.
const GAUGE_DANGER_ARM_MIN   = 15;  // Minimum seconds before first damage after entering danger
const GAUGE_DANGER_ARM_RANGE = 45;  // Random seconds added to the arm timer (total: 15–60s)
const GAUGE_DANGER_DMG_MIN   = 6;   // Minimum health % damage per trigger
const GAUGE_DANGER_DMG_RANGE = 9;   // Random health % added to minimum damage (total: 6–15%)

// GAUGE DANGER THRESHOLDS
// Conditions that arm the gauge danger timer and deal module damage.
const GAUGE_TEMP_DANGER       = 6000;  // Core temp (°C) above which thermal damage accrues
const GAUGE_PRES_DANGER       = 24;    // Core pressure (ATM) above which fuel module takes damage
const GAUGE_PLASMA_DANGER     = 20;    // Plasma stability (%) below which magnetic module takes damage
const GAUGE_COOLANT_TEMP_DANGER = 150; // Coolant temp (°C) above which coolant module takes damage
const GAUGE_COOLANT_FLOW_DANGER = 100; // Coolant flow (L/min) below which coolant module takes damage
const GAUGE_CONTAIN_DANGER    = 15;    // Containment (%) below which magnetic module takes damage
const GAUGE_RADIATION_DANGER  = 60;    // Radiation (mSv) above which sensor module takes damage
const GAUGE_TURBINE_DANGER    = 6000;  // Turbine RPM above which grid module takes damage (base; scales with turbineSpeedUpgrade)
const GAUGE_HEATSINK_DANGER   = 150;   // Heat sink temp (°C) above which coolant module takes damage
const GAUGE_AUXCOOL_DANGER    = 70;    // Aux cool temp (°C) above which backup module takes damage

// SYSTEM ERRORS
// Hidden faults that silently reduce module efficiency until diagnosed.
// Raise SPAWN_NEXT_MIN to give players more breathing room between errors.
const ERR_SPAWN_INIT_MIN    = 30;   // Seconds after reactor start before first error can spawn
const ERR_SPAWN_INIT_RANGE  = 270;  // Random seconds added to initial spawn time (total: 30–300s)
const ERR_SPAWN_NEXT_MIN    = 30;   // Seconds between subsequent error events
const ERR_SPAWN_NEXT_RANGE  = 270;  // Random seconds added (total: 30–300s per error cycle)
const ERR_PENALTY_INIT_MIN  = 0.85; // Initial efficiency when an error is applied (85%)
const ERR_PENALTY_INIT_RANGE = 0.05;// Random range on top of min (initial: 85–90% efficiency)
const ERR_PENALTY_FLOOR     = 0.40; // Efficiency cannot drop below this, even with many worsening events
const ERR_WORSEN_STEP       = 0.05; // Efficiency reduction per worsening event
const ERR_WORSEN_STEP_RANGE = 0.05; // Random amount added to worsen step (total: 0.05–0.10 per event)
const ERR_WORSEN_CHANCE     = 0.75; // Probability that a new error event worsens an existing error vs spreading
const ERR_SPREAD_THRESHOLD  = 8;    // errorCount at which a maxed error starts spreading to new modules

// Module health card color thresholds
const MOD_HEALTH_GREEN    = 75;    // Health (%) above which the bar is green
const MOD_HEALTH_AMBER    = 40;    // Health (%) above which the bar is amber (below = red)

// REPAIR & DIAGNOSIS
// Repair rates are in health % per tick.
const REPAIR_ONLINE_RATE    = 1.2 / 30;    // Health regained per tick when online (normal repair)
const REPAIR_BYPASS_RATE    = 2 / 30;    // Health regained per tick in bypass mode
const REPAIR_OFFLINE_RATE   = 5 / 30;  // Health regained per tick when offline (fast repair)
const DIAG_DURATION_BASE_MS  = 1000;  // Minimum diagnosis duration (ms)
const DIAG_DURATION_RANGE_MS = 4000;  // Random extra duration added (total: 1–5s)
const DIAG_BYPASS_MULT       = 0.4;   // Duration multiplied by this when module is in bypass mode (0.5–2.5s)

// MODULE MANAGEMENT TIMERS
const MODULE_POWER_TRANSITION_MS = 3000;  // Milliseconds for a module to power on or off
const MODULE_RESTART_MS          = 6000;  // Milliseconds for a module restart to complete

// HARD RESET
const HARD_RESET_OFFLINE_MS   = 4000;  // Milliseconds modules stay offline during hard reset
const HARD_RESET_MIN_HEALTH   = 60;    // Module health floored to this % during hard reset (not zeroed)
