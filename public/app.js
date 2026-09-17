// ---------------- Nav ----------------
const navItems = document.querySelectorAll('.nav-item');
const views = document.querySelectorAll('.view');
navItems.forEach((item) => {
  item.addEventListener('click', () => {
    navItems.forEach((n) => n.classList.remove('active'));
    views.forEach((v) => v.classList.remove('active'));
    item.classList.add('active');
    document.getElementById(`view-${item.dataset.view}`).classList.add('active');
    if (item.dataset.view === 'leads') loadLeads();
    if (item.dataset.view === 'properties') loadProperties();
    if (item.dataset.view === 'ops') loadOps();
  });
});

// ---------------- Health check ----------------
async function checkHealth() {
  try {
    const r = await fetch('/api/test/health');
    const data = await r.json();
    setPill('pill-db', data.dbOk);
    setPill('pill-gemini', data.envOk.gemini);
  } catch (e) {
    setPill('pill-db', false);
    setPill('pill-gemini', false);
  }
}
function setPill(id, ok) {
  const el = document.getElementById(id);
  el.classList.remove('ok', 'bad');
  el.classList.add(ok ? 'ok' : 'bad');
}
checkHealth();
setInterval(checkHealth, 15000);

// ---------------- Chat simulator ----------------
let sessionId = localStorage.getItem('realty_session_id');
if (!sessionId) {
  sessionId = 'web-' + Math.random().toString(36).slice(2, 10);
  localStorage.setItem('realty_session_id', sessionId);
}
let currentChannel = 'whatsapp';

const messagesEl = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');

document.querySelectorAll('.channel-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.channel-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    currentChannel = tab.dataset.channel;
    // switching channel = switching identity/session so each channel gets its own lead
    sessionId = `${currentChannel}-web-${Math.random().toString(36).slice(2, 8)}`;
    messagesEl.innerHTML = '';
    renderLead(null);
  });
});

document.querySelectorAll('.quick-try').forEach((qt) => {
  qt.addEventListener('click', () => {
    chatInput.value = qt.dataset.text;
    sendChat();
  });
});

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

function appendMsg(text, cls) {
  const div = document.createElement('div');
  div.className = `msg ${cls}`;
  div.textContent = text;
  messagesEl.appendChild(div);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return div;
}

async function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  chatSend.disabled = true;

  appendMsg(text, 'customer');
  const typingEl = document.createElement('div');
  typingEl.className = 'typing';
  typingEl.textContent = 'Realty AI is typing…';
  messagesEl.appendChild(typingEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;

  try {
    const r = await fetch('/api/test/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, text, channel: currentChannel }),
    });
    const data = await r.json();
    typingEl.remove();

    if (data.skipped) {
      appendMsg('(This lead is marked do-not-contact — no AI reply sent.)', 'system');
    } else if (data.reply) {
      appendMsg(data.reply, 'ai');
    } else if (data.error) {
      appendMsg('Error: ' + data.error, 'system');
    }
    renderLead(data.lead);
  } catch (err) {
    typingEl.remove();
    appendMsg('Network error talking to the server.', 'system');
  } finally {
    chatSend.disabled = false;
    chatInput.focus();
  }
}

function renderLead(lead) {
  const el = document.getElementById('lead-fields');
  if (!lead) {
    el.innerHTML = '<div class="empty-state">Send a message to create a lead.</div>';
    return;
  }
  const temp = (lead.temperature || 'cold').toLowerCase();
  const budget = fmtBudget(lead.budget_min, lead.budget_max);
  const rows = [
    ['Name', lead.name || '—'],
    ['Phone', lead.phone || '—'],
    ['Channel', lead.channel],
    ['Customer type', lead.customer_type || 'unknown'],
    ['Intent', lead.intent || 'unknown'],
    ['Purpose', lead.purpose || '—'],
    ['Timeline', lead.timeline || '—'],
    ['Budget', budget],
    ['Locations', (lead.preferred_locations || []).join(', ') || '—'],
    ['BHK options', (lead.bhk_options || []).join(', ') || '—'],
    ['Status', lead.status],
    ['Urgency', lead.urgency || 'none'],
    ['Score', `${lead.lead_score ?? 0} / 100`],
  ];
  el.innerHTML =
    `<div class="lead-field"><span class="k">Temperature</span><span class="v"><span class="badge ${temp}">${(lead.temperature || 'COLD')}</span></span></div>` +
    rows.map(([k, v]) => `<div class="lead-field"><span class="k">${k}</span><span class="v">${escapeHtml(String(v))}</span></div>`).join('');
}

function fmtBudget(min, max) {
  if (!min && !max) return '—';
  const f = (n) => n >= 10000000 ? `₹${(n/10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n}`;
  if (min && max) return `${f(min)} – ${f(max)}`;
  return f(min || max);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---------------- Leads dashboard ----------------
async function loadLeads() {
  const body = document.getElementById('leads-body');
  const empty = document.getElementById('leads-empty');
  body.innerHTML = '';
  try {
    const r = await fetch('/api/test/leads');
    const leads = await r.json();
    if (!leads.length) { empty.style.display = 'block'; return; }
    empty.style.display = 'none';
    for (const l of leads) {
      const tr = document.createElement('tr');
      const temp = (l.temperature || 'cold').toLowerCase();
      tr.innerHTML = `
        <td>${escapeHtml(l.name || l.external_user_id)}</td>
        <td>${l.channel}</td>
        <td>${l.intent || '—'}</td>
        <td>${fmtBudget(l.budget_min, l.budget_max)}</td>
        <td>${(l.preferred_locations || []).join(', ') || '—'}</td>
        <td>${l.status}</td>
        <td><span class="badge ${temp}">${l.temperature}</span></td>
        <td>${l.lead_score ?? 0}</td>
        <td>${new Date(l.updated_at).toLocaleString()}</td>
      `;
      body.appendChild(tr);
    }
  } catch (e) {
    empty.style.display = 'block';
    empty.textContent = 'Could not load leads — check Supabase credentials.';
  }
}
document.getElementById('leads-refresh').addEventListener('click', loadLeads);

// ---------------- Properties ----------------
async function loadProperties() {
  const grid = document.getElementById('properties-grid');
  grid.innerHTML = '';
  try {
    const r = await fetch('/api/test/properties');
    const props = await r.json();
    if (!props.length) { grid.innerHTML = '<div class="empty-state">No properties seeded yet — run supabase/seed.sql.</div>'; return; }
    for (const p of props) {
      const card = document.createElement('div');
      card.className = 'prop-card';
      card.innerHTML = `
        <p class="proj">${escapeHtml(p.project_name)}</p>
        <div class="loc">${escapeHtml(p.locality)}, ${escapeHtml(p.city)}</div>
        <div class="price">${fmtBudget(p.price_min, p.price_max)}${p.purpose === 'rent' ? '/mo' : ''}</div>
        <div class="meta">
          ${p.bhk ? `<span class="chip">${p.bhk} BHK</span>` : ''}
          <span class="chip">${p.property_type}</span>
          <span class="chip">${p.status}</span>
          <span class="chip">${p.purpose}</span>
        </div>
      `;
      grid.appendChild(card);
    }
  } catch (e) {
    grid.innerHTML = '<div class="empty-state">Could not load properties — check Supabase credentials.</div>';
  }
}
document.getElementById('properties-refresh').addEventListener('click', loadProperties);

// ---------------- Ops (site visits + escalations) ----------------
async function loadOps() {
  const visitsBody = document.getElementById('visits-body');
  const visitsEmpty = document.getElementById('visits-empty');
  const escBody = document.getElementById('escalations-body');
  const escEmpty = document.getElementById('escalations-empty');
  visitsBody.innerHTML = ''; escBody.innerHTML = '';

  try {
    const r = await fetch('/api/test/site-visits');
    const visits = await r.json();
    if (!visits.length) visitsEmpty.style.display = 'block';
    else {
      visitsEmpty.style.display = 'none';
      for (const v of visits) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(v.leads?.name || v.leads?.channel || '—')}</td>
          <td>${escapeHtml(v.properties?.project_name || '—')}</td>
          <td>${v.requested_date || '—'} ${v.requested_time || ''}</td>
          <td>${v.status}</td>
          <td>${new Date(v.created_at).toLocaleString()}</td>
        `;
        visitsBody.appendChild(tr);
      }
    }
  } catch (e) { visitsEmpty.style.display = 'block'; }

  try {
    const r2 = await fetch('/api/test/escalations');
    const escs = await r2.json();
    if (!escs.length) escEmpty.style.display = 'block';
    else {
      escEmpty.style.display = 'none';
      for (const e of escs) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeHtml(e.leads?.name || e.leads?.channel || '—')}</td>
          <td>${escapeHtml(e.reason || '—')}</td>
          <td>${e.urgency}</td>
          <td>${e.status}</td>
          <td>${new Date(e.created_at).toLocaleString()}</td>
        `;
        escBody.appendChild(tr);
      }
    }
  } catch (e) { escEmpty.style.display = 'block'; }
}
document.getElementById('ops-refresh').addEventListener('click', loadOps);

// ---------------- Voice demo (Web Speech API) ----------------
const orb = document.getElementById('orb');
const voiceToggle = document.getElementById('voice-toggle');
const transcriptEl = document.getElementById('voice-transcript');
let voiceSessionId = 'voice-web-' + Math.random().toString(36).slice(2, 8);
let recognizing = false;
let recognition = null;

const SpeechRecognitionImpl = window.SpeechRecognition || window.webkitSpeechRecognition;

function addTranscriptLine(who, text) {
  if (transcriptEl.querySelector('.empty-state')) transcriptEl.innerHTML = '';
  const div = document.createElement('div');
  div.className = `msg ${who === 'You' ? 'customer' : 'ai'}`;
  div.style.marginBottom = '10px';
  div.style.maxWidth = '100%';
  div.textContent = `${who}: ${text}`;
  transcriptEl.appendChild(div);
  transcriptEl.scrollTop = transcriptEl.scrollHeight;
}

function speak(text) {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) return resolve();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.onend = resolve;
    utter.onerror = resolve;
    window.speechSynthesis.speak(utter);
  });
}

async function handleVoiceTurn(text) {
  addTranscriptLine('You', text);
  try {
    const r = await fetch('/api/test/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: voiceSessionId, text, channel: 'voice' }),
    });
    const data = await r.json();
    const reply = data.reply || "Sorry, I couldn't process that.";
    addTranscriptLine('Realty AI', reply);
    await speak(reply);
  } catch (e) {
    addTranscriptLine('Realty AI', 'Network error.');
  }
}

if (SpeechRecognitionImpl) {
  recognition = new SpeechRecognitionImpl();
  recognition.lang = 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    handleVoiceTurn(text);
  };
  recognition.onend = () => {
    orb.classList.remove('listening');
    if (recognizing) recognition.start(); // keep the "call" open, listen again
  };
  recognition.onerror = () => { orb.classList.remove('listening'); };
} else {
  voiceToggle.disabled = true;
  document.querySelector('.voice-hint').textContent =
    'Your browser does not support the Web Speech API — try Chrome for this demo. Real phone calls use Twilio and do not depend on the browser.';
}

voiceToggle.addEventListener('click', async () => {
  if (!recognition) return;
  if (!recognizing) {
    recognizing = true;
    voiceToggle.textContent = 'End call';
    voiceSessionId = 'voice-web-' + Math.random().toString(36).slice(2, 8);
    transcriptEl.innerHTML = '';
    orb.classList.add('listening');
    const greeting = 'Hello, thank you for calling Skyline Realty. How can I help you today?';
    addTranscriptLine('Realty AI', greeting);
    await speak(greeting);
    recognition.start();
  } else {
    recognizing = false;
    voiceToggle.textContent = 'Start call';
    orb.classList.remove('listening');
    recognition.stop();
    window.speechSynthesis.cancel();
  }
});
