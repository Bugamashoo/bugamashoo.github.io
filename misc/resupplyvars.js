// resupplyvars.js - RESUPPLY / MONEY / UPGRADE CONSTANTS
// Load order: 1st (immediately after vars.js, before all reactor scripts)

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
const REPAIR_COST_PER_TICK    = 1000;      // $/tick cost while actively repairing a module

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
const SPEC_UPG_TURBINE_SPEED_COSTS = [2400, 7600, 37000, 150000, 440000, 1100000, 2900000, 7800000, 19200000];

// Backup Generator upgrade (19 tiers, linear: 2MW -> 40MW output, 100% -> 50% fuel rate)
const SPEC_UPG_BACKUP_GEN_TIERS    = 19;
const SPEC_UPG_BACKUP_GEN_MAX_MW   = 40;   // Power output at max tier (2MW/tier × 19 + 2 base)
const SPEC_UPG_BACKUP_GEN_MIN_FUEL = 0.5;  // Fuel consumption multiplier at max tier (50% of base)
const SPEC_UPG_BACKUP_GEN_COSTS    = [24000, 33000, 45000, 62000, 85000, 117000, 161000, 221000, 304000, 418000, 575000, 791000, 1088000, 1496000, 2057000, 2828000, 3889000, 5347000, 7400000];

// MODE UNLOCK UPGRADES (global, 3 tiers each: T0=locked, T1-T3=scaling effectiveness)
// Base costs (not affected by module cost multiplier - these are global unlocks)
const MODE_UNLOCK_OVERCLOCK_COSTS = [210000, 850000, 4400000];   // T1, T2, T3
const MODE_UNLOCK_ECO_COSTS       = [25000, 300000, 2600000];
const MODE_UNLOCK_BYPASS_COSTS    = [40000, 175000, 400000];
const MODE_UNLOCK_TIERS           = 3; // Max tier for each mode unlock

// REPAIR SPEED UPGRADE (per-module, 5 tiers; affected by module cost multiplier)
// Raw multipliers applied to base repair rate/cost. Tier 0 is the default baseline (displayed as 1.0×).
const REPAIR_SPEED_TIERS          = 5;
const REPAIR_SPEED_MULT           = [0.5, 0.7, 1.0, 1.5, 2.15, 3.0];  // [base, T1, T2, T3, T4, T5]
const REPAIR_COST_MULT            = [0.25, 0.35, 0.5, 0.75, 1.075, 1.5]; // cost mult at each tier
const UPGRADE_REPAIR_SPEED_COST   = [15000, 50000, 150000, 400000, 1000000]; // Base cost per tier

// DIAG ALL (Diagnose All sweep) speed upgrade
const DIAG_ALL_BASE_MULT         = 0.1;   // Per-module speed for base Diag All sweep (0.1× = 10× slower than manual single diag)
const DIAG_ALL_SPEED_TIERS       = [0.1, 0.2, 0.4]; // Per-module speed tiers: T0=0.1×  T1=0.2×  T2=0.4× (max)
const SPEC_UPG_DIAG_SPEED_TIERS  = 2;   // Number of purchasable tiers (T1 and T2 can be bought; T0 = no upgrade)
const SPEC_UPG_DIAG_SPEED_COSTS  = [150000, 600000]; // Cost to buy T1, then T2

// FUEL+MONEY EXHAUSTION
const FUEL_MONEY_GAMEOVER_DELAY  = 100;    // Ticks with fuel=0 AND money=0 before game over (5s grace)
