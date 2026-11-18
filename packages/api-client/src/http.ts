import type { ApiErrorBody } from '@truewell/types';

export type ListParams = Record<string, string | number | boolean | undefined | null>;

export interface HttpClientOptions {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  get isUnauthenticated() {
    return this.status === 401;
  }
}

export interface HttpClient {
  get<T>(path: string, params?: ListParams): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
}

export function buildQuery(params?: ListParams): string {
  if (!params) return '';
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export function createHttpClient(options: HttpClientOptions = {}): HttpClient {
  const { baseUrl = '', fetchImpl = (...args) => fetch(...args), getHeaders } = options;

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const extra = getHeaders ? await getHeaders() : {};
    const res = await fetchImpl(`${baseUrl}${path}`, {
      method,
      credentials: 'same-origin',
      headers: { Accept: 'application/json', ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...extra },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    const payload = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      const err = (payload as ApiErrorBody | undefined)?.error;
      throw new ApiError(res.status, err?.code ?? 'unknown_error', err?.message ?? res.statusText, err?.details);
    }
    return payload as T;
  }

  return {
    get: (path, params) => request('GET', `${path}${buildQuery(params)}`),
    post: (path, body) => request('POST', path, body),
    patch: (path, body) => request('PATCH', path, body),
    delete: (path) => request('DELETE', path),
  };
}
