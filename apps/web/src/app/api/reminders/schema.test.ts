import { describe, expect, it } from 'vitest';
import { remindersCreateSchema, remindersPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    channel: 'EMAIL',
    message: 'message value',
    sendAt: '2025-06-02T09:00:00Z',
};

describe('Reminder schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(remindersCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(remindersCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(remindersCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(remindersPatchSchema.safeParse({}).success).toBe(true);
    expect(remindersPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
