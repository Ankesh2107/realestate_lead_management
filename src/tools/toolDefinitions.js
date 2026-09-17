// Gemini function-calling declarations. Kept intentionally small & precise —
// each maps 1:1 to a real Supabase-backed executor in toolExecutor.js.

const toolDeclarations = [
  {
    name: 'search_properties',
    description:
      'Search the organization\'s authorized property inventory. Use flexible ranges: if the ' +
      'customer gave multiple acceptable BHKs or locations, pass them all. Only returns this ' +
      'organization\'s properties.',
    parameters: {
      type: 'object',
      properties: {
        cities: { type: 'array', items: { type: 'string' }, description: 'Acceptable cities/localities, e.g. ["Noida","Greater Noida"]' },
        bhk_options: { type: 'array', items: { type: 'integer' }, description: 'Acceptable BHK counts, e.g. [2,3,4]' },
        budget_min: { type: 'number', description: 'Minimum budget in INR (omit if none)' },
        budget_max: { type: 'number', description: 'Maximum budget in INR (omit if none)' },
        purpose: { type: 'string', enum: ['buy', 'rent'], description: 'Buy or rent' },
        property_type: { type: 'string', description: 'apartment / villa / plot / commercial (optional)' },
      },
    },
  },
  {
    name: 'get_property_details',
    description: 'Get full confirmed details of one specific property by its id or by project_name.',
    parameters: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        project_name: { type: 'string' },
      },
    },
  },
  {
    name: 'check_property_availability',
    description: 'Check current confirmed availability status of a specific property/unit.',
    parameters: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        project_name: { type: 'string' },
      },
    },
  },
  {
    name: 'update_lead',
    description:
      'Create/update the structured lead record with the FULL current understanding of the ' +
      'customer (not just what changed this turn) for any fields you now know.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        customer_type: {
          type: 'string',
          enum: ['buyer', 'rental_customer', 'seller', 'investor', 'tenant', 'broker', 'existing_customer', 'complaint_customer', 'vendor', 'unknown'],
        },
        intent: {
          type: 'string',
          enum: ['buy', 'rent', 'sell', 'invest', 'property_information', 'price_inquiry', 'availability_inquiry', 'brochure_request', 'site_visit_request', 'negotiation', 'financing', 'legal', 'complaint', 'follow_up', 'general_information', 'human_request', 'wrong_number', 'not_interested', 'do_not_contact', 'unknown'],
        },
        purpose: { type: 'string', enum: ['self_use', 'investment', 'unknown'] },
        timeline: { type: 'string', description: 'e.g. "within a month", "next 6 months", "just exploring"' },
        budget_min: { type: 'number' },
        budget_max: { type: 'number' },
        preferred_locations: { type: 'array', items: { type: 'string' } },
        bhk_options: { type: 'array', items: { type: 'integer' } },
        property_type: { type: 'string' },
        notes: { type: 'string', description: 'Any other useful free-text context' },
      },
    },
  },
  {
    name: 'update_lead_status',
    description: 'Update the backend lead status/temperature/urgency. Call this on nearly every turn.',
    parameters: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['NEW', 'ENGAGED', 'EXPLORING', 'QUALIFYING', 'INTERESTED', 'HIGH_INTENT', 'SITE_VISIT', 'NEGOTIATING', 'NURTURE', 'NOT_READY', 'NOT_INTERESTED', 'DO_NOT_CONTACT', 'HUMAN_HANDOFF', 'CLOSED'],
        },
        temperature: { type: 'string', enum: ['COLD', 'WARM', 'HOT', 'PRIORITY'] },
        urgency: { type: 'string', enum: ['none', 'low', 'medium', 'high', 'critical'] },
      },
      required: ['status'],
    },
  },
  {
    name: 'schedule_site_visit',
    description: 'Request/schedule a site visit for a property. Does not guarantee confirmation — returns actual booking status.',
    parameters: {
      type: 'object',
      properties: {
        property_id: { type: 'string' },
        project_name: { type: 'string' },
        requested_date: { type: 'string', description: 'YYYY-MM-DD if known, else natural text like "this Saturday"' },
        requested_time: { type: 'string', description: 'e.g. "4 PM"' },
      },
      required: ['requested_date'],
    },
  },
  {
    name: 'create_followup',
    description: 'Create a follow-up task for staff, only when genuinely warranted.',
    parameters: {
      type: 'object',
      properties: {
        note: { type: 'string' },
        due_in_days: { type: 'integer', description: 'How many days from now the follow-up is due' },
      },
      required: ['note'],
    },
  },
  {
    name: 'escalate_to_human',
    description:
      'Escalate this lead to a human staff member (senior advisor / support). Use for human ' +
      'requests, complaints, anger, legal/payment disputes, negotiation beyond authority, or ' +
      'high-intent ready-to-book customers.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string' },
        urgency: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['reason'],
    },
  },
];

module.exports = { toolDeclarations };
