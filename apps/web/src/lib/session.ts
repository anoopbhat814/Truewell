import { cookies } from 'next/headers';
import type { SessionUser, TokenPair } from '@truewell/types';
import { env } from './env';

const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 14;

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

export function sessionFromToken(token: string | undefined, now = Date.now()): SessionUser | null {
  if (!token) return null;
  const claims = decodeJwtPayload(token);
  if (!claims || typeof claims.exp !== 'number' || claims.exp * 1000 <= now) return null;
  return {
    userId: String(claims.sub),
    role: claims.role as SessionUser['role'],
    patientId: (claims.pid as string | null) ?? null,
    clinicianId: (claims.cid as string | null) ?? null,
  };
}

export function getAccessToken(): string | undefined {
  return cookies().get(env().SESSION_COOKIE_NAME)?.value;
}

export function getSession(): SessionUser | null {
  return sessionFromToken(getAccessToken());
}

export function storeTokens(tokens: TokenPair): void {
  const base = { httpOnly: true, sameSite: 'lax' as const, secure: env().NODE_ENV === 'production', path: '/' };
  const jar = cookies();
  jar.set(env().SESSION_COOKIE_NAME, tokens.accessToken, { ...base, maxAge: ACCESS_MAX_AGE });
  jar.set(env().REFRESH_COOKIE_NAME, tokens.refreshToken, { ...base, maxAge: REFRESH_MAX_AGE, path: '/api/auth' });
}

export function clearTokens(): void {
  const jar = cookies();
  jar.delete(env().SESSION_COOKIE_NAME);
  jar.delete({ name: env().REFRESH_COOKIE_NAME, path: '/api/auth' });
}
