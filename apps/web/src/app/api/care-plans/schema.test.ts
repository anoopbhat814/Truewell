import { describe, expect, it } from 'vitest';
import { carePlansCreateSchema, carePlansPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    clinicianId: 'id_1',
    title: 'title value',
    startsOn: '2025-06-02',
};

describe('CarePlan schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(carePlansCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(carePlansCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(carePlansCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(carePlansPatchSchema.safeParse({}).success).toBe(true);
    expect(carePlansPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
