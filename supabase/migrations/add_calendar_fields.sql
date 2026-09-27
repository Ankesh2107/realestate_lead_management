-- Run this once in the Supabase SQL editor against your existing project.
-- Adds the columns schedule_site_visit needs to record the Google Calendar
-- booking it makes for each site visit. Safe to re-run (IF NOT EXISTS).

alter table site_visits add column if not exists google_calendar_event_id text;
alter table site_visits add column if not exists event_link text;
