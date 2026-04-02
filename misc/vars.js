// vars.js - GAME BALANCE CONSTANTS
// Load order: 0th (before all reactor scripts)

// Tuning for gameplay difficulty and feel.
// Changes take effect on the next page load.

// SIMULATION TIMING
// How fast the simulation runs and how much history is kept.
const SIM_INTERVAL_MS      = 50;     // Milliseconds between simulation ticks (20 Hz at 50ms)
const SIM_DT               = 1 / 20; // Seconds per tick - must match 1000/SIM_INTERVAL_MS
const MONITOR_HISTORY_LEN  = 1200;   // Points kept in monitor graphs (~9 min at 20 Hz, sampled every 3 ticks)
const MONITOR_SAMPLE_TICKS = 3;      // Sample monitor history every N ticks
const POWER_HIST_TICKS     = 60;     // Sample 5-min avg power history every N ticks (3s at 20 Hz)
const POWER_HIST_MAX       = 100;    // Max power history entries (100 × 3s = 5-min rolling window)

// INITIAL STATE
// Starting values when the game loads.
const FUEL_START      = 5;    // Starting fuel level (%) - 1/20th of capacity, buy more via RESUPPLY tab
const KNOB_DEFAULT    = 50;   // Default value for pressureRelief, mixRatio, fieldTune knobs (%)
const TEMP_IDLE       = 20;   // Ambient/idle core temperature (°C)
const PRESSURE_BASE   = 1;    // Idle core pressure (ATM)
const HEATSINK_IDLE   = 20;   // Idle heat sink temperature (°C)
const COOLANT_IDLE    = 15;   // Idle coolant temperature (°C)
const AUX_COOL_IDLE   = 12;   // Idle aux coolant temperature (°C)

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

// STARTUP SEQUENCE THRESHOLDS
// Minimum lever positions required to advance the startup checklist.
const SEQ_CONTAIN_MIN   = 60;  // Containment power must be >= this % (step 6)
const SEQ_FUEL_INJ_MIN  = 10;  // Fuel injection must be >= this % (step 7)
const SEQ_THROTTLE_MIN  = 20;  // Main throttle must be >= this % (step 10)
const IGN_HOLD_MS       = 3000; // Milliseconds the ignition button must be held to fire plasma

// FUEL SYSTEM
// Fuel consumption rates and plasma extinction thresholds.
const FUEL_CONSUME_RATE    = 0.005;  // Fuel drained per 1% injection per dt (base rate)
const FUEL_CONSUME_DISPLAY = 0.3;    // Scale factor for the fuelConsump readout (visual only)
const FUEL_CONSUME_DECAY   = 0.9;    // Per-tick decay of fuelConsump when not igniting (fraction)
const FUEL_DUMP_DRAIN      = 0.5;    // Fuel drained per second when emergency dump is active (%)
const BACKUP_GEN_FUEL_DRAIN = 0.0001; // Fuel % drained per tick when backup generator is on (~medium reactor consumption)
const FUEL_PUMP_GRACE_MS   = 10000;   // Milliseconds fuel continues flowing after pumps go offline
const PLASMA_EXTINGUISH_EF         = 1;  // Plasma extinguishes if effective fuel drops below this
const PLASMA_EXTINGUISH_STABILITY  = 5;  // ...and plasma stability drops below this (%)

// CORE TEMPERATURE
// Heat generation, cooling, and lerp tuning.
// Normal operation: 2000–5000°C. Warning above 4000. Danger above 7000.
// Heat generation
const TEMP_HEAT_FUEL      = 120;   // Fuel injection contribution to raw heat (per 1% inject)
const TEMP_HEAT_THROTTLE  = 50;    // Throttle contribution to raw heat (per 1% throttle)
const TEMP_HEAT_SCALE     = 70;    // Multiplier applied after sqrt-compressing raw heat
const TEMP_MIX_BASE       = 0.5;   // Mix ratio modifier base (result: 0.5 + mixRatio/TEMP_MIX_SCALE)
const TEMP_MIX_SCALE      = 200;   // Denominator for mix ratio modifier (see above)
const MIX_POWER_MIN       = 0.85;  // Power multiplier at 0% mix ratio (scales linearly to 1.0 at 50%)
const MIX_POWER_MAX       = 1.08;  // Power multiplier at 100% mix ratio (slight buff above 50%)
const TEMP_ROD_REDUCTION  = 0.7;   // Fraction of heat removed by full rod insertion (rE=1)

// Cooling
const COOL_FLAT_RATE      = 3.0;   // Flat cooling per % coolantFlow × coolant perf (°C/tick)
const COOL_PCT_RATE       = 0.12;  // Percentage-based cooling per % coolantFlow × coolant perf
const COOL_AUX_FLAT       = 1.5;   // Flat aux cooling per % auxCoolRate × backup perf
const COOL_AUX_PCT        = 0.05;  // Percentage-based aux cooling per % auxCoolRate × backup perf
const EMERG_VENT_TEMP_MULT   = 0.75; // Core temp multiplied by this when emergency vent is active
const EMERG_VENT_TEMP_OFFSET = 100;  // Additional °C subtracted when emergency vent is active

// Physics
const TEMP_LERP           = 0.02;  // Temperature lerp rate toward target per tick (higher = snappier)
const TEMP_RUNAWAY_STEP   = 250;   // °C/tick forced rise when no active cooling is running

// CORE PRESSURE
// Pressure formula constants.
// Normal range: 8–18 ATM. Amber above 18. Red/danger above 24.
const PRES_TEMP_SCALE        = 0.25;  // sqrt(coreTemp) × this = temperature contribution to pressure
const PRES_THROTTLE_DIV      = 12;    // Throttle divided by this = direct throttle contribution
const PRES_FUEL_DIV          = 50;    // Effective fuel divided by this = fuel contribution
const PRES_RELIEF_EFFECT     = 0.5;   // Fraction of generated pressure removed at 100% pressure relief
const PRES_COOLANT_RELIEF    = 0.15;  // Fraction of pressure removed at 100% coolant flow
const PRES_ROD_DAMPENING     = 0.5;   // Fraction of pressure removed by full rod insertion (rE=1)
const EMERG_VENT_PRES_MULT   = 0.5;   // Pressure multiplied by this when emergency vent is active
const PRES_FLOOR             = 1;   // Minimum possible core pressure (ATM)
const PRES_LERP              = 0.03;  // Pressure lerp rate toward target per tick
const SECONDARY_PRES_CORE_SCALE   = 0.6;   // Secondary pressure = corePressure × this + backup contribution
const SECONDARY_PRES_BACKUP_SCALE = 0.05;  // + backupContPow × this

// COOLANT
// Coolant temperature and flow rate calculation.
const COOLANT_CORE_TRANSFER   = 0.04;  // Fraction of coreTemp transferred to coolant per tick
const COOLANT_FLOW_COOLING    = 1;   // °C removed per % coolantFlow × coolant perf
const COOLANT_FLOOR           = 10;    // Minimum coolant temperature (°C)
const COOLANT_LERP            = 0.05;  // Coolant temp lerp rate per tick
const COOLANT_FLOW_SCALE      = 12;    // coolantFlowRate = coolantFlow × switches × perf × this
const AUX_COOL_CORE_TRANSFER  = 0.01;  // Fraction of coreTemp transferred to aux coolant
const AUX_COOL_RATE_COOLING   = 0.3;   // °C removed per % auxCoolRate × backup effectiveness
const AUX_COOL_FLOW_SCALE     = 8;     // auxCoolFlow = auxCoolRate × perf × this

// MAGNETIC FIELD
// Containment field and backup field strength.
const MAG_FIELD_SCALE        = 8;     // (containPower/100) × this × tune factor = target flux
const MAG_TUNE_OFFSET        = 0.7;   // Base tune factor before fieldTune contribution
const MAG_TUNE_SCALE         = 300;   // fieldTune / this = added to MAG_TUNE_OFFSET
const MAG_FLUX_LERP          = 0.05;  // Magnetic flux lerp rate per tick
const MAG_BACKUP_POWER_SCALE = 4;     // Backup field: (switches × backupContPow/100) × this × bEff
const BACKUP_OVERCLOCK_MULT  = 4;     // Backup system effectiveness multiplied by this when overclocked

// PLASMA STABILITY
// Plasma stability formula.
// Target range: >60% for safe operation. Critical below 20%.
const PLASMA_BASE                  = 50;    // Starting stability when igniting (%)
const PLASMA_FLUX_SCALE            = 5;     // Magnetic flux contribution per unit flux
const PLASMA_BACKUP_SCALE          = 2;     // Backup field contribution per unit strength
const PLASMA_OVERTEMP_THRESHOLD    = 5000;  // °C above which plasma destabilizes
const PLASMA_OVERTEMP_SCALE        = 100;   // (coreTemp - threshold) / this = stability penalty
const PLASMA_PRESSURE_TARGET       = 15;    // Ideal core pressure (ATM); deviations penalize stability
const PLASMA_PRESSURE_PENALTY      = 2;     // |deviation from target| × this = stability penalty
const PLASMA_TUNE_BASE             = 0.8;   // Minimum field tune modifier on stability
const PLASMA_TUNE_SCALE            = 500;   // fieldTune / this added to PLASMA_TUNE_BASE
const PLASMA_CONTAIN_FIELD_BOOST   = 10;    // Bonus stability when containField switch is on (%)
const PLASMA_LOW_CONTAIN_THRESHOLD = 60;    // Containment % below which stability starts dropping
const PLASMA_LOW_CONTAIN_SCALE     = 0.4;   // (threshold - containIntegrity) × this = penalty
const PLASMA_NO_FUEL_PENALTY       = 45;    // Stability penalty applied when effective fuel < 1
const PLASMA_FUEL_BONUS_THRESHOLD  = 10;    // Effective fuel above this gets a stability bonus
const PLASMA_FUEL_BONUS_SCALE      = 8;     // (eF - threshold) / this = bonus (capped at max)
const PLASMA_FUEL_BONUS_MAX        = 12;    // Maximum stability bonus from fuel (%)
const PLASMA_ROD_REDUCTION         = 0.3;   // Fraction of stability removed by full rod insertion (rE=1)
const PLASMA_LERP                  = 0.04;  // Plasma stability lerp rate per tick

// NEUTRON DENSITY
const NEUTRON_TEMP_SCALE      = 10;   // sqrt(coreTemp) / this = temperature factor
const NEUTRON_MULT            = 1.5;  // Overall neutron density multiplier
const NEUTRON_ROD_REDUCTION   = 0.6;  // Fraction of neutrons absorbed by full rod insertion (rE=1)
const NEUTRON_LERP            = 0.03; // Neutron density lerp rate per tick

// RADIATION
// Normal shielded operation: ~15–25 mSv. Warning above 30. Danger above 60.
const RAD_NEUTRON_MULT             = 0.4;  // neutronDensity × this = baseline radiation
const RAD_NO_SHIELD_BONUS          = 25;   // Extra mSv when radiation shielding is off
const RAD_LOW_CONTAIN_THRESHOLD    = 70;   // Containment % below which radiation leaks
const RAD_LOW_CONTAIN_SCALE        = 0.5;  // (threshold - containIntegrity) × this = leak bonus

// CONTAINMENT INTEGRITY
// Drain when under-powered; regen when powered with field on.
const CONTAIN_POWER_THRESHOLD    = 50;    // % containPower; below this integrity drains, above it regens
const CONTAIN_DRAIN_MIN          = 0.02;  // Integrity drained/tick at containPower = 0%
const CONTAIN_DRAIN_MAX          = 0.06;  // Additional drain at maximum power deficit (total 0.02–0.06/tick)
const CONTAIN_REGEN_MIN          = 0.01;  // Integrity regained/tick at containPower just above threshold
const CONTAIN_REGEN_MAX          = 0.04;  // Max regen/tick at containPower = 100% (total 0.01–0.04/tick)
const CONTAIN_OVERTEMP_THRESHOLD = 6000;  // °C above which overheating drains containment
const CONTAIN_OVERTEMP_DRAIN_MIN = 0.02;  // Extra drain/tick at CONTAIN_OVERTEMP_THRESHOLD
const CONTAIN_OVERTEMP_DRAIN_MAX = 0.06;  // Max additional drain at extreme temperatures
const CONTAIN_BACKUP_REGEN_SCALE = 0.003; // backupFieldStr × this = extra regen per tick

// TURBINE & GRID
// Safe RPM range: 3,000–12,000. Warning above 13,000.
// TURBINE_LIMITER_MAX is computed dynamically as getTurbineSafeMax() * 0.84 (just below amber threshold)
const TURB_FUEL_BOOST_BASE  = 0.7;   // RPM multiplier at zero effective fuel
const TURB_FUEL_BOOST_RANGE = 0.6;   // Added to base at full fuel (max: base + range = 1.3×)
const TURB_RPM_SCALE        = 150;   // throttle × plasma% × fuelBoost × this = target RPM
const TURB_LERP             = 0.02;  // Turbine RPM lerp rate per tick
const GRID_TARGET           = 80;    // Target grid load when synced (%)
const GRID_LERP             = 0.01;  // Grid load lerp rate toward target per tick
const GRID_DECAY            = 0.95;  // Grid load multiplied by this per tick when not synced

// POWER OUTPUT
// Typical operating range: 50–400 MW.
const POWER_FUEL_MULT_BASE   = 0.6;   // Power multiplier at zero effective fuel
const POWER_FUEL_MULT_RANGE  = 0.8;   // Added at full fuel (max: base + range = 1.4×)
const POWER_RPM_SCALE        = 15000; // turbineRPM / this = RPM contribution (fraction of max)
const POWER_OUTPUT_SCALE     = 8.5;   // Core power multiplier (tunes overall MW output level)
const POWER_ROD_REDUCTION    = 0.4;   // Fraction of power removed by full rod insertion (rE=1)
const POWER_NO_VENT_MULT     = 0.85;  // Power multiplied by this when ventSystem switch is off
const POWER_BACKUP_GEN_BONUS = 2;     // MW added to output when backup generator is active
const POWER_LERP             = 0.03;  // Power output lerp rate per tick

// HEAT SINK
const HEATSINK_CORE_SCALE = 0.005;  // coreTemp × this = heat sink heating contribution
const HEATSINK_COOL_SCALE = 0.025;   // cE_flat (coolant effect) × this = heat sink cooling

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

// SAFE OPERATING RANGES ─
// Thresholds that drive warning lights and gauge color coding.
// These match the values referenced in the Operations Manual tab.
// Warning light triggers (also used as gauge color thresholds)
const SAFE_TEMP_RED       = 6000;  // Core temp (°C) -> red warning light
const SAFE_TEMP_AMBER     = 4000;  // Core temp (°C) -> amber warning light
const SAFE_PRES_RED       = 24;    // Core pressure (ATM) -> red warning light
const SAFE_PRES_AMBER     = 18;    // Core pressure (ATM) -> amber warning light
const SAFE_CONTAIN_RED    = 30;    // Containment (%) -> red warning light
const SAFE_CONTAIN_AMBER  = 60;    // Containment (%) -> amber warning light
const SAFE_COOLANT_RED    = 150;   // Coolant temp (°C) -> red warning light
const SAFE_COOLFLOW_AMBER = 100;   // Coolant flow (L/min) below this -> amber warning light
const SAFE_FUEL_RED       = 10;    // Fuel remaining (%) -> red warning light
const SAFE_FUEL_AMBER     = 25;    // Fuel remaining (%) -> amber warning light
const SAFE_RAD_RED        = 60;    // Radiation (mSv) -> red warning light
const SAFE_RAD_AMBER      = 30;    // Radiation (mSv) -> amber warning light
const SAFE_HEATSINK_RED   = 150;   // Heat sink temp (°C) -> red gauge
const SAFE_AUXCOOL_RED    = 70;    // Aux cool temp (°C) -> red gauge
const SAFE_TURBINE_RED    = 6000;  // Turbine RPM -> red gauge (base; scales with turbineSpeedUpgrade)
const SAFE_CONTAIN_DISP   = 15;    // Containment (%) -> red gauge (display threshold, slightly tighter than light)
const SAFE_PLASMA_LOW     = 20;    // Plasma stability (%) -> red gauge (when igniting)

// Gauge display max values (upper limit of the fill bar, not a danger threshold)
const DISP_TEMP_MAX       = 10000;
const DISP_PRES_MAX       = 50;
const DISP_PLASMA_MAX     = 100;
const DISP_NEUTRON_MAX    = 100;
const DISP_COOLANT_TEMP_MAX = 200;
const DISP_COOLANT_FLOW_MAX = 1200;
const DISP_TURBINE_MAX    = 24000;
const DISP_CONTAIN_MAX    = 100;
const DISP_FLUX_MAX       = 12;
const DISP_RAD_MAX        = 100;
const DISP_AUX_TEMP_MAX   = 100;
const DISP_AUX_FLOW_MAX   = 800;
const DISP_BACKUP_FIELD_MAX = 8;
const DISP_SECONDARY_PRES_MAX = 30;
const DISP_HEATSINK_MAX   = 200;
const DISP_FUEL_RED       = 20;    // Fuel bar turns red below this %
const DISP_FUEL_AMBER     = 50;    // Fuel bar turns amber below this %
const DISP_POWER_RED      = 2000;   // Power display turns red above this MW
const DISP_POWER_AMBER    = 1500;   // Power display turns amber above this MW

// Module health card color thresholds
const MOD_HEALTH_GREEN    = 75;    // Health (%) above which the bar is green
const MOD_HEALTH_AMBER    = 40;    // Health (%) above which the bar is amber (below = red)

// Reactor state transitions
const STATE_CRITICAL_TEMP     = 8000; // Core temp (°C) above which state becomes CRITICAL
const STATE_CRITICAL_CONTAIN  = 20;   // Containment (%) below which state becomes CRITICAL
const AUTO_SCRAM_CONTAIN      = 1;    // Containment (%) at or below which auto-scram triggers

// EVENT SYSTEM
// Controls how often and how urgently events fire.
// Raise delays to make the game easier; lower timers to increase pressure.
const EVT_FIRST_DELAY_MIN   = 300;  // Seconds after startup before the first event can trigger
const EVT_FIRST_DELAY_RANGE = 240;  // Random seconds added to first delay (total: 60–300s)
const EVT_POST_CLOSE_MIN    = 60;   // Seconds of quiet time after resolving an event
const EVT_POST_CLOSE_RANGE  = 240;  // Random seconds added (total: 60–300s)
const EVT_BLINK_THRESHOLD   = 15;   // Seconds remaining on event timer before it starts blinking red
const EVT_RECENT_MEMORY     = 8;    // Number of recent event IDs kept to prevent immediate repeats

// Per-event timers (seconds to resolve before catastrophe)
const EVT_TIME_COOLANT_LEAK     = 40;
const EVT_TIME_MAG_DRIFT        = 20;
const EVT_TIME_FUEL_CONTAM      = 30;
const EVT_TIME_TURBINE_VIB      = 35;
const EVT_TIME_SENSOR_FAULT     = 25;
const EVT_TIME_PLASMA_INSTAB    = 45;
const EVT_TIME_GRID_DRIFT       = 30;
const EVT_TIME_RAD_SPIKE        = 50;
const EVT_TIME_VACUUM_BREACH    = 35;
const EVT_TIME_COOLANT_OVERHEAT = 40;
const EVT_TIME_POWER_SURGE      = 35;
const EVT_TIME_TRITIUM_LEAK     = 50;
const EVT_TIME_MAG_QUENCH       = 70;
const EVT_TIME_STEAM_HAMMER     = 35;
const EVT_TIME_DIVERTOR_OVERLOAD = 40;
const EVT_TIME_AUX_POWER_FAULT  = 30;

// De-escalation phase (after all steps complete, hold controls steady to resolve)
const DEESC_HOLD_MS   = 15000; // Milliseconds of stable controls required to resolve the event
const DEESC_TOLERANCE = 2;     // +- units of change allowed in a tracked control before timer resets

// Game-over screen
const GAME_OVER_DELAY_MS = 4500; // Milliseconds after catastrophe animation before showing game over

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

// EMERGENCY ACTIONS
const EMERG_PURGE_PRES_MULT    = 0.6;   // Core pressure multiplied by this on line purge
const EMERG_PLASMA_DUMP_TEMP   = 0.5;   // Core temp multiplied by this on plasma dump
const EMERG_COOL_FLOOD_COOLANT = 100;   // coolantFlow set to this % on cool flood
const EMERG_COOL_FLOOD_AUX     = 100;   // auxCoolRate set to this % on cool flood
const EMERG_COOL_FLOOD_TEMP    = 0.3;   // Core temp multiplied by this on cool flood

// SCRAM & HARD RESET
const SCRAM_LOCKOUT_MS        = 10000;  // Milliseconds controls stay locked after a SCRAM
const HARD_RESET_OFFLINE_MS   = 4000;  // Milliseconds modules stay offline during hard reset
const HARD_RESET_MIN_HEALTH   = 60;    // Module health floored to this % during hard reset (not zeroed)

// UPTIME & SCORING
const PLASMA_OFF_RESET_SECS   = 10;   // Seconds plasma must be off before uptime resets to 0
const SCORE_DIVISOR           = 3500; // Score increments +1 every floor(SCORE_DIVISOR / MW) ticks
const HEALTH_ALERT_THRESHOLDS = [75, 50, 25, 10, 5]; // Health % levels that trigger log alerts
const PERIODIC_WARN_TICKS     = 80;   // Ticks between periodic system warning log messages

// MONEY SYSTEM
const MONEY_START             = 2000;       // Starting funds ($)
const MONEY_EARN_BASE         = 3;     // Base $/tick earned per MW of power output (at 20Hz)
const MONEY_EARN_SCALE_MW     = 2000;     // MW threshold for maximum earning multiplier
const MONEY_EARN_SCALE_MAX    = 1.5;     // Maximum earning multiplier at high MW output
const MONEY_FORMAT_K          = 1000;    // Threshold to display as $X.Xk
const MONEY_FORMAT_M          = 1000000; // Threshold to display as $X.Xm
const MONEY_FORMAT_B          = 1000000000; // Threshold to display as $X.Xb

// FUEL MARKET
const FUEL_PRICE_BASE_PER_PCT = 20000;    // Base price ($) for 1% fuel
const FUEL_PRICE_LERP         = 0.005;   // Per-tick lerp rate toward target price multiplier
const FUEL_PRICE_CHANGE_MIN   = 3000;    // Min ticks between price target changes (~2.5 min at 20Hz)
const FUEL_PRICE_CHANGE_RANGE = 6000;    // Random ticks added (total 2.5–7.5 min between changes)
const FUEL_PRICE_NORMAL_RANGE = 0.35;    // Normal fluctuation +-35% around base
const FUEL_PRICE_EXTREME_CHANCE = 0.08;  // 8% chance of extreme price swing per change
const FUEL_PRICE_EXTREME_LOW  = 0.50;    // Extreme discount: price drops to 50% of base
const FUEL_PRICE_EXTREME_HIGH = 2.00;    // Extreme spike: price rises to 200% of base
const FUEL_SELL_RATIO         = 0.75;    // Sell price = 75% of current buy price

// REPAIR COSTS
const REPAIR_COST_PER_TICK    = 1400;      // $/tick cost while actively repairing a module

// SYSTEM UPGRADES (per-module, 3 tiers each)
// Base costs are multiplied by UPGRADE_MODULE_COST_MULT per module.
// Total all upgrades ≈ $9.6m (roughly 2 hours of max-output play).
const UPGRADE_HEALTH_COST     = [23000, 91000, 290000];    // Base cost per tier: +max health
const UPGRADE_HEALTH_BONUS    = [10, 15, 25];              // +max health per tier (cumulative: +10, +25, +45)
const UPGRADE_EFFICIENCY_COST = [94000, 379000, 1220000];    // Base cost per tier: error penalty floor improvement
const UPGRADE_EFFICIENCY_BONUS= [0.1, 0.15, 0.25];       // Flat perf multiplier per tier (stacks: T3 = +50%)
const UPGRADE_DRAIN_COST      = [23000, 187000, 650000];    // Base cost per tier: reduce health drain rate
const UPGRADE_DRAIN_MULT      = [0.90, 0.70, 0.45];       // Health drain multiplied by this (lower = better)

// Per-module cost multiplier - scales all upgrade costs for that module.
// Ranked by how directly the module contributes to reactor output.
const UPGRADE_MODULE_COST_MULT = {
  grid:     5.0,   // Grid Interface - power delivery, most expensive
  backup:   2.2,   // Backup Power - emergency stability
  fuel:     3.7,   // Fuel Processing - fuel efficiency
  thermal:  1.3,   // Thermal Control - heat management
  magnetic: 2.0,   // Magnetic Containment - plasma stability
  coolant:  1.5,   // Coolant System - overheat prevention
  sensor:   0.3,   // Sensor Array - readout accuracy
  comms:    0.6    // Comms Relay - control access
};

// SPECIAL ITEMS (one-time-use, repeatable purchase)
const ITEM_EMERGENCY_FUEL_COST   = 0;   // Instant +0% fuel (REMOVE BUTTON)
const ITEM_EMERGENCY_FUEL_AMOUNT = 0;
const ITEM_QUICK_REPAIR_COST     = 165000;  // Instant +30 health to target module
const ITEM_QUICK_REPAIR_AMOUNT   = 30;
const ITEM_DIAGNOSTIC_SWEEP_COST = 96000;  // Reveals ALL hidden system errors
const ITEM_OVERCLOCK_BOOST_COST  = 1200000;  // 60s enhanced overclock (2x perf, normal drain)
const ITEM_OVERCLOCK_BOOST_TICKS = 1200;   // Duration in ticks (60s at 20Hz)
const ITEM_CONTAINMENT_PATCH_COST  = 40000; // Instant +25% containment integrity
const ITEM_CONTAINMENT_PATCH_AMOUNT= 25;
const ITEM_EVENT_EXTENDER_COST   = 110000; // Adds 30s to active event timer
const ITEM_EVENT_EXTENDER_BONUS  = 30;     // Seconds added to event countdown

// SPECIAL TIERED UPGRADES
// 5 tiers each; multiplier at each tier level (applied to base 1.0×)
const SPEC_UPG_TIERS             = 5;
const SPEC_UPG_MULT_STEPS        = [1.4, 1.8, 2.2, 2.6, 3.0]; // multiplier per tier
const SPEC_UPG_EVENT_SUPPRESS_COSTS  = [150000, 400000, 900000, 2000000, 5000000];  // Event Suppression tier costs
const SPEC_UPG_EMERGENCY_DELAY_COSTS = [200000, 500000, 1100000, 2500000, 6000000]; // Emergency Delayer tier costs

// Turbine Speed upgrade (9 tiers, linear: 2,000 -> 20,000 RPM safe threshold)
const SPEC_UPG_TURBINE_SPEED_TIERS = 9;
const SPEC_UPG_TURBINE_SPEED_BASE  = 2000;  // Safe RPM at tier 0 (no upgrade)
const SPEC_UPG_TURBINE_SPEED_MAX   = 20000; // Safe RPM at max tier
const SPEC_UPG_TURBINE_SPEED_COSTS = [3500, 15500, 49000, 180000, 540000, 1300000, 3200000, 7800000, 19200000];

// Backup Generator upgrade (9 tiers, linear: 2MW -> 20MW output, 100% -> 50% fuel rate)
const SPEC_UPG_BACKUP_GEN_TIERS    = 9;
const SPEC_UPG_BACKUP_GEN_MAX_MW   = 20;   // Power output at max tier
const SPEC_UPG_BACKUP_GEN_MIN_FUEL = 0.5;  // Fuel consumption multiplier at max tier (50% of base)
const SPEC_UPG_BACKUP_GEN_COSTS    = [24000, 54000, 90000, 158000, 279000, 442000, 746000, 1500000, 3700000];

// FUEL+MONEY EXHAUSTION
const FUEL_MONEY_GAMEOVER_DELAY  = 100;    // Ticks with fuel=0 AND money=0 before game over (5s grace)

// INTRO OVERLAY
const INTRO_TITLE            = "Buga's Reactor Command";
const INTRO_VERSION          = "v3.4.1";
const INTRO_TEXT             = "story placeholder...";
const INTRO_SWITCH_DELAY_MS         = 600;   // ms - pause after switch flips ON before fade starts
const INTRO_FADE_MS                 = 700;   // ms - smooth fade: intro content out + game in simultaneously
const INTRO_FLICKER_MS              = 3200;  // ms - total duration of the fluorescent flicker sequence
// Fluorescent flicker physics - B(t) = S(t) · [W(t) + α·sin(2πft)]
const INTRO_FLICKER_K               = 0.7;   // flicker catch rate: P(on) = 1 − e^(−k·t); higher = catches faster
const INTRO_FLICKER_M               = 0.5;  // warm-up rate: how quickly the tube climbs from B_start to full brightness
const INTRO_FLICKER_B_START         = 0.3;   // initial brightness when the tube first catches (0–1)
const INTRO_FLICKER_ALPHA           = 0.02;  // hum amplitude: subtle 50/60Hz electrical oscillation on brightness
const INTRO_FLICKER_HUM_FREQ        = 120;   // Hz - electrical hum frequency (120 = 2× 60 Hz mains)
const INTRO_FLICKER_MIN_INTERVAL_MS = 40;    // ms - fastest S(t) sample interval (chaotic early stuttering)
const INTRO_FLICKER_MAX_INTERVAL_MS = 240;   // ms - slowest S(t) sample interval (lamp stabilising)
const INTRO_FLICKER_RAMP_RATE       = 1.0;   // brightness units/sec at litProb=1; scales with litProb so early catches ramp slowly, late catches ramp fast
const INTRO_FLICKER_MIN_BRIGHT      = 0.4;   // minimum brightness for any flicker "on" state (0–1)
const INTRO_Z_INDEX          = 11000;
const INTRO_TITLE_SIZE       = 40;    // px - title font size
const INTRO_TITLE_SPACING    = 2;     // px - title letter-spacing
const INTRO_TITLE_GLOW       = 1;  // opacity multiplier for amber title text-shadow
const INTRO_VERSION_SIZE     = 16;    // px - version text font size
const INTRO_VERSION_SPACING  = 8;     // px - version letter-spacing
const INTRO_VERSION_OPACITY  = 0.8;  // opacity of version text
const INTRO_VERSION_OFFSET   = -22;   // px - margin-top pulling version up under title
const INTRO_CONTENT_GAP      = 28;    // px - gap between title block and the row below
const INTRO_ROW_GAP          = 18;    // px - gap between text box and switch
const INTRO_BOX_WIDTH        = 420;   // px - text box width
const INTRO_BOX_MIN_HEIGHT   = 130;   // px - text box minimum height
const INTRO_BOX_FONT_SIZE    = 13;    // px - text box font size
const INTRO_BOX_LINE_HEIGHT  = 1.75;  // text box line-height