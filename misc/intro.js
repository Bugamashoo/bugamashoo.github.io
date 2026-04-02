// intro.js - Startup overlay interactivity
// Load order: last (after help.js).
// Needs KS, positionKnifeSwitch, animateKnifeSwitch, spawnSwitchSparks from reactor4.js.
// All configurable values come from INTRO_* constants in vars.js.

(function () {
  const overlay    = document.getElementById('introOverlay');
  const blackout   = document.getElementById('introBlackout');
  const content    = document.getElementById('introContent');
  const titleEl    = document.getElementById('introTitle');
  const versionEl  = document.getElementById('introVersion');
  const boxEl      = document.getElementById('introTextBox');
  const rowEl      = document.getElementById('introRow');
  const labelEl    = document.getElementById('introSwitchLabel');
  const ks         = document.getElementById('introSwitch');
  const flashCheck = document.getElementById('introFlashCheck');
  if (!overlay || !ks) return;

  // Wire the "disable flashing lights" checkbox - updates the global flag and
  // adds/removes body.no-flash so CSS animations are suppressed site-wide.
  if (flashCheck) {
    flashCheck.addEventListener('change', () => {
      FLASH_DISABLED = flashCheck.checked;
      document.body.classList.toggle('no-flash', flashCheck.checked);
    });
  }

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
      // Phase 1: title screen (#introOverlay) fades out smoothly.
      // The header is visible above #introBlackout (z-index 8) the whole time.
      overlay.classList.add('flickering'); // disables pointer events
      overlay.style.transition = `opacity ${INTRO_FADE_MS}ms linear`;
      overlay.style.opacity    = '0';

      // Phase 2: once the title is gone, either flicker or instantly clear blackout.
      setTimeout(() => {
        overlay.style.display = 'none';
        if (FLASH_DISABLED) {
          blackout.style.display = 'none';
        } else {
          requestAnimationFrame(() => startFlicker());
        }
      }, INTRO_FADE_MS);
    }, INTRO_SWITCH_DELAY_MS);
  }

  // ── Fluorescent tube flicker: B(t) = S(t) · [W(t) + α·sin(2πft)] ────────
  //
  // S(t)  - binary on/off flicker state.  Sampled at random intervals via a
  //          separate setTimeout chain.  P(on) = 1 − e^(−k·t) so the tube
  //          struggles to catch early and stabilises over time.
  //
  // W(t)  - slow warm-up envelope: starts at B_start and climbs toward 1 via
  //          W(t) = B_start + (1−B_start)·(1−e^(−m·t)).
  //
  // hum   - α·sin(2πft): faint electrical oscillation always present when lit.
  //
  // B(t) is brightness in [0,1].  Overlay opacity = 1 − B(t) because opacity 1
  // is fully visible (tube OFF) and opacity 0 is fully transparent (tube ON).
  //
  // Two loops run concurrently:
  //   • rAF  - re-evaluates W(t)+hum every display frame (smooth continuous glow)
  //   • setTimeout chain - re-samples S(t) at random jittered intervals
  function startFlicker() {
    const start = performance.now();
    const dur   = INTRO_FLICKER_MS;
    let S        = 0;   // binary flicker state from sampleS()
    let maxBright = INTRO_FLICKER_MIN_BRIGHT;  // ceiling on brightness — only climbs while S=1
    let lastFrameTime = performance.now();
    let done = false;

    // - S(t) sampler: random-interval binary state drawn from P(on) = 1−e^(−k·t) —
    function sampleS() {
      if (done) return;
      const t  = (performance.now() - start) / 1000; // seconds
      const Pon = 1 - Math.exp(-INTRO_FLICKER_K * t);
      S = Math.random() < Pon ? 1 : 0;

      // Interval shrinks as the tube stabilises (faster chaos early → slower calm late)
      const tNorm    = Math.min(t / (dur / 1000), 1);
      const range    = INTRO_FLICKER_MAX_INTERVAL_MS - INTRO_FLICKER_MIN_INTERVAL_MS;
      const interval = INTRO_FLICKER_MIN_INTERVAL_MS +
                       Math.random() * range * (0.2 + tNorm * 0.8);
      setTimeout(sampleS, interval);
    }
    sampleS();

    // - rAF loop: applies B(t) to overlay opacity every display frame —
    function frame(now) {
      const elapsed = now - start;
      const t  = elapsed / 1000; // seconds
      const dt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      // Once past the nominal duration, force S=1 so the tube stays lit
      // and maxBright keeps climbing to 1.0 naturally — no hard jump.
      const pastEnd = elapsed >= dur;
      if (pastEnd) S = 1;

      // maxBright only climbs while the arc is sustained (S=1).
      // Rate scales with litProb so early catches barely raise the ceiling
      // before the arc fails, while late sustained arcs push it to 1.0 quickly.
      if (S === 1) {
        const litProb = pastEnd ? 1 : (1 - Math.exp(-INTRO_FLICKER_K * t));
        maxBright = Math.min(1, maxBright + INTRO_FLICKER_RAMP_RATE * litProb * dt);
      }

      // Done once maxBright has fully reached 1.0 (no visible jump)
      if (maxBright >= 0.995) {
        done = true;
        blackout.style.opacity = '0';
        setTimeout(() => { blackout.style.display = 'none'; }, 80);
        return;
      }

      // W(t): slow warm-up envelope B_start → 1
      const W = INTRO_FLICKER_B_START +
                (1 - INTRO_FLICKER_B_START) * (1 - Math.exp(-INTRO_FLICKER_M * t));

      // Electrical hum
      const hum = INTRO_FLICKER_ALPHA * Math.sin(2 * Math.PI * INTRO_FLICKER_HUM_FREQ * t);

      // When lit: brightness = maxBright × envelope. When dark: 0.
      const B = S * maxBright * Math.max(0, Math.min(1, W + hum));

      // Opacity is the complement of brightness (opaque = off, transparent = on)
      blackout.style.opacity = String(1 - B);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
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
