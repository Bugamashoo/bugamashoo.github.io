// ============================================================
// reactor8.js — EVENT SYSTEM
// Load order: 8th (after reactor1, reactor2, reactor3)
// Exports: triggerEvent, updateEvt, closeEvt, triggerCatastrophe
// ============================================================

function triggerEvent() {
  if (S.activeEvent || !S.startupComplete) return;
  // Exclude events that fired within the last 3 events
  let pool = EVENTS.filter(e => !recentEventIds.includes(e.id));
  if (pool.length === 0) pool = EVENTS; // fallback: all events used recently, reset filter
  const e = pool[Math.floor(Math.random() * pool.length)];
  recentEventIds.push(e.id);
  if (recentEventIds.length > EVT_RECENT_MEMORY) recentEventIds.shift();
  S.activeEvent          = { ...e, startTime: Date.now() };
  S.eventStepsComplete   = new Array(e.steps.length).fill(0);
  document.getElementById('eventOverlay').classList.add('active');
  document.getElementById('eventTitle').textContent = e.title;
  document.getElementById('eventDesc').textContent  = e.desc;
  renderEvt();
  addLog('EVENT: ' + e.title, 'err');
  doShake();
  doFlash('rgba(255,46,46,0.15)');
}

function renderEvt() {
  if (!S.activeEvent) return;
  document.getElementById('eventViz').innerHTML = S.activeEvent.viz;
  document.getElementById('eventSteps').innerHTML = S.activeEvent.steps.map((s, i) =>
    `<div class="event-step-item ${S.eventStepsComplete[i] ? 'done' : ''}">` +
      `<div class="estep-dot"></div>${s.text}` +
    `</div>`
  ).join('');
  document.getElementById('eventProgress').style.width =
    (S.eventStepsComplete.filter(Boolean).length / S.activeEvent.steps.length * 100) + '%';
}

const DEESC_TRACKED = ['mainThrottle','fuelInject','coolantFlow','containPower',
                        'auxCoolRate','backupContPow','rodA','rodB','rodC',
                        'pressureRelief','mixRatio','fieldTune'];
const DEESC_DURATION = DEESC_HOLD_MS;   // ms to hold controls steady (set in vars.js)
const DEESC_TOL      = DEESC_TOLERANCE; // ±units allowed before reset (set in vars.js)

function updateEvt() {
  if (!S.activeEvent) return;
  const ev = S.activeEvent;

  // Check each step (sequential — must complete in order)
  ev.steps.forEach((s, i) => {
    if (!S.eventStepsComplete[i]) {
      const prev = i === 0 || S.eventStepsComplete[i - 1];
      if (prev && s.check()) {
        S.eventStepsComplete[i] = 1;
        doFlash('rgba(57,255,20,0.1)');
      }
    }
  });

  const allDone = S.eventStepsComplete.every(Boolean);

  // ── De-escalation phase ──────────────────────────────────────
  if (allDone) {
    const panel = document.querySelector('.event-panel');

    if (!ev.deescalating) {
      ev.deescalating      = true;
      ev.deescStart        = Date.now();
      ev.deescPauseElapsed = (Date.now() - ev.startTime) / 1000;
      ev.deescSnapshot     = {};
      DEESC_TRACKED.forEach(k => { ev.deescSnapshot[k] = S[k]; });
      document.getElementById('eventTitle').textContent = 'Deescalating...';
      if (panel) panel.classList.add('deescalating');
      addLog('HOLD CONTROLS — deescalating', 'ok');
    } else {
      // If any slider/dial step moved out of its required range, exit de-escalation
      const violated = ev.steps.findIndex(s => s.cont && !s.check());
      if (violated !== -1) {
        ev.deescalating = false;
        ev.startTime = Date.now() - ev.deescPauseElapsed * 1000;
        for (let i = violated; i < S.eventStepsComplete.length; i++) S.eventStepsComplete[i] = 0;
        if (panel) panel.classList.remove('deescalating');
        addLog('HOLD BROKEN — control out of range', 'warn');
        renderEvt();
        return;
      }

      // Reset hold timer if any control moved beyond tolerance
      const moved = DEESC_TRACKED.some(k => Math.abs(S[k] - ev.deescSnapshot[k]) > DEESC_TOL);
      if (moved) {
        ev.deescStart = Date.now();
        DEESC_TRACKED.forEach(k => { ev.deescSnapshot[k] = S[k]; });
      }

      if (Date.now() - ev.deescStart >= DEESC_DURATION) {
        S.eventsResolved++;
        addLog('EVENT RESOLVED', 'ok');
        doFlash('rgba(57,255,20,0.15)');
        closeEvt();
        return;
      }
    }

    // Hold-progress bar (0→100% over DEESC_DURATION)
    renderEvt();
    const holdPct = Math.min(100, (Date.now() - ev.deescStart) / DEESC_DURATION * 100);
    document.getElementById('eventProgress').style.width = holdPct + '%';

    // Frozen timer display
    const td = document.getElementById('eventTimer');
    td.textContent  = 'HOLD';
    td.style.animation = 'none';
    td.style.color  = 'var(--green)';
    return;
  }

  // ── Normal countdown ─────────────────────────────────────────
  const elapsed = (Date.now() - ev.startTime) / 1000;
  const rem     = Math.max(0, ev.time - elapsed);
  const td      = document.getElementById('eventTimer');
  td.textContent = Math.floor(rem / 60).toString().padStart(2,'0') + ':' +
                   Math.floor(rem % 60).toString().padStart(2,'0');
  td.style.animation = rem <= EVT_BLINK_THRESHOLD ? 'blink .3s step-end infinite' : 'none';
  td.style.color = '';

  renderEvt();

  if (rem <= 0) triggerCatastrophe(ev.id);
}

function closeEvt() {
  const panel = document.querySelector('.event-panel');
  if (panel) panel.classList.remove('deescalating');
  const td = document.getElementById('eventTimer');
  if (td) { td.style.color = ''; td.style.animation = 'none'; }
  S.activeEvent = null;
  document.getElementById('eventOverlay').classList.remove('active');
  nextEventTime = S.uptime + EVT_POST_CLOSE_MIN + Math.random() * EVT_POST_CLOSE_RANGE;
}

// ── Hover passthrough for event overlay ───────────────────────
// Tracks mouse position via document so pointer-events:none doesn't break it
document.addEventListener('mousemove', function(e) {
  const overlay = document.getElementById('eventOverlay');
  if (!overlay.classList.contains('active')) return;
  const panel = overlay.querySelector('.event-panel');
  if (!panel) return;
  const r = panel.getBoundingClientRect();
  const inside = e.clientX >= r.left && e.clientX <= r.right &&
                 e.clientY >= r.top  && e.clientY <= r.bottom;
  overlay.classList.toggle('hover-passthrough', inside);
});

function triggerCatastrophe(evtId) {
  S.gameOver = 1;
  document.getElementById('eventOverlay').classList.remove('active');
  const cat = CATASTROPHES[evtId] || CATASTROPHES.coolant_leak;

  // Destruction animation
  document.body.style.animationName           = 'bigShake,' + cat.anim;
  document.body.style.animationDuration       = '2s,4s';
  document.body.style.animationDelay          = '0s,1s';
  document.body.style.animationTimingFunction = 'ease-in-out';
  document.body.style.animationFillMode       = 'forwards';
  document.body.classList.add('shake');

  setTimeout(() => {
    const go = document.getElementById('gameOverScreen');
    go.classList.add('active');
    document.getElementById('goTitle').textContent    = cat.title;
    document.getElementById('goTitle').style.color    = cat.color;
    document.getElementById('goSubtitle').textContent = cat.subtitle;
    document.getElementById('goUptime').textContent   = fmtTime(S.uptime);
    document.getElementById('goResolved').textContent = S.eventsResolved;
    document.getElementById('goPeak').textContent     = S.peakPower.toFixed(1) + ' MW';
    document.getElementById('goAvg5m').textContent    = S.bestAvg5m.toFixed(1) + ' MW';
    document.getElementById('goFailed').textContent   = S.eventsFailed + 1;
    document.getElementById('goScore').textContent     = Math.round(S.score);
    document.getElementById('goNarrative').textContent= cat.narrative;
    document.body.style.animation = 'none';
  }, GAME_OVER_DELAY_MS);
}
