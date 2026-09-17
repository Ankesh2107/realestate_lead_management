import { NextRequest } from 'next/server';
import * as instagram from '@/lib/channels/instagram';

export async function GET(req: NextRequest) {
  return instagram.verify(new URL(req.url));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return instagram.receive(body);
}
