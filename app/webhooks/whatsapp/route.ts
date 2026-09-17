import { NextRequest } from 'next/server';
import * as whatsapp from '@/lib/channels/whatsapp';

export async function GET(req: NextRequest) {
  return whatsapp.verify(new URL(req.url));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return whatsapp.receive(body);
}
