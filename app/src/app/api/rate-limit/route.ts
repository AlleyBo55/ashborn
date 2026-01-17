import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const result = checkRateLimit(sessionId);
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Rate limit check failed' }, { status: 500 });
  }
}
