import { genAI, MODEL_NAME } from '../config/gemini';
import { toolDeclarations } from '../tools/toolDefinitions';
import { executeTool } from '../tools/toolExecutor';
import { buildSystemPrompt } from '../prompts/systemPrompt';
import logger from '../utils/logger';

const ORG_NAME = process.env.ORG_NAME || 'Skyline Realty';
const CITY_FOCUS = process.env.ORG_CITY_FOCUS || '';
const HOURS = process.env.ORG_HOURS || '';
const CONTACT = process.env.ORG_CONTACT || '';

// Ordered fastest-first. gemini-3.1-flash-lite is Google's lowest-latency
// current-gen free-tier model (2.5x faster time-to-first-token than 2.5 Flash
// per Google's own benchmarks) — putting it first matters a lot for voice,
// where every extra second is felt directly as dead air on the call.
const FALLBACK_MODELS = Array.from(new Set([
  MODEL_NAME,
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
]));

function historyToContents(history: any[]) {
  return history.map((m) => ({
    role: m.sender === 'customer' ? 'user' : 'model',
    parts: [{ text: m.content }],
  }));
}

async function callModelWithFallback({ systemInstruction, contents }: { systemInstruction: string; contents: any[] }) {
  let lastError: any = null;
  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        tools: [{ functionDeclarations: toolDeclarations }],
      });
      const result = await model.generateContent({ contents });
      return result;
    } catch (err: any) {
      if (err.status === 429 || (err.message && (err.message.includes('429') || err.message.includes('Quota exceeded')))) {
        logger.warn(`[gemini] Model '${modelName}' hit rate limit (429), switching to next free model...`);
        lastError = err;
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export interface GenerateReplyParams {
  lead: any;
  conversation: any;
  history: any[];
  incomingText: string;
  channel: string;
}

export async function generateReply({ lead, conversation, history, incomingText, channel }: GenerateReplyParams) {
  const systemPrompt = buildSystemPrompt({
    orgName: ORG_NAME,
    cityFocus: CITY_FOCUS,
    hours: HOURS,
    contactPhone: CONTACT,
    channel,
    lang: lead.language !== 'auto' ? lead.language : null,
  });

  const leadContextBlock =
    `\n[CURRENT LEAD RECORD — backend state, not something the customer typed just now]\n` +
    JSON.stringify(
      {
        name: lead.name, phone: lead.phone, customer_type: lead.customer_type, intent: lead.intent,
        purpose: lead.purpose, timeline: lead.timeline, budget_min: lead.budget_min, budget_max: lead.budget_max,
        preferred_locations: lead.preferred_locations, bhk_options: lead.bhk_options, status: lead.status,
        temperature: lead.temperature, do_not_contact: lead.do_not_contact,
      },
      null,
      0
    );

  const contents = [
    ...historyToContents(history),
    { role: 'user', parts: [{ text: `${leadContextBlock}\n\n[CUSTOMER MESSAGE]\n${incomingText}` }] },
  ];

  const ctx = { orgId: process.env.ORG_ID || '00000000-0000-0000-0000-000000000001', leadId: lead.id };
  let loopGuard = 0;
  let lastResponseText = '';
  let lastKnownLead: any = null;

  while (loopGuard < 6) {
    loopGuard += 1;
    let result: any;
    try {
      result = await callModelWithFallback({ systemInstruction: systemPrompt, contents });
    } catch (err: any) {
      logger.error('[gemini] All free fallback models hit rate limit (429):', err.message);
      return {
        text: "Our service is experiencing high traffic right now. Please try sending your message again in a minute.",
        lead: lastKnownLead,
      };
    }
    const response = result.response;
    const calls = response.functionCalls();

    if (!calls || calls.length === 0) {
      return { text: response.text().trim(), lead: lastKnownLead };
    }

    lastResponseText = response.text ? response.text().trim() : '';

    const candidateContent = response.candidates && response.candidates[0] && response.candidates[0].content;
    if (candidateContent) {
      contents.push(candidateContent);
    } else {
      contents.push({
        role: 'model',
        parts: calls.map((call: any) => ({ functionCall: { name: call.name, args: call.args } })),
      });
    }

    // Run every tool the model asked for in this turn CONCURRENTLY. The
    // system prompt routinely asks the model for 2-3 tools in one breath
    // (e.g. update_lead_status + search_properties + update_lead) — running
    // them one at a time was adding a full extra Supabase round trip per
    // tool, serially, on every single turn. This was the single biggest
    // contributor to "dead air" on voice calls.
    calls.forEach((call: any) => logger.info(`[gemini] tool call: ${call.name}`, JSON.stringify(call.args)));
    const toolResults = await Promise.all(
      calls.map((call: any) => executeTool(call.name, call.args, ctx))
    );
    const functionResponseParts = calls.map((call: any, i: number) => ({
      functionResponse: { name: call.name, response: toolResults[i] },
    }));

    // Surface the freshest lead row straight from whichever tool touched it,
    // so the caller doesn't need a separate DB round trip just to see the
    // update (see conversationService.ts).
    for (const toolResult of toolResults) {
      if (toolResult && toolResult.ok && toolResult.lead) {
        lastKnownLead = toolResult.lead;
      }
    }

    contents.push({
      role: 'user',
      parts: functionResponseParts,
    });
  }

  logger.warn('[gemini] tool-call loop guard hit, returning fallback text');
  return { text: lastResponseText || "Let me get back to you on that in just a moment.", lead: lastKnownLead };
}
