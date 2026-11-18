import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { env } from '@/lib/env';
import { clearTokens } from '@/lib/session';

export async function POST() {
  const refresh = cookies().get(env().REFRESH_COOKIE_NAME)?.value;
  if (refresh) {
    await fetch(new URL('/api/v1/auth/logout', env().TRUEWELL_API_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    }).catch(() => undefined);
  }
  clearTokens();
  return new NextResponse(null, { status: 204 });
}
