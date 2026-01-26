import { NextResponse } from 'next/server';
import { getStatistics } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getStatistics();
    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error('Error in admin stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
