import type { Page } from '@truewell/types';
import type { Claim, ClaimInput, ClaimPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function claimsApi(http: HttpClient) {
  const base = '/api/insurance/claims';
  return {
    list: (params?: ListParams) => http.get<Page<Claim>>(base, params),
    get: (id: string) => http.get<Claim>(`${base}/${id}`),
    create: (input: ClaimInput) => http.post<Claim>(base, input),
    update: (id: string, patch: ClaimPatch) => http.patch<Claim>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
