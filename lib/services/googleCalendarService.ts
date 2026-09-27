import { JWT } from 'google-auth-library';
import logger from '../utils/logger';

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const DEFAULT_DURATION_MINUTES = 60;
const TIMEZONE = 'Asia/Kolkata';

let cachedClient: JWT | null = null;

function isConfigured(): boolean {
  return Boolean(
    CALENDAR_ID &&
    SERVICE_ACCOUNT_EMAIL &&
    PRIVATE_KEY &&
    !CALENDAR_ID.includes('YOUR_') &&
    !SERVICE_ACCOUNT_EMAIL.includes('YOUR_')
  );
}

function getClient(): JWT {
  if (!cachedClient) {
    cachedClient = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: SCOPES,
    });
  }
  return cachedClient;
}

export interface SiteVisitEventParams {
  leadName?: string | null;
  leadPhone?: string | null;
  propertyName?: string | null;
  propertyLocation?: string | null;
  visitDate: string; // YYYY-MM-DD
  visitTime: string; // HH:MM (24h)
  notes?: string | null;
  durationMinutes?: number;
}

export interface SiteVisitEventResult {
  ok: boolean;
  eventId?: string;
  eventLink?: string;
  error?: string;
}

function toRfc3339(date: string, time: string): string | null {
  const dateMatch = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const timeMatch = /^\d{2}:\d{2}$/.test(time);
  if (!dateMatch || !timeMatch) return null;
  // Interpreted as local Asia/Kolkata wall-clock time; Calendar API takes the
  // timeZone separately, so we send a naive (no-offset) datetime string.
  return `${date}T${time}:00`;
}

export interface DeleteEventResult {
  ok: boolean;
  error?: string;
}

export async function deleteSiteVisitEvent(eventId: string): Promise<DeleteEventResult> {
  if (!isConfigured()) {
    logger.warn('[googleCalendar] not configured — skipping calendar event deletion');
    return { ok: false, error: 'Google Calendar is not configured' };
  }
  if (!eventId) return { ok: false, error: 'No event id provided' };

  try {
    const client = getClient();
    const { token } = await client.getAccessToken();
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID!)}/events/${encodeURIComponent(eventId)}`,
      { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }
    );
    // Google returns 204 on success and 410 if the event was already deleted — both mean "gone".
    if (!res.ok && res.status !== 410 && res.status !== 404) {
      const errBody = await res.text();
      logger.error('[googleCalendar] event deletion failed', `${res.status} ${errBody}`);
      return { ok: false, error: `Calendar API error (${res.status})` };
    }
    return { ok: true };
  } catch (err: any) {
    logger.error('[googleCalendar] deleteSiteVisitEvent failed', err.message);
    return { ok: false, error: err.message };
  }
}

export async function createSiteVisitEvent(params: SiteVisitEventParams): Promise<SiteVisitEventResult> {
  if (!isConfigured()) {
    logger.warn('[googleCalendar] not configured — skipping calendar booking');
    return { ok: false, error: 'Google Calendar is not configured' };
  }

  const startIso = toRfc3339(params.visitDate, params.visitTime);
  if (!startIso) {
    return { ok: false, error: 'Invalid or missing visit date/time' };
  }

  // Do the +duration arithmetic on the naive wall-clock string (tagged as
  // "Z" purely so `Date` can do the math) rather than converting through a
  // real UTC instant — we send both start/end with timeZone: Asia/Kolkata,
  // so what matters is the wall-clock digits, not an actual UTC offset.
  const durationMs = (params.durationMinutes || DEFAULT_DURATION_MINUTES) * 60 * 1000;
  const startAsUtcForMath = new Date(`${startIso}Z`);
  if (Number.isNaN(startAsUtcForMath.getTime())) {
    return { ok: false, error: 'Invalid visit date/time' };
  }
  const endAsUtcForMath = new Date(startAsUtcForMath.getTime() + durationMs);
  const endIso = endAsUtcForMath.toISOString().slice(0, 19);

  const leadLabel = params.leadName || 'Lead';
  const propertyLabel = params.propertyName || 'Property TBD';

  const descriptionLines = [
    params.leadPhone ? `Phone: ${params.leadPhone}` : null,
    params.notes ? `Notes: ${params.notes}` : null,
    'Booked automatically by the AI sales assistant.',
  ].filter(Boolean);

  try {
    const client = getClient();
    const { token } = await client.getAccessToken();

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID!)}/events`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: `Site Visit — ${leadLabel} — ${propertyLabel}`,
          description: descriptionLines.join('\n'),
          location: params.propertyLocation || undefined,
          start: { dateTime: startIso, timeZone: TIMEZONE },
          end: { dateTime: endIso, timeZone: TIMEZONE },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      logger.error('[googleCalendar] event creation failed', `${res.status} ${errBody}`);
      return { ok: false, error: `Calendar API error (${res.status})` };
    }

    const data = await res.json();
    return { ok: true, eventId: data.id, eventLink: data.htmlLink };
  } catch (err: any) {
    logger.error('[googleCalendar] createSiteVisitEvent failed', err.message);
    return { ok: false, error: err.message };
  }
}
