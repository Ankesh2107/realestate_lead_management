import twilio from 'twilio';
import { handleTurn } from '../services/conversationService';
import logger from '../utils/logger';

const VoiceResponse = twilio.twiml.VoiceResponse;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ORG_NAME = process.env.ORG_NAME || 'the team';

function endsConversation(lead: any, text: string) {
  const enders = ['bye', 'goodbye', "that's all", 'thats all', 'thank you bye'];
  const t = (text || '').toLowerCase();
  if (enders.some((w) => t.includes(w))) return true;
  if (lead && ['NOT_INTERESTED', 'DO_NOT_CONTACT', 'CLOSED'].includes(lead.status)) return true;
  return false;
}

export function incoming(): Response {
  const vr = new VoiceResponse();
  const gather = vr.gather({
    input: ['speech'],
    action: `${BASE_URL}/webhooks/voice/gather`,
    method: 'POST',
    speechTimeout: 'auto',
    language: 'en-IN',
  });
  gather.say(
    { voice: 'Polly.Aditi' },
    `Hello, thank you for calling ${ORG_NAME}. How can I help you today?`
  );
  vr.say('We did not receive any input. Goodbye.');
  vr.hangup();

  return new Response(vr.toString(), {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  });
}

export async function gather(formData: FormData): Promise<Response> {
  const callSid = formData.get('CallSid') as string;
  const from = formData.get('From') as string;
  const speechText = formData.get('SpeechResult') as string;

  const vr = new VoiceResponse();

  if (!speechText) {
    const g = vr.gather({
      input: ['speech'],
      action: `${BASE_URL}/webhooks/voice/gather`,
      method: 'POST',
      speechTimeout: 'auto',
      language: 'en-IN',
    });
    g.say({ voice: 'Polly.Aditi' }, "Sorry, I didn't catch that — could you say that again?");
    return new Response(vr.toString(), { status: 200, headers: { 'Content-Type': 'text/xml' } });
  }

  try {
    const { reply, lead, skipped } = await handleTurn({
      channel: 'voice',
      externalUserId: callSid || from,
      text: speechText,
      phone: from,
    });

    if (skipped || !reply) {
      vr.say({ voice: 'Polly.Aditi' }, 'Thank you for calling. Goodbye.');
      vr.hangup();
      return new Response(vr.toString(), { status: 200, headers: { 'Content-Type': 'text/xml' } });
    }

    if (endsConversation(lead, speechText)) {
      vr.say({ voice: 'Polly.Aditi' }, reply);
      vr.hangup();
    } else {
      const g = vr.gather({
        input: ['speech'],
        action: `${BASE_URL}/webhooks/voice/gather`,
        method: 'POST',
        speechTimeout: 'auto',
        language: 'en-IN',
      });
      g.say({ voice: 'Polly.Aditi' }, reply);
    }

    return new Response(vr.toString(), { status: 200, headers: { 'Content-Type': 'text/xml' } });
  } catch (err: any) {
    logger.error('[voice] gather error', err);
    vr.say('Sorry, something went wrong on our end. Please try calling again shortly.');
    vr.hangup();
    return new Response(vr.toString(), { status: 200, headers: { 'Content-Type': 'text/xml' } });
  }
}
