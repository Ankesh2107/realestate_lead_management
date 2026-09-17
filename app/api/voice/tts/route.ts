// app/api/voice/tts/route.ts
// Sarvam AI Bulbul v3 Text-to-Speech proxy
// Returns base64-encoded WAV audio for browser playback

import { NextRequest, NextResponse } from 'next/server';

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

export async function POST(req: NextRequest) {
  try {
    const { text, speaker = 'meera', language_code = 'hi-IN', pace = 1.0 } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY not configured' }, { status: 500 });
    }

    // Truncate to 2500 chars (Sarvam REST API limit)
    const truncatedText = text.slice(0, 2500);

    // Map legacy / invalid speaker names to valid Bulbul v3 speakers
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
        inputs: [truncatedText],
        target_language_code: language_code,
        speaker: safeSpeaker,
        pace,
        pitch: 0,
        loudness: 1.5,
        speech_sample_rate: 22050,
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
    // Sarvam returns { audios: [base64string] }
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
