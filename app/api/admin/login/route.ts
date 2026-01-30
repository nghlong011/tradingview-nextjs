import { NextRequest, NextResponse } from 'next/server';
import { getAdminByUsername } from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createAdminSessionToken } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password.trim() : '';

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

