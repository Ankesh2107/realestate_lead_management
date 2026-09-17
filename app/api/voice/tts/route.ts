// app/api/voice/tts/route.ts
// Sarvam AI Bulbul v3 Text-to-Speech proxy
// Transforms raw AI text into human-like conversational Indian speech

import { NextRequest, NextResponse } from 'next/server';

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

/** Clean & humanize text for natural conversational speech flow */
function humanizeTextForSpeech(text: string): string {
  if (!text) return '';
  let clean = text
    // Remove markdown symbols and code blocks
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`/g, '')
    .replace(/^#+\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    // Replace multiple newlines with natural pauses
    .replace(/[\r\n]+/g, '. ')
    .trim();

  // Expand real estate shorthand to natural spoken words
  clean = clean
    .replace(/\b(\d+)\s*BHK\b/gi, '$1 B H K')
    .replace(/\b(\d+(?:\.\d+)?)\s*Cr\b/gi, '$1 Crore')
    .replace(/\b(\d+(?:\.\d+)?)\s*L\b/gi, '$1 Lakh')
    .replace(/\bsqft\b/gi, 'square feet')
    .replace(/\bCRM\b/gi, 'C R M')
    .replace(/\bAI\b/gi, 'A I');

  // Add micro-pause after conversational greetings if missing punctuation
  clean = clean.replace(/\b(Namaste|Hello|Haan|Ji|Bilkul|Sure|Dhanyawad)\b(?![,\.!?])/gi, '$1,');

  return clean;
}

export async function POST(req: NextRequest) {
  try {
    const { text, speaker = 'ritu', language_code = 'hi-IN', pace = 1.0 } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY not configured' }, { status: 500 });
    }

    const humanizedText = humanizeTextForSpeech(text).slice(0, 2500);

    // List of verified Bulbul v3 speakers
    const validBulbulV3Speakers = [
      'aditya', 'ritu', 'ashutosh', 'priya', 'neha', 'rahul', 'pooja', 'rohan',
      'simran', 'kavya', 'amit', 'dev', 'ishita', 'shreya', 'ratan', 'varun',
      'manan', 'sumit', 'roopa', 'kabir', 'aayan', 'shubh', 'advait', 'anand',
      'tanya', 'tarun', 'sunny', 'mani', 'gokul', 'vijay', 'shruti', 'suhani',
      'mohit', 'kavitha', 'rehan', 'soham', 'rupali'
    ];

    let safeSpeaker = speaker.toLowerCase();
    if (!validBulbulV3Speakers.includes(safeSpeaker)) {
      if (safeSpeaker.includes('male') || safeSpeaker === 'arvind' || safeSpeaker === 'amol') {
        safeSpeaker = 'aditya';
      } else {
        safeSpeaker = 'ritu';
      }
    }

    const response = await fetch(SARVAM_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        inputs: [humanizedText],
        target_language_code: language_code,
        speaker: safeSpeaker,
        pace: typeof pace === 'number' ? Math.max(0.7, Math.min(1.3, pace)) : 1.0,
        pitch: 0,
        loudness: 1.0,
        speech_sample_rate: 24000,
        enable_preprocessing: true,
        model: 'bulbul:v3',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[voice/tts] Sarvam TTS error:', response.status, errorText);
      return NextResponse.json(
        { error: `Sarvam TTS failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const audioBase64 = data?.audios?.[0];
    if (!audioBase64) {
      return NextResponse.json({ error: 'No audio returned from Sarvam' }, { status: 500 });
    }

    return NextResponse.json({ audio: audioBase64, format: 'wav' });
  } catch (err: any) {
    console.error('[voice/tts] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
