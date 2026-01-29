import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createAdminSessionToken } from '@/lib/admin-auth';
import { checkRateLimit, ADMIN_LOGIN_LIMIT, ADMIN_LOGIN_WINDOW_MS } from '@/lib/rate-limit';
import { getClientIp } from '@/lib/ip-analysis';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request.headers) || 'unknown';
    const rate = checkRateLimit(
      `admin_login:${clientIp}`,
      ADMIN_LOGIN_LIMIT,
      ADMIN_LOGIN_WINDOW_MS
    );
    if (!rate.ok) {
      return NextResponse.json(
        {
          error:
            'Bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau vài phút.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username và password là bắt buộc' },
        { status: 400 }
      );
    }

    const admin = await getAdminByUsername(username);
    if (!admin || !admin.password_hash) {
      return NextResponse.json(
        { error: 'Sai tài khoản hoặc mật khẩu' },
        { status: 401 }
      );
    }

    const ok = verifyPassword(password, admin.password_hash);
    if (!ok) {
      return NextResponse.json(
        { error: 'Sai tài khoản hoặc mật khẩu' },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken(admin);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 2, // 2 giờ
    });

    return response;
  } catch (error: any) {
    console.error('Error in admin login API:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

