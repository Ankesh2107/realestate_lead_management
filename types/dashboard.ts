export type VoiceStatus =
  | 'idle'        // not in a call
  | 'connecting'  // playing greeting
  | 'listening'   // recording / listening to user speech
  | 'processing'  // STT + AI reply + TTS in progress
  | 'speaking'    // playing AI audio
  | 'ended';      // call hung up

export type VoiceLang = 'hi-IN' | 'en-IN';

export type ActiveTab = 'voice' | 'leads' | 'properties' | 'ops';

export interface SarvamVoice {
  id: string;
  name: string;
  gender: 'female' | 'male';
  desc: string;
}

export interface TranscriptEntry {
  speaker: 'You' | 'Realty AI';
  text: string;
  time: string;
}

export interface HealthState {
  dbOk: boolean;
  geminiOk: boolean;
}

// The API shapes here aren't tightened yet (kept as `any` to match the
// original code) — swap these for real Lead / Property / SiteVisit /
// Escalation types when you get to the logic pass.
export type Lead = any;
export type Property = any;
export type SiteVisit = any;
export type Escalation = any;
export type LeadMessage = any;   // ← yeh line add karni hai