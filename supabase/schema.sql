-- ============================================================
-- REALTY AI — SUPABASE SCHEMA
-- Run this whole file in Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- ORGANIZATIONS (multi-tenant root) ----------
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city_focus text,
  hours text,
  contact_phone text,
  allowed_discount_pct numeric default 0,     -- authority ceiling, backend-enforced
  created_at timestamptz default now()
);

-- ---------- PROPERTIES (authoritative inventory) ----------
create table if not exists properties (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade,
  project_name text not null,
  developer text,
  city text not null,
  locality text not null,
  property_type text default 'apartment',      -- apartment / villa / plot / commercial
  bhk int,
  price_min bigint not null,                    -- in INR
  price_max bigint not null,                    -- in INR
  size_sqft int,
  status text default 'available',              -- available / reserved / sold / hidden / inactive
  possession_date date,
  furnishing text,                               -- unfurnished / semi-furnished / furnished
  floor_info text,
  facing text,
  amenities text[],
  rera_number text,
  description text,
  purpose text default 'buy',                    -- buy / rent
  created_at timestamptz default now()
);

-- ---------- LEADS ----------
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid references organizations(id) on delete cascade,
  channel text not null,                         -- whatsapp / instagram / facebook / voice / web_test
  external_user_id text not null,                -- phone number / psid / call sid / test session id
  name text,
  phone text,
  email text,
  language text default 'auto',
  customer_type text default 'unknown',          -- buyer/rental/seller/investor/broker/existing/complaint/unknown
  intent text default 'unknown',
  purpose text,                                  -- self-use / investment / unknown
  timeline text,
  budget_min bigint,
  budget_max bigint,
  preferred_locations text[],
  bhk_options int[],
  property_type text,
  notes text,
  status text default 'NEW',                     -- NEW/ENGAGED/EXPLORING/QUALIFYING/INTERESTED/HIGH_INTENT/SITE_VISIT/NEGOTIATING/NURTURE/NOT_READY/NOT_INTERESTED/DO_NOT_CONTACT/HUMAN_HANDOFF/CLOSED
  temperature text default 'COLD',                -- COLD/WARM/HOT/PRIORITY
  lead_score int default 0,
  urgency text default 'none',                    -- none/low/medium/high/critical
  do_not_contact boolean default false,
  assigned_to text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, channel, external_user_id)
);

-- ---------- CONVERSATIONS ----------
create table if not exists conversations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  channel text not null,
  status text default 'open',                     -- open / ended
  started_at timestamptz default now(),
  last_message_at timestamptz default now()
);

-- ---------- MESSAGES ----------
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  lead_id uuid references leads(id) on delete cascade,
  sender text not null,                            -- customer / ai / human
  content text not null,
  language text,
  created_at timestamptz default now()
);

-- ---------- FOLLOWUPS ----------
create table if not exists followups (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  note text,
  due_at timestamptz,
  status text default 'pending',                   -- pending / done / cancelled
  created_at timestamptz default now()
);

-- ---------- SITE VISITS ----------
create table if not exists site_visits (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  property_id uuid references properties(id),
  requested_date date,
  requested_time text,
  status text default 'requested',                 -- requested / confirmed / rescheduled / cancelled / completed
  created_at timestamptz default now()
);

-- ---------- ESCALATIONS (human handoff log) ----------
create table if not exists escalations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete cascade,
  reason text,
  urgency text default 'medium',
  status text default 'open',                       -- open / assigned / resolved
  created_at timestamptz default now()
);

create index if not exists idx_leads_org on leads(org_id);
create index if not exists idx_leads_channel_ext on leads(channel, external_user_id);
create index if not exists idx_messages_conv on messages(conversation_id);
create index if not exists idx_properties_org on properties(org_id);
create index if not exists idx_properties_city on properties(city);
