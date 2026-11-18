import { describe, expect, it } from 'vitest';
import { telehealthSessionsCreateSchema, telehealthSessionsPatchSchema } from './schema';

const valid = {
    appointmentId: 'id_1',
    roomName: 'roomName value',
};

describe('TelehealthSession schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(telehealthSessionsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(telehealthSessionsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires appointmentId', () => {
    const { appointmentId: _omit, ...rest } = valid;
    expect(telehealthSessionsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(telehealthSessionsPatchSchema.safeParse({}).success).toBe(true);
    expect(telehealthSessionsPatchSchema.safeParse({ appointmentId: 42 }).success).toBe(false);
  });
});
