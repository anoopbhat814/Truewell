import { describe, expect, it } from 'vitest';
import { vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() }),
}));

import { POST } from './route';

describe('/api/auth/refresh', () => {
  it('returns 401 when no refresh cookie is present', async () => {
    const res = await POST();
    expect(res.status).toBe(401);
    expect((await res.json()).error.code).toBe('unauthenticated');
  });
});
