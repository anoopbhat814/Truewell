import { describe, expect, it } from 'vitest';
import { documentsCreateSchema, documentsPatchSchema } from './schema';

const valid = {
    patientId: 'id_1',
    title: 'title value',
    category: 'category value',
    storageKey: 'storageKey value',
};

describe('Document schemas', () => {
  it('accepts a minimal valid payload', () => {
    expect(documentsCreateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects unknown keys', () => {
    expect(documentsCreateSchema.safeParse({ ...valid, isAdmin: true }).success).toBe(false);
  });

  it('requires patientId', () => {
    const { patientId: _omit, ...rest } = valid;
    expect(documentsCreateSchema.safeParse(rest).success).toBe(false);
  });

  it('allows partial patches but still validates types', () => {
    expect(documentsPatchSchema.safeParse({}).success).toBe(true);
    expect(documentsPatchSchema.safeParse({ patientId: 42 }).success).toBe(false);
  });
});
