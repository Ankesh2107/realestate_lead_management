'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  PhoneCall,
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
  Search,
} from 'lucide-react';

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

  // Ops state (Site Visits & Escalations)
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [escalations, setEscalations] = useState<any[]>([]);
  const [loadingOps, setLoadingOps] = useState<boolean>(false);

  // Voice demo state
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<{ speaker: 'You' | 'Realty AI'; text: string }[]>([]);
  const recognitionRef = useRef<any>(null);

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
    } catch (err) {
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
    } catch {
      setLeads([]);
    } finally {
      setLoadingLeads(false);
    }
  }

  async function fetchProperties() {
    setLoadingProperties(true);
    try {
      const res = await fetch('/api/test/properties');
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } catch {
      setProperties([]);
    } finally {
      setLoadingProperties(false);
    }
  }

  async function fetchOps() {
    setLoadingOps(true);
    try {
      const [vRes, eRes] = await Promise.all([
        fetch('/api/test/site-visits'),
        fetch('/api/test/escalations'),
      ]);
      const vData = await vRes.json();
      const eData = await eRes.json();
      setSiteVisits(Array.isArray(vData) ? vData : []);
      setEscalations(Array.isArray(eData) ? eData : []);
    } catch {
      setSiteVisits([]);
      setEscalations([]);
    } finally {
      setLoadingOps(false);
    }
  }

  useEffect(() => {
    if (activeTab === 'leads') fetchLeads();
    if (activeTab === 'properties') fetchProperties();
    if (activeTab === 'ops') fetchOps();
  }, [activeTab]);

  function speakText(text: string) {
    return new Promise<void>((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) return resolve();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }

  async function toggleVoiceCall() {
    if (isCalling) {
      setIsCalling(false);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome.');
      return;
    }

    setIsCalling(true);
    setVoiceTranscript([]);
    const voiceSession = `voice-web-${Math.random().toString(36).slice(2, 8)}`;

    const greeting = 'Hello, thank you for calling Skyline Realty. How can I help you today?';
    setVoiceTranscript([{ speaker: 'Realty AI', text: greeting }]);
    await speakText(greeting);

    const rec = new SpeechRecognition();
    rec.lang = 'en-IN';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onresult = async (e: any) => {
      const speech = e.results[0][0].transcript;
      setVoiceTranscript((prev) => [...prev, { speaker: 'You', text: speech }]);

      try {
        const r = await fetch('/api/test/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: voiceSession, text: speech, channel: 'voice' }),
        });
        const d = await r.json();
        const reply = d.reply || "I didn't quite capture that.";
        setVoiceTranscript((prev) => [...prev, { speaker: 'Realty AI', text: reply }]);
        await speakText(reply);
      } catch {
        setVoiceTranscript((prev) => [...prev, { speaker: 'Realty AI', text: 'Error reaching server.' }]);
      }
    };

    rec.onend = () => {
      if (isCalling) rec.start();
    };

    recognitionRef.current = rec;
    rec.start();
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
            Multilingual Real Estate Sales Agent & Omnichannel CRM (WhatsApp, Instagram, Facebook, Voice)
          </p>
        </div>

        {/* System Health Pills */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={healthBadgeStyle(health.dbOk)}>
            {health.dbOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Supabase DB: {health.dbOk ? 'Connected' : 'Disconnected'}
          </div>
          <div style={healthBadgeStyle(health.geminiOk)}>
            {health.geminiOk ? <CheckCircle2 size={14} /> : <XCircle size={14} />} Gemini AI Engine: {health.geminiOk ? 'Active' : 'Offline'}
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #232f48', paddingBottom: '12px', marginBottom: '24px' }}>
        <TabButton icon={<MessageSquare size={16} />} label="Web & Social Simulator" active={activeTab === 'chat'} onClick={() => setActiveTab('chat')} />
        <TabButton icon={<PhoneCall size={16} />} label="Voice Call Simulator" active={activeTab === 'voice'} onClick={() => setActiveTab('voice')} />
        <TabButton icon={<Users size={16} />} label="Leads CRM" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
        <TabButton icon={<Building size={16} />} label="Property Catalog" active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} />
        <TabButton icon={<ClipboardList size={16} />} label="Ops & Escalations" active={activeTab === 'ops'} onClick={() => setActiveTab('ops')} />
      </nav>

      {/* Tab 1: Chat Simulator */}
      {activeTab === 'chat' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px' }}>
          <div style={panelStyle}>
            {/* Channel Switcher */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #232f48', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['whatsapp', 'instagram', 'facebook', 'web_test'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #232f48',
                      background: channel === ch ? '#3b82f6' : '#131b2e',
                      color: '#fff',
                      fontSize: '13px',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {ch.replace('_', ' ')}
                  </button>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: '#9ca3af' }}>Session: {sessionId}</span>
            </div>

            {/* Quick Prompts */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
              <QuickChip text="Hi, do you have any 3BHK flats in Noida under 1.5 Cr?" onClick={(t) => handleSendChat(t)} />
              <QuickChip text="Can I schedule a site visit this Saturday?" onClick={(t) => handleSendChat(t)} />
              <QuickChip text="I want to talk to a human manager." onClick={(t) => handleSendChat(t)} />
            </div>

            {/* Chat Box */}
            <div style={{ height: '420px', overflowY: 'auto', border: '1px solid #232f48', borderRadius: '8px', padding: '16px', background: '#0b0f19', marginBottom: '16px' }}>
              {messages.length === 0 && <p style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', marginTop: '160px' }}>Start a conversation to test Realty AI multi-turn sales pipeline...</p>}
              {messages.map((m, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: m.sender === 'customer' ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      background: m.sender === 'customer' ? '#2563eb' : m.sender === 'ai' ? '#1e293b' : '#374151',
                      color: '#fff',
                      border: m.sender === 'ai' ? '1px solid #334155' : 'none',
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div style={{ color: '#9ca3af', fontSize: '13px', fontStyle: 'italic' }}>Realty AI is thinking and querying properties...</div>}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Type your property inquiry..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #232f48', background: '#0b0f19', color: '#fff', outline: 'none' }}
              />
              <button
                onClick={() => handleSendChat()}
                disabled={isTyping}
                style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}
              >
                <Send size={16} /> Send
              </button>
            </div>
          </div>

          {/* Lead State Inspector Sidebar */}
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

      {/* Tab 2: Voice Simulator */}
      {activeTab === 'voice' && (
        <div style={{ ...panelStyle, textAlign: 'center', padding: '40px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>Twilio Voice Agent Simulator</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>
            Simulates a real phone call turn using Web Speech API & Polly.Aditi voice prompt pipeline.
          </p>
          <button
            onClick={toggleVoiceCall}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: 'none',
              background: isCalling ? '#ef4444' : '#10b981',
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isCalling ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(16, 185, 129, 0.5)',
              marginBottom: '24px',
            }}
          >
            <PhoneCall size={32} />
          </button>
          <p style={{ fontWeight: '600', color: isCalling ? '#ef4444' : '#10b981', marginBottom: '24px' }}>
            {isCalling ? 'Call Connected (Listening... Speak into mic)' : 'Click to Start Voice Call'}
          </p>

          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left', background: '#0b0f19', border: '1px solid #232f48', borderRadius: '8px', padding: '16px', height: '240px', overflowY: 'auto' }}>
            {voiceTranscript.length === 0 && <p style={{ color: '#6b7280', fontSize: '13px', textAlign: 'center', marginTop: '90px' }}>Transcript will appear here...</p>}
            {voiceTranscript.map((t, i) => (
              <div key={i} style={{ marginBottom: '8px', fontSize: '14px', color: t.speaker === 'You' ? '#60a5fa' : '#34d399' }}>
                <strong>{t.speaker}:</strong> {t.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Leads CRM */}
      {activeTab === 'leads' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Leads Directory</h2>
            <button onClick={fetchLeads} style={iconBtnStyle}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          {loadingLeads ? (
            <p style={{ color: '#9ca3af' }}>Loading leads...</p>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name / ID</th>
                  <th>Channel</th>
                  <th>Intent</th>
                  <th>Budget</th>
                  <th>Locations</th>
                  <th>Status</th>
                  <th>Temp</th>
                  <th>Score</th>
                  <th>Last Active</th>
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

      {/* Tab 4: Property Catalog */}
      {activeTab === 'properties' && (
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Properties Inventory</h2>
            <button onClick={fetchProperties} style={iconBtnStyle}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          {loadingProperties ? (
            <p style={{ color: '#9ca3af' }}>Loading inventory...</p>
          ) : (
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

      {/* Tab 5: Ops & Escalations */}
      {activeTab === 'ops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={panelStyle}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Site Visit Bookings</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Property</th>
                  <th>Requested Date</th>
                  <th>Status</th>
                </tr>
              </thead>
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
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Reason</th>
                  <th>Urgency</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {escalations.map((e) => (
                  <tr key={e.id}>
                    <td>{e.leads?.name || e.leads?.channel || '—'}</td>
                    <td>{e.reason}</td>
                    <td>{e.urgency}</td>
                    <td><span style={statusBadgeStyle(e.status)}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers & Styles
function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 16px',
        borderRadius: '8px',
        border: 'none',
        background: active ? '#2563eb' : 'transparent',
        color: active ? '#fff' : '#9ca3af',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
      }}
    >
      {icon} {label}
    </button>
  );
}

function QuickChip({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      style={{
        padding: '4px 10px',
        borderRadius: '12px',
        border: '1px solid #232f48',
        background: '#131b2e',
        color: '#9ca3af',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
      }}
    >
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

const panelStyle: React.CSSProperties = {
  background: '#131b2e',
  border: '1px solid #232f48',
  borderRadius: '12px',
  padding: '20px',
};

const iconBtnStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid #232f48',
  background: '#0b0f19',
  color: '#fff',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '13px',
  color: '#e5e7eb',
  textAlign: 'left',
};

const chipStyle: React.CSSProperties = {
  fontSize: '11px',
  padding: '2px 8px',
  borderRadius: '4px',
  background: '#1e293b',
  color: '#9ca3af',
  border: '1px solid #334155',
};

function healthBadgeStyle(ok: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    background: ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
    color: ok ? '#10b981' : '#ef4444',
    border: `1px solid ${ok ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
  };
}

function statusBadgeStyle(status: string): React.CSSProperties {
  return {
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    background: '#1e293b',
    color: '#60a5fa',
    border: '1px solid #2563eb',
  };
}

function tempBadgeStyle(temp: string): React.CSSProperties {
  const isHot = temp === 'HOT';
  const isWarm = temp === 'WARM';
  return {
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    background: isHot ? 'rgba(239, 68, 68, 0.2)' : isWarm ? 'rgba(245, 158, 11, 0.2)' : 'rgba(107, 114, 128, 0.2)',
    color: isHot ? '#f87171' : isWarm ? '#fbbf24' : '#9ca3af',
  };
}
