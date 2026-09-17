'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  PhoneCall,
  PhoneOff,
  Users,
  Building,
  ClipboardList,
  RefreshCw,
  Send,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  TrendingUp,
  Flame,
  Mic,
  MicOff,
  Volume2,
  Loader2,
} from 'lucide-react';

// ─── Voice state machine ───────────────────────────────────────────────────
type VoiceStatus =
  | 'idle'        // not in a call
  | 'connecting'  // playing greeting
  | 'listening'   // recording user speech
  | 'processing'  // STT + AI reply + TTS in progress
  | 'speaking'    // playing AI audio
  | 'ended';      // call hung up

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'chat' | 'voice' | 'leads' | 'properties' | 'ops'>('chat');
  const [health, setHealth] = useState<{ dbOk: boolean; geminiOk: boolean }>({ dbOk: false, geminiOk: false });

  // Chat simulator state
  const [channel, setChannel] = useState<string>('whatsapp');
  const [sessionId, setSessionId] = useState<string>('');
  const [inputMsg, setInputMsg] = useState<string>('');
  const [messages, setMessages] = useState<{ sender: 'customer' | 'ai' | 'system'; text: string }[]>([]);
  const [currentLead, setCurrentLead] = useState<any>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Leads state
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);

  // Properties state
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(false);

  // Ops state
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [loadingOps, setLoadingOps] = useState<boolean>(false);

  // ── Voice state ──────────────────────────────────────────────────────────
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceLang, setVoiceLang] = useState<'hi-IN' | 'en-IN'>('hi-IN');
  const [voiceSpeaker, setVoiceSpeaker] = useState<string>('meera');
  const [voiceTranscript, setVoiceTranscript] = useState<
    { speaker: 'You' | 'Realty AI'; text: string; time: string }[]
  >([]);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Voice refs
  const voiceSessionRef = useRef<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceStatusRef = useRef<VoiceStatus>('idle');
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceTranscript]);

  useEffect(() => {
    const newSession = `${channel}-web-${Math.random().toString(36).slice(2, 8)}`;
    setSessionId(newSession);
  }, [channel]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function checkHealth() {
    try {
      const res = await fetch('/api/test/health');
      const data = await res.json();
      setHealth({ dbOk: !!data.dbOk, geminiOk: !!data.envOk?.gemini });
    } catch {
      setHealth({ dbOk: false, geminiOk: false });
    }
  }

  async function handleSendChat(textToSend?: string) {
    const text = (textToSend || inputMsg).trim();
    if (!text || isTyping) return;
    setInputMsg('');
    const newMsgs = [...messages, { sender: 'customer' as const, text }];
    setMessages(newMsgs);
    setIsTyping(true);
    try {
      const res = await fetch('/api/test/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, text, channel }),
      });
      const data = await res.json();
      if (data.skipped) {
        setMessages((prev) => [...prev, { sender: 'system', text: '(This lead is marked do-not-contact — no AI reply sent.)' }]);
      } else if (data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { sender: 'system', text: `Error: ${data.error}` }]);
      }
      if (data.lead) setCurrentLead(data.lead);
    } catch {
      setMessages((prev) => [...prev, { sender: 'system', text: 'Network error communicating with Realty AI server.' }]);
    } finally {
      setIsTyping(false);
    }
  }

  async function fetchLeads() {
    setLoadingLeads(true);
    try {
      const res = await fetch('/api/test/leads');
      const data = await res.json();
      setLeads(Array.isArray(data) ? data : []);
    } catch { setLeads([]); } finally { setLoadingLeads(false); }
  }

  async function fetchProperties() {
    setLoadingProperties(true);
    try {
      const res = await fetch('/api/test/properties');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch { setProperties([]); } finally { setLoadingProperties(false); }
  }

  async function fetchOps() {
    setLoadingOps(true);
    try {
      const [vRes, eRes] = await Promise.all([fetch('/api/test/site-visits'), fetch('/api/test/escalations')]);
      setSiteVisits(Array.isArray(await vRes.json()) ? await vRes.clone().json() : []);
      setEscalations(Array.isArray(await eRes.json()) ? await eRes.clone().json() : []);
    } catch { setSiteVisits([]); setEscalations([]); } finally { setLoadingOps(false); }
  }

  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'properties') fetchProperties();
    if (activeTab === 'ops') fetchOps();
  }, [activeTab]);

  // ── Voice helpers ──────────────────────────────────────────────────────

  function nowTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function addTranscript(speaker: 'You' | 'Realty AI', text: string) {
    setVoiceTranscript((prev) => [...prev, { speaker, text, time: nowTime() }]);
  }

  /** Play a base64-encoded WAV returned by Sarvam TTS */
  async function playAudioBase64(base64: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      currentAudioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }

  /** Call Sarvam TTS via our server proxy */
  async function speakWithSarvam(text: string): Promise<void> {
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker: voiceSpeaker, language_code: voiceLang, pace: 1.05 }),
      });
      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();
      if (data.audio) {
        await playAudioBase64(data.audio);
      }
    } catch (err) {
      console.warn('[voice] TTS error, falling back to browser TTS:', err);
      // Graceful fallback to browser speech synthesis
      await new Promise<void>((resolve) => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = voiceLang;
        utter.rate = 1.0;
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        window.speechSynthesis.speak(utter);
      });
    }
  }

  /** Transcribe recorded audio via Sarvam STT */
  async function transcribeAudio(blob: Blob): Promise<string> {
    try {
      const form = new FormData();
      form.append('audio', blob, 'audio.wav');
      form.append('language_code', voiceLang);
      const res = await fetch('/api/voice/stt', { method: 'POST', body: form });
      if (!res.ok) throw new Error('STT failed');
      const data = await res.json();
      return data.transcript || '';
    } catch {
      // Fallback: use browser STT if Sarvam fails
      return '';
    }
  }

  /** Start recording mic audio */
  function startRecording() {
    if (!streamRef.current) return;
    const mr = new MediaRecorder(streamRef.current, { mimeType: 'audio/webm' });
    audioChunksRef.current = [];
    mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    mr.start();
    mediaRecorderRef.current = mr;
  }

  /** Stop recording and return a blob */
  function stopRecording(): Promise<Blob> {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr || mr.state === 'inactive') { resolve(new Blob()); return; }
      mr.onstop = () => { resolve(new Blob(audioChunksRef.current, { type: 'audio/webm' })); };
      mr.stop();
    });
  }

  /** Animate microphone level meter */
  function startLevelMeter() {
    if (!analyserRef.current) return;
    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.fftSize);
    function tick() {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      Array.from(data).forEach((v) => { sum += Math.abs(v - 128); });
      setAudioLevel(Math.min(100, (sum / data.length) * 5));
      animFrameRef.current = requestAnimationFrame(tick);
    }
    animFrameRef.current = requestAnimationFrame(tick);
  }

  function stopLevelMeter() {
    cancelAnimationFrame(animFrameRef.current);
    setAudioLevel(0);
  }

  /** Main voice turn: record → STT → Gemini → TTS → repeat */
  const runVoiceTurn = useCallback(async () => {
    if (voiceStatusRef.current !== 'listening') return;

    // Stop recording after 5s silence detection (simple fixed 5s window for demo)
    setVoiceStatus('processing');
    stopLevelMeter();

    const blob = await stopRecording();

    // STT
    let userText = await transcribeAudio(blob);

    // If Sarvam STT returned nothing, try browser STT as fallback (already happened async — skip)
    if (!userText || userText.trim().length < 2) {
      // Re-enter listening
      setVoiceStatus('listening');
      startRecording();
      startLevelMeter();
      return;
    }

    addTranscript('You', userText);

    // Get AI text reply
    let aiReply = "Ek second, main aapke liye property details check kar rahi hoon.";
    try {
      const res = await fetch('/api/test/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: voiceSessionRef.current, text: userText, channel: 'voice' }),
      });
      const d = await res.json();
      aiReply = d.reply || aiReply;
    } catch { /* use default */ }

    addTranscript('Realty AI', aiReply);

    // TTS
    setVoiceStatus('speaking');
    await speakWithSarvam(aiReply);

    // Loop back to listening if call is still active (re-read ref after async TTS)
    // Cast to string to allow TS to compare across all VoiceStatus values
    const statusAfterTTS: string = voiceStatusRef.current;
    if (statusAfterTTS !== 'ended' && statusAfterTTS !== 'idle') {
      setVoiceStatus('listening');
      startRecording();
      startLevelMeter();
    }
  }, [voiceLang, voiceSpeaker]);

  /** Start the entire call flow */
  async function startCall() {
    if (voiceStatus !== 'idle' && voiceStatus !== 'ended') return;

    // Get mic access
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch {
      alert('Microphone access denied. Please allow mic access to use Voice Call.');
      return;
    }

    // Set up analyser
    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    const source = ctx.createMediaStreamSource(stream);
    source.connect(analyser);
    audioContextRef.current = ctx;
    analyserRef.current = analyser;

    voiceSessionRef.current = `voice-web-${Math.random().toString(36).slice(2, 8)}`;
    setVoiceTranscript([]);
    setCallDuration(0);
    setVoiceStatus('connecting');

    // Start call timer
    callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);

    // Greeting
    const greeting =
      voiceLang === 'hi-IN'
        ? `Namaste! Main Realty AI hoon, Skyline Realty ki taraf se. Aap kaisi property dhundh rahe hain?`
        : `Hello! I'm Realty AI from Skyline Realty. How can I help you find your dream property today?`;
    addTranscript('Realty AI', greeting);
    setVoiceStatus('speaking');
    await speakWithSarvam(greeting);

    if (voiceStatusRef.current === 'speaking') {
      setVoiceStatus('listening');
      startRecording();
      startLevelMeter();
    }
  }

  /** End the call */
  function endCall() {
    // Stop audio
    currentAudioRef.current?.pause();
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();

    // Stop recording
    mediaRecorderRef.current?.stop();

    // Stop mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Stop analyser
    audioContextRef.current?.close();
    stopLevelMeter();

    // Stop timer
    if (callTimerRef.current) clearInterval(callTimerRef.current);

    setVoiceStatus('ended');
  }

  /** Handle press-to-talk: start on down, stop on up */
  async function handlePTTDown() {
    if (voiceStatus !== 'listening') return;
    // Already listening from auto-flow; PTT just triggers immediate processing
    await runVoiceTurn();
  }

  // Auto-trigger processing after listening (5s recording window)
  useEffect(() => {
    if (voiceStatus !== 'listening') return;
    const timer = setTimeout(runVoiceTurn, 5000);
    return () => clearTimeout(timer);
  }, [voiceStatus, runVoiceTurn]);

  function formatDuration(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles style={{ color: '#3b82f6' }} /> Realty AI
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>
            Multilingual Real Estate Sales Agent &amp; Omnichannel CRM — WhatsApp, Instagram, Facebook &amp; Voice (Sarvam AI)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={healthBadgeStyle(health.dbOk)}>
            {health.dbOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Supabase DB: {health.dbOk ? 'Connected' : 'Disconnected'}
          </div>
          <div style={healthBadgeStyle(health.geminiOk)}>
            {health.geminiOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Gemini AI Engine: {health.geminiOk ? 'Active' : 'Offline'}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #232f48', paddingBottom: '12px', marginBottom: '24px' }}>
        <TabButton icon={<MessageSquare size={16} />} label="Web & Social Simulator" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <TabButton icon={<PhoneCall size={16} />} label="Voice Call (Sarvam AI)" active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
        <TabButton icon={<Users size={16} />} label="Leads CRM" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
        <TabButton icon={<Building size={16} />} label="Property Catalog" active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} />
        <TabButton icon={<ClipboardList size={16} />} label="Ops & Escalations" active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} />
      </nav>

      {/* ── Tab 1: Chat ── */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232f48', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['whatsapp', 'instagram', 'facebook', 'web_test'].map((ch) => (
                  <button key={ch} onClick={() => setChannel(ch)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #232f48', background: channel === ch ? '#3b82f6' : '#131b2e', color: '#fff', fontSize: '13px', cursor: 'pointer', textTransform: 'capitalize' }}>
                    {ch.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Session: {sessionId}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              <QuickChip text="Hi, do you have any 3BHK flats in Noida under 1.5 Cr?" onClick={(t) => handleSendChat(t)} />
              <QuickChip text="Can I schedule a site visit this Saturday?" onClick={(t) => handleSendChat(t)} />
              <QuickChip text="I want to talk to a human manager." onClick={(t) => handleSendChat(t)} />
            </div>

            <div style={{ height: '420px', overflowY: 'auto', border: '1px solid #232f48', borderRadius: '8px', padding: '16px', background: '#0b0f19', marginBottom: '16px' }}>
              {messages.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginTop: '160px' }}>Start a conversation to test Realty AI multi-turn sales pipeline...</p>}
              {messages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: m.sender === 'customer' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: '12px', fontSize: '14px', lineHeight: '1.5', background: m.sender === 'customer' ? '#2563eb' : m.sender === 'ai' ? '#1e293b' : '#374151', color: '#fff', border: m.sender === 'ai' ? '1px solid #334155' : 'none' }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>Realty AI is thinking and querying properties...</div>}
              <div ref={chatBottomRef} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Type your property inquiry..." value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendChat()} style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #232f48', background: '#0b0f19', color: '#fff', outline: 'none' }} />
              <button onClick={() => handleSendChat()} disabled={isTyping} style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                <Send size={16} /> Send
              </button>
            </div>
          </div>

          <div style={panelStyle}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', borderBottom: '1px solid #232f48', paddingBottom: '8px', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} style={{ color: '#10b981' }} /> Live Lead Inspector
            </h3>
            {currentLead ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <LeadRow label="Name" value={currentLead.name || 'Not provided'} />
                <LeadRow label="Phone" value={currentLead.phone || 'Not provided'} />
                <LeadRow label="Channel" value={currentLead.channel} />
                <LeadRow label="Intent" value={currentLead.intent || '—'} />
                <LeadRow label="Purpose" value={currentLead.purpose || '—'} />
                <LeadRow label="Timeline" value={currentLead.timeline || '—'} />
                <LeadRow label="Budget Min" value={currentLead.budget_min ? `₹${currentLead.budget_min.toLocaleString()}` : '—'} />
                <LeadRow label="Budget Max" value={currentLead.budget_max ? `₹${currentLead.budget_max.toLocaleString()}` : '—'} />
                <LeadRow label="Locations" value={(currentLead.preferred_locations || []).join(', ') || '—'} />
                <LeadRow label="BHK" value={(currentLead.bhk_options || []).join(', ') || '—'} />
                <LeadRow label="Status" value={currentLead.status} />
                <LeadRow label="Temperature" value={currentLead.temperature} />
                <LeadRow label="Lead Score" value={`${currentLead.lead_score ?? 0} / 100`} />
              </div>
            ) : (
              <p style={{ color: '#6b7280', fontSize: '13px' }}>Send a message to see Supabase real-time lead updates.</p>
            )}
          </div>
        </div>
      )}

      {/* ── Tab 2: Voice Call (Sarvam AI) ── */}
      {activeTab === 'voice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Call Panel */}
          <div style={{ ...panelStyle, textAlign: 'center', padding: '32px 24px' }}>
            {/* AI Avatar */}
            <div style={{ position: 'relative', width: '96px', height: '96px', margin: '0 auto 20px' }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: voiceStatus === 'speaking' ? '0 0 0 8px rgba(59,130,246,0.15), 0 0 0 16px rgba(59,130,246,0.08)' : 'none',
                transition: 'box-shadow 0.4s ease',
              }}>
                <Sparkles size={40} color="#fff" />
              </div>
              {/* Status dot */}
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 16, height: 16, borderRadius: '50%',
                background: voiceStatus === 'idle' || voiceStatus === 'ended' ? '#6b7280'
                  : voiceStatus === 'listening' ? '#10b981'
                  : voiceStatus === 'speaking' ? '#3b82f6'
                  : '#f59e0b',
                border: '2px solid #131b2e',
                transition: 'background 0.3s',
              }} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Realty AI Voice Agent</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
              Powered by Sarvam AI Bulbul v3 (Indian TTS) + Gemini
            </p>

            {/* Call duration */}
            {(voiceStatus !== 'idle' && voiceStatus !== 'ended') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '22px', fontWeight: '700', color: '#10b981', marginBottom: '16px', fontVariantNumeric: 'tabular-nums' }}>
                <Clock size={18} /> {formatDuration(callDuration)}
              </div>
            )}

            {/* Status label */}
            <div style={{ marginBottom: '20px' }}>
              <StatusPill status={voiceStatus} />
            </div>

            {/* Mic level bar */}
            {voiceStatus === 'listening' && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ height: '6px', background: '#1e293b', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${audioLevel}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: '3px', transition: 'width 0.05s' }} />
                </div>
                <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>Mic level — speak clearly</p>
              </div>
            )}

            {/* Language & voice picker */}
            {voiceStatus === 'idle' || voiceStatus === 'ended' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', color: '#9ca3af' }}>Language</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {([['hi-IN', 'Hindi 🇮🇳'], ['en-IN', 'English (IN) 🇮🇳']] as const).map(([code, label]) => (
                    <button key={code} onClick={() => {
                      setVoiceLang(code);
                      setVoiceSpeaker(code === 'hi-IN' ? 'meera' : 'arvind');
                    }} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${voiceLang === code ? '#3b82f6' : '#232f48'}`, background: voiceLang === code ? 'rgba(59,130,246,0.15)' : '#0b0f19', color: voiceLang === code ? '#60a5fa' : '#9ca3af', fontSize: '12px', cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>

                <label style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>Voice</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {(voiceLang === 'hi-IN'
                    ? [['meera', 'Meera ♀'], ['arvind', 'Arvind ♂'], ['amol', 'Amol ♂'], ['anushka', 'Anushka ♀']]
                    : [['arvind', 'Arvind ♂'], ['meera', 'Meera ♀'], ['anushka', 'Anushka ♀'], ['amol', 'Amol ♂']]
                  ).map(([v, label]) => (
                    <button key={v} onClick={() => setVoiceSpeaker(v)} style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${voiceSpeaker === v ? '#8b5cf6' : '#232f48'}`, background: voiceSpeaker === v ? 'rgba(139,92,246,0.15)' : '#0b0f19', color: voiceSpeaker === v ? '#a78bfa' : '#9ca3af', fontSize: '12px', cursor: 'pointer' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              {voiceStatus === 'idle' || voiceStatus === 'ended' ? (
                <button
                  id="start-call-btn"
                  onClick={startCall}
                  style={{ padding: '14px 32px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
                  <PhoneCall size={20} /> Start Call
                </button>
              ) : (
                <>
                  {voiceStatus === 'listening' && (
                    <button
                      onClick={handlePTTDown}
                      style={{ padding: '12px 20px', borderRadius: '50px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(59,130,246,0.4)' } as React.CSSProperties}>
                      <Mic size={16} /> Done Speaking
                    </button>
                  )}
                  <button
                    id="end-call-btn"
                    onClick={endCall}
                    style={{ padding: '12px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 16px rgba(239,68,68,0.4)' }}>
                    <PhoneOff size={18} /> End Call
                  </button>
                </>
              )}
            </div>

            {voiceStatus === 'ended' && (
              <p style={{ marginTop: '16px', fontSize: '12px', color: '#9ca3af' }}>
                Call ended · Duration: {formatDuration(callDuration)}
              </p>
            )}

            <div style={{ marginTop: '24px', padding: '12px', borderRadius: '8px', background: '#0b0f19', border: '1px solid #1e293b', textAlign: 'left' }}>
              <p style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.6' }}>
                🎙️ <strong style={{ color: '#9ca3af' }}>How it works:</strong> Speak → Sarvam Saaras v2 STT transcribes → Gemini replies → Sarvam Bulbul v3 speaks back. Fully Indian voice AI pipeline.<br />
                💡 Tip: Press <strong style={{ color: '#60a5fa' }}>Done Speaking</strong> anytime to skip the 5s window.
              </p>
            </div>
          </div>

          {/* Transcript Panel */}
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232f48', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Volume2 size={16} style={{ color: '#8b5cf6' }} /> Live Transcript
              </h3>
              {voiceTranscript.length > 0 && (
                <button onClick={() => setVoiceTranscript([])} style={iconBtnStyle}>
                  <RefreshCw size={12} /> Clear
                </button>
              )}
            </div>

            <div style={{ height: '480px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {voiceTranscript.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic size={28} color="#a78bfa" />
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center' }}>Start a call to see the live transcript here.<br />Both STT and TTS are powered by Sarvam AI.</p>
                </div>
              )}
              {voiceTranscript.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    flexShrink: 0, width: '32px', height: '32px', borderRadius: '50%',
                    background: t.speaker === 'You' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)',
                    border: `1px solid ${t.speaker === 'You' ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700',
                    color: t.speaker === 'You' ? '#60a5fa' : '#a78bfa',
                  }}>
                    {t.speaker === 'You' ? 'U' : 'AI'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: t.speaker === 'You' ? '#60a5fa' : '#a78bfa' }}>{t.speaker}</span>
                      <span style={{ fontSize: '11px', color: '#4b5563' }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.55', background: t.speaker === 'Realty AI' ? '#0f1929' : 'transparent', padding: t.speaker === 'Realty AI' ? '10px 14px' : '0', borderRadius: '8px', border: t.speaker === 'Realty AI' ? '1px solid #1e293b' : 'none' }}>
                      {t.text}
                    </div>
                  </div>
                </div>
              ))}
              {voiceStatus === 'processing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing with Sarvam AI + Gemini...
                </div>
              )}
              <div ref={transcriptBottomRef} />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab 3: Leads CRM ── */}
      {activeTab === 'leads' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Leads Directory</h2>
            <button onClick={fetchLeads} style={iconBtnStyle}><RefreshCw size={14} /> Refresh</button>
          </div>
          {loadingLeads ? <p style={{ color: '#9ca3af' }}>Loading leads...</p> : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name / ID</th><th>Channel</th><th>Intent</th><th>Budget</th>
                  <th>Locations</th><th>Status</th><th>Temp</th><th>Score</th><th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td>{l.name || l.external_user_id}</td>
                    <td style={{ textTransform: 'capitalize' }}>{l.channel}</td>
                    <td>{l.intent || '—'}</td>
                    <td>{l.budget_max ? `₹${(l.budget_max / 100000).toFixed(1)}L` : '—'}</td>
                    <td>{(l.preferred_locations || []).join(', ') || '—'}</td>
                    <td><span style={statusBadgeStyle(l.status)}>{l.status}</span></td>
                    <td><span style={tempBadgeStyle(l.temperature)}>{l.temperature}</span></td>
                    <td><strong>{l.lead_score ?? 0}</strong></td>
                    <td>{new Date(l.updated_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Tab 4: Property Catalog ── */}
      {activeTab === 'properties' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Properties Inventory</h2>
            <button onClick={fetchProperties} style={iconBtnStyle}><RefreshCw size={14} /> Refresh</button>
          </div>
          {loadingProperties ? <p style={{ color: '#9ca3af' }}>Loading inventory...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {properties.map((p) => (
                <div key={p.id} style={{ background: '#0b0f19', border: '1px solid #232f48', borderRadius: '8px', padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '4px' }}>{p.project_name}</h3>
                  <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}><MapPin size={12} display="inline" /> {p.locality}, {p.city}</p>
                  <p style={{ fontSize: '16px', fontWeight: '700', color: '#10b981', marginBottom: '12px' }}>
                    ₹{(p.price_min / 10000000).toFixed(2)} Cr - ₹{(p.price_max / 10000000).toFixed(2)} Cr
                  </p>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={chipStyle}>{p.bhk} BHK</span>
                    <span style={chipStyle}>{p.property_type}</span>
                    <span style={chipStyle}>{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 5: Ops ── */}
      {activeTab === 'ops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={panelStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Site Visit Bookings</h2>
            <table style={tableStyle}>
              <thead><tr><th>Lead</th><th>Property</th><th>Requested Date</th><th>Status</th></tr></thead>
              <tbody>
                {siteVisits.map((v) => (
                  <tr key={v.id}>
                    <td>{v.leads?.name || v.leads?.channel || '—'}</td>
                    <td>{v.properties?.project_name || 'General Visit'}</td>
                    <td>{v.requested_date || '—'}</td>
                    <td><span style={statusBadgeStyle(v.status)}>{v.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={panelStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Human Agent Escalations</h2>
            <table style={tableStyle}>
              <thead><tr><th>Lead</th><th>Reason</th><th>Urgency</th><th>Status</th></tr></thead>
              <tbody>
                {escalations.map((e) => (
                  <tr key={e.id}>
                    <td>{e.leads?.name || e.leads?.channel || '—'}</td>
                    <td>{e.reason}</td><td>{e.urgency}</td>
                    <td><span style={statusBadgeStyle(e.status)}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        table th { padding: 10px 12px; background: #0b0f19; color: #9ca3af; font-size: 12px; font-weight: 600; text-align: left; }
        table td { padding: 10px 12px; border-bottom: 1px solid #1e293b; }
        table tr:hover td { background: rgba(59,130,246,0.04); }
      `}</style>
    </div>
  );
}

// ── Status pill ──────────────────────────────────────────────────────────────
function StatusPill({ status }: { status: VoiceStatus }) {
  const config: Record<VoiceStatus, { label: string; color: string; bg: string; icon?: React.ReactNode }> = {
    idle:       { label: 'Ready to Call',   color: '#9ca3af', bg: 'rgba(156,163,175,0.1)' },
    connecting: { label: 'Connecting...',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> },
    listening:  { label: '● Listening',     color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
    processing: { label: 'AI Processing...', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> },
    speaking:   { label: '▶ AI Speaking',   color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
    ended:      { label: 'Call Ended',      color: '#6b7280', bg: 'rgba(107,114,128,0.1)' },
  };
  const c = config[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '20px', background: c.bg, color: c.color, fontSize: '13px', fontWeight: '600', border: `1px solid ${c.color}30` }}>
      {c.icon} {c.label}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', background: active ? '#2563eb' : 'transparent', color: active ? '#fff' : '#9ca3af', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
      {icon} {label}
    </button>
  );
}
function QuickChip({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button onClick={() => onClick(text)} style={{ padding: '4px 10px', borderRadius: '12px', border: '1px solid #232f48', background: '#131b2e', color: '#9ca3af', fontSize: '12px', whiteSpace: 'nowrap', cursor: 'pointer' }}>
      {text}
    </button>
  );
}
function LeadRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '4px' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color: '#fff', fontWeight: '500' }}>{value}</span>
    </div>
  );
}

const panelStyle: React.CSSProperties = { background: '#131b2e', border: '1px solid #232f48', borderRadius: '12px', padding: '20px' };
const iconBtnStyle: React.CSSProperties = { padding: '6px 12px', borderRadius: '6px', border: '1px solid #232f48', background: '#0b0f19', color: '#fff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' };
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#e5e7eb', textAlign: 'left' };
const chipStyle: React.CSSProperties = { fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#1e293b', color: '#9ca3af', border: '1px solid #334155' };

function healthBadgeStyle(ok: boolean): React.CSSProperties {
  return { display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: ok ? '#10b981' : '#ef4444', border: `1px solid ${ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` };
}
function statusBadgeStyle(_: string): React.CSSProperties {
  return { padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: '#1e293b', color: '#60a5fa', border: '1px solid #2563eb' };
}
function tempBadgeStyle(temp: string): React.CSSProperties {
  const isHot = temp === 'HOT', isWarm = temp === 'WARM';
  return { padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '600', background: isHot ? 'rgba(239,68,68,0.2)' : isWarm ? 'rgba(245,158,11,0.2)' : 'rgba(107,114,128,0.2)', color: isHot ? '#f87171' : isWarm ? '#fbbf24' : '#9ca3af' };
}
