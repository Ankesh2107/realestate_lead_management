import axios from 'axios';
import logger from '../utils/logger';
import { handleIncoming } from '../services/debounceService';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v20.0';

export function verify(reqUrl: URL): Response {
  const mode = reqUrl.searchParams.get('hub.mode');
  const token = reqUrl.searchParams.get('hub.verify_token');
  const challenge = reqUrl.searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    logger.info('[whatsapp] webhook verified');
    return new Response(challenge, { status: 200 });
  }
  return new Response('Forbidden', { status: 403 });
}

export async function receive(body: any): Promise<Response> {
  try {
    const entry = body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    const messages = value?.messages;
    if (!messages || messages.length === 0) return new Response('OK', { status: 200 });

    const contact = value.contacts?.[0];
    const name = contact?.profile?.name || null;

    for (const msg of messages) {
      const from = msg.from;
      const text = extractText(msg);
      if (!text) continue;

      handleIncoming(
        { channel: 'whatsapp', externalUserId: from, text, name, phone: from },
        async (reply) => sendMessage(from, reply)
      );
    }
  } catch (err: any) {
    logger.error('[whatsapp] receive error', err);
  }
  return new Response('OK', { status: 200 });
}

function extractText(msg: any): string | null {
  if (msg.type === 'text') return msg.text?.body;
  if (msg.type === 'button') return msg.button?.text;
  if (msg.type === 'interactive') {
    return msg.interactive?.button_reply?.title || msg.interactive?.list_reply?.title;
  }
  return null;
}

export async function sendMessage(to: string, text: string) {
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
  } catch (err: any) {
    logger.error('[whatsapp] sendMessage failed', err.response?.data || err.message);
  }
}
