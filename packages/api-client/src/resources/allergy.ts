import type { Page } from '@truewell/types';
import type { Allergy, AllergyInput, AllergyPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function allergiesApi(http: HttpClient) {
  const base = '/api/allergies';
  return {
    list: (params?: ListParams) => http.get<Page<Allergy>>(base, params),
    get: (id: string) => http.get<Allergy>(`${base}/${id}`),
    create: (input: AllergyInput) => http.post<Allergy>(base, input),
    update: (id: string, patch: AllergyPatch) => http.patch<Allergy>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
