import { FunctionDeclaration, SchemaType } from '@google/generative-ai';

export const toolDeclarations: FunctionDeclaration[] = [
  {
    name: 'search_properties',
    description: 'Queries database for matching real estate properties based on city, price range, BHK options, and purpose.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        cities: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'Cities to filter properties in (e.g. Noida, Gurgaon, Pune).',
        },
        bhk_options: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.INTEGER },
          description: 'Number of bedrooms (e.g. 2, 3, 4).',
        },
        budget_min: { type: SchemaType.NUMBER, description: 'Minimum budget in INR.' },
        budget_max: { type: SchemaType.NUMBER, description: 'Maximum budget in INR.' },
        purpose: { type: SchemaType.STRING, description: 'Purpose: buy, rent, invest, self_use.' },
      },
    },
  },
  {
    name: 'update_lead',
    description: 'Updates lead record in backend database with preferences and profile data learned during the conversation.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        name: { type: SchemaType.STRING, description: 'Customer name.' },
        phone: { type: SchemaType.STRING, description: 'Customer phone number.' },
        customer_type: { type: SchemaType.STRING, description: 'buyer, tenant, investor, seller.' },
        intent: { type: SchemaType.STRING, description: 'buy, rent, sell, general_inquiry.' },
        purpose: { type: SchemaType.STRING, description: 'self_use, investment, resale.' },
        timeline: { type: SchemaType.STRING, description: 'immediate, 3_months, 6_months, exploring.' },
        budget_min: { type: SchemaType.NUMBER, description: 'Minimum budget in INR.' },
        budget_max: { type: SchemaType.NUMBER, description: 'Maximum budget in INR.' },
        preferred_locations: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: 'Preferred sectors or cities.',
        },
        bhk_options: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.INTEGER },
          description: 'Preferred bedroom counts.',
        },
      },
    },
  },
  {
    name: 'schedule_site_visit',
    description: 'Schedules a site visit for a lead to view a specific project or property, and books it on the team calendar. Only call this once you have a specific calendar date AND a specific time from the customer — never guess or leave these vague.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        property_id: { type: SchemaType.STRING, description: 'UUID of the target property (optional if project_name is given).' },
        project_name: { type: SchemaType.STRING, description: 'Name of the project/property to visit (used if property_id is not known).' },
        visit_date: { type: SchemaType.STRING, description: 'Requested visit date in YYYY-MM-DD format.' },
        visit_time: { type: SchemaType.STRING, description: 'Requested visit time in 24-hour HH:MM format (e.g. 16:00 for 4 PM).' },
        notes: { type: SchemaType.STRING, description: 'Additional instructions or pickup details.' },
      },
      required: ['visit_date', 'visit_time'],
    },
  },
  {
    name: 'cancel_site_visit',
    description: 'Cancels the customer\'s most recently scheduled (non-cancelled) site visit and removes it from the team calendar if it was booked there. Use this whenever the customer says they booked by mistake, want to cancel, or no longer want the scheduled visit.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        reason: { type: SchemaType.STRING, description: 'Why the customer wants to cancel (optional).' },
      },
    },
  },
  {
    name: 'escalate_to_human',
    description: 'Escalates conversation to a human real estate agent or manager.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        reason: { type: SchemaType.STRING, description: 'Reason for human escalation.' },
        urgency: { type: SchemaType.STRING, description: 'low, medium, high, immediate.' },
      },
      required: ['reason'],
    },
  },
  {
    name: 'update_lead_status',
    description: 'Updates lead temperature and sales status in the CRM.',
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        status: { type: SchemaType.STRING, description: 'One of: NEW, ENGAGED, EXPLORING, QUALIFYING, INTERESTED, HIGH_INTENT, SITE_VISIT, NEGOTIATING, NURTURE, NOT_READY, NOT_INTERESTED, DO_NOT_CONTACT, HUMAN_HANDOFF, CLOSED.' },
        temperature: { type: SchemaType.STRING, description: 'COLD, WARM, HOT.' },
        urgency: { type: SchemaType.STRING, description: 'low, medium, high.' },
      },
    },
  },
];
