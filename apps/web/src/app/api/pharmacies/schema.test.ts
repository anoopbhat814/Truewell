import { describe, expect, it } from 'vitest';
import { pharmaciesCreateSchema, pharmaciesPatchSchema } from './schema';

const valid = {
    name: 'name value',
    ncpdpId: 'ncpdpId value',
    city: 'city value',
    region: 'region value',
};

describe('Pharmacy schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(pharmaciesCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(pharmaciesCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires name', () => {
    const { name: _omit, ...rest } = valid;
    expect(pharmaciesCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(pharmaciesPatchSchema.safeParse({}).success).toBe(true);
    expect(pharmaciesPatchSchema.safeParse({ name: 42 }).success).toBe(false);
  });
});
