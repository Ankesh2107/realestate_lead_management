import { NextRequest } from 'next/server';
import * as whatsapp from '@/lib/channels/whatsapp';
import { verifyMetaSignature } from '@/lib/utils/verifySignature';
import logger from '@/lib/utils/logger';

const APP_SECRET = process.env.META_APP_SECRET || '';

export async function GET(req: NextRequest) {
  return whatsapp.verify(new URL(req.url));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');

  if (!verifyMetaSignature(rawBody, signature, APP_SECRET)) {
    logger.warn('[whatsapp] rejected webhook — invalid or missing signature');
    return new Response('Invalid signature', { status: 401 });
  }

  const body = JSON.parse(rawBody);
  return whatsapp.receive(body);
}
