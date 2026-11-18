import { NextRequest, NextResponse } from 'next/server';
import type { ZodTypeAny, z } from 'zod';
import { camelKeys, snakeKeys } from './case';
import { env } from './env';
import { getAccessToken } from './session';

interface ProxyOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  query?: URLSearchParams;
}

export function problem(status: number, code: string, message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

/** Forward a request to the Python API with the caller's bearer token and translate key casing. */
export async function proxyJson(req: NextRequest, path: string, opts: ProxyOptions = {}): Promise<NextResponse> {
  const token = getAccessToken();
  if (!token) return problem(401, 'unauthenticated', 'Sign in to continue');

  const url = new URL(`/api/v1${path}`, env().TRUEWELL_API_URL);
  (opts.query ?? req.nextUrl.searchParams).forEach((v, k) => url.searchParams.set(k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), v));

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: opts.method ?? 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Request-ID': req.headers.get('x-request-id') ?? crypto.randomUUID(),
      },
      body: opts.body === undefined ? undefined : JSON.stringify(snakeKeys(opts.body)),
      cache: 'no-store',
    });
  } catch {
    return problem(502, 'upstream_unavailable', 'The clinical API is temporarily unavailable');
  }

  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  const payload = await upstream.json().catch(() => ({}));
  const res = NextResponse.json(camelKeys(payload), { status: upstream.status });
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export function proxyList(req: NextRequest, path: string) {
  return proxyJson(req, path);
}

/** Parse and validate a JSON body before forwarding it. */
export async function validated<S extends ZodTypeAny>(
  req: NextRequest,
  schema: S,
  handler: (body: z.infer<S>) => Promise<NextResponse>,
): Promise<NextResponse> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return problem(400, 'invalid_json', 'Request body must be valid JSON');
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return problem(422, 'validation_failed', 'Some fields are invalid', { issues: parsed.error.flatten().fieldErrors });
  }
  return handler(parsed.data);
}
