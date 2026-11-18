import { describe, expect, it } from 'vitest';
import { labOrdersCreateSchema, labOrdersPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    clinicianId: 'id_1',
    panelCode: 'panelCode value',
};

describe('LabOrder schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(labOrdersCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(labOrdersCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(labOrdersCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(labOrdersPatchSchema.safeParse({}).success).toBe(true);
    expect(labOrdersPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
