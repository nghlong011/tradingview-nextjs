'use client';

import { useEffect, useState } from 'react';
import { load } from '@fingerprintjs/botd';
import ViewOne from '@/app/view-one';
import ViewTwo from '@/app/view-two';

type GateStatus = 'loading' | 'bot' | 'allowed';

interface BotdDetectionResult {
  bot: boolean;
  [key: string]: unknown;
}

function Placeholder() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-foreground/20 rounded-full" />
          <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-foreground rounded-full animate-spin" />
        </div>
        <p className="text-foreground/60 text-sm font-medium animate-pulse">
          Đang tải...
        </p>
      </div>
    </div>
  );
}

interface BotdGateProps {
  apiToken?: string;
}

export default function BotdGate({ apiToken }: BotdGateProps) {
  const [status, setStatus] = useState<GateStatus>('loading');
  const [botdResult, setBotdResult] = useState<BotdDetectionResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const botd = await load();
        if (cancelled) return;
        const result = (await botd.detect()) as BotdDetectionResult;
        if (cancelled) return;

        setBotdResult(result);

        if (result.bot === true) {
          setStatus('bot');
          sendLog('ViewTwo', null, result);
          return;
        }

        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (apiToken) headers['x-api-key'] = apiToken;

        const res = await fetch('/api/unlock-view', {
          method: 'POST',
          headers,
          body: JSON.stringify({ botd_result: result }),
        });

        if (cancelled) return;

        const data = await res.json().catch(() => ({}));
        const allowed = data?.allowed === true;
        const ip = data?.ip ?? 'unknown';
        const blockReason = data?.block_reason ?? null;
        const organization = data?.organization ?? null;
        const asn = data?.asn ?? null;

        if (allowed) {
          setStatus('allowed');
          sendLog('ViewOne', { ip, block_reason: blockReason, organization, asn }, result);
        } else {
          setStatus('bot');
          sendLog('ViewTwo', { ip, block_reason: blockReason, organization, asn }, result);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('[BotdGate] Error:', err);
        setStatus('bot');
        sendLog('ViewTwo', null, null);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apiToken]);

  function sendLog(
    view: 'ViewOne' | 'ViewTwo',
    serverData: { ip: string; block_reason?: string | null; organization?: string | null; asn?: number | null } | null,
    result: BotdDetectionResult | null
  ) {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const payload = {
      ip: serverData?.ip ?? 'unknown',
      view,
      block_reason: serverData?.block_reason ?? null,
      organization: serverData?.organization ?? null,
      asn: serverData?.asn ?? null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      headers: null,
      botd_result: result != null ? JSON.stringify(result) : null,
    };

    const logHeaders: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiToken) logHeaders['x-api-key'] = apiToken;
    fetch(`${baseUrl}/api/log-access`, {
      method: 'POST',
      headers: logHeaders,
      body: JSON.stringify(payload),
    }).catch((e) => console.error('[BotdGate] Log error:', e));
  }

  if (status === 'loading') {
    return <Placeholder />;
  }

  if (status === 'bot') {
    return <ViewTwo />;
  }

  return <ViewOne />;
}
