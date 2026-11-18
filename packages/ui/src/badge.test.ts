import { describe, expect, it } from 'vitest';
import { statusTone } from './Badge';
import { cx } from './cx';

describe('statusTone', () => {
  it('maps clinical and billing states to tones', () => {
    expect(statusTone('CRITICAL_HIGH')).toBe('danger');
    expect(statusTone('PAID')).toBe('success');
    expect(statusTone('REQUESTED')).toBe('warning');
    expect(statusTone('SOMETHING_NEW')).toBe('neutral');
  });
});

describe('cx', () => {
  it('drops falsy parts', () => {
    expect(cx('a', false, undefined, 'b', null)).toBe('a b');
  });
});
