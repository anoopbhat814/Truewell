import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/session', () => ({ getSession: vi.fn() }));

import { getSession } from '@/lib/session';
import { GET } from './route';

describe('/api/auth/me', () => {
  it('returns 401 without a session', async () => {
    vi.mocked(getSession).mockReturnValue(null);
    expect((await GET()).status).toBe(401);
  });

  it('returns the session user with no-store caching', async () => {
    vi.mocked(getSession).mockReturnValue({ userId: 'u1', role: 'PATIENT', patientId: 'p1', clinicianId: null });
    const res = await GET();
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toMatchObject({ role: 'PATIENT', patientId: 'p1' });
  });
});
