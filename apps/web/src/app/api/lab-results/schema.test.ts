import { describe, expect, it } from 'vitest';
import { labResultsCreateSchema, labResultsPatchSchema } from './schema';

const valid = {
    orderId: 'id_1',
    analyte: 'analyte value',
    value: 1.5,
    unit: 'unit value',
};

describe('LabResult schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(labResultsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(labResultsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires orderId', () => {
    const { orderId: _omit, ...rest } = valid;
    expect(labResultsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(labResultsPatchSchema.safeParse({}).success).toBe(true);
    expect(labResultsPatchSchema.safeParse({ orderId: 42 }).success).toBe(false);
  });
});
