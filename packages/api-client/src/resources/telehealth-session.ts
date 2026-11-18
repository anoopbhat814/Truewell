import type { Page } from '@truewell/types';
import type { TelehealthSession, TelehealthSessionInput, TelehealthSessionPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function telehealthSessionsApi(http: HttpClient) {
  const base = '/api/telehealth/sessions';
  return {
    list: (params?: ListParams) => http.get<Page<TelehealthSession>>(base, params),
    get: (id: string) => http.get<TelehealthSession>(`${base}/${id}`),
    create: (input: TelehealthSessionInput) => http.post<TelehealthSession>(base, input),
    update: (id: string, patch: TelehealthSessionPatch) => http.patch<TelehealthSession>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
