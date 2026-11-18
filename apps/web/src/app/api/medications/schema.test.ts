import { describe, expect, it } from 'vitest';
import { medicationsCreateSchema, medicationsPatchSchema } from './schema';

const valid = {
    rxnormCode: 'rxnormCode value',
    name: 'name value',
};

describe('Medication schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(medicationsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(medicationsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires rxnormCode', () => {
    const { rxnormCode: _omit, ...rest } = valid;
    expect(medicationsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(medicationsPatchSchema.safeParse({}).success).toBe(true);
    expect(medicationsPatchSchema.safeParse({ rxnormCode: 42 }).success).toBe(false);
  });
});
