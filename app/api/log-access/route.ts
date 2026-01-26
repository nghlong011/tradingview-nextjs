import { NextRequest, NextResponse } from 'next/server';
import { saveAccessLog, AccessLog } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const log: AccessLog = {
      ip: body.ip,
      view: body.view,
      block_reason: body.block_reason || null,
      organization: body.organization || null,
      asn: body.asn || null,
      user_agent: body.user_agent || null,
    };

    saveAccessLog(log);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error in log-access API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save access log' },
      { status: 500 }
    );
  }
}
