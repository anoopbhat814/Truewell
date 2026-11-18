import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { camelKeys } from '@/lib/case';
import { env } from '@/lib/env';
import { logger } from '@/lib/logger';
import { problem, validated } from '@/lib/proxy';
import { storeTokens } from '@/lib/session';
import type { TokenPair } from '@truewell/types';

const schema = z.object({ email: z.string().email(), password: z.string().min(1).max(256) }).strict();

export async function POST(req: NextRequest) {
  return validated(req, schema, async (body) => {
    const upstream = await fetch(new URL('/api/v1/auth/login', env().TRUEWELL_API_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': req.headers.get('user-agent') ?? 'truewell-web' },
      body: JSON.stringify(body),
    }).catch(() => null);

    if (!upstream) return problem(502, 'upstream_unavailable', 'Sign-in is temporarily unavailable');
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      logger.warn('login rejected', { status: upstream.status });
      return NextResponse.json(payload, { status: upstream.status });
    }
    storeTokens(camelKeys<TokenPair>(payload));
    return NextResponse.json({ ok: true });
  });
}
