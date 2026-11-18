import { describe, expect, it } from 'vitest';
import { claimsCreateSchema, claimsPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    policyId: 'id_1',
    totalCents: 1,
};

describe('Claim schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(claimsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(claimsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(claimsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(claimsPatchSchema.safeParse({}).success).toBe(true);
    expect(claimsPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
