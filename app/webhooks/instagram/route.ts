import { NextRequest } from 'next/server';
import * as instagram from '@/lib/channels/instagram';
import { verifyMetaSignature } from '@/lib/utils/verifySignature';
import logger from '@/lib/utils/logger';

const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || '';

export async function GET(req: NextRequest) {
  return instagram.verify(new URL(req.url));
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-hub-signature-256');

  if (!verifyMetaSignature(rawBody, signature, APP_SECRET)) {
    logger.warn('[instagram] rejected webhook — invalid or missing signature');
    return new Response('Invalid signature', { status: 401 });
  }

  const body = JSON.parse(rawBody);
  return instagram.receive(body);
}
