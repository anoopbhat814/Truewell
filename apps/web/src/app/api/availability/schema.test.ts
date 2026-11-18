import { describe, expect, it } from 'vitest';
import { availabilitySlotsCreateSchema, availabilitySlotsPatchSchema } from './schema';

const valid = {
    clinicianId: 'id_1',
    startsAt: '2025-06-02T09:00:00Z',
    endsAt: '2025-06-02T09:00:00Z',
};

describe('AvailabilitySlot schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(availabilitySlotsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(availabilitySlotsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires clinicianId', () => {
    const { clinicianId: _omit, ...rest } = valid;
    expect(availabilitySlotsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(availabilitySlotsPatchSchema.safeParse({}).success).toBe(true);
    expect(availabilitySlotsPatchSchema.safeParse({ clinicianId: 42 }).success).toBe(false);
  });
});
