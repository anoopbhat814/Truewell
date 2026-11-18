import { describe, expect, it } from 'vitest';
import { carePlanGoalsCreateSchema, carePlanGoalsPatchSchema } from './schema';

const valid = {
    carePlanId: 'id_1',
    description: 'description value',
};

describe('CarePlanGoal schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(carePlanGoalsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(carePlanGoalsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires carePlanId', () => {
    const { carePlanId: _omit, ...rest } = valid;
    expect(carePlanGoalsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(carePlanGoalsPatchSchema.safeParse({}).success).toBe(true);
    expect(carePlanGoalsPatchSchema.safeParse({ carePlanId: 42 }).success).toBe(false);
  });
});
