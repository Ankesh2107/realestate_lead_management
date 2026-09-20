'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SARVAM_VOICE_LIBRARY } from '@/lib/dashboard/constants';
import { TranscriptEntry, VoiceLang, VoiceStatus } from '@/types/dashboard';

/** All state, refs and call-flow logic for the Sarvam AI voice call agent tab. */
export function useVoiceCall() {
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceLang, setVoiceLang] = useState<VoiceLang>('hi-IN');
  const [voiceSpeaker, setVoiceSpeaker] = useState<string>('ritu');
  const [voicePace, setVoicePace] = useState<number>(1.0);
  const [voiceGenderFilter, setVoiceGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  const [voiceTranscript, setVoiceTranscript] = useState<TranscriptEntry[]>([]);
  const [callDuration, setCallDuration] = useState<number>(0);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [interimText, setInterimText] = useState<string>('');
  const [voiceInput, setVoiceInput] = useState<string>('');
  const [noticeMsg, setNoticeMsg] = useState<string>('');

  // Synchronous Voice Refs (prevents stale closure issues)
  const voiceSessionRef = useRef<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const callTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const voiceStatusRef = useRef<VoiceStatus>('idle');
  const voiceSpeakerRef = useRef<string>('ritu');
  const voiceLangRef = useRef<VoiceLang>('hi-IN');
  const voicePaceRef = useRef<number>(1.0);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const isProcessingTurnRef = useRef<boolean>(false);

  // Synchronize state with refs
  useEffect(() => { voiceStatusRef.current = voiceStatus; }, [voiceStatus]);
  useEffect(() => { voiceSpeakerRef.current = voiceSpeaker; }, [voiceSpeaker]);
  useEffect(() => { voiceLangRef.current = voiceLang; }, [voiceLang]);
  useEffect(() => { voicePaceRef.current = voicePace; }, [voicePace]);

  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [voiceTranscript, interimText]);

  // Release the mic / stop everything if this component unmounts mid-call
  // (e.g. the user navigates to another page while on a live call).
  useEffect(() => {
    return () => {
      currentAudioRef.current?.pause();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try { mediaRecorderRef.current.stop(); } catch {}
      }
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioContextRef.current?.close();
      cancelAnimationFrame(animFrameRef.current);
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function nowTime() {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function addTranscript(speaker: 'You' | 'Realty AI', text: string) {
    setVoiceTranscript((prev) => [...prev, { speaker, text, time: nowTime() }]);
  }

  /** Play base64 WAV audio from Sarvam TTS via Blob Object URL + AudioContext resume */
  async function playAudioBase64(base64: string): Promise<void> {
    return new Promise(async (resolve) => {
      try {
        // Ensure AudioContext is active
        if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume().catch(() => {});
        }

        // Convert base64 to Blob Object URL for 100% reliable playback without Data URI limits
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const blob = new Blob([bytes.buffer], { type: 'audio/wav' });
        const blobUrl = URL.createObjectURL(blob);

        const audio = new Audio(blobUrl);
        currentAudioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          resolve();
        };

        audio.onerror = (err) => {
          console.warn('[voice] Blob audio error:', err);
          URL.revokeObjectURL(blobUrl);
          resolve();
        };

        audio.play().catch((err) => {
          console.warn('[voice] Audio play rejected:', err);
          URL.revokeObjectURL(blobUrl);
          resolve();
        });
      } catch (err) {
        console.warn('[voice] playAudioBase64 failed:', err);
        resolve();
      }
    });
  }

  /** Call Sarvam TTS exclusively (retry up to 2x, NO robotic browser fallback) */
  async function speakWithSarvam(text: string): Promise<void> {
    const currentSpeaker = voiceSpeakerRef.current;
    const currentLang = voiceLangRef.current;
    const currentPace = voicePaceRef.current;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const res = await fetch('/api/voice/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text,
            speaker: currentSpeaker,
            language_code: currentLang,
            pace: currentPace,
          }),
        });
        if (!res.ok) throw new Error(`TTS HTTP error: ${res.status}`);
        const data = await res.json();
        if (data.audio) {
          await playAudioBase64(data.audio);
          return;
        }
      } catch (err) {
        console.warn(`[voice] Sarvam TTS attempt ${attempt} error:`, err);
        if (attempt === 2) {
          setNoticeMsg('Voice playback network delay. Speaking again...');
        }
      }
    }
  }

  /** Transcribe recorded audio via Sarvam STT */
  async function transcribeAudio(blob: Blob): Promise<string> {
    if (!blob || blob.size < 100) return '';
    try {
      const form = new FormData();
      form.append('audio', blob, 'audio.wav');
      form.append('language_code', voiceLangRef.current);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        rec.lang = voiceLangRef.current;

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processTurn]);

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
      voiceLangRef.current === 'hi-IN'
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

  /** Change language and keep the ref in sync (also resets speaker to that language's default voice) */
  function selectLanguage(code: VoiceLang) {
    setVoiceLang(code);
    voiceLangRef.current = code;
    const defaultSpk = code === 'hi-IN' ? 'ritu' : 'rahul';
    setVoiceSpeaker(defaultSpk);
    voiceSpeakerRef.current = defaultSpk;
  }

  /** Change speaker and keep the ref in sync */
  function selectSpeaker(id: string) {
    setVoiceSpeaker(id);
    voiceSpeakerRef.current = id;
  }

  /** Change speech pace and keep the ref in sync */
  function updatePace(val: number) {
    setVoicePace(val);
    voicePaceRef.current = val;
  }

  const filteredVoices = SARVAM_VOICE_LIBRARY.filter(
    (v) => voiceGenderFilter === 'all' || v.gender === voiceGenderFilter
  );

  return {
    voiceStatus,
    voiceLang,
    voiceSpeaker,
    voicePace,
    voiceGenderFilter,
    setVoiceGenderFilter,
    voiceTranscript,
    setVoiceTranscript,
    callDuration,
    audioLevel,
    interimText,
    voiceInput,
    setVoiceInput,
    noticeMsg,
    transcriptBottomRef,
    filteredVoices,
    startCall,
    endCall,
    processTurn,
    handleSendVoiceInput,
    formatDuration,
    selectLanguage,
    selectSpeaker,
    updatePace,
  };
}
