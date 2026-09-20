// import React from 'react';
// import { Clock, Info, Loader2, Mic, PhoneCall, PhoneOff, RefreshCw, Send, Sliders, Sparkles, Volume2 } from 'lucide-react';
// import { QuickVoiceChip } from '@/components/dashboard/ui/QuickVoiceChip';
// import { StatusPill } from '@/components/dashboard/ui/StatusPill';
// import { iconBtnClass, panelClass } from '@/lib/dashboard/styles';
// import { useVoiceCall } from '@/hooks/useVoiceCall';

// const LANGUAGE_OPTIONS = [
//   ['hi-IN', 'Hindi (हिन्दी) 🇮🇳'],
//   ['en-IN', 'English (Indian) 🇮🇳'],
// ] as const;

// const GENDER_FILTERS = ['all', 'female', 'male'] as const;

// const GLOW: Record<string, string> = {
//   speaking: 'shadow-[0_0_0_10px_rgba(47,111,237,0.16),0_0_0_20px_rgba(47,111,237,0.08)]',
//   listening: 'shadow-[0_0_0_10px_rgba(22,163,74,0.16),0_0_0_20px_rgba(22,163,74,0.08)]',
// };

// const DOT: Record<string, string> = {
//   idle: 'bg-faint',
//   ended: 'bg-faint',
//   listening: 'bg-success',
//   speaking: 'bg-primary',
//   connecting: 'bg-warning',
//   processing: 'bg-warning',
// };

// export function VoiceTab({ voice }: { voice: ReturnType<typeof useVoiceCall> }) {
//   const {
//     voiceStatus,
//     voiceLang,
//     voiceSpeaker,
//     voicePace,
//     voiceGenderFilter,
//     setVoiceGenderFilter,
//     voiceTranscript,
//     setVoiceTranscript,
//     callDuration,
//     audioLevel,
//     interimText,
//     voiceInput,
//     setVoiceInput,
//     noticeMsg,
//     transcriptBottomRef,
//     filteredVoices,
//     startCall,
//     endCall,
//     processTurn,
//     handleSendVoiceInput,
//     formatDuration,
//     selectLanguage,
//     selectSpeaker,
//     updatePace,
//   } = voice;

//   return (
//     <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[440px_1fr]">
//       {/* Call Control Console */}
//       <div className={`${panelClass} px-6 py-7 text-center`}>
//         {/* AI Avatar */}
//         <div className="relative mx-auto mb-4 h-[100px] w-[100px]">
//           <div
//             className={`flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet transition-shadow duration-300 ${GLOW[voiceStatus] || ''}`}
//           >
//             <Sparkles size={44} className="text-white" />
//           </div>
//           <div className={`absolute bottom-1 right-1 h-[18px] w-[18px] rounded-full border-[3px] border-surface transition-colors ${DOT[voiceStatus]}`} />
//         </div>

//         <h2 className="mb-1 text-xl font-bold text-ink">Realty AI Voice Agent</h2>
//         <p className="mb-4 text-[13px] text-muted">Sarvam AI Bulbul v3 (TTS) + Gemini Sales Intelligence</p>

//         {(voiceStatus !== 'idle' && voiceStatus !== 'ended') && (
//           <div className="mb-4 flex items-center justify-center gap-1.5 text-2xl font-bold text-success [font-variant-numeric:tabular-nums]">
//             <Clock size={18} /> {formatDuration(callDuration)}
//           </div>
//         )}

//         <div className="mb-4">
//           <StatusPill status={voiceStatus} />
//         </div>

//         {voiceStatus === 'listening' && (
//           <div className="mb-4">
//             <div className="h-2 overflow-hidden rounded-md bg-border">
//               <div
//                 className="h-full rounded-md bg-gradient-to-r from-success to-primary transition-[width] duration-75"
//                 style={{ width: `${Math.max(10, audioLevel)}%` }}
//               />
//             </div>
//             <p className="mt-1.5 text-xs font-medium text-success">🎙️ Listening live... speak your property query</p>
//           </div>
//         )}

//         {noticeMsg && (
//           <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/25 bg-warning-soft px-3 py-2.5 text-left text-xs text-warning">
//             <Info size={16} className="shrink-0" />
//             <span>{noticeMsg}</span>
//           </div>
//         )}

//         {(voiceStatus === 'idle' || voiceStatus === 'ended') && (
//           <div className="mb-6 flex flex-col gap-3.5 rounded-xl border border-border bg-surface-alt p-4 text-left">
//             <div>
//               <label className="mb-1.5 block text-xs font-semibold text-muted">🌐 Language Accent</label>
//               <div className="flex gap-2">
//                 {LANGUAGE_OPTIONS.map(([code, label]) => (
//                   <button
//                     key={code}
//                     onClick={() => selectLanguage(code)}
//                     className={[
//                       'flex-1 rounded-lg border px-3 py-2 text-xs font-semibold',
//                       voiceLang === code ? 'border-primary bg-primary-soft text-primary' : 'border-border bg-surface text-muted',
//                     ].join(' ')}
//                   >
//                     {label}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <div className="mb-1.5 flex items-center justify-between">
//                 <label className="text-xs font-semibold text-muted">🎙️ Select AI Voice ({filteredVoices.length} options)</label>
//                 <div className="flex gap-1">
//                   {GENDER_FILTERS.map((g) => (
//                     <button
//                       key={g}
//                       onClick={() => setVoiceGenderFilter(g)}
//                       className={[
//                         'rounded px-2 py-0.5 text-[10px] capitalize',
//                         voiceGenderFilter === g ? 'bg-ink text-white' : 'bg-border text-muted',
//                       ].join(' ')}
//                     >
//                       {g}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="grid max-h-[200px] grid-cols-2 gap-1.5 overflow-y-auto pr-1">
//                 {filteredVoices.map((v) => (
//                   <button
//                     key={v.id}
//                     onClick={() => selectSpeaker(v.id)}
//                     className={[
//                       'rounded-lg border px-2.5 py-2 text-left',
//                       voiceSpeaker === v.id ? 'border-violet bg-violet-soft text-violet' : 'border-border bg-surface text-ink',
//                     ].join(' ')}
//                   >
//                     <div className="text-xs font-semibold">{v.name}</div>
//                     <div className="mt-0.5 text-[10px] text-muted">{v.desc}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <div className="mb-1 flex items-center justify-between">
//                 <label className="flex items-center gap-1 text-xs font-semibold text-muted">
//                   <Sliders size={12} /> Speech Cadence Speed
//                 </label>
//                 <span className="text-[11px] font-bold text-primary">{voicePace.toFixed(2)}x</span>
//               </div>
//               <input
//                 type="range"
//                 min="0.85"
//                 max="1.15"
//                 step="0.05"
//                 value={voicePace}
//                 onChange={(e) => updatePace(parseFloat(e.target.value))}
//                 className="w-full cursor-pointer accent-primary"
//               />
//               <div className="mt-0.5 flex justify-between text-[10px] text-faint">
//                 <span>Relaxed (0.85x)</span>
//                 <span>Conversational (1.0x)</span>
//                 <span>Fast (1.15x)</span>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Action Buttons */}
//         <div className="mb-5 flex justify-center gap-3">
//           {voiceStatus === 'idle' || voiceStatus === 'ended' ? (
//             <button
//               id="start-call-btn"
//               onClick={startCall}
//               className="flex items-center gap-2.5 rounded-full bg-gradient-to-br from-success to-[#0f8a3d] px-9 py-3.5 text-base font-bold text-white shadow-lg shadow-success/25"
//             >
//               <PhoneCall size={20} /> Start Voice Call
//             </button>
//           ) : (
//             <>
//               {voiceStatus === 'listening' && (
//                 <button
//                   onClick={() => processTurn(interimText)}
//                   className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-white shadow-lg shadow-primary/25"
//                 >
//                   <Mic size={16} /> Send Speech
//                 </button>
//               )}
//               <button
//                 id="end-call-btn"
//                 onClick={endCall}
//                 className="flex items-center gap-2 rounded-full bg-gradient-to-br from-danger to-[#c9342b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-danger/25"
//               >
//                 <PhoneOff size={18} /> End Call
//               </button>
//             </>
//           )}
//         </div>

//         {/* Interactive Speech Input & Quick Chips during call */}
//         {(voiceStatus === 'listening' || voiceStatus === 'speaking' || voiceStatus === 'processing') && (
//           <div className="border-t border-border pt-4 text-left">
//             <label className="mb-2 block text-xs text-muted">💬 Speak into mic or type a test message:</label>

//             <div className="mb-2.5 flex gap-2">
//               <input
//                 type="text"
//                 placeholder="e.g. 3BHK flat in Noida under 1.5 Cr..."
//                 value={voiceInput}
//                 onChange={(e) => setVoiceInput(e.target.value)}
//                 onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceInput()}
//                 className="flex-1 rounded-lg border border-border bg-surface-alt px-3.5 py-2.5 text-[13px] text-ink outline-none"
//               />
//               <button
//                 onClick={() => handleSendVoiceInput()}
//                 className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white"
//               >
//                 <Send size={14} /> Send
//               </button>
//             </div>

//             <div className="flex flex-wrap gap-1.5">
//               <QuickVoiceChip text="Noida 3BHK under 1.5 Cr?" onClick={(t) => handleSendVoiceInput(t)} />
//               <QuickVoiceChip text="Book Saturday site visit" onClick={(t) => handleSendVoiceInput(t)} />
//               <QuickVoiceChip text="Connect with sales manager" onClick={(t) => handleSendVoiceInput(t)} />
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Live Transcript */}
//       <div className={panelClass}>
//         <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
//           <h3 className="flex items-center gap-2 text-base font-semibold text-ink">
//             <Volume2 size={18} className="text-violet" /> Live Call Transcript
//           </h3>
//           {voiceTranscript.length > 0 && (
//             <button onClick={() => setVoiceTranscript([])} className={iconBtnClass}>
//               <RefreshCw size={12} /> Clear Log
//             </button>
//           )}
//         </div>

//         <div className="flex h-[560px] flex-col gap-3.5 overflow-y-auto pr-1">
//           {voiceTranscript.length === 0 && !interimText && (
//             <div className="flex h-full flex-col items-center justify-center gap-3">
//               <div className="flex h-16 w-16 items-center justify-center rounded-full border border-violet/20 bg-violet-soft">
//                 <Mic size={28} className="text-violet" />
//               </div>
//               <p className="text-center text-sm leading-relaxed text-muted">
//                 Click <strong>Start Voice Call</strong> to speak live with Realty AI.
//                 <br />
//                 Select from 14 distinct male/female Sarvam Bulbul v3 voices!
//               </p>
//             </div>
//           )}

//           {voiceTranscript.map((t, i) => (
//             <div key={i} className="flex items-start gap-3">
//               <div
//                 className={[
//                   'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[13px] font-bold',
//                   t.speaker === 'You'
//                     ? 'border-primary/30 bg-primary-soft text-primary'
//                     : 'border-violet/30 bg-violet-soft text-violet',
//                 ].join(' ')}
//               >
//                 {t.speaker === 'You' ? 'U' : 'AI'}
//               </div>
//               <div className="flex-1">
//                 <div className="mb-1 flex items-center gap-2">
//                   <span className={`text-[13px] font-semibold ${t.speaker === 'You' ? 'text-primary' : 'text-violet'}`}>
//                     {t.speaker}
//                   </span>
//                   <span className="text-[11px] text-faint">{t.time}</span>
//                 </div>
//                 <div className="rounded-xl border border-border-soft bg-surface-alt px-3.5 py-2.5 text-sm leading-relaxed text-ink">
//                   {t.text}
//                 </div>
//               </div>
//             </div>
//           ))}

//           {interimText && (
//             <div className="flex items-start gap-3 opacity-85">
//               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-success/30 bg-success-soft text-[13px] font-bold text-success">
//                 U
//               </div>
//               <div className="flex-1">
//                 <span className="mb-0.5 block text-xs italic text-success">Speaking live...</span>
//                 <div className="rounded-xl border border-dashed border-success/30 bg-success-soft px-3.5 py-2.5 text-sm italic text-success">
//                   &quot;{interimText}&quot;
//                 </div>
//               </div>
//             </div>
//           )}

//           {voiceStatus === 'processing' && (
//             <div className="flex items-center gap-2.5 rounded-lg border border-primary/20 bg-primary-soft px-3.5 py-2.5 text-[13px] italic text-primary">
//               <Loader2 size={16} className="animate-spin" /> Processing query with Sarvam AI + Gemini...
//             </div>
//           )}

//           <div ref={transcriptBottomRef} />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import { Clock, Loader2, Mic, PhoneCall, PhoneOff, Send } from 'lucide-react';
import { useVoiceCall } from '@/hooks/useVoiceCall';

const LANGUAGE_OPTIONS = [
  ['hi-IN', 'Hindi'],
  ['en-IN', 'English'],
] as const;

const GENDER_FILTERS = ['all', 'female', 'male'] as const;

const SETTINGS_TABS = ['language', 'voice', 'speed'] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number];

// Per call-state visual config — colour, glow, breathing speed, what to show.
const STATE = {
  idle: { dot: 'bg-[#a49c86]', ring: 'rgba(180,170,145,0.35)', label: 'Ready to call', breathe: '4.5s', eq: false, spin: false },
  connecting: { dot: 'bg-[#c9963f]', ring: 'rgba(201,150,63,0.4)', label: 'Connecting…', breathe: '2.2s', eq: false, spin: false },
  listening: { dot: 'bg-[#3f9d5c]', ring: 'rgba(63,157,92,0.35)', label: 'Listening to you', breathe: '1.8s', eq: true, spin: false },
  processing: { dot: 'bg-[#c9963f]', ring: 'rgba(201,150,63,0.4)', label: 'Thinking…', breathe: '2.4s', eq: false, spin: true },
  speaking: { dot: 'bg-[#b8863f]', ring: 'rgba(184,134,63,0.4)', label: 'Realty AI speaking', breathe: '1.6s', eq: true, spin: false },
  ended: { dot: 'bg-[#a49c86]', ring: 'rgba(180,170,145,0.35)', label: 'Call ended', breathe: '4.5s', eq: false, spin: false },
} as const;

export function VoiceTab({ voice }: { voice: ReturnType<typeof useVoiceCall> }) {
  const {
    voiceStatus,
    voiceLang,
    voiceSpeaker,
    voicePace,
    voiceGenderFilter,
    setVoiceGenderFilter,
    callDuration,
    interimText,
    voiceInput,
    setVoiceInput,
    noticeMsg,
    filteredVoices,
    startCall,
    endCall,
    processTurn,
    handleSendVoiceInput,
    formatDuration,
    selectLanguage,
    selectSpeaker,
    updatePace,
  } = voice;

  const [settingsTab, setSettingsTab] = useState<SettingsTab>('language');

  const cfg = STATE[voiceStatus];
  const live = voiceStatus !== 'idle' && voiceStatus !== 'ended';

  return (
    <div className="grid grid-cols-1  gap-6 lg:grid-cols-[1fr_320px]">
      {/* ── Stage ─────────────────────────────────────────── */}
      <div
        className="relative flex min-h-[560px] flex-col items-center justify-center overflow-hidden rounded-[32px] border border-[#ece4d0] bg-white px-8 py-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 42%, rgba(220,182,115,0.16), transparent 62%)',
          boxShadow: '0 30px 60px -20px rgba(120,95,40,0.14), 0 1px 0 rgba(0,0,0,0.02)',
        }}
      >
        {/* Orb */}
        <div className="relative flex h-48 w-48 items-center justify-center">
          {live && (
            <>
              <span className="pulse-ring" style={{ borderColor: cfg.ring, animationDelay: '0s' }} />
              <span className="pulse-ring" style={{ borderColor: cfg.ring, animationDelay: '1s' }} />
            </>
          )}
          <div
            className="breathe relative flex h-32 w-32 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(150deg, #e9c98a 0%, #b8863f 100%)',
              boxShadow: '0 20px 40px -10px rgba(184,134,63,0.45), inset 0 2px 6px rgba(255,255,255,0.35)',
              animationDuration: cfg.breathe,
            }}
          >
            {cfg.spin ? (
              <Loader2 size={30} className="animate-spin text-white/90" />
            ) : (
              <Mic size={30} className="text-white/90" />
            )}
          </div>
        </div>

        {/* Equalizer */}
        <div className="mt-6 flex h-6 items-end gap-[3px]">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="eq-bar w-[3px] rounded-full"
              style={{
                background: cfg.dot.replace('bg-[', '').replace(']', ''),
                animationPlayState: cfg.eq ? 'running' : 'paused',
                animationDelay: `${i * 0.12}s`,
                height: cfg.eq ? undefined : '4px',
              }}
            />
          ))}
        </div>

        {/* Status */}
        <div className="mt-5 flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <span className="text-[15px] font-semibold text-ink">{cfg.label}</span>
        </div>

        {live && (
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-faint [font-variant-numeric:tabular-nums]">
            <Clock size={12} /> {formatDuration(callDuration)}
          </div>
        )}

        {noticeMsg && <p className="mt-3 max-w-xs text-center text-xs text-[#c9963f]">{noticeMsg}</p>}

        {/* Call control */}
        <div className="mt-9 flex items-center gap-3">
          {!live ? (
            <button
              id="start-call-btn"
              onClick={startCall}
              className="flex items-center gap-2.5 rounded-full px-8 py-3.5 text-[15px] font-semibold text-white transition-transform hover:scale-[1.02] bg-ink"
              // style={{
              //   background: 'linear-gradient(135deg, #e9c98a, #b8863f)',
              //   boxShadow: '0 16px 30px -10px rgba(184,134,63,0.5)',
              // }}
            >
              <PhoneCall size={18} /> Start Voice Call
            </button>
          ) : (
            <>
              {voiceStatus === 'listening' && (
                <button
                  onClick={() => processTurn(interimText)}
                  className="flex items-center gap-1.5 rounded-full border border-[#e8e1cf] bg-white px-4 py-2.5 text-xs font-semibold text-ink shadow-sm"
                >
                  <Mic size={14} /> Send now
                </button>
              )}
              <button
                id="end-call-btn"
                onClick={endCall}
                className="flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
              >
                <PhoneOff size={16} /> End Call
              </button>
            </>
          )}
        </div>

        {/* Live text input during call */}
        {live && (
          <div className="mt-8 flex w-full max-w-sm items-center gap-2">
            <input
              type="text"
              placeholder="Type instead of speaking…"
              value={voiceInput}
              onChange={(e) => setVoiceInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceInput()}
              className="flex-1 rounded-full border border-[#e8e1cf] bg-[#fbf8f1] px-4 py-2 text-xs text-ink outline-none focus:border-[#dcb673]"
            />
            <button
              onClick={() => handleSendVoiceInput()}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-white"
            >
              <Send size={13} />
            </button>
          </div>
        )}

        <style jsx>{`
          .breathe {
            animation-name: breathe;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
          @keyframes breathe {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.06); }
          }
          .pulse-ring {
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            border-width: 1.5px;
            border-style: solid;
            animation: ringPulse 2.4s cubic-bezier(0.2, 0.6, 0.4, 1) infinite;
          }
          @keyframes ringPulse {
            0% { transform: scale(0.82); opacity: 0.7; }
            100% { transform: scale(1.7); opacity: 0; }
          }
          .eq-bar {
            animation-name: eqBar;
            animation-duration: 0.9s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
          @keyframes eqBar {
            0%, 100% { height: 4px; }
            50% { height: 22px; }
          }
        `}</style>
      </div>

      {/* ── Settings panel ────────────────────────────────── */}
      <div className="flex min-h-[560px] flex-col rounded-[32px] border border-[#ece4d0] bg-white p-6">
        <h3 className="mb-4 text-sm font-bold text-ink">Call Settings</h3>

        {/* Tab switcher */}
        <div className="mb-6 flex gap-1 rounded-full bg-[#f4eee0] p-1">
          {SETTINGS_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setSettingsTab(t)}
              className={[
                'flex-1 rounded-full py-1.5 text-xs font-semibold capitalize transition-colors',
                settingsTab === t ? 'bg-ink text-white shadow-sm' : 'text-muted hover:text-ink',
              ].join(' ')}
            >
              {t}
            </button>
          ))}
        </div>

        {live && (
          <p className="mb-4 rounded-2xl bg-[#faf3e4] px-3.5 py-2.5 text-[11.5px] leading-relaxed text-[#a3762f]">
            Settings lock while a call is live — end the call to change them.
          </p>
        )}

        <div className={live ? 'pointer-events-none opacity-40' : ''}>
          {settingsTab === 'language' && (
            <div className="flex flex-col gap-2">
              {LANGUAGE_OPTIONS.map(([code, label]) => (
                <button
                  key={code}
                  onClick={() => selectLanguage(code)}
                  className={[
                    'rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors',
                    voiceLang === code
                      ? 'border-[#dcb673] bg-[#faf3e4] text-[#a3762f]'
                      : 'border-[#e8e1cf] text-muted hover:border-[#dcb673]/60',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {settingsTab === 'voice' && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-1.5">
                {GENDER_FILTERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setVoiceGenderFilter(g)}
                    className={[
                      'rounded-full px-3 py-1 text-[11px] font-semibold capitalize transition-colors',
                      voiceGenderFilter === g ? 'bg-ink text-white' : 'bg-[#f4eee0] text-muted',
                    ].join(' ')}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className="flex max-h-[340px] flex-col gap-1.5 overflow-y-auto pr-1">
                {filteredVoices.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => selectSpeaker(v.id)}
                    className={[
                      'rounded-2xl border px-3.5 py-2.5 text-left transition-colors',
                      voiceSpeaker === v.id
                        ? 'border-[#dcb673] bg-[#faf3e4]'
                        : 'border-[#e8e1cf] hover:border-[#dcb673]/60',
                    ].join(' ')}
                  >
                    <div className={`text-[13px] font-semibold ${voiceSpeaker === v.id ? 'text-[#a3762f]' : 'text-ink'}`}>
                      {v.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-faint">{v.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {settingsTab === 'speed' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted">Speech cadence</span>
                <span className="text-xs font-bold text-[#a3762f]">{voicePace.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.15"
                step="0.05"
                value={voicePace}
                onChange={(e) => updatePace(parseFloat(e.target.value))}
                className="h-1 w-full cursor-pointer appearance-none rounded-full bg-[#eee6d3] accent-[#b8863f]"
              />
              <div className="flex justify-between text-[10px] text-faint">
                <span>Relaxed</span>
                <span>Conversational</span>
                <span>Fast</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}