import { NextRequest, NextResponse } from 'next/server';
import { verifyApiToken } from '@/lib/auth-api';
import { checkRateLimit, UNLOCK_VIEW_LIMIT } from '@/lib/rate-limit';
import { analyzeIpAccess, getClientIp } from '@/lib/ip-analysis';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-api-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null;
    try {
      await verifyApiToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientIp = getClientIp(request.headers) || 'unknown';
    const rate = checkRateLimit(`unlock:${clientIp}`, UNLOCK_VIEW_LIMIT);
    if (!rate.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const botdResult = body.botd_result;

    if (!botdResult || typeof botdResult !== 'object') {
      return NextResponse.json(
        { allowed: false, error: 'Missing or invalid botd_result' },
        { status: 400 }
      );
    }

    if (botdResult.bot !== false) {
      return NextResponse.json({
        allowed: false,
        ip: clientIp,
        block_reason: 'BOT_DETECTED',
      });
    }

    const ipAccess = await analyzeIpAccess(request.headers, {});

    if (!ipAccess.allowed) {
      return NextResponse.json({
        allowed: false,
        ip: ipAccess.details?.ip ?? 'unknown',
        block_reason: ipAccess.reason ?? 'BLOCKED',
        organization: ipAccess.details?.organization ?? null,
        asn: ipAccess.details?.asn ?? null,
      });
    }

    const ip = ipAccess.details?.ip ?? 'unknown';
    return NextResponse.json({
      allowed: true,
      ip,
      block_reason: null,
      organization: ipAccess.details?.organization ?? null,
      asn: ipAccess.details?.asn ?? null,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error('[unlock-view] Error:', err?.message ?? error);
    return NextResponse.json(
      { allowed: false, error: 'Unlock check failed' },
      { status: 500 }
    );
  }
}
