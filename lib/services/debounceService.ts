import logger from '../utils/logger';
import { handleTurn } from './conversationService';

const DEBOUNCE_MS = parseInt(process.env.DEBOUNCE_MS || '6000', 10);
const buffers = new Map<string, { messages: string[]; timer: NodeJS.Timeout | null; meta: any }>();

function key(channel: string, externalUserId: string) {
  return `${channel}:${externalUserId}`;
}

export interface HandleIncomingParams {
  channel: string;
  externalUserId: string;
  text: string;
  name?: string | null;
  phone?: string | null;
  language?: string | null;
}

export function handleIncoming(
  { channel, externalUserId, text, name, phone, language }: HandleIncomingParams,
  onReply: (replyText: string, lead: any) => Promise<void>
) {
  const k = key(channel, externalUserId);
  const existing = buffers.get(k);

  if (existing) {
    if (existing.timer) clearTimeout(existing.timer);
    existing.messages.push(text);
  } else {
    buffers.set(k, { messages: [text], timer: null, meta: { channel, externalUserId, name, phone, language } });
  }

  const entry = buffers.get(k)!;
  entry.timer = setTimeout(() => flush(k, onReply), DEBOUNCE_MS);
}

async function flush(k: string, onReply: (replyText: string, lead: any) => Promise<void>) {
  const entry = buffers.get(k);
  if (!entry) return;
  buffers.delete(k);

  const combinedText = entry.messages.join('\n');
  logger.info(`[debounce] flushing ${entry.messages.length} buffered message(s) for ${k}`);

  try {
    const { reply, lead, skipped } = await handleTurn({
      channel: entry.meta.channel,
      externalUserId: entry.meta.externalUserId,
      text: combinedText,
      name: entry.meta.name,
      phone: entry.meta.phone,
      language: entry.meta.language,
    });
    if (!skipped && reply) await onReply(reply, lead);
  } catch (err: any) {
    logger.error('[debounce] flush failed', err);
  }
}
