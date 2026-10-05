// Generates the Hinglish narration/dialogue audio clips for the Hindi demo,
// via the real Sarvam TTS API. Run with: node public/demo/hindi/generate-audio.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '..', '.env') });
const fs = require('fs');
const path = require('path');

const API_KEY = process.env.SARVAM_API_KEY;
const OUT_DIR = path.join(__dirname, 'audio');
const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// [id, speaker, language_code, pace, text] — Hinglish written in Latin script,
// same convention the product itself already uses for hi-IN Sarvam calls.
const clips = [
  ['01-hook', 'aditya', 'hi-IN', 1.0,
    "Roz roz leads aate hain WhatsApp, Instagram, Facebook, aur phone calls par. Aur jo message miss hota hai, wahi ek sale miss hoti hai."],
  ['02-intro', 'aditya', 'hi-IN', 1.0,
    "Miliye Realty AI se. Ek AI sales employee jo turant reply karta hai, customer ki zaroorat samajhta hai, aur kabhi sota nahi."],
  ['03-whatsapp-lead', 'aditya', 'hi-IN', 1.0,
    "Dekhiye kya hota hai jab ek lead WhatsApp par message karta hai."],
  ['04-ai-reply', 'ritu', 'hi-IN', 1.05,
    "Hi! Humare paas Skyline Heights hai, Sector 150 Noida mein. 3 BHK units, 1.25 se 1.35 crore ke beech. Kya aap site visit schedule karna chahenge?"],
  ['05-voice-intro', 'aditya', 'hi-IN', 1.0,
    "Ye phone calls bhi uthata hai. Live. Real time mein."],
  ['06-voice-greeting', 'ritu', 'hi-IN', 1.0,
    "Namaste! Main Realty AI hoon, Skyline Realty ki taraf se. Aap kaisi property dekh rahe hain?"],
  ['07-booking-intro', 'aditya', 'hi-IN', 1.0,
    "Jab customer ready hota hai, Realty AI turant site visit book kar deta hai. Seedha aapke team ke calendar par. Koi back and forth nahi."],
  ['08-dashboard', 'aditya', 'hi-IN', 1.0,
    "Har lead, har conversation, har booking. Sab kuch live, ek hi dashboard mein."],
  ['09-closing', 'aditya', 'hi-IN', 0.95,
    "Realty AI. Hamesha on. Hamesha selling. Chaliye aapki sales ko autopilot par daalte hain."],
];

async function generateClip(id, speaker, language_code, pace, text) {
  const res = await fetch(SARVAM_TTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-subscription-key': API_KEY },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: language_code,
      speaker,
      pace,
      pitch: 0,
      loudness: 1.0,
      speech_sample_rate: 24000,
      enable_preprocessing: true,
      model: 'bulbul:v3',
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`${id}: ${res.status} ${errText}`);
  }
  const data = await res.json();
  const audioBase64 = data?.audios?.[0];
  if (!audioBase64) throw new Error(`${id}: no audio returned`);
  const buf = Buffer.from(audioBase64, 'base64');
  fs.writeFileSync(path.join(OUT_DIR, `${id}.wav`), buf);
  console.log(`OK  ${id}.wav (${buf.length} bytes)`);
}

(async () => {
  for (const [id, speaker, lang, pace, text] of clips) {
    try {
      await generateClip(id, speaker, lang, pace, text);
    } catch (err) {
      console.error(`FAIL ${id}:`, err.message);
    }
  }
})();
