// intro.js - Startup overlay interactivity
// Load order: last (after help.js).
// Needs KS, positionKnifeSwitch, animateKnifeSwitch, spawnSwitchSparks from reactor4.js.
// All configurable values come from INTRO_* constants in vars.js.

(function () {
  const overlay    = document.getElementById('introOverlay');
  const blackout1  = document.getElementById('introBlackout1');
  const blackout2  = document.getElementById('introBlackout2');
  const blackout3  = document.getElementById('introBlackout3');
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

  // Wire the "disable random catastrophes" checkbox
  const eventsCheck = document.getElementById('introEventsCheck');
  if (eventsCheck) {
    eventsCheck.addEventListener('change', () => {
      if (eventsCheck.checked) showToast(toastEventsOff);
      EVENTS_DISABLED = eventsCheck.checked;
    });
  }

  // Wire the "disable helpful toasts" checkbox
  const toastsCheck = document.getElementById('introToastsCheck');
  if (toastsCheck) {
    toastsCheck.addEventListener('change', () => {
      if (toastsCheck.checked) showToast(toastToastsOff);
      TOASTS_DISABLED = toastsCheck.checked;
    });
  }

  // Fade the knife switch in once all page resources are loaded
  const switchWrap = document.getElementById('introSwitchWrap');
  window.addEventListener('load', () => {
    if (switchWrap) {
      switchWrap.style.opacity = '1';
      switchWrap.style.pointerEvents = 'auto';
    }
  });

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
  window.introStarted = false; // global flag for other systems (keybinds etc.)

  function turnOn() {
    if (state) return;
    state = 1;
    window.introStarted = true;
    ks.classList.add('on');
    animateKnifeSwitch(ks, true, () => spawnSwitchSparks(ks));

    setTimeout(() => {
      // Phase 1: title screen (#introOverlay) fades out smoothly.
      // The header is visible above #introBlackout (z-index 8) the whole time.
      overlay.classList.add('flickering'); // disables pointer events
      overlay.style.transition = `opacity ${INTRO_FADE_MS}ms linear`;
      overlay.style.opacity    = '0';

      // Phase 2: once the title is gone, either flicker or instantly clear blackouts.
      setTimeout(() => {
        overlay.style.display = 'none';
        if (FLASH_DISABLED) {
          blackout1.style.display = 'none';
          blackout2.style.display = 'none';
          blackout3.style.display = 'none';
        } else {
          // Stagger the three panels slightly for a realistic multi-tube feel
          requestAnimationFrame(() => {
            startFlicker(blackout1, 0);
            startFlicker(blackout2, Math.random() * 180 + 60);
            startFlicker(blackout3, Math.random() * 180 + 60);
          });
        }
      }, INTRO_FADE_MS);
    }, INTRO_SWITCH_DELAY_MS);
  }

  // ── Atmospheric fluorescent tube flicker ────────────────────────────────────
  //
  // State machine with discrete strike attempts:
  //   DARK  → tube is off, waiting for next strike attempt
  //   STRIKE → tube tries to ignite; holds for a duration that increases with Pon
  //   ON    → tube is sustaining (late-stage only, once fully caught)
  //
  // B(t) = S(t) · [W(t) + α·sin(2πft)]
  //
  // The key difference from a simple random sampler: early on the tube makes
  // short, desperate flicker attempts with long dark pauses between them.
  // As Pon climbs, attempts last longer and dark gaps shrink. Once Pon is near 1,
  // the tube locks on and maxBright races to 1.0.
  //
  // maxBright ceiling: only climbs while arc is sustained. Never jumps.
  function startFlicker(panel, delayMs) {
    setTimeout(() => {
      const start = performance.now();
      const dur   = INTRO_FLICKER_MS;
      let S         = 0;   // binary lit state
      let maxBright = INTRO_FLICKER_MIN_BRIGHT;
      let lastFrameTime = performance.now();
      let done = false;

      // State machine vars
      let strikeEnd    = 0;   // performance.now() when current strike ends
      let darkEnd      = 0;   // performance.now() when current dark pause ends
      let inStrike     = false;

      function scheduleNext() {
        if (done) return;
        const t   = (performance.now() - start) / 1000;
        const Pon = 1 - Math.exp(-INTRO_FLICKER_K * t);

        if (inStrike) {
          // Currently lit — decide whether to sustain or drop out
          const keepProb = Pon * 0.85 + 0.1; // high Pon → likely to keep going
          if (Math.random() < keepProb) {
            // Stay lit a bit longer; hold duration grows with Pon
            const holdMs = INTRO_FLICKER_MIN_INTERVAL_MS +
                           Math.random() * 120 * (0.3 + Pon * 0.7);
            strikeEnd = performance.now() + holdMs;
            S = 1;
            setTimeout(scheduleNext, holdMs);
          } else {
            // Arc dies — go dark
            inStrike = false;
            S = 0;
            // Dark gap shrinks as Pon grows (early = long dark, late = brief flicker off)
            const darkMs = INTRO_FLICKER_MIN_INTERVAL_MS +
                           Math.random() * INTRO_FLICKER_MAX_INTERVAL_MS * (1 - Pon * 0.8);
            darkEnd = performance.now() + darkMs;
            setTimeout(scheduleNext, darkMs);
          }
        } else {
          // Currently dark — attempt a strike
          if (Math.random() < Pon * 0.9 + 0.05) {
            // Strike succeeds
            inStrike = true;
            S = 1;
            // Early strikes are short and desperate; late ones hold
            const holdMs = INTRO_FLICKER_MIN_INTERVAL_MS +
                           Math.random() * 200 * (Pon * Pon);
            strikeEnd = performance.now() + holdMs;
            setTimeout(scheduleNext, holdMs);
          } else {
            // Strike fails — stay dark
            const darkMs = INTRO_FLICKER_MIN_INTERVAL_MS +
                           Math.random() * INTRO_FLICKER_MAX_INTERVAL_MS * (1.2 - Pon);
            darkEnd = performance.now() + darkMs;
            setTimeout(scheduleNext, darkMs);
          }
        }
      }
      scheduleNext();

      // ── rAF loop: applies B(t) to panel opacity every display frame ──
      function frame(now) {
        const elapsed = now - start;
        const t  = elapsed / 1000;
        const dt = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        // Past the nominal duration: force tube on, let maxBright race to 1
        const pastEnd = elapsed >= dur;
        if (pastEnd) { S = 1; inStrike = true; }

        // maxBright only climbs while arc is sustained (S=1)
        if (S === 1) {
          const litProb = pastEnd ? 1 : (1 - Math.exp(-INTRO_FLICKER_K * t));
          maxBright = Math.min(1, maxBright + INTRO_FLICKER_RAMP_RATE * litProb * dt);
        }

        // Done once maxBright fully reaches 1.0 — no visible jump
        if (maxBright >= 0.995) {
          done = true;
          panel.style.opacity = '0';
          setTimeout(() => { panel.style.display = 'none'; }, 80);
          return;
        }

        // W(t): slow warm-up envelope B_start → 1
        const W = INTRO_FLICKER_B_START +
                  (1 - INTRO_FLICKER_B_START) * (1 - Math.exp(-INTRO_FLICKER_M * t));

        // Electrical hum: faint sine always present when lit
        const hum = INTRO_FLICKER_ALPHA * Math.sin(2 * Math.PI * INTRO_FLICKER_HUM_FREQ * t);

        // When lit: brightness = maxBright × envelope. When dark: 0.
        const B = S * maxBright * Math.max(0, Math.min(1, W + hum));

        // Opacity is complement of brightness (opaque=off, transparent=on)
        panel.style.opacity = String(1 - B);

        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }, delayMs);
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
