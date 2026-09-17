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

export async function handleTurn({ channel, externalUserId, text, name, phone, language }: HandleTurnParams) {
  const lead = await leadService.getOrCreateLead({ channel, externalUserId, name, phone });

  if (lead.do_not_contact) {
    logger.info(`Lead ${lead.id} is DO_NOT_CONTACT — skipping AI reply.`);
    return { reply: null, lead, skipped: true };
  }

  const conversation = await leadService.getOrCreateOpenConversation(lead.id, channel);

  await leadService.saveMessage({
    conversationId: conversation.id,
    leadId: lead.id,
    sender: 'customer',
    content: text,
    language,
  });

  const history = await leadService.getRecentHistory(conversation.id, 24);
  const priorHistory = history.slice(0, -1);

  const { text: replyText } = await geminiService.generateReply({
    lead,
    conversation,
    history: priorHistory,
    incomingText: text,
    channel,
  });

  await leadService.saveMessage({
    conversationId: conversation.id,
    leadId: lead.id,
    sender: 'ai',
    content: replyText,
  });

  const refreshedLead = await leadService.getLeadById(lead.id);

  return { reply: replyText, lead: refreshedLead, skipped: false };
}
