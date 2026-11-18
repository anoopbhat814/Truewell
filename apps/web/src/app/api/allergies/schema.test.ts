import { describe, expect, it } from 'vitest';
import { allergiesCreateSchema, allergiesPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    substance: 'substance value',
};

describe('Allergy schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(allergiesCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(allergiesCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(allergiesCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(allergiesPatchSchema.safeParse({}).success).toBe(true);
    expect(allergiesPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
