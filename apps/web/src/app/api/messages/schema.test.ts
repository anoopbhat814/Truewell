import { describe, expect, it } from 'vitest';
import { messagesCreateSchema, messagesPatchSchema } from './schema';

const valid = {
    threadId: 'id_1',
    body: 'Hello there',
};

describe('Message schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(messagesCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(messagesCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires threadId', () => {
    const { threadId: _omit, ...rest } = valid;
    expect(messagesCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(messagesPatchSchema.safeParse({}).success).toBe(true);
    expect(messagesPatchSchema.safeParse({ threadId: 42 }).success).toBe(false);
  });
});
