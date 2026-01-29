import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import type { AdminUser } from './db';

const ADMIN_SESSION_PURPOSE = 'admin_session';
const ADMIN_SESSION_EXPIRY = '2h';

function getAdminSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.API_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'ADMIN_SESSION_SECRET hoặc API_SECRET phải được set và có độ dài tối thiểu 16 ký tự'
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Tạo JWT cho session admin
 */
export async function createAdminSessionToken(admin: AdminUser): Promise<string> {
  const secret = getAdminSessionSecret();
  const jwt = await new SignJWT({
    purpose: ADMIN_SESSION_PURPOSE,
    sub: String(admin.id),
    username: admin.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ADMIN_SESSION_EXPIRY)
    .sign(secret);

  return jwt;
}

export interface AdminSessionPayload {
  purpose: string;
  sub: string;
  username: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT session admin
 */
export async function verifyAdminSessionToken(
  token: string | null | undefined
): Promise<AdminSessionPayload> {
  if (!token || typeof token !== 'string' || !token.trim()) {
    throw new Error('Missing admin session token');
  }

  const secret = getAdminSessionSecret();
  const { payload } = await jwtVerify(token, secret);

  if (payload.purpose !== ADMIN_SESSION_PURPOSE) {
    throw new Error('Invalid admin session token purpose');
  }

  return payload as AdminSessionPayload;
}

/**
 * Giữ lại helper dùng ADMIN_API_KEY như backdoor server-side (tuỳ chọn).
 * Không dùng cho SPA admin nữa (đã chuyển sang cookie session + middleware).
 */
export function requireAdminAuth(request: Request): NextResponse | null {
  const key =
    request.headers.get('x-admin-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ??
    null;
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || !key || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
