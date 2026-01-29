import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua bảo vệ cho các route login/logout
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout')
  ) {
    return NextResponse.next();
  }

  // Backdoor: cho phép qua nếu header x-admin-key khớp ADMIN_API_KEY
  const adminKeyHeader =
    request.headers.get('x-admin-key') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim() ??
    null;
  const expectedKey = process.env.ADMIN_API_KEY;
  if (expectedKey && adminKeyHeader && adminKeyHeader === expectedKey) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin_session')?.value || null;

  try {
    await verifyAdminSessionToken(token);
    // Token hợp lệ, cho tiếp tục
    return NextResponse.next();
  } catch {
    // Không có hoặc token không hợp lệ
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Với trang /admin/* => redirect sang /admin/login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};

