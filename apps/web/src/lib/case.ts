const toSnake = (s: string) => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (s: string) => s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

function convertKeys(value: unknown, fn: (k: string) => string): unknown {
  if (Array.isArray(value)) return value.map((v) => convertKeys(v, fn));
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [fn(k), convertKeys(v, fn)]));
  }
  return value;
}

/** The Python API speaks snake_case; the web layer speaks camelCase. */
export const snakeKeys = <T = unknown>(value: unknown): T => convertKeys(value, toSnake) as T;
export const camelKeys = <T = unknown>(value: unknown): T => convertKeys(value, toCamel) as T;
