import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => undefined, set: vi.fn(), delete: vi.fn() }),
}));

import { POST } from './route';

const valid = {
  email: 'new.patient@patients.example',
  password: 'Str0ng-Passphrase!',
  displayName: 'New Patient',
  firstName: 'New',
  lastName: 'Patient',
  dateOfBirth: '1988-02-29',
};
const post = (body: unknown) =>
  POST(new NextRequest('http://localhost/api/auth/register', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }));

describe('/api/auth/register', () => {
  it('requires a 12 character password', async () => {
    expect((await post({ ...valid, password: 'short' })).status).toBe(422);
  });

  it('requires an ISO date of birth', async () => {
    expect((await post({ ...valid, dateOfBirth: '29/02/1988' })).status).toBe(422);
  });

  it('converts keys to snake_case for the API', async () => {
    const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(JSON.stringify({ id: 'u1' }), { status: 201 }));
    expect((await post(valid)).status).toBe(201);
    const sent = JSON.parse((spy.mock.calls[0]?.[1] as RequestInit).body as string);
    expect(sent).toMatchObject({ display_name: 'New Patient', date_of_birth: '1988-02-29' });
  });
});
