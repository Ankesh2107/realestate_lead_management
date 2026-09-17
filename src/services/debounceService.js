const logger = require('../utils/logger');
const conversationService = require('./conversationService');

const DEBOUNCE_MS = parseInt(process.env.DEBOUNCE_MS || '6000', 10);

// In-memory per-user buffer. Fine for a single local/dev instance.
// For multi-instance production deployments, swap this for a Redis-backed
// delayed job (e.g. BullMQ / Upstash QStash) keyed the same way.
const buffers = new Map(); // key: `${channel}:${externalUserId}` -> { messages: [], timer, meta }

function key(channel, externalUserId) {
  return `${channel}:${externalUserId}`;
}

/**
 * Buffers rapid-fire messages from the same user on the same channel and
 * fires `onReply(replyText, lead)` exactly once, DEBOUNCE_MS after the last
 * message arrives — this is what stops "hii" + "how are you" from producing
 * two separate AI replies.
 */
function handleIncoming({ channel, externalUserId, text, name, phone, language }, onReply) {
  const k = key(channel, externalUserId);
  const existing = buffers.get(k);

  if (existing) {
    clearTimeout(existing.timer);
    existing.messages.push(text);
  } else {
    buffers.set(k, { messages: [text], timer: null, meta: { channel, externalUserId, name, phone, language } });
  }

  const entry = buffers.get(k);
  entry.timer = setTimeout(() => flush(k, onReply), DEBOUNCE_MS);
}

async function flush(k, onReply) {
  const entry = buffers.get(k);
  if (!entry) return;
  buffers.delete(k);

  const combinedText = entry.messages.join('\n');
  logger.info(`[debounce] flushing ${entry.messages.length} buffered message(s) for ${k}`);

  try {
    const { reply, lead, skipped } = await conversationService.handleTurn({
      channel: entry.meta.channel,
      externalUserId: entry.meta.externalUserId,
      text: combinedText,
      name: entry.meta.name,
      phone: entry.meta.phone,
      language: entry.meta.language,
    });
    if (!skipped) await onReply(reply, lead);
  } catch (err) {
    logger.error('[debounce] flush failed', err);
  }
}

module.exports = { handleIncoming };
