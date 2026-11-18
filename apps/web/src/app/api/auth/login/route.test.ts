import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() }),
}));

import { POST } from './route';

const post = (body: unknown) =>
  POST(new NextRequest('http://localhost/api/auth/login', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }));

describe('/api/auth/login', () => {
  it('rejects invalid emails before calling the API', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const res = await post({ email: 'not-an-email', password: 'x' });
    expect(res.status).toBe(422);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('passes upstream credential errors through', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { code: 'unauthenticated', message: 'Incorrect email or password' } }), { status: 401 }),
    );
    const res = await post({ email: 'sam.patel@patients.example', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('reports an unreachable API as 502', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('connect ECONNREFUSED'));
    expect((await post({ email: 'sam.patel@patients.example', password: 'pw' })).status).toBe(502);
  });
});
