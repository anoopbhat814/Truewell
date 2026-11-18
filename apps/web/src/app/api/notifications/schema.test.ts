import { describe, expect, it } from 'vitest';
import { notificationsCreateSchema, notificationsPatchSchema } from './schema';

const valid = {
    userId: 'id_1',
    kind: 'SYSTEM',
    title: 'title value',
    body: 'Hello there',
};

describe('Notification schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(notificationsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(notificationsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires userId', () => {
    const { userId: _omit, ...rest } = valid;
    expect(notificationsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(notificationsPatchSchema.safeParse({}).success).toBe(true);
    expect(notificationsPatchSchema.safeParse({ userId: 42 }).success).toBe(false);
  });
});
