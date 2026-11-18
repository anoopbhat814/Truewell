import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy', async () => {
  const actual = await vi.importActual<typeof import('@/lib/proxy')>('@/lib/proxy');
  return { ...actual, proxyJson: vi.fn(async () => NextResponse.json({ ok: true })), proxyList: vi.fn(async () => NextResponse.json({ items: [] })) };
});

import { proxyJson } from '@/lib/proxy';
import { GET } from './route';

describe('/api/care-plans/[id]/progress', () => {
  beforeEach(() => vi.mocked(proxyJson).mockClear());

  it('GET proxies to /care-plans/abc/progress', async () => {
    await GET(new NextRequest('http://localhost/api/x', { method: 'GET' }), { params: { id: 'abc' } });
    const call = vi.mocked(proxyJson).mock.calls[0];
    expect(call?.[1]).toBe('/care-plans/abc/progress');
    expect(call?.[2]).toMatchObject({ method: 'GET' });
  });
});
