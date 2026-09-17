// Shared logic for Facebook Messenger + Instagram DM — both ride on Meta's
// "Messenger Platform" webhook shape (entry[].messaging[]), just with
// different page access tokens / graph endpoints.
const axios = require('axios');
const logger = require('../utils/logger');
const debounceService = require('../services/debounceService');

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

function verify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

function makeReceiveHandler(channelName, pageAccessTokenEnv) {
  return async function receive(req, res) {
    res.sendStatus(200);
    try {
      const entries = req.body.entry || [];
      for (const entry of entries) {
        const events = entry.messaging || [];
        for (const event of events) {
          const senderId = event.sender?.id;
          const text = event.message?.text;
          if (!senderId || !text) continue;
          if (event.message?.is_echo) continue; // ignore our own outgoing echoes

          debounceService.handleIncoming(
            { channel: channelName, externalUserId: senderId, text, name: null, phone: null },
            async (reply) => sendMessage(senderId, reply, pageAccessTokenEnv)
          );
        }
      }
    } catch (err) {
      logger.error(`[${channelName}] receive error`, err);
    }
  };
}

async function sendMessage(recipientId, text, pageAccessTokenEnv) {
  const token = process.env[pageAccessTokenEnv];
  if (!token || token.includes('YOUR_')) {
    logger.warn(`[messenger] send skipped — ${pageAccessTokenEnv} not configured. Would have sent:`, text);
    return;
  }
  try {
    await axios.post(
      `https://graph.facebook.com/v20.0/me/messages?access_token=${token}`,
      { recipient: { id: recipientId }, message: { text } }
    );
  } catch (err) {
    logger.error('[messenger] sendMessage failed', err.response?.data || err.message);
  }
}

module.exports = { verify, makeReceiveHandler, sendMessage };
