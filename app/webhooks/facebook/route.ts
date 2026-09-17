import { NextRequest } from 'next/server';
import * as facebook from '@/lib/channels/facebook';

export async function GET(req: NextRequest) {
  return facebook.verify(new URL(req.url));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return facebook.receive(body);
}
