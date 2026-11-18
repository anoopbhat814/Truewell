import type { Page } from '@truewell/types';
import type { Medication, MedicationInput, MedicationPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function medicationsApi(http: HttpClient) {
  const base = '/api/medications';
  return {
    list: (params?: ListParams) => http.get<Page<Medication>>(base, params),
    get: (id: string) => http.get<Medication>(`${base}/${id}`),
    create: (input: MedicationInput) => http.post<Medication>(base, input),
    update: (id: string, patch: MedicationPatch) => http.patch<Medication>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
