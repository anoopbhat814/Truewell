import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { TokenPair } from '@truewell/types';
import { camelKeys } from '@/lib/case';
import { env } from '@/lib/env';
import { problem } from '@/lib/proxy';
import { clearTokens, storeTokens } from '@/lib/session';

export async function POST() {
  const refresh = cookies().get(env().REFRESH_COOKIE_NAME)?.value;
  if (!refresh) return problem(401, 'unauthenticated', 'No refresh token');

  const upstream = await fetch(new URL('/api/v1/auth/refresh', env().TRUEWELL_API_URL), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refresh }),
  }).catch(() => null);

  if (!upstream?.ok) {
    clearTokens();
    return problem(401, 'unauthenticated', 'Session expired, please sign in again');
  }
  storeTokens(camelKeys<TokenPair>(await upstream.json()));
  return NextResponse.json({ ok: true });
}
