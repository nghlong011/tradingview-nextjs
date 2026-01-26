import { NextRequest, NextResponse } from 'next/server';
import { getAccessLogs, getStatistics, LogQueryParams } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const params: LogQueryParams = {};
    
    const page = searchParams.get('page');
    if (page) {
      params.page = parseInt(page, 10);
    }
    
    const limit = searchParams.get('limit');
    if (limit) {
      params.limit = parseInt(limit, 10);
    }
    
    const ip = searchParams.get('ip');
    if (ip) {
      params.ip = ip;
    }
    
    const view = searchParams.get('view');
    if (view === 'ViewOne' || view === 'ViewTwo') {
      params.view = view;
    }
    
    const blockReason = searchParams.get('block_reason');
    if (blockReason) {
      params.block_reason = blockReason;
    }
    
    const startDate = searchParams.get('startDate');
    if (startDate) {
      params.startDate = startDate;
    }
    
    const endDate = searchParams.get('endDate');
    if (endDate) {
      params.endDate = endDate;
    }
    
    const logs = await getAccessLogs(params);
    
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error in admin logs API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}
