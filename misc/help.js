// ============================================================
// help.js — HELP MODE
// Load order: last (after sim.js)
// Contains: toggleHelp(), tooltip logic, help descriptions
// ============================================================

let helpMode = false;
let helpEverClicked = false;

// ── Descriptions: switches ────────────────────────────────────
// First element = title (amber). Rest = effect lines (cyan, › prefix).
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
  rodSafetyOff:  ['ROD SAFETY OFF',  'Disables control rod safety interlock', 'Allows rods to be physically inserted into the plasma'],

  // Ignition panel push buttons
  ignBtn:  ['IGNITE',    'Hold continuously for 3 seconds to fire plasma ignition', 'Requires IGN PRIME and AUX POWER to be active'],
  testBtn: ['LAMP TEST', 'Flashes all warning indicators amber for one second', 'Confirms every warning light in the system is functional'],
  purgeBtn:['LINE PURGE','G:- core pressure (significant)', 'Vents the fuel delivery lines to relieve pressure buildup'],
};

// ── Descriptions: levers ─────────────────────────────────────
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

// ── Descriptions: knobs ──────────────────────────────────────
const HELP_KNOB = {
  pressureRelief: ['PRESSURE RELIEF', 'G:- core pressure (moderate)', 'No direct effect on temperature or plasma'],
  mixRatio:       ['MIX RATIO',        'R:+ core temperature (slight)', 'Adjusts fuel-plasma mixture for heat efficiency'],
  fieldTune:      ['FIELD TUNE',       'G:+ magnetic flux efficiency', 'G:+ plasma stability', 'Fine-tunes the confinement field geometry'],
};

// ── Descriptions: gauges / readouts ──────────────────────────
// Format: ['GAUGE NAME', 'One sentence description.']
const HELP_GAUGE = {
  coreTemp:         ['CORE TEMP',         'Temperature of the reaction plasma — high values degrade containment integrity and destabilize plasma confinement.'],
  corePressure:     ['CORE PRESSURE',     'Internal pressure of the reaction chamber — excess pressure risks vessel breach and disrupts plasma stability.'],
  plasmaStability:  ['PLASMA STABILITY',  'How well the plasma is confined — low stability leads to loss of ignition, containment failure, or reactor damage.'],
  neutronDensity:   ['NEUTRON DENSITY',   'Density of neutrons produced by the reaction — indicates fusion intensity and is the primary source of radiation output.'],
  coolantTemp:      ['COOLANT TEMP',      'Temperature of the primary coolant circuit — overheating reduces cooling effectiveness and risks thermal damage to the loop.'],
  coolantFlowRate:  ['COOLANT FLOW',      'Volume of coolant moving through the primary loop per minute — insufficient flow allows core heat to build unchecked.'],
  turbineRPM:       ['TURBINE RPM',       'Rotation speed of the turbine generator — drives all electrical power output; excessive speed risks mechanical disintegration.'],
  containIntegrity: ['CONTAIN INTEGRITY', 'Structural health of the magnetic containment field — loss at critical levels allows plasma contact with vessel walls.'],
  magneticFlux:     ['MAGNETIC FLUX',     'Strength of the active magnetic confinement field — directly determines plasma stability and how well the plasma is held.'],
  radiationLevel:   ['RADIATION',         'Radiation escaping the reactor — elevated by high neutron flux, disabled shielding, or degraded containment integrity.'],
  auxCoolTemp:      ['AUX COOL TEMP',     'Temperature of the backup cooling circuit — indicates the heat load being handled by secondary cooling systems.'],
  auxCoolFlow:      ['AUX COOL FLOW',     'Flow rate through the auxiliary cooling loop — provides supplemental heat removal when primary cooling is under stress.'],
  backupFieldStr:   ['BACKUP FIELD STR',  'Strength of the backup magnetic containment field — supplements the main field and contributes to containment integrity recovery.'],
  secondaryPressure:['SECONDARY PRES',    'Pressure in the secondary containment circuit — driven by core pressure levels and backup field power settings.'],
  rodPosition:      ['ROD POSITION',      'Average insertion depth of all control rods — rods absorb neutrons to reduce core heat, neutron density, and power output.'],
  heatSinkTemp:     ['HEAT SINK TEMP',    'Temperature of the primary thermal heat sink — reflects the overall heat load being rejected from the cooling system.'],
  fuelRemaining:    ['FUEL REMAINING',    'Current fuel reserve level — depleting fully shuts off plasma ignition and brings the reactor to a halt.'],
  fuelConsump:      ['FUEL CONSUMPTION',  'Rate at which fuel is being consumed — rises with injection rate and reactor load.'],
  netOutput:        ['NET OUTPUT (MW)',    'Total electrical power being generated — the primary measure of reactor performance and scoring.'],
};

// ── Descriptions: emergency push buttons ─────────────────────
const HELP_BIGBTN = {
  'PLASMA DUMP': ['PLASMA DUMP',  'G:- core temperature (significant)', 'Immediately terminates plasma ignition'],
  'COOL FLOOD':  ['COOL FLOOD',   'Maximizes all primary and backup coolant systems instantly', 'G:- core temperature (significant)'],
  'HARD RESET':  ['HARD RESET',   'Takes all modules offline briefly and clears system errors', 'Zeros all controls and resets lever positions'],
};

// ── Descriptions: SCRAM button ───────────────────────────────
const HELP_SCRAM = ['SCRAM', 'Emergency reactor shutdown — kills all main switches, zeros all controls, and locks out the main panel for several seconds.'];

// ── Descriptions: systems tab per-module buttons ─────────────
const HELP_SYS_BTN = {
  modeNormal:    ['MODE: NORMAL',    'Standard operating mode', '+ balanced performance', '+ normal health drain rate'],
  modeOverclock: ['MODE: OVERCLOCK', 'G:+ performance by 50%', 'R:- tripled health drain rate', 'R:- adds significant heat to the core'],
  modeEco:       ['MODE: ECO',       'R:- performance reduced to 60%', 'G:+ very slow health drain', 'G:+ slight reduction in core heat'],
  modeBypass:    ['MODE: BYPASS',    'G:+ runs at 90% performance with no self-drain', 'R:- redirects all stress to backup systems instead'],
  restart:       ['RESTART',         'Takes the module fully offline to clear all system errors', 'Module is unavailable for several seconds during restart'],
  power:         ['POWER ON / OFF',  'Toggles the module offline or online without affecting health', 'Module is unavailable while transitioning'],
  diagnose:      ['DIAGNOSE',        'Runs a scan to reveal any hidden system errors', 'Takes a few seconds — only one module can be diagnosed at a time'],
  repair:        ['REPAIR',          'Gradually restores module health over time', 'Offline modules repair significantly faster than online ones'],
};

// ── Descriptions: systems tab bulk control buttons ────────────
const HELP_BULK_BTN = {
  powerAll:     ['POWER ALL ON / OFF', 'Toggles all modules online or offline simultaneously', 'Useful for a full system power cycle'],
  restartAll:   ['RESTART ALL',        'Restarts all modules at once', 'Clears all system errors across every module simultaneously'],
  allNormal:    ['ALL NORMAL',         'Sets all compatible modules to Normal mode at once'],
  allOverclock: ['ALL OVERCLOCK',      'Sets all compatible modules to Overclock mode at once', 'R:- significantly accelerates health drain across the board'],
  allEco:       ['ALL ECO',            'Sets all compatible modules to Eco mode at once', 'G:+ significantly slows health drain across the board'],
  allBypass:    ['ALL BYPASS',         'Sets all compatible modules to Bypass mode at once', 'R:- concentrates all stress onto backup systems'],
};

// ── Tooltip DOM helpers ───────────────────────────────────────
function fmtLine(text) {
  // Wrap leading + or - in a bold oversized span
  return text.replace(/^([+\-])/, '<span class="help-sym">$1</span>');
}

function showHelpTooltip(x, y, lines) {
  const tt = document.getElementById('helpTooltip');
  tt.innerHTML = lines.map((l, i) => {
    if (i === 0) return `<div class="help-tt-title">${l}</div>`;
    let cls = 'help-tt-line';
    if      (l.startsWith('G:')) { cls += ' good'; l = l.slice(2); }
    else if (l.startsWith('R:')) { cls += ' bad';  l = l.slice(2); }
    return `<div class="${cls}">${fmtLine(l)}</div>`;
  }).join('');
  tt.style.display = 'block';

  // Position offset from cursor; flip if near viewport edge
  const margin = 14;
  tt.style.left = (x + margin) + 'px';
  tt.style.top  = (y + margin) + 'px';

  // After paint, clamp to viewport
  requestAnimationFrame(() => {
    const r = tt.getBoundingClientRect();
    if (r.right  > window.innerWidth  - 8) tt.style.left = (x - r.width  - margin) + 'px';
    if (r.bottom > window.innerHeight - 8) tt.style.top  = (y - r.height - margin) + 'px';
  });
}

function hideHelpTooltip() {
  document.getElementById('helpTooltip').style.display = 'none';
}

// ── Element → help info lookup ────────────────────────────────
function getHelpInfo(el) {
  if (!el) return null;

  // Knife switch
  const ks = el.closest('.knife-switch');
  if (ks && ks.dataset.switch) return HELP_CTRL[ks.dataset.switch] || null;

  // Switch group (label / indicator)
  const sg = el.closest('.switch-group');
  if (sg) {
    const innerKs = sg.querySelector('.knife-switch');
    if (innerKs && innerKs.dataset.switch) return HELP_CTRL[innerKs.dataset.switch] || null;
  }

  // Lever track or handle
  const lt = el.closest('.lever-track');
  if (lt && lt.dataset.lever) return HELP_LEVER[lt.dataset.lever] || null;

  // Lever group (name / readout)
  const lg = el.closest('.lever-group');
  if (lg) {
    const innerLt = lg.querySelector('.lever-track');
    if (innerLt && innerLt.dataset.lever) return HELP_LEVER[innerLt.dataset.lever] || null;
  }

  // Knob group
  const kg = el.closest('.knob-group');
  if (kg) {
    const ro = kg.querySelector('[id^="readout_"]');
    if (ro) return HELP_KNOB[ro.id.replace('readout_', '')] || null;
  }

  // SCRAM button
  if (el.closest('#scramBtn')) return HELP_SCRAM;

  // Named push buttons (ignite / test / purge)
  for (const id of ['ignBtn', 'testBtn', 'purgeBtn']) {
    if (el.closest('#' + id)) return HELP_CTRL[id] || null;
  }

  // Emergency push buttons (text-matched)
  const pb = el.closest('.push-btn');
  if (pb) {
    const label = pb.textContent.trim().replace(/\s+/g, ' ');
    for (const key of Object.keys(HELP_BIGBTN)) {
      if (label.includes(key)) return HELP_BIGBTN[key];
    }
  }

  // Systems tab mod-btn buttons (matched by onclick attribute)
  const mb = el.closest('button.mod-btn');
  if (mb) {
    const oc = mb.getAttribute('onclick') || '';
    if (oc.includes('setMode')) {
      if (oc.includes("'normal'"))    return HELP_SYS_BTN.modeNormal;
      if (oc.includes("'overclock'")) return HELP_SYS_BTN.modeOverclock;
      if (oc.includes("'eco'"))       return HELP_SYS_BTN.modeEco;
      if (oc.includes("'bypass'"))    return HELP_SYS_BTN.modeBypass;
    }
    if (oc.includes('rstMod('))      return HELP_SYS_BTN.restart;
    if (oc.includes('powerMod('))    return HELP_SYS_BTN.power;
    if (oc.includes('diagMod('))     return HELP_SYS_BTN.diagnose;
    if (oc.includes('toggleRepair('))return HELP_SYS_BTN.repair;
    if (oc.includes('powerAllMods')) return HELP_BULK_BTN.powerAll;
    if (oc.includes('rstAllMods'))   return HELP_BULK_BTN.restartAll;
    if (oc.includes("setAllMode('normal')"))    return HELP_BULK_BTN.allNormal;
    if (oc.includes("setAllMode('overclock')")) return HELP_BULK_BTN.allOverclock;
    if (oc.includes("setAllMode('eco')"))       return HELP_BULK_BTN.allEco;
    if (oc.includes("setAllMode('bypass')"))    return HELP_BULK_BTN.allBypass;
  }

  // Gauge display box
  const db = el.closest('.display-box');
  if (db) {
    const disp = db.querySelector('[id^="disp_"]');
    if (disp) {
      const gId = disp.id.replace('disp_', '');
      const info = HELP_GAUGE[gId];
      if (info) return [info[0], info[1]]; // title + one sentence
    }
  }

  // Net power output display
  if (el.closest('#netOutput') || el.id === 'netOutput') {
    const g = HELP_GAUGE.netOutput;
    return [g[0], g[1]];
  }

  return null;
}

// ── Overlay mouse handling ────────────────────────────────────
(function () {
  const overlay = document.getElementById('helpOverlay');
  let lastX = 0, lastY = 0;

  overlay.addEventListener('mousemove', function (e) {
    lastX = e.clientX; lastY = e.clientY;
    // Temporarily hide overlay so elementFromPoint finds what's beneath
    this.style.pointerEvents = 'none';
    const under = document.elementFromPoint(lastX, lastY);
    this.style.pointerEvents = '';

    const info = getHelpInfo(under);
    if (info) showHelpTooltip(lastX, lastY, info);
    else hideHelpTooltip();
  });

  overlay.addEventListener('mouseleave', () => hideHelpTooltip());
  overlay.addEventListener('click', e => e.stopPropagation());
})();

// ── Toggle ────────────────────────────────────────────────────
function toggleHelp() {
  if (!helpEverClicked) {
    helpEverClicked = true;
    document.getElementById('helpBtn').classList.remove('help-pulse');
  }
  helpMode = !helpMode;
  document.body.classList.toggle('help-mode', helpMode);
  document.getElementById('helpBtnVal').textContent = helpMode ? '■ ON' : '? HELP';
  if (!helpMode) hideHelpTooltip();
}

// Start pulsing immediately
document.getElementById('helpBtn').classList.add('help-pulse');
