import { NextRequest } from 'next/server';
import * as voice from '@/lib/channels/voice';

export async function POST(req: NextRequest) {
  return voice.incoming();
}
