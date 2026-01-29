import { NextRequest, NextResponse } from 'next/server';
import { verifyApiToken } from '@/lib/auth-api';
import { checkRateLimit, LOG_ACCESS_LIMIT } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip-analysis';
import { saveAccessLog, AccessLog } from '@/lib/db';
import { parseUserAgent } from '@/lib/ua-parser';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-api-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
    try {
      await verifyApiToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const ip = getClientIp(request.headers) || 'unknown';
    const rate = checkRateLimit(`log:${ip}`, LOG_ACCESS_LIMIT);
    if (!rate.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    console.log('[API] Received log request:', {
      ip: body.ip,
      view: body.view,
      block_reason: body.block_reason,
      hasHeaders: !!body.headers,
      hasBotdResult: !!body.botd_result,
    });
    
    // Parse user-agent
    const parsedUA = parseUserAgent(body.user_agent);
    const parsedUAJson = parsedUA ? JSON.stringify(parsedUA) : null;
    
    const log: AccessLog = {
      ip: body.ip,
      view: body.view,
      block_reason: body.block_reason || null,
      organization: body.organization || null,
      asn: body.asn || null,
      user_agent: body.user_agent || null,
      user_agent_parsed: parsedUAJson,
      headers: body.headers || null,
      botd_result: body.botd_result ?? null,
    };

    // Await saveAccessLog để đảm bảo được xử lý
    await saveAccessLog(log);
    
    console.log('[API] Successfully saved access log');

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[API] Error in log-access API:', {
      error: error?.message || String(error),
      errorStack: error?.stack,
      errorName: error?.name,
    });
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save access log',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    );
  }
}
