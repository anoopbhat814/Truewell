import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() }),
}));

import { POST } from './route';

describe('/api/auth/logout', () => {
  it('always answers 204 and does not call the API without a refresh cookie', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    const res = await POST();
    expect(res.status).toBe(204);
    expect(spy).not.toHaveBeenCalled();
  });
});
