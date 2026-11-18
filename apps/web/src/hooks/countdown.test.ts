import { describe, expect, it } from 'vitest';
import { formatCountdown } from './useCountdown';

describe('formatCountdown', () => {
  it('formats minutes and hours', () => {
    expect(formatCountdown(65)).toBe('01:05');
    expect(formatCountdown(3725)).toBe('1:02:05');
    expect(formatCountdown(-4)).toBe('00:00');
  });
});
