import * as leadService from './leadService';
import * as geminiService from './geminiService';
import logger from '../utils/logger';

export interface HandleTurnParams {
  channel: string;
  externalUserId: string;
  text: string;
  name?: string | null;
  phone?: string | null;
  language?: string | null;
}

interface SessionCacheEntry {
  lead: any;
  conversation: any;
  history: any[];
  lastActive: number;
}

const sessionCache = new Map<string, SessionCacheEntry>();

function cleanOldSessions() {
  if (sessionCache.size > 200) {
    const now = Date.now();
    sessionCache.forEach((val, key) => {
      if (now - val.lastActive > 10 * 60 * 1000) {
        sessionCache.delete(key);
      }
    });
  }
}

export async function handleTurn({ channel, externalUserId, text, name, phone, language }: HandleTurnParams) {
  cleanOldSessions();
  const cacheKey = `${channel}:${externalUserId}`;
  let cached = sessionCache.get(cacheKey);

  let lead: any;
  let conversation: any;
  let priorHistory: any[];

  if (cached && (Date.now() - cached.lastActive < 10 * 60 * 1000)) {
    lead = cached.lead;
    conversation = cached.conversation;
    priorHistory = cached.history;
  } else {
    lead = await leadService.getOrCreateLead({ channel, externalUserId, name, phone });

    if (lead.do_not_contact) {
      logger.info(`Lead ${lead.id} is DO_NOT_CONTACT — skipping AI reply.`);
      return { reply: null, lead, skipped: true };
    }

    conversation = await leadService.getOrCreateOpenConversation(lead.id, channel);
    const existingHistory = await leadService.getRecentHistory(conversation.id, 24);
    priorHistory = existingHistory;

    cached = {
      lead,
      conversation,
      history: [...existingHistory],
      lastActive: Date.now(),
    };
    sessionCache.set(cacheKey, cached);
  }

  if (lead.do_not_contact) {
    logger.info(`Lead ${lead.id} is DO_NOT_CONTACT — skipping AI reply.`);
    return { reply: null, lead, skipped: true };
  }

  // Save the incoming customer message asynchronously to database so it doesn't block LLM generation
  leadService.saveMessage({
    conversationId: conversation.id,
    leadId: lead.id,
    sender: 'customer',
    content: text,
    language,
  }).catch((err) => logger.error('[conversationService] background customer message save error', err));

  // Generate the AI reply
  const { text: replyText, lead: leadFromTools } = await geminiService.generateReply({
    lead,
    conversation,
    history: priorHistory,
    incomingText: text,
    channel,
  });

  // Save AI response and update lead state in parallel
  const [, refreshedLead] = await Promise.all([
    leadService.saveMessage({
      conversationId: conversation.id,
      leadId: lead.id,
      sender: 'ai',
      content: replyText,
    }),
    leadFromTools ? Promise.resolve(leadFromTools) : leadService.getLeadById(lead.id),
  ]);

  // Update in-memory session cache for fast subsequent turns
  if (cached) {
    cached.lead = refreshedLead || lead;
    cached.history.push({ sender: 'customer', content: text });
    cached.history.push({ sender: 'ai', content: replyText });
    if (cached.history.length > 30) {
      cached.history = cached.history.slice(-24);
    }
    cached.lastActive = Date.now();
  }

  return { reply: replyText, lead: refreshedLead, skipped: false };
}
