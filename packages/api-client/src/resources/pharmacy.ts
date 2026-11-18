import type { Page } from '@truewell/types';
import type { Pharmacy, PharmacyInput, PharmacyPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function pharmaciesApi(http: HttpClient) {
  const base = '/api/pharmacies';
  return {
    list: (params?: ListParams) => http.get<Page<Pharmacy>>(base, params),
    get: (id: string) => http.get<Pharmacy>(`${base}/${id}`),
    create: (input: PharmacyInput) => http.post<Pharmacy>(base, input),
    update: (id: string, patch: PharmacyPatch) => http.patch<Pharmacy>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
