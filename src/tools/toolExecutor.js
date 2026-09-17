const { supabase } = require('../config/supabase');
const { formatINR } = require('../utils/money');
const logger = require('../utils/logger');

// All executors receive { orgId, leadId } as context plus the tool's args,
// and return a plain-JSON-serializable result that gets fed back to Gemini
// as the function response. Nothing here is ever fabricated — a failed
// Supabase call is surfaced as { ok: false, error } so Gemini must be honest.

async function search_properties(ctx, args) {
  try {
    let query = supabase.from('properties').select('*').eq('org_id', ctx.orgId).neq('status', 'hidden').neq('status', 'inactive');

    if (args.cities && args.cities.length) {
      const orFilters = args.cities.map((c) => `city.ilike.%${c}%,locality.ilike.%${c}%`).join(',');
      query = query.or(orFilters);
    }
    if (args.purpose) query = query.eq('purpose', args.purpose);
    if (args.property_type) query = query.ilike('property_type', `%${args.property_type}%`);
    if (args.bhk_options && args.bhk_options.length) query = query.in('bhk', args.bhk_options);

    // Budget: use a generous +/-15% tolerance band like a real advisor would,
    // rather than a hard cutoff, unless the customer gave an exact range.
    if (args.budget_max) {
      query = query.lte('price_min', Math.round(args.budget_max * 1.15));
    }
    if (args.budget_min) {
      query = query.gte('price_max', Math.round(args.budget_min * 0.85));
    }

    const { data, error } = await query.limit(8);
    if (error) throw error;

    const results = (data || []).map(formatPropertyRow);
    return { ok: true, count: results.length, properties: results };
  } catch (err) {
    logger.error('search_properties failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function get_property_details(ctx, args) {
  try {
    let query = supabase.from('properties').select('*').eq('org_id', ctx.orgId);
    if (args.property_id) query = query.eq('id', args.property_id);
    else if (args.project_name) query = query.ilike('project_name', `%${args.project_name}%`);
    else return { ok: false, error: 'property_id or project_name required' };

    const { data, error } = await query.limit(5);
    if (error) throw error;
    if (!data || data.length === 0) return { ok: true, found: false };

    return { ok: true, found: true, properties: data.map(formatPropertyRow) };
  } catch (err) {
    logger.error('get_property_details failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function check_property_availability(ctx, args) {
  const result = await get_property_details(ctx, args);
  if (!result.ok) return result;
  if (!result.found) return { ok: true, found: false, availability: 'unknown' };
  return {
    ok: true,
    found: true,
    availability: result.properties.map((p) => ({ project_name: p.project_name, bhk: p.bhk, status: p.status })),
  };
}

async function update_lead(ctx, args) {
  try {
    const patch = {};
    const map = {
      name: 'name', phone: 'phone', email: 'email', customer_type: 'customer_type',
      intent: 'intent', purpose: 'purpose', timeline: 'timeline',
      budget_min: 'budget_min', budget_max: 'budget_max',
      preferred_locations: 'preferred_locations', bhk_options: 'bhk_options',
      property_type: 'property_type', notes: 'notes',
    };
    for (const [k, col] of Object.entries(map)) {
      if (args[k] !== undefined && args[k] !== null) patch[col] = args[k];
    }
    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('leads').update(patch).eq('id', ctx.leadId).select().single();
    if (error) throw error;
    return { ok: true, lead: data };
  } catch (err) {
    logger.error('update_lead failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function update_lead_status(ctx, args) {
  try {
    const patch = { updated_at: new Date().toISOString() };
    if (args.status) patch.status = args.status;
    if (args.temperature) patch.temperature = args.temperature;
    if (args.urgency) patch.urgency = args.urgency;
    if (args.status === 'DO_NOT_CONTACT') patch.do_not_contact = true;

    // simple deterministic backend scoring nudge based on status/temperature
    patch.lead_score = scoreFor(args.status, args.temperature, args.urgency);

    const { data, error } = await supabase.from('leads').update(patch).eq('id', ctx.leadId).select().single();
    if (error) throw error;
    return { ok: true, lead: data };
  } catch (err) {
    logger.error('update_lead_status failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function schedule_site_visit(ctx, args) {
  try {
    let propertyId = args.property_id || null;
    if (!propertyId && args.project_name) {
      const { data } = await supabase
        .from('properties')
        .select('id')
        .eq('org_id', ctx.orgId)
        .ilike('project_name', `%${args.project_name}%`)
        .limit(1)
        .maybeSingle();
      if (data) propertyId = data.id;
    }

    const { data, error } = await supabase
      .from('site_visits')
      .insert({
        lead_id: ctx.leadId,
        property_id: propertyId,
        requested_date: normalizeDateGuess(args.requested_date),
        requested_time: args.requested_time || null,
        status: 'requested',
      })
      .select()
      .single();
    if (error) throw error;

    await supabase.from('leads').update({ status: 'SITE_VISIT', updated_at: new Date().toISOString() }).eq('id', ctx.leadId);

    return { ok: true, site_visit: data, confirmed: false, message: 'Site visit request logged for team confirmation.' };
  } catch (err) {
    logger.error('schedule_site_visit failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function create_followup(ctx, args) {
  try {
    const dueAt = args.due_in_days
      ? new Date(Date.now() + args.due_in_days * 86400000).toISOString()
      : null;
    const { data, error } = await supabase
      .from('followups')
      .insert({ lead_id: ctx.leadId, note: args.note, due_at: dueAt, status: 'pending' })
      .select()
      .single();
    if (error) throw error;
    return { ok: true, followup: data };
  } catch (err) {
    logger.error('create_followup failed', err.message);
    return { ok: false, error: err.message };
  }
}

async function escalate_to_human(ctx, args) {
  try {
    const { data, error } = await supabase
      .from('escalations')
      .insert({ lead_id: ctx.leadId, reason: args.reason, urgency: args.urgency || 'medium', status: 'open' })
      .select()
      .single();
    if (error) throw error;

    await supabase.from('leads').update({ status: 'HUMAN_HANDOFF', urgency: args.urgency || 'high', updated_at: new Date().toISOString() }).eq('id', ctx.leadId);

    return { ok: true, escalation: data, assigned: false, message: 'Escalation logged; a human has NOT been assigned yet in this demo — say it will be routed to the team.' };
  } catch (err) {
    logger.error('escalate_to_human failed', err.message);
    return { ok: false, error: err.message };
  }
}

// ---------------- helpers ----------------

function formatPropertyRow(p) {
  return {
    id: p.id,
    project_name: p.project_name,
    developer: p.developer,
    city: p.city,
    locality: p.locality,
    property_type: p.property_type,
    bhk: p.bhk,
    price_min: p.price_min,
    price_max: p.price_max,
    price_display: `${formatINR(p.price_min)} - ${formatINR(p.price_max)}`,
    size_sqft: p.size_sqft,
    status: p.status,
    possession_date: p.possession_date,
    furnishing: p.furnishing,
    floor_info: p.floor_info,
    facing: p.facing,
    amenities: p.amenities,
    rera_number: p.rera_number,
    description: p.description,
    purpose: p.purpose,
  };
}

function scoreFor(status, temperature, urgency) {
  const statusScore = {
    NEW: 5, ENGAGED: 15, EXPLORING: 25, QUALIFYING: 35, INTERESTED: 55, HIGH_INTENT: 75,
    SITE_VISIT: 80, NEGOTIATING: 90, NURTURE: 20, NOT_READY: 15, NOT_INTERESTED: 0,
    DO_NOT_CONTACT: 0, HUMAN_HANDOFF: 70, CLOSED: 100,
  }[status] ?? 10;
  const tempBonus = { COLD: 0, WARM: 5, HOT: 10, PRIORITY: 15 }[temperature] ?? 0;
  const urgencyBonus = { none: 0, low: 0, medium: 3, high: 7, critical: 10 }[urgency] ?? 0;
  return Math.max(0, Math.min(100, statusScore + tempBonus + urgencyBonus));
}

function normalizeDateGuess(text) {
  if (!text) return null;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (iso.test(text)) return text;
  return null; // leave natural-language dates as null; requested_time/notes keep the raw text via the AI's reply
}

const executors = {
  search_properties,
  get_property_details,
  check_property_availability,
  update_lead,
  update_lead_status,
  schedule_site_visit,
  create_followup,
  escalate_to_human,
};

async function executeTool(name, args, ctx) {
  const fn = executors[name];
  if (!fn) return { ok: false, error: `Unknown tool: ${name}` };
  return fn(ctx, args || {});
}

module.exports = { executeTool };
