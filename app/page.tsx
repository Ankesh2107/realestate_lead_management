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
  Info,
  Sliders,
} from 'lucide-react';

// ─── Voice state machine ───────────────────────────────────────────────────
type VoiceStatus =
  | 'idle'        // not in a call
  | 'connecting'  // playing greeting
  | 'listening'   // recording / listening to user speech
  | 'processing'  // STT + AI reply + TTS in progress
  | 'speaking'    // playing AI audio
  | 'ended';      // call hung up

const SARVAM_VOICE_LIBRARY = [
  // Female Voices ♀
  { id: 'ritu', name: 'Ritu ♀', gender: 'female', desc: 'Warm & Conversational' },
  { id: 'simran', name: 'Simran ♀', gender: 'female', desc: 'Friendly & Expressive' },
  { id: 'priya', name: 'Priya ♀', gender: 'female', desc: 'Soft Customer Service' },
  { id: 'ishita', name: 'Ishita ♀', gender: 'female', desc: 'Energetic Sales Pitch' },
  { id: 'pooja', name: 'Pooja ♀', gender: 'female', desc: 'Clear & Professional' },
  { id: 'roopa', name: 'Roopa ♀', gender: 'female', desc: 'Calm & Trustworthy' },
  { id: 'kavya', name: 'Kavya ♀', gender: 'female', desc: 'Modern Youth Accent' },
  // Male Voices ♂
  { id: 'aditya', name: 'Aditya ♂', gender: 'male', desc: 'Executive & Professional' },
  { id: 'rahul', name: 'Rahul ♂', gender: 'male', desc: 'Friendly Sales Advisor' },
  { id: 'shubh', name: 'Shubh ♂', gender: 'male', desc: 'Confident Specialist' },
  { id: 'dev', name: 'Dev ♂', gender: 'male', desc: 'Warm & Approachable' },
  { id: 'kabir', name: 'Kabir ♂', gender: 'male', desc: 'Deep Voice Executive' },
  { id: 'varun', name: 'Varun ♂', gender: 'male', desc: 'Dynamic & Upbeat' },
  { id: 'manan', name: 'Manan ♂', gender: 'male', desc: 'Relatable & Clear' },
];

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
  const [voiceSpeaker, setVoiceSpeaker] = useState<string>('ritu');
  const [voicePace, setVoicePace] = useState<number>(1.0);
  const [voiceGenderFilter, setVoiceGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [voiceTranscript, setVoiceTranscript] = useState<
    { speaker: 'You' | 'Realty AI'; text: string; time: string }[]
  >([]);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [interimText, setInterimText] = useState<string>('');
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [noticeMsg, setNoticeMsg] = useState<string>('');

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
  const recognitionRef = useRef<any>(null);
  const isProcessingTurnRef = useRef<boolean>(false);

  // Keep status ref in sync
  useEffect(() => {
    voiceStatusRef.current = voiceStatus;
  }, [voiceStatus]);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceTranscript, interimText]);

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

  /** Play base64 WAV audio from Sarvam TTS */
  async function playAudioBase64(base64: string): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio(`data:audio/wav;base64,${base64}`);
      currentAudioRef.current = audio;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }

  /** Call Sarvam TTS via server proxy with fallback */
  async function speakWithSarvam(text: string): Promise<void> {
    try {
      const res = await fetch('/api/voice/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker: voiceSpeaker, language_code: voiceLang, pace: voicePace }),
      });
      if (!res.ok) throw new Error(`TTS HTTP error: ${res.status}`);
      const data = await res.json();
      if (data.audio) {
        await playAudioBase64(data.audio);
        return;
      }
      throw new Error('No audio returned from Sarvam');
    } catch (err) {
      console.warn('[voice] Sarvam TTS fallback to browser TTS:', err);
      await new Promise<void>((resolve) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) { resolve(); return; }
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = voiceLang;
        utter.rate = voicePace;
        utter.onend = () => resolve();
        utter.onerror = () => resolve();
        window.speechSynthesis.speak(utter);
      });
    }
  }

  /** Transcribe recorded audio via Sarvam STT */
  async function transcribeAudio(blob: Blob): Promise<string> {
    if (!blob || blob.size < 100) return '';
    try {
      const form = new FormData();
      form.append('audio', blob, 'audio.wav');
      form.append('language_code', voiceLang);
      const res = await fetch('/api/voice/stt', { method: 'POST', body: form });
      if (!res.ok) return '';
      const data = await res.json();
      return data.transcript || '';
    } catch {
      return '';
    }
  }

  /** Mic level meter animation */
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

  /** Stop media recorder */
  function stopMediaRecorder(): Promise<Blob> {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr || mr.state === 'inactive') {
        resolve(new Blob());
        return;
      }
      mr.onstop = () => {
        resolve(new Blob(audioChunksRef.current, { type: 'audio/webm' }));
      };
      mr.stop();
    });
  }

  /** Stop Web Speech recognition */
  function stopSpeechRecognition() {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
  }

  /** Main voice turn handler: processes recognized or input text */
  const processTurn = useCallback(async (spokenText?: string) => {
    if (isProcessingTurnRef.current) return;
    if (voiceStatusRef.current !== 'listening' && voiceStatusRef.current !== 'speaking') return;

    isProcessingTurnRef.current = true;
    setNoticeMsg('');
    setVoiceStatus('processing');
    stopLevelMeter();
    stopSpeechRecognition();

    let textToProcess = (spokenText || '').trim();

    if (!textToProcess) {
      const blob = await stopMediaRecorder();
      textToProcess = await transcribeAudio(blob);
    } else {
      await stopMediaRecorder();
    }

    setInterimText('');

    if (!textToProcess || textToProcess.length < 2) {
      isProcessingTurnRef.current = false;
      setNoticeMsg('No clear speech detected. Speak now or type a message below.');
      startListeningLoop();
      return;
    }

    addTranscript('You', textToProcess);

    let aiReply = "Aapki inquiry update ho gayi hai. Main Skyline Realty CRM se details check kar rahi hoon.";
    try {
      const res = await fetch('/api/test/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: voiceSessionRef.current, text: textToProcess, channel: 'voice' }),
      });
      const data = await res.json();
      if (data.reply) aiReply = data.reply;
    } catch {
      /* fallback */
    }

    addTranscript('Realty AI', aiReply);

    setVoiceStatus('speaking');
    await speakWithSarvam(aiReply);

    isProcessingTurnRef.current = false;

    const statusAfterTTS: string = voiceStatusRef.current;
    if (statusAfterTTS !== 'ended' && statusAfterTTS !== 'idle') {
      startListeningLoop();
    }
  }, [voiceLang, voiceSpeaker, voicePace]);

  /** Start listening loop with Browser Speech Recognition + MediaRecorder fallback */
  const startListeningLoop = useCallback(() => {
    if (voiceStatusRef.current === 'ended' || voiceStatusRef.current === 'idle') return;

    setVoiceStatus('listening');
    startLevelMeter();
    setInterimText('');

    if (streamRef.current) {
      try {
        const mr = new MediaRecorder(streamRef.current, { mimeType: 'audio/webm' });
        audioChunksRef.current = [];
        mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
        mr.start();
        mediaRecorderRef.current = mr;
      } catch {
        /* proceed */
      }
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const rec = new SpeechRec();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = voiceLang;

        rec.onresult = (e: any) => {
          let currentTranscript = '';
          for (let i = e.resultIndex; i < e.results.length; ++i) {
            currentTranscript += e.results[i][0].transcript;
          }
          setInterimText(currentTranscript);

          if (e.results[e.results.length - 1].isFinal) {
            rec.stop();
            processTurn(currentTranscript);
          }
        };

        rec.onerror = (e: any) => {
          console.warn('[voice] Web Speech Rec error:', e.error);
        };

        rec.start();
        recognitionRef.current = rec;
      } catch (err) {
        console.warn('[voice] Web Speech Rec start failed:', err);
      }
    }
  }, [voiceLang, processTurn]);

  /** Start call flow */
  async function startCall() {
    if (voiceStatus !== 'idle' && voiceStatus !== 'ended') return;

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
    } catch {
      alert('Microphone access denied. Please grant mic permissions in your browser to use Voice Call.');
      return;
    }

    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
    } catch {}

    voiceSessionRef.current = `voice-web-${Math.random().toString(36).slice(2, 8)}`;
    setVoiceTranscript([]);
    setCallDuration(0);
    setNoticeMsg('');
    setVoiceStatus('connecting');

    callTimerRef.current = setInterval(() => setCallDuration((d) => d + 1), 1000);

    const greeting =
      voiceLang === 'hi-IN'
        ? `Namaste! Main Realty AI hoon, Skyline Realty ki taraf se. Aap kaisi property dekh rahe hain?`
        : `Hello! I'm Realty AI from Skyline Realty. What kind of property are you looking for today?`;

    addTranscript('Realty AI', greeting);
    setVoiceStatus('speaking');
    await speakWithSarvam(greeting);

    if (voiceStatusRef.current !== 'ended' && voiceStatusRef.current !== 'idle') {
      startListeningLoop();
    }
  }

  /** End call flow */
  function endCall() {
    currentAudioRef.current?.pause();
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();

    stopSpeechRecognition();
    stopMediaRecorder();

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioContextRef.current?.close();
    stopLevelMeter();

    if (callTimerRef.current) clearInterval(callTimerRef.current);

    setVoiceStatus('ended');
    setInterimText('');
  }

  function handleSendVoiceInput(textToSend?: string) {
    const text = (textToSend || voiceInput).trim();
    if (!text) return;
    setVoiceInput('');
    processTurn(text);
  }

  function formatDuration(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  const filteredVoices = SARVAM_VOICE_LIBRARY.filter(
    (v) => voiceGenderFilter === 'all' || v.gender === voiceGenderFilter
  );

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
        <TabButton icon={<PhoneCall size={16} />} label="Voice Call Agent (Sarvam AI)" active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
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
        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: '20px', alignItems: 'start' }}>
          {/* Call Control Console */}
          <div style={{ ...panelStyle, textAlign: 'center', padding: '28px 24px' }}>
            {/* AI Avatar */}
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: voiceStatus === 'speaking'
                  ? '0 0 0 10px rgba(59,130,246,0.2), 0 0 0 20px rgba(59,130,246,0.1)'
                  : voiceStatus === 'listening'
                  ? '0 0 0 10px rgba(16,185,129,0.2), 0 0 0 20px rgba(16,185,129,0.1)'
                  : 'none',
                transition: 'box-shadow 0.4s ease',
              }}>
                <Sparkles size={44} color="#fff" />
              </div>
              {/* Status Dot */}
              <div style={{
                position: 'absolute', bottom: 4, right: 4,
                width: 18, height: 18, borderRadius: '50%',
                background: voiceStatus === 'idle' || voiceStatus === 'ended' ? '#6b7280'
                  : voiceStatus === 'listening' ? '#10b981'
                  : voiceStatus === 'speaking' ? '#3b82f6'
                  : '#f59e0b',
                border: '3px solid #131b2e',
                transition: 'background 0.3s',
              }} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Realty AI Voice Agent</h2>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
              Sarvam AI Bulbul v3 (TTS) + Gemini Sales Intelligence
            </p>

            {/* Call duration */}
            {(voiceStatus !== 'idle' && voiceStatus !== 'ended') && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '16px', fontVariantNumeric: 'tabular-nums' }}>
                <Clock size={18} /> {formatDuration(callDuration)}
              </div>
            )}

            {/* Status Pill */}
            <div style={{ marginBottom: '16px' }}>
              <StatusPill status={voiceStatus} />
            </div>

            {/* Mic level bar when listening */}
            {voiceStatus === 'listening' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.max(10, audioLevel)}%`, background: 'linear-gradient(90deg, #10b981, #3b82f6)', borderRadius: '4px', transition: 'width 0.05s ease' }} />
                </div>
                <p style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', fontWeight: '500' }}>
                  🎙️ Listening live... speak your property query
                </p>
              </div>
            )}

            {/* Notice / Feedback banner */}
            {noticeMsg && (
              <div style={{ marginBottom: '16px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24', fontSize: '12px', textAlign: 'left', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>{noticeMsg}</span>
              </div>
            )}

            {/* Language & Voice Selector */}
            {(voiceStatus === 'idle' || voiceStatus === 'ended') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', textAlign: 'left', background: '#0b0f19', padding: '16px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '6px', display: 'block', fontWeight: '600' }}>
                    🌐 Language Accent
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {([['hi-IN', 'Hindi (हिन्दी) 🇮🇳'], ['en-IN', 'English (Indian) 🇮🇳']] as const).map(([code, label]) => (
                      <button key={code} onClick={() => {
                        setVoiceLang(code);
                        setVoiceSpeaker(code === 'hi-IN' ? 'ritu' : 'rahul');
                      }} style={{ flex: 1, padding: '8px 12px', borderRadius: '6px', border: `1px solid ${voiceLang === code ? '#3b82f6' : '#232f48'}`, background: voiceLang === code ? 'rgba(59,130,246,0.15)' : '#131b2e', color: voiceLang === code ? '#60a5fa' : '#9ca3af', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>
                      🎙️ Select AI Voice ({filteredVoices.length} options)
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {(['all', 'female', 'male'] as const).map((g) => (
                        <button key={g} onClick={() => setVoiceGenderFilter(g)} style={{ padding: '2px 8px', borderRadius: '4px', border: 'none', background: voiceGenderFilter === g ? '#3b82f6' : '#1e293b', color: voiceGenderFilter === g ? '#fff' : '#9ca3af', fontSize: '10px', textTransform: 'capitalize', cursor: 'pointer' }}>
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                    {filteredVoices.map((v) => (
                      <button key={v.id} onClick={() => setVoiceSpeaker(v.id)} style={{ textAlign: 'left', padding: '8px 10px', borderRadius: '6px', border: `1px solid ${voiceSpeaker === v.id ? '#8b5cf6' : '#232f48'}`, background: voiceSpeaker === v.id ? 'rgba(139,92,246,0.15)' : '#131b2e', color: voiceSpeaker === v.id ? '#a78bfa' : '#d1d5db', cursor: 'pointer' }}>
                        <div style={{ fontSize: '12px', fontWeight: '600' }}>{v.name}</div>
                        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{v.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speech Pace Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sliders size={12} /> Speech Cadence Speed
                    </label>
                    <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '700' }}>{voicePace.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.85"
                    max="1.15"
                    step="0.05"
                    value={voicePace}
                    onChange={(e) => setVoicePace(parseFloat(e.target.value))}
                    style={{ width: '100%', accentColor: '#3b82f6', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
                    <span>Relaxed (0.85x)</span>
                    <span>Conversational (1.0x)</span>
                    <span>Fast (1.15x)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
              {voiceStatus === 'idle' || voiceStatus === 'ended' ? (
                <button
                  id="start-call-btn"
                  onClick={startCall}
                  style={{ padding: '14px 36px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(16,185,129,0.4)' }}>
                  <PhoneCall size={20} /> Start Voice Call
                </button>
              ) : (
                <>
                  {voiceStatus === 'listening' && (
                    <button
                      onClick={() => processTurn(interimText)}
                      style={{ padding: '12px 20px', borderRadius: '50px', background: '#2563eb', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', boxShadow: '0 4px 12px rgba(37,99,235,0.4)' }}>
                      <Mic size={16} /> Send Speech
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

            {/* Interactive Speech Input & Quick Chips during call */}
            {(voiceStatus === 'listening' || voiceStatus === 'speaking' || voiceStatus === 'processing') && (
              <div style={{ marginTop: '16px', borderTop: '1px solid #1e293b', paddingTop: '16px', textAlign: 'left' }}>
                <label style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px', display: 'block' }}>
                  💬 Speak into mic or type a test message:
                </label>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    placeholder="e.g. 3BHK flat in Noida under 1.5 Cr..."
                    value={voiceInput}
                    onChange={(e) => setVoiceInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceInput()}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #232f48', background: '#0b0f19', color: '#fff', fontSize: '13px', outline: 'none' }}
                  />
                  <button
                    onClick={() => handleSendVoiceInput()}
                    style={{ padding: '10px 16px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Send size={14} /> Send
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <QuickVoiceChip text="Noida 3BHK under 1.5 Cr?" onClick={(t) => handleSendVoiceInput(t)} />
                  <QuickVoiceChip text="Book Saturday site visit" onClick={(t) => handleSendVoiceInput(t)} />
                  <QuickVoiceChip text="Connect with sales manager" onClick={(t) => handleSendVoiceInput(t)} />
                </div>
              </div>
            )}
          </div>

          {/* Live Transcript & Real-Time Voice Wave Panel */}
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232f48', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={18} style={{ color: '#8b5cf6' }} /> Live Call Transcript
              </h3>
              {voiceTranscript.length > 0 && (
                <button onClick={() => setVoiceTranscript([])} style={iconBtnStyle}>
                  <RefreshCw size={12} /> Clear Log
                </button>
              )}
            </div>

            <div style={{ height: '560px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
              {voiceTranscript.length === 0 && !interimText && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mic size={28} color="#a78bfa" />
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', lineHeight: '1.6' }}>
                    Click <strong>Start Voice Call</strong> to speak live with Realty AI.<br />
                    Select from 14 distinct male/female Sarvam Bulbul v3 voices!
                  </p>
                </div>
              )}

              {/* Speech Log */}
              {voiceTranscript.map((t, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{
                    flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%',
                    background: t.speaker === 'You' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)',
                    border: `1px solid ${t.speaker === 'You' ? 'rgba(59,130,246,0.4)' : 'rgba(139,92,246,0.4)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700',
                    color: t.speaker === 'You' ? '#60a5fa' : '#a78bfa',
                  }}>
                    {t.speaker === 'You' ? 'U' : 'AI'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: t.speaker === 'You' ? '#60a5fa' : '#a78bfa' }}>{t.speaker}</span>
                      <span style={{ fontSize: '11px', color: '#4b5563' }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#e5e7eb', lineHeight: '1.6', background: t.speaker === 'Realty AI' ? '#0f1929' : 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: t.speaker === 'Realty AI' ? '1px solid #1e293b' : '1px solid rgba(255,255,255,0.06)' }}>
                      {t.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Live interim text preview as user speaks */}
              {interimText && (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', opacity: 0.8 }}>
                  <div style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#10b981' }}>
                    U
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: '#10b981', fontStyle: 'italic', marginBottom: '2px', display: 'block' }}>Speaking live...</span>
                    <div style={{ fontSize: '14px', color: '#6ee7b7', fontStyle: 'italic', background: 'rgba(16,185,129,0.1)', padding: '10px 14px', borderRadius: '10px', border: '1px dashed rgba(16,185,129,0.3)' }}>
                      "{interimText}"
                    </div>
                  </div>
                </div>
              )}

              {/* Processing indicator */}
              {voiceStatus === 'processing' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#60a5fa', fontSize: '13px', fontStyle: 'italic', padding: '10px 14px', background: 'rgba(59,130,246,0.1)', borderRadius: '8px', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing query with Sarvam AI + Gemini...
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
          {loadingProperties ? <p style={{ color: '#9ca3af' }}>Loading properties...</p> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {properties.map((p) => (
                <div key={p.id} style={{ background: '#0b0f19', border: '1px solid #232f48', borderRadius: '10px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{p.title}</h3>
                    <span style={{ fontSize: '11px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: '600' }}>
                      {p.possession_status || 'Active'}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {p.location}, {p.city}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#e5e7eb', background: '#131b2e', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
                    <div>
                      <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block' }}>Type</span>
                      <strong>{p.bhk_type} Flat</strong>
                    </div>
                    <div>
                      <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block' }}>Area</span>
                      <strong>{p.sqft ? `${p.sqft} sqft` : '—'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#9ca3af', fontSize: '11px', display: 'block' }}>Price</span>
                      <strong style={{ color: '#10b981' }}>₹{(p.price / 10000000).toFixed(2)} Cr</strong>
                    </div>
                  </div>
                  {Array.isArray(p.amenities) && p.amenities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {p.amenities.slice(0, 4).map((a: string, idx: number) => (
                        <span key={idx} style={{ fontSize: '11px', background: '#1e293b', color: '#9ca3af', padding: '2px 6px', borderRadius: '4px' }}>{a}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab 5: Ops & Escalations ── */}
      {activeTab === 'ops' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Scheduled Site Visits</h2>
              <button onClick={fetchOps} style={iconBtnStyle}><RefreshCw size={14} /> Refresh</button>
            </div>
            {siteVisits.length === 0 ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No site visits recorded yet.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {siteVisits.map((v) => (
                  <div key={v.id} style={{ padding: '12px', background: '#0b0f19', border: '1px solid #232f48', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                      <span>Visit #{v.id.slice(0, 6)}</span>
                      <span style={{ color: '#10b981' }}>{v.status || 'Scheduled'}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                      Date: {new Date(v.scheduled_time || v.visit_date).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600' }}>Human Escalations &amp; Support</h2>
              <button onClick={fetchOps} style={iconBtnStyle}><RefreshCw size={14} /> Refresh</button>
            </div>
            {escalations.length === 0 ? <p style={{ color: '#9ca3af', fontSize: '13px' }}>No escalated leads pending.</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {escalations.map((e) => (
                  <div key={e.id} style={{ padding: '12px', background: '#0b0f19', border: '1px solid #232f48', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', color: '#fff' }}>
                      <span>Escalation #{e.id.slice(0, 6)}</span>
                      <span style={{ color: '#ef4444' }}>{e.status || 'Pending'}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '4px' }}>
                      Reason: {e.reason || 'Human agent requested by customer'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Components ─────────────────────────────────────────────────────────────

function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '8px', border: 'none', background: active ? '#3b82f6' : 'transparent', color: active ? '#fff' : '#9ca3af', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
      {icon} {label}
    </button>
  );
}

function QuickChip({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button onClick={() => onClick(text)} style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: '16px', border: '1px solid #232f48', background: '#131b2e', color: '#9ca3af', fontSize: '12px', cursor: 'pointer' }}>
      {text}
    </button>
  );
}

function QuickVoiceChip({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button onClick={() => onClick(text)} style={{ padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '11px', cursor: 'pointer' }}>
      "{text}"
    </button>
  );
}

function LeadRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '6px' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <strong style={{ color: '#fff', textAlign: 'right' }}>{value}</strong>
    </div>
  );
}

function StatusPill({ status }: { status: VoiceStatus }) {
  const configs: Record<VoiceStatus, { label: string; bg: string; color: string; border: string }> = {
    idle: { label: 'Ready for Call', bg: 'rgba(107,114,128,0.15)', color: '#9ca3af', border: '1px solid rgba(107,114,128,0.3)' },
    connecting: { label: 'Connecting Agent...', bg: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' },
    listening: { label: '🎙️ Listening to You...', bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' },
    processing: { label: '⚡ Thinking & Querying...', bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' },
    speaking: { label: '🔊 Agent Speaking...', bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' },
    ended: { label: 'Call Ended', bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
  };

  const cfg = configs[status] || configs.idle;

  return (
    <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', background: cfg.bg, color: cfg.color, border: cfg.border, fontSize: '13px', fontWeight: '600' }}>
      {cfg.label}
    </span>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  background: '#131b2e',
  borderRadius: '12px',
  border: '1px solid #232f48',
  padding: '20px',
};

const iconBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 10px',
  borderRadius: '6px',
  border: '1px solid #232f48',
  background: '#0b0f19',
  color: '#9ca3af',
  fontSize: '12px',
  cursor: 'pointer',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
  color: '#e5e7eb',
};

function healthBadgeStyle(ok: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    background: ok ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
    color: ok ? '#34d399' : '#f87171',
    border: `1px solid ${ok ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
  };
}

function statusBadgeStyle(status: string): React.CSSProperties {
  const isHot = status === 'qualified' || status === 'visit_scheduled';
  return {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    background: isHot ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)',
    color: isHot ? '#34d399' : '#9ca3af',
  };
}

function tempBadgeStyle(temp: string): React.CSSProperties {
  const isHot = temp === 'HOT';
  const isWarm = temp === 'WARM';
  return {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    background: isHot ? 'rgba(239,68,68,0.15)' : isWarm ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)',
    color: isHot ? '#f87171' : isWarm ? '#fbbf24' : '#60a5fa',
  };
}
