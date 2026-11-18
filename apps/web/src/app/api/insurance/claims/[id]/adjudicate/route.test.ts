import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy', async () => {
  const actual = await vi.importActual<typeof import('@/lib/proxy')>('@/lib/proxy');
  return { ...actual, proxyJson: vi.fn(async () => NextResponse.json({ ok: true })), proxyList: vi.fn(async () => NextResponse.json({ items: [] })) };
});

import { proxyJson } from '@/lib/proxy';
import { POST } from './route';

const ctx = { params: { id: 'abc' } };

describe('/api/insurance/claims/[id]/adjudicate', () => {
  beforeEach(() => vi.mocked(proxyJson).mockClear());

  it('forwards a valid adjudication', async () => {
    await POST(new NextRequest('http://localhost/x', { method: 'POST', body: JSON.stringify({"allowedCents": 800}), headers: { 'content-type': 'application/json' } }), ctx);
    expect(vi.mocked(proxyJson).mock.calls[0]?.[1]).toBe('/insurance/claims/abc/adjudicate');
  });

  it('rejects negative amounts', async () => {
    expect((await POST(new NextRequest('http://localhost/x', { method: 'POST', body: JSON.stringify({"allowedCents": -1}), headers: { 'content-type': 'application/json' } }), ctx)).status).toBe(422);
    expect(proxyJson).not.toHaveBeenCalled();
  });
});
