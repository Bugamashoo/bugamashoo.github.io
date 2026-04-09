// vars.js - SIMULATION & GAMEPLAY BALANCE CONSTANTS
// Load order: 0th (before all reactor scripts)
// Money, upgrade, and resupply constants are in resupplyvars.js
// Module/systems constants are in systemvars.js

// Tuning for gameplay difficulty and feel.

// SIMULATION TIMING
// How fast the simulation runs and how much history is kept.
const SIM_INTERVAL_MS      = 50;     // Milliseconds between simulation ticks (20 Hz at 50ms)
const SIM_DT               = 1 / 20; // Seconds per tick - must match 1000/SIM_INTERVAL_MS
const MONITOR_HISTORY_LEN  = 1200;   // Points kept in monitor graphs (~9 min at 20 Hz, sampled every 3 ticks)
const MONITOR_SAMPLE_TICKS = 3;      // Sample monitor history every N ticks
const POWER_HIST_TICKS     = 60;     // Sample 5-min avg power history every N ticks (3s at 20 Hz)
const POWER_HIST_MAX       = 100;    // Max power history entries (100 × 3s = 5-min rolling window)
var FIRST_ON               = 0;      // Whether reactor has been started before (this session)
var STORE_PULSE            = 0;      // Whether the store has been pulsed before

// INITIAL STATE
// Starting values when the game loads.
const FUEL_START      = 5;    // Starting fuel level (%) - 1/20th of capacity, buy more via RESUPPLY tab
const KNOB_DEFAULT    = 50;   // Default value for pressureRelief, mixRatio, fieldTune knobs (%)
const TEMP_IDLE       = 20;   // Ambient/idle core temperature (°C)
const PRESSURE_BASE   = 1;    // Idle core pressure (ATM)
const HEATSINK_IDLE   = 20;   // Idle heat sink temperature (°C)
const COOLANT_IDLE    = 15;   // Idle coolant temperature (°C)
const AUX_COOL_IDLE   = 12;   // Idle aux coolant temperature (°C)

// STARTUP SEQUENCE THRESHOLDS
// Minimum lever positions required to advance the startup checklist.
const SEQ_COOLANT_MIN   = 60;  // Coolant flow must be >= this % (step 5)
const SEQ_CONTAIN_MIN   = 60;  // Containment power must be >= this % (step 7)
const SEQ_FUEL_INJ_MIN  = 10;  // Fuel injection must be >= this % (step 8)
const SEQ_THROTTLE_MIN  = 20;  // Main throttle must be >= this % (step 11)
const IGN_HOLD_MS       = 3000; // Milliseconds the ignition button must be held to fire plasma
const IGN_HOLD_TICKS    = Math.round(IGN_HOLD_MS / SIM_INTERVAL_MS);  // 60 ticks (3s)

// FUEL SYSTEM
// Fuel consumption rates and plasma extinction thresholds.
const FUEL_CONSUME_RATE    = 0.005;  // Fuel drained per 1% injection per dt (base rate)
const FUEL_CONSUME_DISPLAY = 0.3;    // Scale factor for the fuelConsump readout (visual only)
const FUEL_CONSUME_DECAY   = 0.9;    // Per-tick decay of fuelConsump when not igniting (fraction)
const FUEL_CONSUMP_LERP    = 1 / 600; // Lerp rate for fuelConsump display value (~30s to settle, same as pump spindown)
const FUEL_DUMP_DRAIN      = 0.5;    // Fuel drained per second when emergency dump is active (%)
const BACKUP_GEN_FUEL_DRAIN = 0.0001; // Fuel % drained per tick when backup generator is on (~medium reactor consumption)
const FUEL_PUMP_SPINDOWN_RATE    = 1 / 600;  // Flow decrease per tick when fuel pumps go offline (~30s to zero at 20Hz)
const FUEL_PUMP_SPINUP_RATE      = 0.2;      // Flow increase per tick when fuel pumps come online (~5 ticks)
const COOLANT_PUMP_SPINDOWN_RATE = 1 / 600;  // Flow decrease per tick when coolant pumps go offline (~30s to zero at 20Hz)
const COOLANT_PUMP_SPINUP_RATE   = 0.2;      // Flow increase per tick when coolant pumps come online (~5 ticks)
const PLASMA_EXTINGUISH_EF         = 5;   // Plasma extinguishes if effective fuel drops below 5% of max (100)
const PLASMA_IGNITE_EF             = 10;  // Effective fuel must be at least 10% of max to ignite

// CORE TEMPERATURE
// Heat generation, cooling, and lerp tuning.
// Normal operation: 2000–5000°C. Warning above 4000. Danger above 7000.
// Heat generation
const TEMP_HEAT_FUEL      = 120;   // Fuel injection contribution to raw heat (per 1% inject)
const TEMP_HEAT_THROTTLE  = 50;    // Throttle contribution to raw heat (per 1% throttle)
const TEMP_HEAT_SCALE     = 70;    // Multiplier applied after sqrt-compressing raw heat
const TEMP_MIX_BASE       = 0.625;  // Mix ratio modifier base (result: 0.625 + mixRatio/TEMP_MIX_SCALE); ½ of original ±0.25 swing around 0.75
const TEMP_MIX_SCALE      = 400;    // Denominator for mix ratio modifier; larger = smaller effect (was 200)
const MIX_POWER_MIN       = 0.925;  // Power multiplier at 0% mix ratio (½ of original 0.15 penalty = 0.075)
const MIX_POWER_MAX       = 1.04;   // Power multiplier at 100% mix ratio (½ of original 0.08 bonus = 0.04)
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
const RAD_PRES_RELIEF_MIN          = -20;  // Radiation offset at pressureRelief=5% (venting reduces rad)
const RAD_PRES_RELIEF_MAX          = 10;   // Radiation offset at pressureRelief=95% (closed = slight buildup)

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
const DEESC_HOLD_TICKS = Math.round(DEESC_HOLD_MS / SIM_INTERVAL_MS); // 300 ticks (15s)
const DEESC_TOLERANCE = 2;     // +- units of change allowed in a tracked control before timer resets

// Game-over screen
const GAME_OVER_DELAY_MS = 4500; // Milliseconds after catastrophe animation before showing game over

// EMERGENCY ACTIONS
const EMERG_PURGE_PRES_MULT    = 0.6;   // Core pressure multiplied by this on line purge
const EMERG_PLASMA_DUMP_TEMP   = 0.5;   // Core temp multiplied by this on plasma dump
const EMERG_COOL_FLOOD_COOLANT = 100;   // coolantFlow set to this % on cool flood
const EMERG_COOL_FLOOD_AUX     = 100;   // auxCoolRate set to this % on cool flood
const EMERG_COOL_FLOOD_TEMP    = 0.3;   // Core temp multiplied by this on cool flood

// SCRAM
const SCRAM_LOCKOUT_MS        = 10000;  // Milliseconds controls stay locked after a SCRAM

// UPTIME & SCORING
const PLASMA_OFF_RESET_SECS   = 10;   // Seconds plasma must be off before uptime resets to 0
const SCORE_DIVISOR           = 3500; // Score increments +1 every floor(SCORE_DIVISOR / MW) ticks
const HEALTH_ALERT_THRESHOLDS = [75, 50, 25, 10, 5]; // Health % levels that trigger log alerts
const PERIODIC_WARN_TICKS     = 80;   // Ticks between periodic system warning log messages
const CRIT_HINT_RETRIGGER_TICKS = 400; // Ticks between repeated control hints while a gauge stays critical (~20s)

// INTRO OVERLAY
const INTRO_TITLE            = "Buga's Reactor Command";
const INTRO_VERSION          = document.getElementById("introVersion").textContent.trim();
const INTRO_TEXT             = "story placeholder...";
const INTRO_SWITCH_DELAY_MS         = 600;   // ms - pause after switch flips ON before fade starts
const INTRO_FADE_MS                 = 700;   // ms - smooth fade: intro content out + game in simultaneously
const INTRO_FLICKER_MS              = 3200;  // ms - total duration of the fluorescent flicker sequence
// Fluorescent flicker physics - B(t) = S(t) · [W(t) + α·sin(2πft)]
const INTRO_FLICKER_K               = 0.65;  // catch rate: P(on) = 1−e^(−k·t); lower = more desperate early struggling
const INTRO_FLICKER_M               = 0.4;   // warm-up rate: how quickly the tube climbs from B_start to full brightness
const INTRO_FLICKER_B_START         = 0.25;  // initial brightness when the tube first catches (0–1)
const INTRO_FLICKER_ALPHA           = 0.03;  // hum amplitude: subtle electrical oscillation on brightness
const INTRO_FLICKER_HUM_FREQ        = 120;   // Hz - electrical hum frequency (120 = 2× 60 Hz mains)
const INTRO_FLICKER_MIN_INTERVAL_MS = 20;    // ms - minimum hold/dark time (fast early stuttering)
const INTRO_FLICKER_MAX_INTERVAL_MS = 280;   // ms - maximum dark gap (long dark pauses early on)
const INTRO_FLICKER_RAMP_RATE       = 1.5;   // brightness ceiling units/sec at litProb=1; ensures all panels reach 1.0
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