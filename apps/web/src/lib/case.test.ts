import { describe, expect, it } from 'vitest';
import { camelKeys, snakeKeys } from './case';

describe('case conversion', () => {
  it('converts nested keys both ways', () => {
    const camel = { patientId: 'p1', items: [{ startsAt: 'x', nestedValue: { isBooked: true } }] };
    const snake = snakeKeys(camel);
    expect(snake).toEqual({ patient_id: 'p1', items: [{ starts_at: 'x', nested_value: { is_booked: true } }] });
    expect(camelKeys(snake)).toEqual(camel);
  });

  it('leaves primitives and null untouched', () => {
    expect(camelKeys(null)).toBeNull();
    expect(snakeKeys('plain_text')).toBe('plain_text');
  });
});
