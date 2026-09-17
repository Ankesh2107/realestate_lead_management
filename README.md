# Realty AI — Multilingual Real-Estate Sales Employee (WhatsApp · Instagram · Facebook · Voice)

A working, run-locally implementation of a Gemini-powered conversational real-estate
employee, built from the "Realty AI" master system prompt. It:

- Understands full, unstructured messages (multi-field, multilingual, Hinglish, code-switched)
- Never runs a rigid qualification script — asks only useful questions
- Searches a real (dummy) property inventory in **Supabase** via Gemini function calling
- Keeps a persistent, auditable lead record (status/temperature/urgency/score) that updates
  on every turn
- Handles complaints, anger, rejection, "do not contact", and human escalation honestly
  (never fakes a booking or a human handoff)
- Runs the **same** pipeline across WhatsApp, Instagram, Facebook Messenger, and Voice (Twilio)
- Debounces rapid-fire messages so "hii" + "how are you" doesn't trigger two replies
- Ships with a browser test console (chat simulator, voice demo, leads dashboard, property
  inventory, site-visits/escalations ops view) so you can test everything with **zero
  channel credentials** — only Supabase + Gemini are required to start testing.

## 1. Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project
- A [Gemini API key](https://aistudio.google.com/app/apikey)
- (Optional, only for real channels) Meta WhatsApp Cloud API / Messenger app + a Twilio account

## 2. Set up Supabase

1. Create a new Supabase project.
2. Open the SQL editor and run `supabase/schema.sql` (creates all tables).
3. Then run `supabase/seed.sql` (creates one demo organization + ~15 dummy properties
   across Noida, Greater Noida, Gurgaon and Pune, for both buy and rent).
4. Copy your **Project URL** and **service_role key** (Project Settings → API) — you'll
   need both for `.env`. Use the `service_role` key (not `anon`) since the server writes
   to the database directly; keep this key secret and never ship it to a browser.

## 3. Configure environment

```bash
cp .env.example .env
```

Fill in at minimum:
```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
```

The `ORG_ID` in `.env.example` already matches the organization id inserted by
`supabase/seed.sql`, so leave it as-is unless you changed the seed file.

Everything else (`WHATSAPP_*`, `META_*`, `TWILIO_*`) is only needed once you connect a real
channel — the app runs and logs a clear warning instead of crashing if they're left as
placeholders.

## 4. Install & run

```bash
npm install
npm start
```

Open **http://localhost:3000** — that's the test console. Use the sidebar to:

- **Chat simulator** — talk to Realty AI as a WhatsApp/Instagram/Facebook lead, see the
  live lead record update in real time (budget, BHK, status, temperature, score…)
- **Voice call demo** — mic + speaker in the browser (Web Speech API, Chrome recommended),
  running through the exact same Gemini pipeline used by the real Twilio voice channel
- **Leads dashboard** — every lead across every channel, pulled live from Supabase
- **Property inventory** — the dummy authorized inventory Realty AI is allowed to quote from
- **Site visits & escalations** — what the AI has booked or handed off to humans

Try the quick-reply chips in the chat simulator for a fast tour: a full multi-field request
in one message, a Hinglish flexible-BHK request, an angry complaint, a site-visit request,
and a do-not-contact request — each demonstrates a different rule from the system prompt.

## 5. Going live on real channels

### WhatsApp (Meta Cloud API)
1. Create a Meta developer app → add the WhatsApp product.
2. Set the webhook URL to `https://<your-domain>/webhooks/whatsapp`, verify token =
   `WHATSAPP_VERIFY_TOKEN` from `.env`.
3. Subscribe to the `messages` field.
4. Fill in `WHATSAPP_ACCESS_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID`.

### Instagram DM / Facebook Messenger
1. In the same (or a new) Meta app, add the Messenger product and connect your Page +
   Instagram professional account.
2. Webhook URLs: `https://<your-domain>/webhooks/facebook` and
   `https://<your-domain>/webhooks/instagram`, verify token = `META_VERIFY_TOKEN`.
3. Subscribe to `messages`.
4. Fill in `FB_PAGE_ACCESS_TOKEN` and `IG_PAGE_ACCESS_TOKEN`.

### Voice (Twilio)
1. Buy/configure a Twilio number.
2. Set its **Voice webhook** ("A call comes in") to
   `https://<your-domain>/webhooks/voice/incoming`, HTTP POST.
3. Fill in `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`, and make sure
   `BASE_URL` in `.env` is your public URL (Twilio calls back to `/webhooks/voice/gather`).

For local testing of real webhooks before deploying, use `ngrok http 3000` and paste the
`https://*.ngrok-free.app` URL into Meta/Twilio's webhook fields.

## 6. Deploying

This is a standard stateless Express app — deploy it anywhere that runs Node (Render,
Railway, Fly.io, a VPS, etc). Set the same environment variables from `.env` there, and set
`BASE_URL` to your real public URL (Twilio TwiML needs this to build its callback URLs).

**Important for production scale:** the message debounce buffer
(`src/services/debounceService.js`) is currently in-memory, which is correct for a single
instance and for local testing. If you deploy multiple instances behind a load balancer,
swap it for a Redis-backed delayed job (e.g. BullMQ or Upstash QStash) — the in-memory
`setTimeout` won't be visible across instances or survive a serverless cold start.

## 7. Project structure

```
src/
  server.js                 Express app entrypoint
  config/                   Supabase + Gemini client setup
  prompts/systemPrompt.js   The Realty AI system prompt (built dynamically per org/channel)
  tools/                    Gemini function-calling schema + real Supabase-backed executors
  services/
    leadService.js          Lead/conversation/message persistence
    conversationService.js  The shared per-turn pipeline used by every channel
    geminiService.js        Gemini chat + function-calling loop
    debounceService.js      Per-user message buffering (fixes the "double reply" problem)
  channels/
    whatsapp.js              Meta WhatsApp Cloud API webhook + sender
    facebook.js / instagram.js / metaMessenger.js   Meta Messenger Platform webhook + sender
    voice.js                 Twilio Voice webhook (TwiML)
  routes/
    webhooks.js              Mounts all channel webhooks
    testApi.js                API used by the browser test console
public/                      Browser test console (chat / voice / leads / properties / ops)
supabase/
  schema.sql                 Full DB schema
  seed.sql                   Dummy organization + ~15 properties
```

## 8. How the key requirements map to code

| Requirement | Where |
|---|---|
| Gemini gets full system-prompt context every turn | `src/prompts/systemPrompt.js` + `geminiService.js` |
| Only reads from the org's own (dummy) inventory | `toolExecutor.js` — every query is scoped by `org_id` |
| Everything persisted in Supabase | `supabase/schema.sql`, `leadService.js`, `toolExecutor.js` |
| No duplicate replies from rapid messages | `debounceService.js`, used by `whatsapp.js`, `facebook.js`, `instagram.js` |
| Lead status updated every turn | `update_lead_status` tool, called by the model each turn per the system prompt |
| Works for WhatsApp / Instagram / Facebook / Voice | `src/channels/*.js`, all sharing `conversationService.handleTurn` |
| Angry/complaint handling, human escalation, do-not-contact | encoded in the system prompt + `escalate_to_human` tool + `do_not_contact` flag checked in `conversationService.js` |
| Test UI | `public/` — chat simulator, voice demo, leads dashboard, inventory, ops view |

## 9. Notes & honesty about this demo

- The voice **demo tab** in the browser uses the Web Speech API purely so you can test
  without Twilio credentials. The actual production voice channel is
  `src/channels/voice.js`, which is real Twilio TwiML and needs Twilio credentials — swap
  to it by wiring up your Twilio number as described above.
- The AI never fabricates availability, prices, discounts, bookings, or human hand-offs —
  every one of those claims is gated behind an actual Supabase read/write in
  `toolExecutor.js`. If a tool fails, the model is fed `{ ok: false, error }` and instructed
  to be honest about it, not to pretend it worked.
- Multi-tenancy: every table is scoped by `org_id`. This demo ships one organization; to
  support many, create more rows in `organizations`, insert `properties` scoped to each,
  and pass the correct `org_id` per channel/number instead of a single `.env` value.
