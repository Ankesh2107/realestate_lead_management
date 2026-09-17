import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey.includes('YOUR_GEMINI')) {
  console.warn(
    '[gemini] WARNING: GEMINI_API_KEY is not set (or still a placeholder) in .env. ' +
    'AI replies will fail until you add a real Gemini API key.'
  );
}

export const genAI = new GoogleGenerativeAI(apiKey || 'placeholder');
export const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-flash-lite-latest';
