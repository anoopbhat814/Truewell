'use strict';

const REDACT = new Set(['password', 'token', 'memberId', 'body', 'message']);

function line(level, msg, ctx = {}) {
  const safe = Object.fromEntries(Object.entries(ctx).map(([k, v]) => [k, REDACT.has(k) ? '[redacted]' : v]));
  return JSON.stringify({ ts: new Date().toISOString(), level, msg, ...safe });
}

const logger = {
  info: (msg, ctx) => console.info(line('info', msg, ctx)),
  warn: (msg, ctx) => console.warn(line('warn', msg, ctx)),
  error: (msg, ctx) => console.error(line('error', msg, ctx)),
  line,
};

module.exports = { logger };
