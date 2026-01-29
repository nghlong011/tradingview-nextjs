import { SignJWT, jwtVerify } from 'jose';

const PURPOSE = 'api';
const EXPIRY = '5m';

function getSecret(): Uint8Array {
  const secret = process.env.API_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('API_SECRET must be set and at least 16 characters');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Tạo JWT ngắn hạn cho client gọi unlock-view và log-access.
 * Payload: { purpose: 'api', exp }
 */
export async function createApiToken(): Promise<string> {
  const secret = getSecret();
  const jwt = await new SignJWT({ purpose: PURPOSE })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret);
  return jwt;
}

/**
 * Xác thực JWT từ header. Trả về payload nếu hợp lệ.
 * @throws nếu thiếu token, invalid hoặc expired
 */
export async function verifyApiToken(token: string | null | undefined): Promise<{ purpose: string }> {
  if (!token || typeof token !== 'string' || !token.trim()) {
    throw new Error('Missing API token');
  }
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);
  if (payload.purpose !== PURPOSE) {
    throw new Error('Invalid token purpose');
  }
  return payload as { purpose: string };
}
