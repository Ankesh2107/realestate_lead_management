import { NextRequest, NextResponse } from 'next/server';
import { handleTurn } from '@/lib/services/conversationService';
import logger from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, text, name, channel } = await req.json();
    if (!sessionId || !text) {
      return NextResponse.json({ error: 'sessionId and text are required' }, { status: 400 });
    }

    const result = await handleTurn({
      channel: channel || 'web_test',
      externalUserId: sessionId,
      text,
      name: name || null,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    logger.error('[testApi] /message failed', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
