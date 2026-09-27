import { NextRequest } from 'next/server';
import * as voice from '@/lib/channels/voice';
import { verifyTwilioRequest } from '@/lib/utils/verifyTwilio';
import logger from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  const { valid } = await verifyTwilioRequest(req);
  if (!valid) {
    logger.warn('[voice] rejected incoming call — invalid Twilio signature');
    return new Response('Forbidden', { status: 403 });
  }
  return voice.incoming();
}
