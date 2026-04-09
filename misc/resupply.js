// resupply.js - RESUPPLY TAB (fuel market, upgrades, items)
// Load order: after reactor7.js, before reactor8.js

// MONEY FORMATTING
function fmtMoney(v) {
  const abs = Math.abs(v);
  let num, suffix;
  if (abs >= MONEY_FORMAT_B)      { num = v / MONEY_FORMAT_B; suffix = 'b'; }
  else if (abs >= MONEY_FORMAT_M) { num = v / MONEY_FORMAT_M; suffix = 'm'; }
  else if (abs >= MONEY_FORMAT_K) { num = v / MONEY_FORMAT_K; suffix = 'k'; }
  else return '$' + v.toFixed(0);
  const s = num.toFixed(1);
  return '$' + (s.endsWith('.00') ? num.toFixed(0) : s) + suffix;
}

// FUEL PRICE HELPERS
function getFuelBuyPrice() {
  return FUEL_PRICE_BASE_PER_PCT * S.fuelPriceMult;
}
function getFuelSellPrice() {
  return getFuelBuyPrice() * FUEL_SELL_RATIO;
}
function getFuelPricePerKg() {
  // Display price: $/kg label (1% fuel = ~100 kg for display purposes)
  return getFuelBuyPrice() / 100;
}

// FUEL PRICE NOISE (called each tick from sim.js)
function updateFuelPrice() {
  if (!S.fuelFirstPurchase) return;
  // Lerp current multiplier toward target
  S.fuelPriceMult += (S.fuelPriceTarget - S.fuelPriceMult) * FUEL_PRICE_LERP;
  // Check if it's time for a new target
  if (tick >= S.fuelPriceNextChange) {
    if (Math.random() < FUEL_PRICE_EXTREME_CHANCE) {
      // Extreme swing
      S.fuelPriceTarget = Math.random() < 0.6
        ? FUEL_PRICE_EXTREME_LOW + Math.random() * 0.3  // 0.50–0.80
        : FUEL_PRICE_EXTREME_HIGH - Math.random() * 0.5; // 1.50–2.00
    } else {
      // Normal fluctuation: +-35%
      S.fuelPriceTarget = 1 + (Math.random() * 2 - 1) * FUEL_PRICE_NORMAL_RANGE;
    }
    S.fuelPriceNextChange = tick + FUEL_PRICE_CHANGE_MIN + Math.random() * FUEL_PRICE_CHANGE_RANGE;
  }
}

// PURCHASE FUNCTIONS
function commsBlockPurchase() {
  if (S.modules.comms.status === 'offline') {
    addLog('COMMS OFFLINE - resupply unavailable', 'err');
    return true;
  }
  return false;
}

function spendMoney(amount) {
  if (S.money < amount) return false;
  S.money -= amount;
  S.totalSpent += amount;
  return true;
}

window.buyFuel = function(pct) {
  if (commsBlockPurchase()) return;
  if (!fuelUnlocked) { addLog('Fuel market locked until first startup complete', 'warn'); return; }
  if (!S.fuelFirstPurchase) {
    S.fuelFirstPurchase = true;
    S.fuelPriceNextChange = tick + FUEL_PRICE_CHANGE_MIN + Math.random() * FUEL_PRICE_CHANGE_RANGE;
  }
  const maxCap = getMaxFuel();
  const space = maxCap - S.fuelRemaining;
  if (space <= 0) { addLog('Fuel tanks full', 'warn'); return; }
  const actual = Math.min(pct, space);
  const cost = actual * getFuelBuyPrice();
  if (cost > S.money) { addLog('Insufficient funds', 'warn'); return; }
  spendMoney(cost);
  S.fuelRemaining = Math.min(maxCap, S.fuelRemaining + actual);
  addLog('Purchased ' + actual.toFixed(1) + '% fuel - ' + fmtMoney(cost), 'ok');
  updateResupplyValues();
};

window.buyFuelMax = function() {
  if (commsBlockPurchase()) return;
  if (!fuelUnlocked) { addLog('Fuel market locked until first startup complete', 'warn'); return; }
  const maxCap = getMaxFuel();
  const space = maxCap - S.fuelRemaining;
  if (space <= 0) { addLog('Fuel tanks full', 'warn'); return; }
  const pricePerPct = getFuelBuyPrice();
  const affordable = Math.min(space, S.money / pricePerPct);
  if (affordable < 0.01) { addLog('Insufficient funds', 'warn'); return; }
  if (!S.fuelFirstPurchase) {
    S.fuelFirstPurchase = true;
    S.fuelPriceNextChange = tick + FUEL_PRICE_CHANGE_MIN + Math.random() * FUEL_PRICE_CHANGE_RANGE;
  }
  const cost = affordable * pricePerPct;
  spendMoney(cost);
  S.fuelRemaining = Math.min(maxCap, S.fuelRemaining + affordable);
  addLog('Purchased ' + affordable.toFixed(1) + '% fuel - ' + fmtMoney(cost), 'ok');
  updateResupplyValues();
};

window.sellFuel = function(pct) {
  if (commsBlockPurchase()) return;
  if (!fuelUnlocked) { addLog('Fuel market locked until first startup complete', 'warn'); return; }
  if (S.fuelRemaining <= 0) { addLog('No fuel to sell', 'warn'); return; }
  const actual = Math.min(pct, S.fuelRemaining);
  if (actual <= 0) return;
  const sellPrice = actual * getFuelSellPrice();
  addLog('Sold ' + actual.toFixed(1) + '% fuel - +' + fmtMoney(sellPrice), 'ok');
  S.money += sellPrice;
  S.totalEarned += sellPrice;
  S.fuelRemaining = Math.max(0, S.fuelRemaining - actual);
  updateResupplyValues();
};

window.sellFuelAll = function() { sellFuel(S.fuelRemaining); };

// Buy/sell mode toggle
let fuelModeBuy = true;
window.toggleFuelMode = function() {
  fuelModeBuy = !fuelModeBuy;
  const sw = document.getElementById('rsFuelSwitch');
  if (sw) sw.classList.toggle('sell', !fuelModeBuy);
  updateResupplyValues();
};

function getMaxFuel() { return 100; } // fuel capacity is always 100%

// UPGRADE FUNCTIONS
function getUpgradeMaxHealth(key) {
  const tier = moduleUpgrades[key]?.health || 0;
  let bonus = 0;
  for (let i = 0; i < tier; i++) bonus += UPGRADE_HEALTH_BONUS[i];
  return 100 + bonus;
}

function getUpgradeDrainMult(key) {
  const tier = moduleUpgrades[key]?.drain || 0;
  return tier > 0 ? UPGRADE_DRAIN_MULT[tier - 1] : 1;
}

function getUpgradeEfficiencyBonus(key) {
  const tier = moduleUpgrades[key]?.efficiency || 0;
  let bonus = 0;
  for (let i = 0; i < tier; i++) bonus += UPGRADE_EFFICIENCY_BONUS[i];
  return bonus;
}

// Get actual upgrade cost for a module/type/tier (applies per-module multiplier)
function getUpgradeCost(key, type, tier) {
  let baseCosts;
  if (type === 'health')          baseCosts = UPGRADE_HEALTH_COST;
  else if (type === 'efficiency') baseCosts = UPGRADE_EFFICIENCY_COST;
  else if (type === 'drain')      baseCosts = UPGRADE_DRAIN_COST;
  else if (type === 'repair')     baseCosts = UPGRADE_REPAIR_SPEED_COST;
  else return 0;
  const mult = UPGRADE_MODULE_COST_MULT[key] || 1;
  return Math.round(baseCosts[tier] * mult);
}

function getRepairSpeedMult(key) {
  const tier = moduleUpgrades[key]?.repair || 0;
  return REPAIR_SPEED_MULT[tier];
}

function getRepairCostMult(key) {
  const tier = moduleUpgrades[key]?.repair || 0;
  return REPAIR_COST_MULT[tier];
}

window.buyUpgrade = function(key, type) {
  if (commsBlockPurchase()) return;
  const u = moduleUpgrades[key];
  if (!u) return;
  const tier = u[type]; // current tier
  const maxTier = type === 'repair' ? REPAIR_SPEED_TIERS : 3;
  if (tier >= maxTier) { addLog('Already max tier', 'warn'); return; }
  const cost = getUpgradeCost(key, type, tier);
  if (!spendMoney(cost)) { addLog('Insufficient funds', 'warn'); return; }
  u[type] = tier + 1;
  const m = S.modules[key];
  addLog(m.name + ' ' + type.toUpperCase() + ' upgraded to T' + u[type], 'ok');
  updateUpgradeCard(key);
  buildSys();
};

// SPECIAL ITEMS
let quickRepairPending = false; // waiting for module selection

window.buyEmergencyFuel = function() {
  if (commsBlockPurchase()) return;
  if (!spendMoney(ITEM_EMERGENCY_FUEL_COST)) { addLog('Insufficient funds', 'warn'); return; }
  S.fuelRemaining = Math.min(getMaxFuel(), S.fuelRemaining + ITEM_EMERGENCY_FUEL_AMOUNT);
  addLog('Emergency fuel cell: +' + ITEM_EMERGENCY_FUEL_AMOUNT + '% fuel', 'ok');
  updateResupplyValues();
};

window.buyQuickRepair = function(key) {
  if (commsBlockPurchase()) return;
  if (key) {
    const m = S.modules[key];
    if (!m) return;
    if (!spendMoney(ITEM_QUICK_REPAIR_COST)) { addLog('Insufficient funds', 'warn'); return; }
    const maxH = getUpgradeMaxHealth(key);
    m.health = Math.min(maxH, m.health + ITEM_QUICK_REPAIR_AMOUNT);
    addLog(m.name + ': +' + ITEM_QUICK_REPAIR_AMOUNT + ' health (quick repair)', 'ok');
    quickRepairPending = false;
    buildResupply();
    buildSys();
  } else {
    if (S.money < ITEM_QUICK_REPAIR_COST) { addLog('Insufficient funds', 'warn'); return; }
    quickRepairPending = !quickRepairPending;
    if (quickRepairPending) addLog('Quick Repair ready - select a module below', 'ok');
    buildResupply();
  }
};

window.buyDiagSweep = function() {
  if (commsBlockPurchase()) return;
  if (!spendMoney(ITEM_DIAGNOSTIC_SWEEP_COST)) { addLog('Insufficient funds', 'warn'); return; }
  let found = 0;
  Object.entries(S.modules).forEach(([k, m]) => {
    if (m.sysError && !m.sysErrorVisible) { m.sysErrorVisible = true; found++; }
  });
  addLog('Diagnostic sweep: ' + (found > 0 ? found + ' errors revealed' : 'no hidden errors'), found > 0 ? 'err' : 'ok');
  updateResupplyValues();
  buildSys();
};

window.buyOverclockBoost = function() {
  if (commsBlockPurchase()) return;
  if (!spendMoney(ITEM_OVERCLOCK_BOOST_COST)) { addLog('Insufficient funds', 'warn'); return; }
  overclockBoostEnd = tick + ITEM_OVERCLOCK_BOOST_TICKS;
  addLog('Overclock boost active for 60s', 'ok');
  updateResupplyValues();
};

window.buyContainmentPatch = function() {
  if (commsBlockPurchase()) return;
  if (!spendMoney(ITEM_CONTAINMENT_PATCH_COST)) { addLog('Insufficient funds', 'warn'); return; }
  S.containIntegrity = Math.min(100, S.containIntegrity + ITEM_CONTAINMENT_PATCH_AMOUNT);
  addLog('Containment patch: +' + ITEM_CONTAINMENT_PATCH_AMOUNT + '% integrity', 'ok');
  updateResupplyValues();
};

window.buyEventExtender = function() {
  if (commsBlockPurchase()) return;
  if (!S.activeEvent) { addLog('No active event', 'warn'); return; }
  if (!spendMoney(ITEM_EVENT_EXTENDER_COST)) { addLog('Insufficient funds', 'warn'); return; }
  S.activeEvent.time += ITEM_EVENT_EXTENDER_BONUS;
  addLog('Event timer extended +' + ITEM_EVENT_EXTENDER_BONUS + 's', 'ok');
  updateResupplyValues();
};

window.buySpecialUpgrade = function(key) {
  if (commsBlockPurchase()) return;
  const tier = specialUpgrades[key] || 0;
  if (tier >= SPEC_UPG_TIERS) return;
  const costs = key === 'eventSuppression' ? SPEC_UPG_EVENT_SUPPRESS_COSTS : SPEC_UPG_EMERGENCY_DELAY_COSTS;
  if (!spendMoney(costs[tier])) { addLog('Insufficient funds', 'warn'); return; }
  specialUpgrades[key] = tier + 1;
  const label = key === 'eventSuppression' ? 'Event Suppression' : 'Emergency Delayer';
  addLog(label + ' T' + (tier + 1) + ' - ' + SPEC_UPG_MULT_STEPS[tier].toFixed(1) + '× active', 'ok');
  rebuildSpecUpgradesSection();
};

window.buyTurbineSpeedUpgrade = function() {
  if (commsBlockPurchase()) return;
  const tier = specialUpgrades.turbineSpeedUpgrade || 0;
  if (tier >= SPEC_UPG_TURBINE_SPEED_TIERS) return;
  if (!spendMoney(SPEC_UPG_TURBINE_SPEED_COSTS[tier])) { addLog('Insufficient funds', 'warn'); return; }
  if (tier == 0) showToast(toastTurbineUpg1);
  specialUpgrades.turbineSpeedUpgrade = tier + 1;
  const newMax = getTurbineSafeMax();
  addLog('Turbine Speed T' + (tier + 1) + ' - safe limit ' + newMax.toFixed(0) + ' RPM', 'ok');
  rebuildSpecUpgradesSection();
};

window.buyModeUnlock = function(mode) {
  if (commsBlockPurchase()) return;
  const tier = modeUnlocks[mode] || 0;
  if (tier >= MODE_UNLOCK_TIERS) return;
  const costs = mode === 'overclock' ? MODE_UNLOCK_OVERCLOCK_COSTS
              : mode === 'eco'       ? MODE_UNLOCK_ECO_COSTS
              :                        MODE_UNLOCK_BYPASS_COSTS;
  if (!spendMoney(costs[tier])) { addLog('Insufficient funds', 'warn'); return; }
  const wasTier0 = tier === 0;
  modeUnlocks[mode] = tier + 1;
  syncModeStats();
  const label = mode.toUpperCase();
  addLog(label + ' MODE T' + (tier + 1) + ' unlocked', 'ok');
  buildResupply();
  buildSys();
  if (wasTier0) showToast(mode === 'overclock' ? toastUnlockOverclock : mode === 'eco' ? toastUnlockEco : toastUnlockBypass);
};

window.buyBackupGenUpgrade = function() {
  if (commsBlockPurchase()) return;
  const tier = specialUpgrades.backupGenerator || 0;
  if (tier >= SPEC_UPG_BACKUP_GEN_TIERS) return;
  if (!spendMoney(SPEC_UPG_BACKUP_GEN_COSTS[tier])) { addLog('Insufficient funds', 'warn'); return; }
  specialUpgrades.backupGenerator = tier + 1;
  const mw   = getBackupGenOutput().toFixed(0);
  const fuel = Math.round(getBackupGenFuelMult() * 100);
  addLog('Backup Generator T' + (tier + 1) + ' - ' + mw + 'MW / ' + fuel + '% fuel rate', 'ok');
  rebuildSpecUpgradesSection();
};

// FUEL ACTION DISPATCHERS (route through buy/sell mode)
window.buyFuelFull = function() {
  const space = getMaxFuel() - S.fuelRemaining;
  if (space > 0) buyFuel(space);
};

window.fuelAction = function(pct) {
  if (fuelModeBuy) buyFuel(pct);
  else sellFuel(pct);
};
window.fuelActionMax = function() {
  if (fuelModeBuy) buyFuelMax();
  else sellFuelAll();
};
window.fuelActionFull = function() {
  if (fuelModeBuy) buyFuelFull();
  else sellFuelAll();
};

// Targeted rebuild of a single system upgrade card
function updateUpgradeCard(key) {
  const card = document.getElementById('rsUpgCard_' + key);
  if (!card) return;
  const u    = moduleUpgrades[key];
  const maxH = getUpgradeMaxHealth(key);
  const hp   = card.querySelector('.upgrade-card-health');
  if (hp) hp.textContent = 'HP: ' + S.modules[key].health.toFixed(0) + '/' + maxH;
  card.querySelectorAll('.upgrade-track,.upgrade-track-tiered,.upgrade-pip-row,.upg-row-btn').forEach(t => t.remove());
  let tracks = buildUpgradeTrack(key, 'health', 'MAX HP', UPGRADE_HEALTH_BONUS, u.health, '+');
  if (key !== 'comms' && key !== 'sensor') {
    tracks += buildUpgradeTrack(key, 'efficiency', 'EFFICIENCY', UPGRADE_EFFICIENCY_BONUS.map(v => (v * 100).toFixed(0) + '%'), u.efficiency, '+');
  }
  tracks += buildUpgradeTrack(key, 'drain', 'DURABILITY', UPGRADE_DRAIN_MULT.map(v => Math.round((1 - v) * 100) + '%'), u.drain, '-drain ');
  tracks += buildUpgradeTrack(key, 'repair', 'REPAIR SPEED', null, u.repair, '');
  card.insertAdjacentHTML('beforeend', tracks);
}

// Targeted rebuild of only the special upgrades grid
function buildModeUnlockCard(mode) {
  const tier     = modeUnlocks[mode] || 0;
  const maxTiers = MODE_UNLOCK_TIERS;
  const tierBadge = tier > 0 ? 'T' + tier + '\u2009/\u2009T' + maxTiers : '\u2014\u2009/\u2009T' + maxTiers;
  const costs    = mode === 'overclock' ? MODE_UNLOCK_OVERCLOCK_COSTS
                 : mode === 'eco'       ? MODE_UNLOCK_ECO_COSTS
                 :                        MODE_UNLOCK_BYPASS_COSTS;
  const maxed    = tier >= maxTiers;

  // Effect text based on current tier
  let effectText;
  if (tier === 0) {
    effectText = 'LOCKED';
  } else if (mode === 'overclock') {
    effectText = '+' + Math.round((MODE_OVERCLOCK_PERF_TIERS[tier - 1] - 1) * 100) + '% perf, ' + MODE_OVERCLOCK_DRAIN_TIERS[tier - 1] + '\u00d7 drain';
  } else if (mode === 'eco') {
    effectText = '-' + Math.round((1 - MODE_ECO_PERF_TIERS[tier - 1]) * 100) + '% perf, ' + MODE_ECO_DRAIN_TIERS[tier - 1] + '\u00d7 drain';
  } else {
    effectText = '~' + Math.round(MODE_BYPASS_PERF_TIERS[tier - 1] * 100) + '% perf, no self-drain';
  }

  const dimmed = maxed || S.money < (costs[tier] || Infinity);
  let actionHtml;
  if (maxed) {
    actionHtml = `<button class="spec-upgrade-btn" disabled>MAXED</button>`;
  } else {
    const cost = costs[tier];
    let deltaText;
    if (mode === 'overclock') {
      deltaText = '+' + Math.round((MODE_OVERCLOCK_PERF_TIERS[tier] - 1) * 100) + '% perf';
    } else if (mode === 'eco') {
      deltaText = '-' + Math.round((1 - MODE_ECO_PERF_TIERS[tier]) * 100) + '% perf';
    } else {
      deltaText = '~' + Math.round(MODE_BYPASS_PERF_TIERS[tier] * 100) + '% perf';
    }
    actionHtml = `<button class="spec-upgrade-btn" id="specUpgMode_${mode}" onclick="buyModeUnlock('${mode}')" ${S.money < cost ? 'disabled' : ''}>\u2192 T${tier + 1}\u2002${deltaText}\u2002${fmtMoney(cost)}</button>`;
  }

  return `<div class="spec-upgrade-card${dimmed ? ' dimmed' : ''}" id="specCard_mode_${mode}">
    <div class="spec-upgrade-header">
      <span class="spec-upgrade-name">${mode.toUpperCase()} MODE</span>
      <span class="spec-upgrade-tier-badge">${tierBadge}</span>
    </div>
    <div class="spec-upgrade-effect">${effectText}</div>
    ${actionHtml}
  </div>`;
}

function rebuildModeUnlocksSection() {
  const grid = document.querySelector('.mode-unlocks-grid');
  if (!grid) return;
  grid.innerHTML = buildModeUnlockCard('overclock') + buildModeUnlockCard('eco') + buildModeUnlockCard('bypass');
}

function rebuildSpecUpgradesSection() {
  const grid = document.querySelector('.spec-upgrades-grid');
  if (!grid) return;
  const cards = [
    ...(!EVENTS_DISABLED ? [
      { maxed: (specialUpgrades.eventSuppression || 0) >= SPEC_UPG_TIERS, html: buildSpecUpgradeCard('specUpgSuppress', 'EVENT SUPPRESSION', 'interval between events', 'eventSuppression') },
      { maxed: (specialUpgrades.emergencyDelayer  || 0) >= SPEC_UPG_TIERS, html: buildSpecUpgradeCard('specUpgDelay',    'EMERGENCY DELAYER',  'event resolve time',     'emergencyDelayer') },
    ] : []),
    { maxed: (specialUpgrades.backupGenerator      || 0) >= SPEC_UPG_BACKUP_GEN_TIERS,       html: buildBackupGenUpgradeCard() },
    { maxed: (specialUpgrades.turbineSpeedUpgrade  || 0) >= SPEC_UPG_TURBINE_SPEED_TIERS,    html: buildTurbineSpeedUpgradeCard() },
  ];
  cards.sort((a, b) => a.maxed - b.maxed);
  grid.innerHTML = cards.map(c => c.html).join('');
}

function buildTurbineSpeedUpgradeCard() {
  const tier     = specialUpgrades.turbineSpeedUpgrade || 0;
  const maxTiers = SPEC_UPG_TURBINE_SPEED_TIERS;
  const tierBadge = tier > 0 ? 'T' + tier + '\u2009/\u2009T' + maxTiers : '\u2014\u2009/\u2009T' + maxTiers;
  const currentMax = getTurbineSafeMax();
  const effectText = currentMax.toFixed(0) + ' RPM safe limit';
  const maxed  = tier >= maxTiers;
  const dimmed = maxed || S.money < SPEC_UPG_TURBINE_SPEED_COSTS[tier];

  let actionHtml;
  if (maxed) {
    actionHtml = `<button class="spec-upgrade-btn" disabled>MAXED</button>`;
  } else {
    const nextMax   = SPEC_UPG_TURBINE_SPEED_BASE + (tier + 1) * (SPEC_UPG_TURBINE_SPEED_MAX - SPEC_UPG_TURBINE_SPEED_BASE) / maxTiers;
    const deltaRPM  = (nextMax - currentMax).toFixed(0);
    const cost      = SPEC_UPG_TURBINE_SPEED_COSTS[tier];
    actionHtml = `<button class="spec-upgrade-btn" id="specUpgTurbineSpeed" onclick="buyTurbineSpeedUpgrade()" ${S.money < cost ? 'disabled' : ''}>\u2192 T${tier + 1}\u2002+${deltaRPM} RPM\u2002${fmtMoney(cost)}</button>`;
  }

  const shouldPulse = tier === 0 && S.money >= SPEC_UPG_TURBINE_SPEED_COSTS[0];
  return `<div class="spec-upgrade-card${dimmed ? ' dimmed' : ''}${shouldPulse ? ' card-pulse' : ''}" id="specCard_turbineSpeedUpgrade">
    <div class="spec-upgrade-header">
      <span class="spec-upgrade-name">TURBINE SPEED</span>
      <span class="spec-upgrade-tier-badge">${tierBadge}</span>
    </div>
    <div class="spec-upgrade-effect">${effectText}</div>
    ${actionHtml}
  </div>`;
}

function buildDiagSpeedUpgradeCard() {
  const tier     = specialUpgrades.diagSpeed || 0;
  const maxTiers = SPEC_UPG_DIAG_SPEED_TIERS;
  const tierBadge = tier > 0 ? 'T' + tier + '\u2009/\u2009T' + maxTiers : '\u2014\u2009/\u2009T' + maxTiers;
  const speedMult = DIAG_ALL_SPEED_TIERS[tier];
  const effectText = speedMult + '\u00d7 Diagnose All speed';
  const maxed  = tier >= maxTiers;
  const dimmed = maxed || S.money < (SPEC_UPG_DIAG_SPEED_COSTS[tier] || Infinity);

  let actionHtml;
  if (maxed) {
    actionHtml = `<button class="spec-upgrade-btn" disabled>MAXED</button>`;
  } else {
    const nextMult = DIAG_ALL_SPEED_TIERS[tier + 1];
    const cost     = SPEC_UPG_DIAG_SPEED_COSTS[tier];
    actionHtml = `<button class="spec-upgrade-btn" id="specUpgDiagSpeed" onclick="buyDiagSpeedUpgrade()" ${S.money < cost ? 'disabled' : ''}>\u2192 T${tier + 1}\u2002${nextMult}\u00d7 speed\u2002${fmtMoney(cost)}</button>`;
  }
  return `<div class="spec-upgrade-card${dimmed ? ' dimmed' : ''}" id="specCard_diagSpeed">
    <div class="spec-upgrade-header">
      <span class="spec-upgrade-name">DIAGNOSE SPEED</span>
      <span class="spec-upgrade-tier-badge">${tierBadge}</span>
    </div>
    <div class="spec-upgrade-effect">${effectText}</div>
    ${actionHtml}
  </div>`;
}

window.buyDiagSpeedUpgrade = function() {
  const tier = specialUpgrades.diagSpeed || 0;
  if (tier >= SPEC_UPG_DIAG_SPEED_TIERS) { addLog('Diag Speed already maxed', 'warn'); return; }
  const cost = SPEC_UPG_DIAG_SPEED_COSTS[tier];
  if (S.money < cost) { addLog('Insufficient funds', 'warn'); return; }
  S.money -= cost;
  S.totalSpent += cost;
  specialUpgrades.diagSpeed = tier + 1;
  addLog('Diag Speed upgraded to T' + (tier + 1) + ' (' + DIAG_ALL_SPEED_TIERS[tier + 1] + '\u00d7)', 'ok');
  buildResupply();
};

// BUILD RESUPPLY TAB (full DOM rebuild - structural changes only)
let resupplyBuilt = false;
let resupplyQRP = false; // tracks quickRepairPending state at last build

function buildResupply() {
  const c = document.getElementById('resupplyGrid');
  if (!c) return;

  // Preserve scroll position across rebuilds (tab + each panel by index)
  const tabEl = document.getElementById('tab-resupply');
  const scrollTop = tabEl ? tabEl.scrollTop : 0;
  const panelScrolls = Array.from(c.querySelectorAll('.resupply-panel')).map(p => p.scrollTop);

  resupplyQRP = quickRepairPending;

  let html = '';

  // FUEL MARKET PANEL
  html += `<div class="resupply-panel" id="rsFuelPanel" style="position:relative">
    <div class="resupply-panel-title">FUEL MARKET</div>
    <div class="fuel-price-display">
      <span class="fuel-price-label">PRICE</span>
      <span class="fuel-price-value" id="rsFuelPrice"></span>
      <span class="fuel-price-trend" id="rsFuelTrend"></span>
    </div>
    <div class="fuel-status">
      <span id="rsFuelTank"></span>
      <span id="rsFuelFunds"></span>
    </div>
    <div class="fuel-controls">
      <div class="fuel-mode-switch" id="rsFuelSwitch" onclick="toggleFuelMode()">
        <div class="fuel-mode-label" id="rsFuelLabelBuy">BUY</div>
        <div class="fuel-mode-track"><div class="fuel-mode-thumb"></div></div>
        <div class="fuel-mode-label" id="rsFuelLabelSell">SELL</div>
      </div>
      <div class="resupply-btn-grid">
        <button class="resupply-btn buy" style="grid-column:1/-1" id="rsBuyMax" onclick="fuelActionMax()"><span id="rsBuyMaxL">BUY MAX</span><br><span class="btn-price" id="rsBuyMaxP"></span></button>
        <button class="resupply-btn buy" id="rsBuy1" onclick="fuelAction(1)"><span id="rsBuy1L">+1%</span><br><span class="btn-price" id="rsBuy1P"></span></button>
        <button class="resupply-btn buy" id="rsBuy5" onclick="fuelAction(5)"><span id="rsBuy5L">+5%</span><br><span class="btn-price" id="rsBuy5P"></span></button>
        <button class="resupply-btn buy" id="rsBuy25" onclick="fuelAction(25)"><span id="rsBuy25L">+25%</span><br><span class="btn-price" id="rsBuy25P"></span></button>
        <button class="resupply-btn buy" id="rsBuyFull" onclick="fuelActionFull()"><span id="rsBuyFullL">FULL REFILL</span><br><span class="btn-price" id="rsBuyFullP"></span></button>
      </div>
    </div>
    ${!fuelUnlocked ? `<div class="panel-lock-overlay" id="rsFuelLock"><div class="panel-lock-label">FUEL MARKET</div><div class="panel-lock-note">Complete first startup to unlock</div></div>` : ''}
    <div class="resupply-panel-title" style="margin-top:10px">MODE UPGRADES</div>
    <div class="mode-unlocks-grid">
      ${buildModeUnlockCard('overclock')}
      ${buildModeUnlockCard('eco')}
      ${buildModeUnlockCard('bypass')}
      ${buildDiagSpeedUpgradeCard()}
    </div>
  </div>`;

  // SYSTEM UPGRADES PANEL
  html += `<div class="resupply-panel">
    <div class="resupply-panel-title">SYSTEM UPGRADES</div>
    <div class="upgrade-grid">`;

  Object.entries(S.modules).forEach(([k, m]) => {
    const u = moduleUpgrades[k];
    const maxH = getUpgradeMaxHealth(k);
    html += `<div class="upgrade-card" id="rsUpgCard_${k}">
      <div class="upgrade-card-title">${m.name}</div>
      <div class="upgrade-card-health" id="rsHp_${k}">HP: ${m.health.toFixed(0)}/${maxH}</div>`;
    html += buildUpgradeTrack(k, 'health', 'MAX HP', UPGRADE_HEALTH_BONUS, u.health, '+');
    if (k !== 'comms' && k !== 'sensor') {
      html += buildUpgradeTrack(k, 'efficiency', 'EFFICIENCY', UPGRADE_EFFICIENCY_BONUS.map(v => (v * 100).toFixed(0) + '%'), u.efficiency, '+');
    }
    html += buildUpgradeTrack(k, 'drain', 'DURABILITY', UPGRADE_DRAIN_MULT.map(v => Math.round((1 - v) * 100) + '%'), u.drain, '-drain ');
    html += buildUpgradeTrack(k, 'repair', 'REPAIR SPEED', null, u.repair, '');
    html += `</div>`;
  });

  html += `</div></div>`;

  // SPECIAL ITEMS PANEL
  html += `<div class="resupply-panel" style="position:relative">
    <div class="resupply-panel-title">SPECIAL ITEMS</div>
    <div class="items-grid">`;

  html += buildItemBtn('rsItemRepair', 'QUICK REPAIR', '+' + ITEM_QUICK_REPAIR_AMOUNT + ' HP to module', ITEM_QUICK_REPAIR_COST, 'buyQuickRepair()', quickRepairPending);
  html += buildItemBtn('rsItemDiag', 'DIAG SWEEP', 'Reveal all errors', ITEM_DIAGNOSTIC_SWEEP_COST, 'buyDiagSweep()');
  html += buildItemBtn('rsItemCont', 'CONTAIN PATCH', '+' + ITEM_CONTAINMENT_PATCH_AMOUNT + '% integrity', ITEM_CONTAINMENT_PATCH_COST, 'buyContainmentPatch()');
  html += buildItemBtn('rsItemEvt', 'EVENT EXTENDER', '+' + ITEM_EVENT_EXTENDER_BONUS + 's timer', ITEM_EVENT_EXTENDER_COST, 'buyEventExtender()');

  html += `</div>`;

  // Special tiered upgrades - maxed cards sorted to bottom
  html += `<div class="resupply-panel-title" style="margin-top:10px">SPECIAL UPGRADES</div>`;
  html += `<div class="spec-upgrades-grid">`;
  const specCards = [
    ...(!EVENTS_DISABLED ? [
      { maxed: (specialUpgrades.eventSuppression || 0) >= SPEC_UPG_TIERS, html: buildSpecUpgradeCard('specUpgSuppress', 'EVENT SUPPRESSION', 'interval between events', 'eventSuppression') },
      { maxed: (specialUpgrades.emergencyDelayer  || 0) >= SPEC_UPG_TIERS, html: buildSpecUpgradeCard('specUpgDelay',    'EMERGENCY DELAYER',  'event resolve time',     'emergencyDelayer') },
    ] : []),
    { maxed: (specialUpgrades.backupGenerator      || 0) >= SPEC_UPG_BACKUP_GEN_TIERS,      html: buildBackupGenUpgradeCard() },
    { maxed: (specialUpgrades.turbineSpeedUpgrade  || 0) >= SPEC_UPG_TURBINE_SPEED_TIERS,   html: buildTurbineSpeedUpgradeCard() },
  ];
  specCards.sort((a, b) => a.maxed - b.maxed);
  specCards.forEach(sc => { html += sc.html; });
  html += `</div>`;

  // Quick repair module picker — overlays items + upgrades
  if (quickRepairPending) {
    html += `<div class="quick-repair-picker">
      <div class="resupply-panel-title" style="font-size:10px">SELECT MODULE TO REPAIR</div>
      <div class="repair-picker-grid">`;
    Object.entries(S.modules).forEach(([k, m]) => {
      const maxH = getUpgradeMaxHealth(k);
      const full = m.health >= maxH * 0.99;
      html += `<button class="resupply-btn buy" id="rsRepPick_${k}" onclick="buyQuickRepair('${k}')" ${full ? 'disabled' : ''}>${m.name}<br><span class="btn-price" id="rsRepPickP_${k}"></span></button>`;
    });
    html += `</div></div>`;
  }

  html += `</div>`;

  c.innerHTML = html;
  resupplyBuilt = true;
  if (tabEl) tabEl.scrollTop = scrollTop;
  c.querySelectorAll('.resupply-panel').forEach((p, i) => { if (panelScrolls[i]) p.scrollTop = panelScrolls[i]; });
  updateResupplyValues();

  // Snap quick-repair picker into view when it opens
  if (quickRepairPending) {
    const picker = c.querySelector('.quick-repair-picker');
    if (picker) requestAnimationFrame(() => picker.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
  }
}

// UPDATE RESUPPLY VALUES (DOM patches only - no rebuild)
function updateResupplyValues() {
  if (!resupplyBuilt) return;
  // If structure changed (quick repair picker toggled), do a full rebuild
  if (quickRepairPending !== resupplyQRP) { buildResupply(); return; }

  const buyPrice = getFuelBuyPrice();
  const sellPrice = getFuelSellPrice();
  const pricePerKg = getFuelPricePerKg();
  const maxCap = getMaxFuel();
  const space = maxCap - S.fuelRemaining;
  const priceColor = S.fuelPriceMult < 0.9 ? 'var(--green)' : S.fuelPriceMult > 1.1 ? 'var(--red)' : 'var(--amber)';
  const priceTrend = S.fuelPriceTarget > S.fuelPriceMult ? '▲' : S.fuelPriceTarget < S.fuelPriceMult ? '▼' : '—';
  const trendColor = S.fuelPriceTarget > S.fuelPriceMult * 1.02 ? 'var(--red)' : S.fuelPriceTarget < S.fuelPriceMult * 0.98 ? 'var(--green)' : 'var(--amber)';

  const cost1 = Math.min(space, 1) * buyPrice;
  const cost5 = Math.min(space, 5) * buyPrice;
  const cost25 = Math.min(space, 25) * buyPrice;
  const costFull = space * buyPrice;

  // Fuel price display
  const fp = document.getElementById('rsFuelPrice');
  if (fp) { fp.textContent = fmtMoney(pricePerKg) + '/kg'; fp.style.color = priceColor; }
  const ft = document.getElementById('rsFuelTrend');
  if (ft) { ft.textContent = priceTrend; ft.style.color = trendColor; }

  // Tank & funds
  const tk = document.getElementById('rsFuelTank');
  if (tk) tk.textContent = 'TANK: ' + S.fuelRemaining.toFixed(1) + '% / ' + maxCap + '%';
  const ff = document.getElementById('rsFuelFunds');
  if (ff) ff.textContent = 'FUNDS: ' + fmtMoney(S.money);

  // Fuel buttons: labels, colors, disabled states, prices
  const sellPricePerPct = getFuelSellPrice();
  const isBuy = fuelModeBuy;
  const btnClass = isBuy ? 'buy' : 'sell';

  function updBtn(id, priceId, labelId, disabled, priceText, label) {
    const b = document.getElementById(id);
    const p = document.getElementById(priceId);
    const l = document.getElementById(labelId);
    if (b) { b.disabled = disabled; b.className = 'resupply-btn ' + btnClass; }
    if (p) p.textContent = priceText;
    if (l) l.textContent = label;
  }

  if (isBuy) {
    const maxBtn = document.getElementById('rsBuyMax');
    if (maxBtn) maxBtn.style.gridColumn = '1/-1';
    updBtn('rsBuyMax', 'rsBuyMaxP', 'rsBuyMaxL', S.money < buyPrice * 0.01 || space <= 0, space > 0 ? fmtMoney(Math.min(S.money, costFull)) : 'FULL', 'BUY MAX');
    updBtn('rsBuy1', 'rsBuy1P', 'rsBuy1L', S.money < cost1 || space <= 0, fmtMoney(cost1), '+1%');
    updBtn('rsBuy5', 'rsBuy5P', 'rsBuy5L', S.money < cost5 || space <= 0, fmtMoney(cost5), '+5%');
    updBtn('rsBuy25', 'rsBuy25P', 'rsBuy25L', S.money < cost25 || space <= 0, fmtMoney(cost25), '+25%');
    updBtn('rsBuyFull', 'rsBuyFullP', 'rsBuyFullL', S.money < costFull || space <= 0, space > 0 ? fmtMoney(costFull) : 'FULL', 'FULL REFILL');
  } else {
    const sell1 = Math.min(1, S.fuelRemaining) * sellPricePerPct;
    const sell5 = Math.min(5, S.fuelRemaining) * sellPricePerPct;
    const sell25 = Math.min(25, S.fuelRemaining) * sellPricePerPct;
    const sellAll = S.fuelRemaining * sellPricePerPct;
    const maxBtn = document.getElementById('rsBuyMax');
    if (maxBtn) maxBtn.style.gridColumn = '1/-1';
    updBtn('rsBuyMax', 'rsBuyMaxP', 'rsBuyMaxL', S.fuelRemaining <= 0, S.fuelRemaining > 0 ? '+' + fmtMoney(sellAll) : 'EMPTY', 'SELL ALL');
    updBtn('rsBuy1', 'rsBuy1P', 'rsBuy1L', S.fuelRemaining < 1, '+' + fmtMoney(sell1), '-1%');
    updBtn('rsBuy5', 'rsBuy5P', 'rsBuy5L', S.fuelRemaining < 5, '+' + fmtMoney(sell5), '-5%');
    updBtn('rsBuy25', 'rsBuy25P', 'rsBuy25L', S.fuelRemaining < 25, '+' + fmtMoney(sell25), '-25%');
    updBtn('rsBuyFull', 'rsBuyFullP', 'rsBuyFullL', S.fuelRemaining <= 0, S.fuelRemaining > 0 ? '+' + fmtMoney(sellAll) : 'EMPTY', 'SELL ALL');
  }

  // Switch label highlights
  const lb = document.getElementById('rsFuelLabelBuy');
  const ls = document.getElementById('rsFuelLabelSell');
  if (lb) lb.classList.toggle('active', isBuy);
  if (ls) ls.classList.toggle('active', !isBuy);

  // Upgrade card HP values
  Object.entries(S.modules).forEach(([k, m]) => {
    const hp = document.getElementById('rsHp_' + k);
    if (hp) hp.textContent = 'HP: ' + m.health.toFixed(0) + '/' + getUpgradeMaxHealth(k);
  });

  // Upgrade row button disabled states
  document.querySelectorAll('.upg-row-btn').forEach(el => {
    const oc = el.getAttribute('onclick') || '';
    const m = oc.match(/buyUpgrade\('(\w+)','(\w+)'\)/);
    if (m) {
      const [, key, type] = m;
      const tier = moduleUpgrades[key]?.[type] || 0;
      const maxTier = type === 'repair' ? REPAIR_SPEED_TIERS : 3;
      if (tier < maxTier) el.disabled = S.money < getUpgradeCost(key, type, tier);
    }
  });

  // Item buttons disabled states
  const itemMap = {
    rsItemRepair:{ cost: ITEM_QUICK_REPAIR_COST, force: Object.entries(S.modules).every(([k, m]) => m.health >= getUpgradeMaxHealth(k) * 0.98) },
    rsItemDiag:  { cost: ITEM_DIAGNOSTIC_SWEEP_COST, force: !Object.values(S.modules).some(m => m.sysError && !m.sysErrorVisible) },
    rsItemCont:  { cost: ITEM_CONTAINMENT_PATCH_COST, force: S.containIntegrity >= 99.9 },
    rsItemEvt:   { cost: ITEM_EVENT_EXTENDER_COST, force: !S.activeEvent }
  };
  Object.entries(itemMap).forEach(([id, info]) => {
    const el = document.getElementById(id);
    if (el) el.disabled = info.force || S.money < info.cost;
  });

  // Quick repair picker HP values
  if (quickRepairPending) {
    Object.entries(S.modules).forEach(([k, m]) => {
      const maxH = getUpgradeMaxHealth(k);
      const p = document.getElementById('rsRepPickP_' + k);
      if (p) p.textContent = m.health.toFixed(0) + '/' + maxH + ' HP';
      const btn = document.getElementById('rsRepPick_' + k);
      if (btn) btn.disabled = m.health >= maxH * 0.99;
    });
  }

  // Mode unlock card disabled states
  [['overclock', MODE_UNLOCK_OVERCLOCK_COSTS], ['eco', MODE_UNLOCK_ECO_COSTS], ['bypass', MODE_UNLOCK_BYPASS_COSTS]].forEach(([mode, costs]) => {
    const tier    = modeUnlocks[mode] || 0;
    const maxed   = tier >= MODE_UNLOCK_TIERS;
    const cost    = maxed ? Infinity : costs[tier];
    const cantAfford = S.money < cost;
    const btnEl   = document.getElementById('specUpgMode_' + mode);
    if (btnEl) btnEl.disabled = cantAfford;
    const cardEl  = document.getElementById('specCard_mode_' + mode);
    if (cardEl) cardEl.classList.toggle('dimmed', maxed || cantAfford);
  });

  // Special upgrade button disabled states + card dimming
  [['specUpgSuppress', 'eventSuppression', SPEC_UPG_EVENT_SUPPRESS_COSTS, SPEC_UPG_TIERS],
   ['specUpgDelay',    'emergencyDelayer',  SPEC_UPG_EMERGENCY_DELAY_COSTS, SPEC_UPG_TIERS]
  ].forEach(([btnId, key, costs, maxTier]) => {
    const tier    = specialUpgrades[key] || 0;
    const maxed   = tier >= maxTier;
    const cost    = maxed ? Infinity : costs[tier];
    const cantAfford = S.money < cost;
    const btnEl   = document.getElementById(btnId);
    if (btnEl) btnEl.disabled = cantAfford;
    const cardEl  = document.getElementById('specCard_' + key);
    if (cardEl) cardEl.classList.toggle('dimmed', maxed || cantAfford);
  });
  const bgTier     = specialUpgrades.backupGenerator || 0;
  const bgMaxed    = bgTier >= SPEC_UPG_BACKUP_GEN_TIERS;
  const bgCost     = bgMaxed ? Infinity : SPEC_UPG_BACKUP_GEN_COSTS[bgTier];
  const bgCantAfford = S.money < bgCost;
  const bgBtnEl    = document.getElementById('specUpgBackupGen');
  if (bgBtnEl) bgBtnEl.disabled = bgCantAfford;
  const bgCardEl   = document.getElementById('specCard_backupGenerator');
  if (bgCardEl) bgCardEl.classList.toggle('dimmed', bgMaxed || bgCantAfford);

  const tsTier       = specialUpgrades.turbineSpeedUpgrade || 0;
  const tsMaxed      = tsTier >= SPEC_UPG_TURBINE_SPEED_TIERS;
  const tsCost       = tsMaxed ? Infinity : SPEC_UPG_TURBINE_SPEED_COSTS[tsTier];
  const tsCantAfford = S.money < tsCost;
  const tsBtnEl      = document.getElementById('specUpgTurbineSpeed');
  if (tsBtnEl) tsBtnEl.disabled = tsCantAfford;
  const tsCardEl     = document.getElementById('specCard_turbineSpeedUpgrade');
  if (tsCardEl) tsCardEl.classList.toggle('dimmed', tsMaxed || tsCantAfford);
  if (tsCardEl) tsCardEl.classList.toggle('card-pulse', tsTier === 0 && !tsCantAfford);
}

// ── Turbine arrow: mobile scroll hint for first turbine upgrade ──
let _turbineArrowBound = false;
const _turbineMQ = typeof matchMedia !== 'undefined'
  ? matchMedia('(orientation:portrait) and (max-width:1024px)') : null;

function updateTurbineArrow() {
  const arrow = document.getElementById('turbineArrow');
  if (!arrow) return;

  // Only on mobile, resupply tab active, T0, affordable, game running
  const isMobile   = _turbineMQ && _turbineMQ.matches;
  const resTab     = document.getElementById('tab-resupply');
  const resActive  = resTab && resTab.classList.contains('active');
  const tier       = specialUpgrades.turbineSpeedUpgrade || 0;
  const canAfford  = S.money >= SPEC_UPG_TURBINE_SPEED_COSTS[0];
  const show       = isMobile && resActive && tier === 0 && canAfford && !S.gameOver;

  if (!show) { arrow.style.display = 'none'; return; }
  arrow.style.display = '';

  // Bind listeners once
  if (!_turbineArrowBound) {
    _turbineArrowBound = true;
    resTab.addEventListener('scroll', _positionTurbineArrow, { passive: true });
    arrow.addEventListener('click', () => {
      document.querySelectorAll('.toast-close').forEach(btn => btn.click());
      _scrollToTurbineCard();
    });
  }
  _positionTurbineArrow();
}

function _positionTurbineArrow() {
  const arrow = document.getElementById('turbineArrow');
  const card  = document.getElementById('specCard_turbineSpeedUpgrade');
  if (!arrow || !card || arrow.style.display === 'none') return;

  const cardRect = card.getBoundingClientRect();
  const viewH    = window.innerHeight;
  // Arrow tip should sit just above the card top.
  // If card top is above where the arrow's resting bottom edge would be, park it there.
  const arrowRect = arrow.getBoundingClientRect();
  const arrowH   = arrowRect.height > 0 ? arrowRect.height : 92;
  const gap      = 6;
  const parkTop  = cardRect.top - arrowH - gap;
  const restTop  = viewH - 18 - arrowH;        // where the arrow sits when fixed to bottom

  if (parkTop <= restTop) {
    arrow.style.position = 'fixed';
    arrow.style.bottom = 'auto';
    arrow.style.top = Math.max(0, parkTop) + 'px';
  } else {
    arrow.style.position = 'fixed';
    arrow.style.top = 'auto';
    arrow.style.bottom = '18px';
  }
}

function _scrollToTurbineCard() {
  const container = document.getElementById('tab-resupply');
  const card      = document.getElementById('specCard_turbineSpeedUpgrade');
  if (!container || !card) return;

  const cRect  = container.getBoundingClientRect();
  const kRect  = card.getBoundingClientRect();
  const target = container.scrollTop + kRect.top - cRect.top
               - cRect.height / 2 + kRect.height / 2;
  const start  = container.scrollTop;
  const dist   = target - start;
  const dur    = 1000;
  const t0     = performance.now();

  (function step(now) {
    const p    = Math.min((now - t0) / dur, 1);
    const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    container.scrollTop = start + dist * ease;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

function getUpgradeTooltipLines(key, type, bonuses, currentTier, prefix) {
  const maxTier = type === 'repair' ? REPAIR_SPEED_TIERS : 3;
  const maxed = currentTier >= maxTier;
  const modName = S.modules[key]?.name || key;

  // Title & description per type
  const descs = {
    health:     ['MAX HEALTH', 'Increases the maximum health this module can have, letting it survive longer between repairs'],
    efficiency: ['EFFICIENCY', 'Boosts the performance output of this module regardless of system errors or degradation'],
    drain:      ['DURABILITY', 'Reduces the rate at which this module takes passive health damage over time'],
    repair:     ['REPAIR SPEED', 'Increases how fast this module is repaired, but also increases the cost per tick of repairing it']
  };
  const [title, desc] = descs[type] || [type.toUpperCase(), ''];
  const lines = [modName + ' \u2014 ' + title];
  lines.push(desc);

  // Current tier summary
  if (currentTier > 0) {
    if (type === 'repair') {
      const ds = (REPAIR_SPEED_MULT[currentTier] / REPAIR_SPEED_MULT[0]).toFixed(1);
      const dc = (REPAIR_COST_MULT[currentTier] / REPAIR_COST_MULT[0]).toFixed(1);
      lines.push('G:Current: ' + ds + '\u00d7 repair speed, ' + dc + '\u00d7 repair cost');
    } else if (type === 'health') {
      let total = 0;
      for (let i = 0; i < currentTier; i++) total += UPGRADE_HEALTH_BONUS[i];
      lines.push('G:Current: +' + total + ' max health (' + (100 + total) + ' total)');
    } else if (type === 'efficiency') {
      let total = 0;
      for (let i = 0; i < currentTier; i++) total += UPGRADE_EFFICIENCY_BONUS[i];
      lines.push('G:Current: +' + Math.round(total * 100) + '% performance');
    } else if (type === 'drain') {
      lines.push('G:Current: ' + Math.round((1 - UPGRADE_DRAIN_MULT[currentTier - 1]) * 100) + '% less damage taken');
    }
  }

  if (maxed) {
    lines.push('G:Fully upgraded');
  } else {
    const cost = getUpgradeCost(key, type, currentTier);
    // Next tier preview
    if (type === 'repair') {
      const ns = (REPAIR_SPEED_MULT[currentTier + 1] / REPAIR_SPEED_MULT[0]).toFixed(1);
      const nc = (REPAIR_COST_MULT[currentTier + 1] / REPAIR_COST_MULT[0]).toFixed(1);
      lines.push('Next: ' + ns + '\u00d7 repair speed, ' + nc + '\u00d7 repair cost');
    } else if (type === 'health') {
      lines.push('Next: +' + UPGRADE_HEALTH_BONUS[currentTier] + ' max health');
    } else if (type === 'efficiency') {
      lines.push('Next: +' + (UPGRADE_EFFICIENCY_BONUS[currentTier] * 100).toFixed(0) + '% performance');
    } else if (type === 'drain') {
      lines.push('Next: ' + Math.round((1 - UPGRADE_DRAIN_MULT[currentTier]) * 100) + '% less damage taken');
    }
    lines.push('Cost: ' + fmtMoney(cost));
    if (S.money < cost) lines.push('R:Insufficient funds');
  }
  return lines;
}

function buildUpgradeTrack(key, type, label, bonuses, currentTier, prefix) {
  const maxTier = type === 'repair' ? REPAIR_SPEED_TIERS : 3;
  const maxed = currentTier >= maxTier;
  const nextCost = maxed ? 0 : getUpgradeCost(key, type, currentTier);
  const canAfford = !maxed && S.money >= nextCost;

  // Indicator pips — always fully opaque red/green
  let pips = '';
  for (let i = 0; i < maxTier; i++) {
    pips += `<div class="upg-pip ${i < currentTier ? 'purchased' : 'unpurchased'}"></div>`;
  }

  return `<button class="upg-row-btn" data-ugk="${key}" data-ugt="${type}" onclick="buyUpgrade('${key}','${type}')" ${maxed || !canAfford ? 'disabled' : ''}>
    <span class="upg-row-label">${label}</span>
    <div class="upg-row-pips">${pips}</div>
  </button>`;
}

function buildItemBtn(id, name, desc, cost, onclick, active, forceDisabled) {
  const disabled = forceDisabled || S.money < cost;
  return `<button class="item-btn ${active ? 'active-mode' : ''}" id="${id}" onclick="${onclick}" ${disabled ? 'disabled' : ''}>
    <div class="item-name">${name}</div>
    <div class="item-desc">${desc}</div>
    <div class="item-cost">${fmtMoney(cost)}</div>
  </button>`;
}

function buildSpecUpgradeCard(btnId, name, effectLabel, key) {
  const tier  = specialUpgrades[key] || 0;
  const costs = key === 'eventSuppression' ? SPEC_UPG_EVENT_SUPPRESS_COSTS : SPEC_UPG_EMERGENCY_DELAY_COSTS;
  const currentMult = tier > 0 ? SPEC_UPG_MULT_STEPS[tier - 1] : 1.0;
  const tierBadge   = tier > 0 ? 'T' + tier + '\u2009/\u2009T' + SPEC_UPG_TIERS : '\u2014\u2009/\u2009T' + SPEC_UPG_TIERS;
  const effectText  = currentMult.toFixed(1) + '\u00d7 ' + effectLabel;
  const maxed       = tier >= SPEC_UPG_TIERS;
  const dimmed      = maxed || S.money < costs[tier];

  let actionHtml;
  if (maxed) {
    actionHtml = `<button class="spec-upgrade-btn" disabled>MAXED</button>`;
  } else {
    const nextMult = SPEC_UPG_MULT_STEPS[tier];
    const delta    = (nextMult - currentMult).toFixed(1);
    const cost     = costs[tier];
    actionHtml = `<button class="spec-upgrade-btn" id="${btnId}" onclick="buySpecialUpgrade('${key}')" ${S.money < cost ? 'disabled' : ''}>\u2192 T${tier + 1}\u2002+${delta}\u00d7\u2002${fmtMoney(cost)}</button>`;
  }

  return `<div class="spec-upgrade-card${dimmed ? ' dimmed' : ''}" id="specCard_${key}">
    <div class="spec-upgrade-header">
      <span class="spec-upgrade-name">${name}</span>
      <span class="spec-upgrade-tier-badge">${tierBadge}</span>
    </div>
    <div class="spec-upgrade-effect">${effectText}</div>
    ${actionHtml}
  </div>`;
}

function buildBackupGenUpgradeCard() {
  const tier        = specialUpgrades.backupGenerator || 0;
  const maxTiers    = SPEC_UPG_BACKUP_GEN_TIERS;
  const tierBadge   = tier > 0 ? 'T' + tier + '\u2009/\u2009T' + maxTiers : '\u2014\u2009/\u2009T' + maxTiers;
  const currentMW   = getBackupGenOutput();
  const currentFuel = Math.round(getBackupGenFuelMult() * 100);
  const effectText  = currentMW.toFixed(0) + 'MW\u2002\u2022\u2002' + currentFuel + '% fuel rate';
  const maxed       = tier >= maxTiers;
  const dimmed      = maxed || S.money < SPEC_UPG_BACKUP_GEN_COSTS[tier];

  let actionHtml;
  if (maxed) {
    actionHtml = `<button class="spec-upgrade-btn" disabled>MAXED</button>`;
  } else {
    const nextMW    = POWER_BACKUP_GEN_BONUS + (tier + 1) * (SPEC_UPG_BACKUP_GEN_MAX_MW - POWER_BACKUP_GEN_BONUS) / maxTiers;
    const nextFuel  = Math.round((1.0 - (tier + 1) * (1.0 - SPEC_UPG_BACKUP_GEN_MIN_FUEL) / maxTiers) * 100);
    const cost      = SPEC_UPG_BACKUP_GEN_COSTS[tier];
    const deltaMW   = (nextMW - currentMW).toFixed(0);
    const deltaFuel = currentFuel - nextFuel;
    actionHtml = `<button class="spec-upgrade-btn" id="specUpgBackupGen" onclick="buyBackupGenUpgrade()" ${S.money < cost ? 'disabled' : ''}>\u2192 T${tier + 1}\u2002+${deltaMW}MW\u2002-${deltaFuel}% fuel\u2002${fmtMoney(cost)}</button>`;
  }

  return `<div class="spec-upgrade-card${dimmed ? ' dimmed' : ''}" id="specCard_backupGenerator">
    <div class="spec-upgrade-header">
      <span class="spec-upgrade-name">BACKUP GENERATOR</span>
      <span class="spec-upgrade-tier-badge">${tierBadge}</span>
    </div>
    <div class="spec-upgrade-effect">${effectText}</div>
    ${actionHtml}
  </div>`;
}

// Upgrade row hover tooltips (reuses help tooltip, but only outside help mode)
// On mobile (portrait ≤1024px): first tap shows tooltip + prevents purchase, second tap confirms
(function() {
  const BONUS_DATA = {
    health:     { bonuses: UPGRADE_HEALTH_BONUS, prefix: '+' },
    efficiency: { bonuses: UPGRADE_EFFICIENCY_BONUS.map(v => (v * 100).toFixed(0) + '%'), prefix: '+' },
    drain:      { bonuses: UPGRADE_DRAIN_MULT.map(v => Math.round((1 - v) * 100) + '%'), prefix: '-drain ' },
    repair:     { bonuses: null, prefix: '' }
  };
  const mobileQuery = window.matchMedia('(orientation:portrait) and (max-width:1024px)');
  let previewedBtn = null; // the button currently previewed on mobile (tap-to-confirm)

  function showUpgTooltip(btn, x, y) {
    const key = btn.dataset.ugk;
    const type = btn.dataset.ugt;
    if (!key || !type) return;
    const tier = moduleUpgrades[key]?.[type] || 0;
    const bd = BONUS_DATA[type];
    if (!bd) return;
    const lines = getUpgradeTooltipLines(key, type, bd.bonuses, tier, bd.prefix);
    showHelpTooltip(x, y, lines);
  }

  // Desktop: mousemove tooltip
  document.addEventListener('mousemove', function(e) {
    if (typeof helpMode !== 'undefined' && helpMode) return;
    const btn = e.target.closest('.upg-row-btn');
    if (!btn) { hideHelpTooltip(); return; }
    showUpgTooltip(btn, e.clientX, e.clientY);
  });
  document.addEventListener('mouseout', function(e) {
    if (typeof helpMode !== 'undefined' && helpMode) return;
    if (!e.relatedTarget || !e.relatedTarget.closest('.upg-row-btn')) hideHelpTooltip();
  });

  // Mobile: tap-to-preview, tap again to confirm
  document.addEventListener('click', function(e) {
    if (!mobileQuery.matches) return;
    const btn = e.target.closest('.upg-row-btn');
    if (!btn) { previewedBtn = null; hideHelpTooltip(); return; }
    if (typeof helpMode !== 'undefined' && helpMode) return;
    if (previewedBtn === btn) {
      // Second tap — allow the onclick to fire, clear preview
      previewedBtn = null;
      hideHelpTooltip();
      return;
    }
    // First tap — show tooltip, block the purchase
    e.preventDefault();
    e.stopImmediatePropagation();
    previewedBtn = btn;
    const rect = btn.getBoundingClientRect();
    showUpgTooltip(btn, rect.left + rect.width / 2, rect.top);
  }, true); // capture phase to intercept before onclick
})();

// Build on load
buildResupply();
