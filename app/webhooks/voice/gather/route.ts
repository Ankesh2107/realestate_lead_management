import { NextRequest } from 'next/server';
import * as voice from '@/lib/channels/voice';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  return voice.gather(formData);
}
