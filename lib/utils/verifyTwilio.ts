import { NextRequest } from 'next/server';
import twilio from 'twilio';
import logger from './logger';

const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Verifies the `X-Twilio-Signature` header against the configured auth token.
 * If TWILIO_AUTH_TOKEN hasn't been set up yet, this warns and allows the
 * request through rather than breaking voice calls for anyone who hasn't
 * finished wiring up their Twilio credentials — set TWILIO_AUTH_TOKEN in
 * .env to actually enforce this check.
 */
export async function verifyTwilioRequest(req: NextRequest): Promise<{ valid: boolean; formData: FormData }> {
  const formData = await req.formData();

  if (!AUTH_TOKEN || AUTH_TOKEN.includes('YOUR_TWILIO')) {
    logger.warn('[voice] TWILIO_AUTH_TOKEN not configured — skipping signature verification');
    return { valid: true, formData };
  }

  const signature = req.headers.get('x-twilio-signature');
  if (!signature) return { valid: false, formData };

  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = value.toString();
  });

  const url = `${BASE_URL}${new URL(req.url).pathname}`;
  const valid = twilio.validateRequest(AUTH_TOKEN, signature, url, params);
  return { valid, formData };
}
