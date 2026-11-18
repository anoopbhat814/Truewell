import { describe, expect, it } from 'vitest';
import { appointmentsCreateSchema, appointmentsPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    clinicianId: 'id_1',
    typeId: 'id_1',
    startsAt: '2025-06-02T09:00:00Z',
    endsAt: '2025-06-02T09:00:00Z',
};

describe('Appointment schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(appointmentsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(appointmentsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(appointmentsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(appointmentsPatchSchema.safeParse({}).success).toBe(true);
    expect(appointmentsPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
