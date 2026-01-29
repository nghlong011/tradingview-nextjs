import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const KEYLEN = 64;

/**
 * Hash mật khẩu với scrypt.
 * Trả về chuỗi dạng "salt:hash" (hex).
 */
export function hashPassword(plain: string): string {
  if (!plain) {
    throw new Error('Password is required');
  }
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, KEYLEN).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * So sánh mật khẩu plaintext với hash dạng "salt:hash".
 */
export function verifyPassword(plain: string, stored: string | null | undefined): boolean {
  if (!plain || !stored) return false;
  const parts = stored.split(':');
  if (parts.length !== 2) return false;
  const [salt, hash] = parts;
  if (!salt || !hash) return false;

  const derived = scryptSync(plain, salt, KEYLEN).toString('hex');

  try {
    return timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'));
  } catch {
    return false;
  }
}

