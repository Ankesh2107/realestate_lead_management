const leadService = require('./leadService');
const geminiService = require('./geminiService');
const logger = require('../utils/logger');

/**
 * Core pipeline shared by every channel (WhatsApp, Instagram, Facebook, Voice, web test UI).
 * One function in, one AI reply out. Everything is persisted to Supabase.
 */
async function handleTurn({ channel, externalUserId, text, name, phone, language }) {
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
  // drop the message we just saved from history (it's passed separately as the new turn)
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

module.exports = { handleTurn };
