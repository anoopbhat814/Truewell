import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy', async () => {
  const actual = await vi.importActual<typeof import('@/lib/proxy')>('@/lib/proxy');
  return { ...actual, proxyJson: vi.fn(async () => NextResponse.json({ ok: true })), proxyList: vi.fn(async () => NextResponse.json({ items: [] })) };
});

import { proxyJson } from '@/lib/proxy';
import { POST } from './route';

describe('/api/telehealth/sessions/[id]/end', () => {
  beforeEach(() => vi.mocked(proxyJson).mockClear());

  it('POST proxies to /telehealth/sessions/abc/end', async () => {
    await POST(new NextRequest('http://localhost/api/x', { method: 'POST' }), { params: { id: 'abc' } });
    const call = vi.mocked(proxyJson).mock.calls[0];
    expect(call?.[1]).toBe('/telehealth/sessions/abc/end');
    expect(call?.[2]).toMatchObject({ method: 'POST' });
  });
});
