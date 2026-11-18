import 'server-only';
import { camelKeys } from './case';
import { env } from './env';
import { getAccessToken } from './session';
import type { Page } from '@truewell/types';

export class ServerApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Query = Record<string, string | number | boolean | undefined>;

/** Server-component data fetching straight to the Python API using the caller's session cookie. */
export async function apiGet<T>(path: string, query: Query = {}): Promise<T> {
  const token = getAccessToken();
  if (!token) throw new ServerApiError(401, 'Not signed in');
  const url = new URL(`/api/v1${path}`, env().TRUEWELL_API_URL);
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) url.searchParams.set(k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`), String(v));
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) throw new ServerApiError(res.status, `API ${path} responded ${res.status}`);
  return camelKeys<T>(await res.json());
}

export async function apiList<T>(path: string, query: Query = {}): Promise<T[]> {
  const page = await apiGet<Page<T>>(path, { limit: 100, ...query });
  return page.items;
}
