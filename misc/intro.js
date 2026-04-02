// intro.js - Startup overlay interactivity
// Load order: last (after help.js).
// Needs KS, positionKnifeSwitch, animateKnifeSwitch, spawnSwitchSparks from reactor4.js.
// All configurable values come from INTRO_* constants in vars.js.

(function () {
  const overlay    = document.getElementById('introOverlay');
  const content    = document.getElementById('introContent');
  const titleEl    = document.getElementById('introTitle');
  const versionEl  = document.getElementById('introVersion');
  const boxEl      = document.getElementById('introTextBox');
  const rowEl      = document.getElementById('introRow');
  const labelEl    = document.getElementById('introSwitchLabel');
  const ks         = document.getElementById('introSwitch');
  if (!overlay || !ks) return;

  //  Apply all values from vars.js ─

  overlay.style.zIndex = INTRO_Z_INDEX;

  titleEl.textContent = INTRO_TITLE;
  titleEl.style.fontSize     = INTRO_TITLE_SIZE + 'px';
  titleEl.style.letterSpacing = INTRO_TITLE_SPACING + 'px';
  titleEl.style.textShadow   = `0 0 30px rgba(255,159,28,${INTRO_TITLE_GLOW})`;

  versionEl.textContent      = INTRO_VERSION;
  versionEl.style.fontSize   = INTRO_VERSION_SIZE + 'px';
  versionEl.style.letterSpacing = INTRO_VERSION_SPACING + 'px';
  versionEl.style.opacity    = INTRO_VERSION_OPACITY;
  versionEl.style.marginTop  = INTRO_VERSION_OFFSET + 'px';

  content.style.gap = INTRO_CONTENT_GAP + 'px';

  boxEl.textContent          = INTRO_TEXT;
  boxEl.style.width          = INTRO_BOX_WIDTH + 'px';
  boxEl.style.minHeight      = INTRO_BOX_MIN_HEIGHT + 'px';
  boxEl.style.fontSize       = INTRO_BOX_FONT_SIZE + 'px';
  boxEl.style.lineHeight     = INTRO_BOX_LINE_HEIGHT;

  rowEl.style.gap = INTRO_ROW_GAP + 'px';

  labelEl.style.fontSize     = '10px';
  labelEl.style.letterSpacing = '2px';

  //  Initialise switch handle to OFF (up) position ─
  positionKnifeSwitch(ks, false);

  let state = 0; // 0 = off; 1 = on (one-way - overlay cannot be re-shown)

  function turnOn() {
    if (state) return;
    state = 1;
    ks.classList.add('on');
    animateKnifeSwitch(ks, true, () => spawnSwitchSparks(ks));

    setTimeout(() => {
      overlay.style.animationDuration = INTRO_FLICKER_MS + 'ms';
      overlay.classList.add('flickering');
      overlay.addEventListener('animationend', () => {
        overlay.style.display = 'none';
      }, { once: true });
    }, INTRO_SWITCH_DELAY_MS);
  }

  //  Drag / click - mirrors setupKnifeSwitch, one-way only ─
  let dragging = false, startY = 0, startState = 0, lastZone = -1;
  const range        = KS.DOWN_Y - KS.UP_Y;
  const ON_THRESHOLD = KS.DOWN_Y - 10;

  function startDrag(clientY) {
    dragging = true; startY = clientY; startState = state; lastZone = state;
    document.body.style.cursor = 'ns-resize';
  }

  function moveDrag(clientY) {
    if (!dragging) return;
    const dy = clientY - startY;
    const centerY = startState === 0
      ? KS.UP_Y   + Math.max(0,      Math.min(range,  dy))
      : KS.DOWN_Y + Math.max(-range, Math.min(0,      dy));
    positionKnifeSwitch(ks, null, centerY);
    const wantOn = centerY >= ON_THRESHOLD ? 1 : 0;
    if (wantOn !== lastZone && wantOn !== state) { turnOn(); lastZone = wantOn; }
  }

  function endDrag(clientY) {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';
    const isClick = Math.abs(clientY - startY) < 8;
    if (isClick) turnOn();
    if (!state) animateKnifeSwitch(ks, false, null);
  }

  ks.addEventListener('mousedown',  e => { startDrag(e.clientY); e.preventDefault(); });
  ks.addEventListener('touchstart', e => { startDrag(e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  document.addEventListener('mousemove',  e => moveDrag(e.clientY));
  document.addEventListener('touchmove',  e => { if (dragging) { e.preventDefault(); moveDrag(e.touches[0].clientY); } }, { passive: false });
  document.addEventListener('mouseup',    e => endDrag(e.clientY));
  document.addEventListener('touchend',   e => endDrag(e.changedTouches[0].clientY));
})();
