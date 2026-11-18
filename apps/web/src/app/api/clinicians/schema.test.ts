import { describe, expect, it } from 'vitest';
import { cliniciansCreateSchema, cliniciansPatchSchema } from './schema';

const valid = {
    userId: 'id_1',
    organizationId: 'id_1',
    npi: 'npi value',
    specialty: 'specialty value',
};

describe('Clinician schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(cliniciansCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(cliniciansCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires userId', () => {
    const { userId: _omit, ...rest } = valid;
    expect(cliniciansCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(cliniciansPatchSchema.safeParse({}).success).toBe(true);
    expect(cliniciansPatchSchema.safeParse({ userId: 42 }).success).toBe(false);
  });
});
