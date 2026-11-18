import { describe, expect, it } from 'vitest';
import { sessionFromToken } from './session';

function token(claims: Record<string, unknown>) {
  const enc = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${enc({ alg: 'HS256' })}.${enc(claims)}.sig`;
}

describe('sessionFromToken', () => {
  const now = Date.UTC(2025, 5, 1);
  const exp = Math.floor(now / 1000) + 600;

  it('decodes a live token', () => {
    const s = sessionFromToken(token({ sub: 'u1', role: 'PATIENT', pid: 'p1', cid: null, exp }), now);
    expect(s).toEqual({ userId: 'u1', role: 'PATIENT', patientId: 'p1', clinicianId: null });
  });

  it('rejects expired, malformed and missing tokens', () => {
    expect(sessionFromToken(token({ sub: 'u1', role: 'PATIENT', exp: exp - 1200 }), now)).toBeNull();
    expect(sessionFromToken('garbage', now)).toBeNull();
    expect(sessionFromToken(undefined, now)).toBeNull();
  });
});
