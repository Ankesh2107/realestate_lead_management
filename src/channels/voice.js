// Twilio Voice adapter. Reuses the exact same conversationService pipeline as
// every other channel — "one intelligent employee across every channel".
//
// Flow:
//   Incoming call -> /voice/incoming  -> <Gather input="speech"> greeting
//   Speech result -> /voice/gather    -> run through Gemini -> <Say> reply -> <Gather> again (loop)
// A live call is inherently turn-based already, so we call conversationService
// directly here instead of going through the debounce buffer (that buffer is
// for async messaging channels like WhatsApp/IG where double webhook fires
// are the problem being solved).
const twilio = require('twilio');
const conversationService = require('../services/conversationService');
const logger = require('../utils/logger');

const VoiceResponse = twilio.twiml.VoiceResponse;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const ORG_NAME = process.env.ORG_NAME || 'the team';

function endsConversation(lead, text) {
  const enders = ['bye', 'goodbye', 'that\'s all', 'thats all', 'thank you bye'];
  const t = (text || '').toLowerCase();
  if (enders.some((w) => t.includes(w))) return true;
  if (lead && ['NOT_INTERESTED', 'DO_NOT_CONTACT', 'CLOSED'].includes(lead.status)) return true;
  return false;
}

// POST /voice/incoming — first webhook Twilio hits when a call comes in
function incoming(req, res) {
  const vr = new VoiceResponse();
  const gather = vr.gather({
    input: 'speech',
    action: `${BASE_URL}/voice/gather`,
    method: 'POST',
    speechTimeout: 'auto',
    language: 'en-IN',
  });
  gather.say(
    { voice: 'Polly.Aditi' },
    `Hello, thank you for calling ${ORG_NAME}. How can I help you today?`
  );
  // if the caller says nothing at all
  vr.say('We did not receive any input. Goodbye.');
  vr.hangup();

  res.type('text/xml').send(vr.toString());
}

// POST /voice/gather — Twilio posts SpeechResult here after each utterance
async function gather(req, res) {
  const callSid = req.body.CallSid;
  const from = req.body.From;
  const speechText = req.body.SpeechResult;

  const vr = new VoiceResponse();

  if (!speechText) {
    const g = vr.gather({ input: 'speech', action: `${BASE_URL}/voice/gather`, method: 'POST', speechTimeout: 'auto', language: 'en-IN' });
    g.say({ voice: 'Polly.Aditi' }, "Sorry, I didn't catch that — could you say that again?");
    res.type('text/xml').send(vr.toString());
    return;
  }

  try {
    const { reply, lead, skipped } = await conversationService.handleTurn({
      channel: 'voice',
      externalUserId: callSid || from, // group the whole call as one lead/conversation
      text: speechText,
      phone: from,
    });

    if (skipped || !reply) {
      vr.say({ voice: 'Polly.Aditi' }, 'Thank you for calling. Goodbye.');
      vr.hangup();
      res.type('text/xml').send(vr.toString());
      return;
    }

    if (endsConversation(lead, speechText)) {
      vr.say({ voice: 'Polly.Aditi' }, reply);
      vr.hangup();
    } else {
      const g = vr.gather({ input: 'speech', action: `${BASE_URL}/voice/gather`, method: 'POST', speechTimeout: 'auto', language: 'en-IN' });
      g.say({ voice: 'Polly.Aditi' }, reply);
    }

    res.type('text/xml').send(vr.toString());
  } catch (err) {
    logger.error('[voice] gather error', err);
    vr.say('Sorry, something went wrong on our end. Please try calling again shortly.');
    vr.hangup();
    res.type('text/xml').send(vr.toString());
  }
}

module.exports = { incoming, gather };
