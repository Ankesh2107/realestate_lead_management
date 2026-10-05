// Realty AI demo player — scene sequencing, real audio-reactive waveform
// (driven by an AnalyserNode reading the actual narration audio), kinetic
// text reveals, and fully synthesized background pad/SFX via Web Audio API
// (nothing sourced externally; narration clips in audio/ are real Sarvam
// TTS output).

// A verified-valid, silent 8-sample WAV — same trick used to fix the real
// voice call's silent-greeting bug. Playing this synchronously inside the
// "Start Demo" click (before any await) unlocks audio playback for the tab;
// reusing this exact <audio> element for every narration clip (instead of
// `new Audio()` per clip, several awaits deep from the click) is what
// actually keeps it reliable on strict browsers.
const SILENT_WAV_DATA_URI =
  'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA==';

let audioCtx = null;
let masterGain = null;
let ambienceNodes = null;
let analyser = null;
let muted = false;
let narrationEl = null;
let narrationSource = null;

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioCtx.createGain();
  masterGain.gain.value = 1;
  masterGain.connect(audioCtx.destination);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 128;
  analyser.smoothingTimeConstant = 0.75;
  analyser.connect(masterGain);
}

/** Prime + wire up the single reusable narration element. Must be called
 * synchronously inside the click handler, before any await. */
function primeNarrationElement() {
  if (narrationEl) return;
  narrationEl = new Audio(SILENT_WAV_DATA_URI);
  narrationEl.play().catch(() => {});
}

/** Soft ambient pad: two detuned triangle oscillators through a slow-moving lowpass filter. */
function startAmbience() {
  const now = audioCtx.currentTime;
  const bus = audioCtx.createGain();
  bus.gain.value = 0;
  bus.connect(masterGain);
  bus.gain.linearRampToValueAtTime(0.045, now + 2.5);

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  filter.connect(bus);

  const notes = [110, 164.81, 220]; // A2, E3, A3 — open fifth + octave, calm and unobtrusive
  const oscs = notes.map((freq, i) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    osc.detune.value = (i - 1) * 4;
    const g = audioCtx.createGain();
    g.gain.value = i === 2 ? 0.4 : 1; // keep the octave subtle
    osc.connect(g).connect(filter);
    osc.start();
    return osc;
  });

  const lfo = audioCtx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoGain = audioCtx.createGain();
  lfoGain.gain.value = 280;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  ambienceNodes = { bus, oscs, lfo };
}

function stopAmbience() {
  if (!ambienceNodes) return;
  const now = audioCtx.currentTime;
  ambienceNodes.bus.gain.linearRampToValueAtTime(0, now + 1.2);
  setTimeout(() => {
    ambienceNodes.oscs.forEach((o) => { try { o.stop(); } catch {} });
    try { ambienceNodes.lfo.stop(); } catch {}
  }, 1300);
}

/** Short synthesized "ding" — used when a chat bubble / badge appears. */
function sfxDing() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  osc.connect(gain).connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.4);
}

/** Filtered noise burst with a pitch sweep + short delay-based "space" — used on scene transitions. */
function sfxWhoosh() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const bufferSize = audioCtx.sampleRate * 0.5;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.8;
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(2600, now + 0.35);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.13, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  // Cheap "space": a couple of decaying delay taps instead of a real IR reverb.
  const delay = audioCtx.createDelay();
  delay.delayTime.value = 0.09;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.28;
  delay.connect(feedback).connect(delay);

  noise.connect(filter).connect(gain);
  gain.connect(masterGain);
  gain.connect(delay);
  delay.connect(masterGain);

  noise.start(now);
  noise.stop(now + 0.5);
}

/** Two-note bell chime with a soft tail — used for the calendar confirmation moment. */
function sfxChime() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const delay = audioCtx.createDelay();
  delay.delayTime.value = 0.12;
  const feedback = audioCtx.createGain();
  feedback.gain.value = 0.22;
  delay.connect(feedback).connect(delay);
  delay.connect(masterGain);

  [660, 990].forEach((freq, i) => {
    const start = now + i * 0.14;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.16, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.8);
    osc.connect(gain);
    gain.connect(masterGain);
    gain.connect(delay);
    osc.start(start);
    osc.stop(start + 0.85);
  });
}

// ---------------------------------------------------------------------------
// Kinetic text — wraps each word of [data-kinetic] headings in a span so CSS
// can stagger them in with a blur-to-focus reveal.
// ---------------------------------------------------------------------------
function prepareKineticText() {
  document.querySelectorAll('[data-kinetic]').forEach((el) => {
    if (el.dataset.kineticDone) return;
    el.dataset.kineticDone = '1';
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const words = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (w.trim() === '') { frag.appendChild(document.createTextNode(w)); return; }
            const span = document.createElement('span');
            span.className = 'w';
            span.textContent = w;
            frag.appendChild(span);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          child.classList.add('kinetic');
          walk(child);
        }
      });
    };
    walk(el);
  });
}

function playKineticIn(sceneEl) {
  const words = sceneEl.querySelectorAll('.w');
  words.forEach((w, i) => {
    w.style.animation = 'none';
    void w.offsetWidth; // restart animation
    w.style.animationDelay = `${i * 0.045}s`;
    w.style.animation = '';
  });
}

// ---------------------------------------------------------------------------
// Simulated cursor — small hand-driven feel for key interactions.
// ---------------------------------------------------------------------------
const cursorEl = document.getElementById('sim-cursor');
function moveCursorTo(targetEl, opts = {}) {
  if (!targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const x = rect.left + (opts.xRatio ?? 0.5) * rect.width;
  const y = rect.top + (opts.yRatio ?? 0.5) * rect.height;
  cursorEl.classList.add('show');
  cursorEl.style.left = `${x}px`;
  cursorEl.style.top = `${y}px`;
}
function cursorClick() {
  cursorEl.classList.remove('click');
  void cursorEl.offsetWidth;
  cursorEl.classList.add('click');
  sfxDing();
}
function hideCursor() { cursorEl.classList.remove('show'); }

// ---------------------------------------------------------------------------
// Count-up numbers for the dashboard stat cards.
// ---------------------------------------------------------------------------
function runCountUps(sceneEl) {
  sceneEl.querySelectorAll('[data-count]').forEach((el, i) => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 900;
    const start = performance.now() + i * 120;
    function tick(now) {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  });
}

// ---------------------------------------------------------------------------
// Audio-reactive waveform — real amplitude data from whatever is playing.
// ---------------------------------------------------------------------------
const waveformEl = document.getElementById('waveform');
const BAR_COUNT = 28;
let waveformBars = [];
let waveformRAF = null;

function buildWaveformBars() {
  if (waveformBars.length) return;
  for (let i = 0; i < BAR_COUNT; i++) {
    const bar = document.createElement('span');
    waveformEl.appendChild(bar);
    waveformBars.push(bar);
  }
}

function startWaveform() {
  buildWaveformBars();
  const data = new Uint8Array(analyser.frequencyBinCount);
  function draw() {
    analyser.getByteFrequencyData(data);
    const step = Math.floor(data.length / BAR_COUNT) || 1;
    for (let i = 0; i < BAR_COUNT; i++) {
      const v = data[i * step] / 255;
      waveformBars[i].style.height = `${4 + v * 36}px`;
    }
    waveformRAF = requestAnimationFrame(draw);
  }
  draw();
}

function stopWaveform() {
  if (waveformRAF) cancelAnimationFrame(waveformRAF);
  waveformBars.forEach((b) => { b.style.height = '4px'; });
}

// ---------------------------------------------------------------------------
// Scene sequencing
// ---------------------------------------------------------------------------

const chatBody = document.getElementById('chat-body');
const callStatusEl = document.getElementById('call-status');
const progressFill = document.getElementById('progress-fill');
const hud = document.getElementById('hud');

function showScene(n) {
  document.querySelectorAll('.scene').forEach((el) => {
    const isTarget = el.dataset.scene === String(n);
    el.classList.toggle('active', isTarget);
    if (isTarget) {
      requestAnimationFrame(() => playKineticIn(el));
      if (el.querySelector('[data-count]')) runCountUps(el);
    }
  });
}

function addBubble(text, dir) {
  const b = document.createElement('div');
  b.className = `bubble ${dir}`;
  b.textContent = text;
  chatBody.appendChild(b);
  sfxDing();
}

function addTyping() {
  const t = document.createElement('div');
  t.className = 'typing-dots';
  t.id = 'typing-indicator';
  t.innerHTML = '<span></span><span></span><span></span>';
  chatBody.appendChild(t);
}

function removeTyping() {
  const t = document.getElementById('typing-indicator');
  if (t) t.remove();
}

let lastClipEndedAt = 0;

function playClip(file) {
  return new Promise((resolve) => {
    const audio = narrationEl;
    audio.muted = muted;
    audio.src = `audio/${file}.wav`;

    if (!narrationSource) {
      try {
        narrationSource = audioCtx.createMediaElementSource(audio);
        narrationSource.connect(analyser);
      } catch {
        /* if this ever fails, playback still works, just without the reactive waveform */
      }
    }

    audio.onended = () => { lastClipEndedAt = performance.now(); resolve(); };
    audio.onerror = resolve;
    audio.play().catch(resolve);
  });
}

let totalSteps = 0;
let stepIndex = 0;

function updateProgress() {
  progressFill.style.width = `${Math.min(100, (stepIndex / totalSteps) * 100)}%`;
}

async function runSequence() {
  const steps = [
    { scene: 1, action: null, clip: '01-hook' },
    { scene: 2, action: null, clip: '02-intro' },
    { scene: 3, action: () => { chatBody.innerHTML = ''; addBubble('Hi, I’m looking for a 3BHK in Noida under 1.5 crore', 'in'); }, clip: '03-whatsapp-lead' },
    { scene: 3, action: () => { addTyping(); }, clip: null, wait: 900 },
    { scene: 3, action: () => {
        removeTyping();
        addBubble('Hi! We have Skyline Heights in Sector 150, Noida — 3BHK units between ₹1.25Cr–₹1.35Cr. Would you like to schedule a site visit?', 'out');
        const badge = document.createElement('div'); badge.className = 'lead-badge'; badge.textContent = '🔥 Lead marked HOT · Score 92';
        chatBody.parentElement.appendChild(badge);
        moveCursorTo(badge, { yRatio: 0.2 });
        setTimeout(cursorClick, 350);
        setTimeout(hideCursor, 900);
      }, clip: '04-ai-reply' },
    { scene: 5, action: () => { callStatusEl.textContent = 'Incoming call…'; stopWaveform(); sfxWhoosh(); }, clip: '05-voice-intro' },
    { scene: 5, action: () => { callStatusEl.textContent = 'Realty AI speaking'; startWaveform(); }, clip: '06-voice-greeting' },
    { scene: 7, action: () => { stopWaveform(); sfxWhoosh(); }, clip: '07-booking-intro' },
    { scene: 7, action: () => { sfxChime(); }, clip: null, wait: 1400 },
    { scene: 8, action: () => { sfxWhoosh(); }, clip: '08-dashboard' },
    { scene: 9, action: () => { sfxWhoosh(); }, clip: '09-closing' },
  ];

  totalSteps = steps.length;
  stepIndex = 0;

  for (const step of steps) {
    showScene(step.scene);
    if (step.action) step.action();
    stepIndex += 1;
    updateProgress();
    if (step.clip) {
      await playClip(step.clip);
    } else if (step.wait) {
      await new Promise((r) => setTimeout(r, step.wait));
    }
  }

  stopWaveform();
  progressFill.style.width = '100%';
}

function resetVisuals() {
  chatBody.innerHTML = '';
  const badge = document.querySelector('.lead-badge');
  if (badge) badge.remove();
  callStatusEl.textContent = 'Incoming call…';
  stopWaveform();
  hideCursor();
}

async function startDemo() {
  primeNarrationElement();
  prepareKineticText();
  initAudio();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  startAmbience();

  document.getElementById('start-overlay').style.display = 'none';
  hud.classList.add('show');
  resetVisuals();
  await runSequence();
  stopAmbience();
}

document.getElementById('start-btn').addEventListener('click', startDemo);

document.getElementById('replay-btn').addEventListener('click', async () => {
  if (narrationEl) narrationEl.pause();
  stopAmbience();
  resetVisuals();
  startAmbience();
  progressFill.style.width = '0%';
  await runSequence();
  stopAmbience();
});

document.getElementById('mute-btn').addEventListener('click', (e) => {
  muted = !muted;
  e.target.textContent = muted ? '🔇' : '🔊';
  if (narrationEl) narrationEl.muted = muted;
  if (masterGain) masterGain.gain.value = muted ? 0 : 1;
});
