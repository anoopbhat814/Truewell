import { describe, expect, it } from 'vitest';
import { carePlanTasksCreateSchema, carePlanTasksPatchSchema } from './schema';

const valid = {
    carePlanId: 'id_1',
    title: 'title value',
};

describe('CarePlanTask schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(carePlanTasksCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(carePlanTasksCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires carePlanId', () => {
    const { carePlanId: _omit, ...rest } = valid;
    expect(carePlanTasksCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(carePlanTasksPatchSchema.safeParse({}).success).toBe(true);
    expect(carePlanTasksPatchSchema.safeParse({ carePlanId: 42 }).success).toBe(false);
  });
});
