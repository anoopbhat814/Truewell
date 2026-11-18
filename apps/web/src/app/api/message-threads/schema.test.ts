import { describe, expect, it } from 'vitest';
import { messageThreadsCreateSchema, messageThreadsPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    subject: 'subject value',
};

describe('MessageThread schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(messageThreadsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(messageThreadsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(messageThreadsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(messageThreadsPatchSchema.safeParse({}).success).toBe(true);
    expect(messageThreadsPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
