import { NextRequest, NextResponse } from 'next/server';
import { saveAccessLog, AccessLog } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('[API] Received log request:', {
      ip: body.ip,
      view: body.view,
      block_reason: body.block_reason,
      hasHeaders: !!body.headers,
    });
    
    const log: AccessLog = {
      ip: body.ip,
      view: body.view,
      block_reason: body.block_reason || null,
      organization: body.organization || null,
      asn: body.asn || null,
      user_agent: body.user_agent || null,
      headers: body.headers || null,
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
