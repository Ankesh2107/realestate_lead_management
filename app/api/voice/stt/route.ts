// app/api/voice/stt/route.ts
// Sarvam AI Saaras v3 Speech-to-Text proxy
// Accepts raw PCM/WAV audio blob and returns transcript

import { NextRequest, NextResponse } from 'next/server';

const SARVAM_STT_URL = 'https://api.sarvam.ai/speech-to-text';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.SARVAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'SARVAM_API_KEY not configured' }, { status: 500 });
    }

    // The request body is a FormData with 'audio' (blob) and optional 'language_code'
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob | null;
    const languageCode = (formData.get('language_code') as string) || 'hi-IN';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Build form-data for Sarvam STT
    const sarvamForm = new FormData();
    sarvamForm.append('file', audioFile, 'audio.wav');
    sarvamForm.append('model', 'saaras:v2');
    sarvamForm.append('language_code', languageCode);
    sarvamForm.append('with_timestamps', 'false');
    sarvamForm.append('with_disfluencies', 'false');

    const response = await fetch(SARVAM_STT_URL, {
      method: 'POST',
      headers: {
        'api-subscription-key': apiKey,
      },
      body: sarvamForm,
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[voice/stt] Sarvam STT error:', response.status, errText);
      return NextResponse.json(
        { error: `Sarvam STT failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    // Sarvam returns { transcript: "..." }
    return NextResponse.json({ transcript: data.transcript || '' });
  } catch (err: any) {
    console.error('[voice/stt] Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
