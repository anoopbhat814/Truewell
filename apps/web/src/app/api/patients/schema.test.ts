import { describe, expect, it } from 'vitest';
import { patientsCreateSchema, patientsPatchSchema } from './schema';

const valid = {
    userId: 'id_1',
    mrn: 'mrn value',
    firstName: 'firstName value',
    lastName: 'lastName value',
    dateOfBirth: '2025-06-02',
};

describe('Patient schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(patientsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(patientsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires userId', () => {
    const { userId: _omit, ...rest } = valid;
    expect(patientsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(patientsPatchSchema.safeParse({}).success).toBe(true);
    expect(patientsPatchSchema.safeParse({ userId: 42 }).success).toBe(false);
  });
});
