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
  if (recentEventIds.length > 3) recentEventIds.shift();
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

function updateEvt() {
  if (!S.activeEvent) return;

  // Check each step (sequential — must complete in order)
  S.activeEvent.steps.forEach((s, i) => {
    if (!S.eventStepsComplete[i]) {
      const prev = i === 0 || S.eventStepsComplete[i - 1];
      if (prev && s.check()) {
        S.eventStepsComplete[i] = 1;
        doFlash('rgba(57,255,20,0.1)');
      }
    }
  });

  // Countdown timer
  const elapsed = (Date.now() - S.activeEvent.startTime) / 1000;
  const rem     = Math.max(0, S.activeEvent.time - elapsed);
  const td      = document.getElementById('eventTimer');
  td.textContent = Math.floor(rem / 60).toString().padStart(2,'0') + ':' +
                   Math.floor(rem % 60).toString().padStart(2,'0');
  td.style.animation = rem <= 10 ? 'blink .3s step-end infinite' : 'none';

  renderEvt();

  // Resolved
  if (S.eventStepsComplete.every(Boolean)) {
    S.eventsResolved++;
    addLog('EVENT RESOLVED', 'ok');
    doFlash('rgba(57,255,20,0.15)');
    closeEvt();
    return;
  }

  // Timed out → catastrophe
  if (rem <= 0) {
    triggerCatastrophe(S.activeEvent.id);
  }
}

function closeEvt() {
  S.activeEvent = null;
  document.getElementById('eventOverlay').classList.remove('active');
  nextEventTime = S.uptime + 30 + Math.random() * 90;
}

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
    document.getElementById('goFailed').textContent   = S.eventsFailed + 1;
    document.getElementById('goScore').textContent     = Math.round(S.score);
    document.getElementById('goNarrative').textContent= cat.narrative;
    document.body.style.animation = 'none';
  }, 4500);
}
