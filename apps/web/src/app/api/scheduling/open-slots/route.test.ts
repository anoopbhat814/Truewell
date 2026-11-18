import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/proxy', async () => {
  const actual = await vi.importActual<typeof import('@/lib/proxy')>('@/lib/proxy');
  return { ...actual, proxyJson: vi.fn(async () => NextResponse.json({ ok: true })), proxyList: vi.fn(async () => NextResponse.json({ items: [] })) };
});

import { proxyJson } from '@/lib/proxy';
import { GET } from './route';

describe('/api/scheduling/open-slots', () => {
  beforeEach(() => vi.mocked(proxyJson).mockClear());

  it('requires clinicianId and a valid day', async () => {
    const res = await GET(new NextRequest('http://localhost/api/scheduling/open-slots?day=tomorrow'));
    expect(res.status).toBe(422);
  });

  it('forwards a normalised query with the default slot length', async () => {
    await GET(new NextRequest('http://localhost/api/scheduling/open-slots?clinicianId=c1&day=2025-06-02'));
    const opts = vi.mocked(proxyJson).mock.calls[0]?.[2] as { query: URLSearchParams };
    expect(opts.query.get('minutes')).toBe('20');
    expect(opts.query.get('clinicianId')).toBe('c1');
  });
});
