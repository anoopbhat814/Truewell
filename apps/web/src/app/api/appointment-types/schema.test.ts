import { describe, expect, it } from 'vitest';
import { appointmentTypesCreateSchema, appointmentTypesPatchSchema } from './schema';

const valid = {
    code: 'code value',
    label: 'label value',
    durationMinutes: 1,
};

describe('AppointmentType schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(appointmentTypesCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(appointmentTypesCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires code', () => {
    const { code: _omit, ...rest } = valid;
    expect(appointmentTypesCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(appointmentTypesPatchSchema.safeParse({}).success).toBe(true);
    expect(appointmentTypesPatchSchema.safeParse({ code: 42 }).success).toBe(false);
  });
});
