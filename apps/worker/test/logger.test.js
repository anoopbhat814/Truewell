'use strict';

const { logger } = require('../src/lib/logger');

test('log lines are JSON and redact sensitive keys', () => {
  const parsed = JSON.parse(logger.line('info', 'sent', { message: 'secret text', channel: 'SMS' }));
  expect(parsed.message).toBe('[redacted]');
  expect(parsed.channel).toBe('SMS');
  expect(parsed.level).toBe('info');
});
