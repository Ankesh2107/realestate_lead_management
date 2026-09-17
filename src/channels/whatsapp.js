const axios = require('axios');
const logger = require('../utils/logger');
const debounceService = require('../services/debounceService');

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v20.0';

// GET /webhooks/whatsapp — Meta webhook verification handshake
function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    logger.info('[whatsapp] webhook verified');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

// POST /webhooks/whatsapp — incoming messages
async function receive(req, res) {
  res.sendStatus(200); // ack immediately, Meta expects a fast 200

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;
    if (!messages || messages.length === 0) return;

    const contact = value.contacts?.[0];
    const name = contact?.profile?.name || null;

    for (const msg of messages) {
      const from = msg.from; // phone number
      const text = extractText(msg);
      if (!text) continue;

      debounceService.handleIncoming(
        { channel: 'whatsapp', externalUserId: from, text, name, phone: from },
        async (reply) => sendMessage(from, reply)
      );
    }
  } catch (err) {
    logger.error('[whatsapp] receive error', err);
  }
}

function extractText(msg) {
  if (msg.type === 'text') return msg.text?.body;
  if (msg.type === 'button') return msg.button?.text;
  if (msg.type === 'interactive') {
    return msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title;
  }
  return null;
}

async function sendMessage(to, text) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID || ACCESS_TOKEN.includes('YOUR_WHATSAPP')) {
    logger.warn('[whatsapp] send skipped — credentials not configured. Would have sent:', text);
    return;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      { messaging_product: 'whatsapp', to, type: 'text', text: { body: text } },
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );
  } catch (err) {
    logger.error('[whatsapp] sendMessage failed', err.response?.data || err.message);
  }
}

module.exports = { verify, receive, sendMessage };
