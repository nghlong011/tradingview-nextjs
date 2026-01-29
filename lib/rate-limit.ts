const store = new Map<string, { count: number; windowStart: number }>();

const WINDOW_MS = 60 * 1000; // 1 phút

/**
 * Rate limit theo key (thường là IP).
 * @param key - identifier (ví dụ IP)
 * @param limit - số request tối đa trong window
 * @param windowMs - cửa sổ thời gian (ms)
 * @returns null nếu OK; NextResponse 429 nếu vượt limit
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number = WINDOW_MS
): { ok: true } | { ok: false; response: Response } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }

  if (now - entry.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { ok: true };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: 'Too many requests', retryAfter: 60 }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      ),
    };
  }

  return { ok: true };
}

/** Giới hạn unlock-view: 10 lần / IP / phút */
export const UNLOCK_VIEW_LIMIT = 10;

/** Giới hạn log-access: 20 lần / IP / phút */
export const LOG_ACCESS_LIMIT = 20;
