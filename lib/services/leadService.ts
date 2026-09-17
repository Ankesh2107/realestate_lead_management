import { supabase } from '../config/supabase';
import logger from '../utils/logger';

const ORG_ID = process.env.ORG_ID;

export interface GetOrCreateLeadParams {
  channel: string;
  externalUserId: string;
  name?: string | null;
  phone?: string | null;
}

export async function getOrCreateLead({ channel, externalUserId, name, phone }: GetOrCreateLeadParams) {
  const { data: existing, error: findErr } = await supabase
    .from('leads')
    .select('*')
    .eq('org_id', ORG_ID)
    .eq('channel', channel)
    .eq('external_user_id', externalUserId)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing;

  const { data: created, error: createErr } = await supabase
    .from('leads')
    .insert({
      org_id: ORG_ID,
      channel,
      external_user_id: externalUserId,
      name: name || null,
      phone: phone || null,
      status: 'NEW',
      temperature: 'COLD',
    })
    .select()
    .single();

  if (createErr) throw createErr;
  logger.info(`New lead created: ${created.id} (${channel}/${externalUserId})`);
  return created;
}

export async function getOrCreateOpenConversation(leadId: string, channel: string) {
  const { data: existing, error: findErr } = await supabase
    .from('conversations')
    .select('*')
    .eq('lead_id', leadId)
    .eq('status', 'open')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findErr) throw findErr;
  if (existing) return existing;

  const { data: created, error: createErr } = await supabase
    .from('conversations')
    .insert({ lead_id: leadId, channel, status: 'open' })
    .select()
    .single();

  if (createErr) throw createErr;
  return created;
}

export interface SaveMessageParams {
  conversationId: string;
  leadId: string;
  sender: 'customer' | 'ai' | 'human';
  content: string;
  language?: string | null;
}

export async function saveMessage({ conversationId, leadId, sender, content, language }: SaveMessageParams) {
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    lead_id: leadId,
    sender,
    content,
    language: language || null,
  });
  if (error) throw error;

  await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId);
}

export async function getRecentHistory(conversationId: string, limit = 20) {
  const { data, error } = await supabase
    .from('messages')
    .select('sender, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function getLeadById(leadId: string) {
  const { data, error } = await supabase.from('leads').select('*').eq('id', leadId).single();
  if (error) throw error;
  return data;
}

export async function listLeads({ limit = 100 } = {}) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('org_id', ORG_ID)
    .order('updated_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
