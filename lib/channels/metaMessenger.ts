import axios from 'axios';
import logger from '../utils/logger';
import { handleIncoming } from '../services/debounceService';

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

export function verify(reqUrl: URL): Response {
  const mode = reqUrl.searchParams.get('hub.mode');
  const token = reqUrl.searchParams.get('hub.verify_token');
  const challenge = reqUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export function makeReceiveHandler(channelName: string, pageAccessTokenEnv: string) {
  return async function receive(body: any): Promise<Response> {
    try {
      const entries = body.entry || [];
      for (const entry of entries) {
        const events = entry.messaging || [];
        for (const event of events) {
          const senderId = event.sender?.id;
          const text = event.message?.text;
          if (!senderId || !text) continue;
          if (event.message?.is_echo) continue;

          handleIncoming(
            { channel: channelName, externalUserId: senderId, text, name: null, phone: null },
            async (reply) => sendMessage(senderId, reply, pageAccessTokenEnv)
          );
        }
      }
    } catch (err: any) {
      logger.error(`[${channelName}] receive error`, err);
    }
    return new Response('OK', { status: 200 });
  };
}

export async function sendMessage(recipientId: string, text: string, pageAccessTokenEnv: string) {
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
  } catch (err: any) {
    logger.error('[messenger] sendMessage failed', err.response?.data || err.message);
  }
}
