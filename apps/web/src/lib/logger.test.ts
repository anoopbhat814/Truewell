import { afterEach, describe, expect, it, vi } from 'vitest';
import { logger } from './logger';

afterEach(() => vi.restoreAllMocks());

describe('logger', () => {
  it('redacts sensitive fields recursively', () => {
    const spy = vi.spyOn(console, 'info').mockImplementation(() => undefined);
    logger.info('login', { user: { token: 'abc', name: 'ok' }, memberId: 'EHP-1' });
    const line = JSON.parse(spy.mock.calls[0]![0] as string);
    expect(line.user).toEqual({ token: '[redacted]', name: 'ok' });
    expect(line.memberId).toBe('[redacted]');
  });
});
