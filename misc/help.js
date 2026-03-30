// help.js - HELP MODE
// Load order: last (after helpdata.js)
// Contains: toggleHelp(), tooltip logic, element>data lookup
// Help text data lives in helpdata.js

let helpMode = false;
let helpEverClicked = false;

// Tooltip DOM helpers
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

  // Render offscreen to measure true dimensions before positioning
  tt.style.left = '-9999px';
  tt.style.top  = '-9999px';
  tt.style.display = 'block';

  const margin = 14;
  const w  = tt.offsetWidth;
  const h  = tt.offsetHeight;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let left = x + margin;
  let top  = y + margin;
  if (left + w > vw - 8) left = x - w - margin;
  if (top  + h > vh - 8) top  = y - h - margin;
  // Hard clamp so it never escapes the viewport
  left = Math.max(8, Math.min(left, vw - w - 8));
  top  = Math.max(8, Math.min(top,  vh - h - 8));

  tt.style.left = left + 'px';
  tt.style.top  = top  + 'px';
}

function hideHelpTooltip() {
  document.getElementById('helpTooltip').style.display = 'none';
}

// Element > help info lookup
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

  // Money header box
  if (el.closest('.hdr-box-money')) return HELP_MONEY;

  // Resupply tab elements
  const resBtn = el.closest('.resupply-btn');
  if (resBtn) {
    if (resBtn.classList.contains('sell')) return HELP_RESUPPLY.sellFuel;
    if (resBtn.classList.contains('buy')) return HELP_RESUPPLY.buyFuel;
  }
  if (el.closest('.fuel-price-display')) return HELP_RESUPPLY.fuelPrice;
  const itemBtn = el.closest('.item-btn');
  if (itemBtn) {
    const oc = itemBtn.getAttribute('onclick') || '';
    if (oc.includes('EmergencyFuel'))    return HELP_RESUPPLY.itemFuel;
    if (oc.includes('QuickRepair'))      return HELP_RESUPPLY.itemRepair;
    if (oc.includes('DiagSweep'))        return HELP_RESUPPLY.itemDiag;
    if (oc.includes('OverclockBoost'))   return HELP_RESUPPLY.itemOC;
    if (oc.includes('ContainmentPatch')) return HELP_RESUPPLY.itemContain;
    if (oc.includes('EventExtender'))    return HELP_RESUPPLY.itemEvent;
  }
  const upgTier = el.closest('.upgrade-tier.available');
  if (upgTier) {
    const oc = upgTier.getAttribute('onclick') || '';
    if (oc.includes("'health'"))     return HELP_RESUPPLY.upgHealth;
    if (oc.includes("'efficiency'")) return HELP_RESUPPLY.upgEfficiency;
    if (oc.includes("'drain'"))      return HELP_RESUPPLY.upgDrain;
  }

  return null;
}

// Overlay mouse handling
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

  // Touch support for mobile help mode
  overlay.addEventListener('touchstart', function (e) {
    const t = e.touches[0];
    this.style.pointerEvents = 'none';
    const under = document.elementFromPoint(t.clientX, t.clientY);
    this.style.pointerEvents = '';
    const info = getHelpInfo(under);
    if (info) { e.preventDefault(); showHelpTooltip(t.clientX, t.clientY, info); }
    else hideHelpTooltip();
  }, { passive: false });
})();

// Toggle
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
