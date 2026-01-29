import { NextResponse } from 'next/server';

/**
 * Kiểm tra header x-admin-key hoặc Authorization: Bearer <key> với ADMIN_API_KEY.
 * Trả về null nếu hợp lệ; trả về NextResponse 401 nếu thiếu hoặc sai.
 */
export function requireAdminAuth(request: Request): NextResponse | null {
  const key = request.headers.get('x-admin-key') ?? request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ?? null;
  const expected = process.env.ADMIN_API_KEY;
  if (!expected || !key || key !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
