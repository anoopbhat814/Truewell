import { describe, expect, it } from 'vitest';
import { prescriptionsCreateSchema, prescriptionsPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    clinicianId: 'id_1',
    medicationId: 'id_1',
    dosage: 'dosage value',
    frequency: 'frequency value',
    quantity: 1,
};

describe('Prescription schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(prescriptionsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(prescriptionsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(prescriptionsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(prescriptionsPatchSchema.safeParse({}).success).toBe(true);
    expect(prescriptionsPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
