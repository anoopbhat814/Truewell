const REDACT = new Set(['password', 'token', 'accessToken', 'refreshToken', 'memberId', 'dateOfBirth']);

function scrub(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(scrub);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, REDACT.has(k) ? '[redacted]' : scrub(v)]),
    );
  }
  return value;
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => console.info(JSON.stringify({ level: 'info', msg, ...(scrub(ctx) as object) })),
  warn: (msg: string, ctx?: Record<string, unknown>) => console.warn(JSON.stringify({ level: 'warn', msg, ...(scrub(ctx) as object) })),
  error: (msg: string, ctx?: Record<string, unknown>) => console.error(JSON.stringify({ level: 'error', msg, ...(scrub(ctx) as object) })),
};
