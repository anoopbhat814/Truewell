import { describe, expect, it } from 'vitest';
import { insurancePoliciesCreateSchema, insurancePoliciesPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    payerName: 'payerName value',
    memberId: 'memberId value',
    planType: 'planType value',
    effectiveOn: '2025-06-02',
};

describe('InsurancePolicy schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(insurancePoliciesCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(insurancePoliciesCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(insurancePoliciesCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(insurancePoliciesPatchSchema.safeParse({}).success).toBe(true);
    expect(insurancePoliciesPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
