import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { snakeKeys } from '@/lib/case';
import { problem, validated } from '@/lib/proxy';

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(12).max(256),
    displayName: z.string().min(1).max(120),
    firstName: z.string().min(1).max(80),
    lastName: z.string().min(1).max(80),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
  .strict();

export async function POST(req: NextRequest) {
  return validated(req, schema, async (body) => {
    const upstream = await fetch(new URL('/api/v1/auth/register', env().TRUEWELL_API_URL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeKeys(body)),
    }).catch(() => null);
    if (!upstream) return problem(502, 'upstream_unavailable', 'Registration is temporarily unavailable');
    return NextResponse.json(await upstream.json().catch(() => ({})), { status: upstream.status });
  });
}
