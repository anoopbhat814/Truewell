import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy', async () => {
  const actual = await vi.importActual<typeof import('@/lib/proxy')>('@/lib/proxy');
  return { ...actual, proxyJson: vi.fn(async () => NextResponse.json({ ok: true })), proxyList: vi.fn(async () => NextResponse.json({ items: [] })) };
});

import { proxyJson } from '@/lib/proxy';
import { DELETE, GET, PATCH } from './route';

const ctx = { params: { id: 'abc 1' } };

describe('/api/clinicians/[id]', () => {
  beforeEach(() => vi.mocked(proxyJson).mockClear());

  it('GET forwards with an encoded identifier', async () => {
    await GET(new NextRequest('http://localhost/api/clinicians/abc', { method: 'GET' }), ctx);
    expect(vi.mocked(proxyJson).mock.calls[0]?.[1]).toBe('/clinicians/abc%201');
  });

  it('PATCH rejects unknown fields before reaching the API', async () => {
    const res = await PATCH(new NextRequest('http://localhost/api/clinicians/abc', { method: 'PATCH', body: JSON.stringify({"notAField": true}), headers: { 'content-type': 'application/json' } }), ctx);
    expect(res.status).toBe(422);
    expect(proxyJson).not.toHaveBeenCalled();
  });

  it('PATCH rejects malformed JSON', async () => {
    const bad = new NextRequest('http://localhost/api/clinicians/abc', { method: 'PATCH', body: '{oops', headers: { 'content-type': 'application/json' } });
    expect((await PATCH(bad, ctx)).status).toBe(400);
  });

  it('DELETE uses the DELETE method', async () => {
    await DELETE(new NextRequest('http://localhost/api/clinicians/abc', { method: 'DELETE' }), ctx);
    expect(vi.mocked(proxyJson).mock.calls[0]?.[2]).toMatchObject({ method: 'DELETE' });
  });
});
