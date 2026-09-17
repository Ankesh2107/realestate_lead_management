const express = require('express');
const router = express.Router();

const { supabase } = require('../config/supabase');
const conversationService = require('../services/conversationService');
const leadService = require('../services/leadService');
const logger = require('../utils/logger');

const ORG_ID = process.env.ORG_ID;

// POST /api/test/message  { sessionId, text, name?, channel? }
// Used by the browser test UI (chat + voice-demo tabs). Runs the exact same
// pipeline as WhatsApp/Instagram/Facebook/Voice — just called directly and
// synchronously for a snappy local testing experience (real channels go
// through the debounce buffer since they're async webhook-driven).
router.post('/message', async (req, res) => {
  try {
    const { sessionId, text, name, channel } = req.body;
    if (!sessionId || !text) return res.status(400).json({ error: 'sessionId and text are required' });

    const result = await conversationService.handleTurn({
      channel: channel || 'web_test',
      externalUserId: sessionId,
      text,
      name: name || null,
    });

    res.json(result);
  } catch (err) {
    logger.error('[testApi] /message failed', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/lead/:sessionId?channel=web_test
router.get('/lead/:sessionId', async (req, res) => {
  try {
    const channel = req.query.channel || 'web_test';
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('org_id', ORG_ID)
      .eq('channel', channel)
      .eq('external_user_id', req.params.sessionId)
      .maybeSingle();
    if (error) throw error;
    res.json(data || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/leads  -> dashboard table
router.get('/leads', async (_req, res) => {
  try {
    const leads = await leadService.listLeads({ limit: 200 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/leads/:leadId/messages
router.get('/leads/:leadId/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', req.params.leadId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/properties
router.get('/properties', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('org_id', ORG_ID)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/escalations
router.get('/escalations', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('escalations')
      .select('*, leads(name, phone, channel, status)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/site-visits
router.get('/site-visits', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('site_visits')
      .select('*, leads(name, phone, channel), properties(project_name, city)')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/test/health -> quick sanity check for Supabase + env
router.get('/health', async (_req, res) => {
  const envOk = {
    supabase: !!process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('YOUR_PROJECT'),
    gemini: !!process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_GEMINI'),
    org_id: process.env.ORG_ID,
  };
  let dbOk = false;
  try {
    const { error } = await supabase.from('organizations').select('id').limit(1);
    dbOk = !error;
  } catch (_) {
    dbOk = false;
  }
  res.json({ envOk, dbOk });
});

module.exports = router;
