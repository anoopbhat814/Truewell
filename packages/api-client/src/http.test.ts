import { describe, expect, it, vi } from 'vitest';
import { ApiError, buildQuery, createHttpClient } from './http';

describe('buildQuery', () => {
  it('skips empty values and encodes the rest', () => {
    expect(buildQuery({ a: 1, b: '', c: undefined, d: 'x y' })).toBe('?a=1&d=x+y');
    expect(buildQuery()).toBe('');
  });
});

describe('createHttpClient', () => {
  it('parses JSON and sends the body', async () => {
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    const http = createHttpClient({ fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(http.post('/x', { a: 1 })).resolves.toEqual({ ok: true });
    const init = (fetchImpl.mock.calls[0] as unknown[])[1] as RequestInit;
    expect(init.body).toBe('{"a":1}');
  });

  it('throws ApiError with the server error envelope', async () => {
    const body = { error: { code: 'conflict', message: 'Slot taken' } };
    const fetchImpl = vi.fn(async () => new Response(JSON.stringify(body), { status: 409 }));
    const http = createHttpClient({ fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(http.get('/x')).rejects.toMatchObject({ status: 409, code: 'conflict', message: 'Slot taken' });
    await expect(http.get('/x')).rejects.toBeInstanceOf(ApiError);
  });

  it('returns undefined for 204', async () => {
    const fetchImpl = vi.fn(async () => new Response(null, { status: 204 }));
    const http = createHttpClient({ fetchImpl: fetchImpl as unknown as typeof fetch });
    await expect(http.delete('/x')).resolves.toBeUndefined();
  });
});
