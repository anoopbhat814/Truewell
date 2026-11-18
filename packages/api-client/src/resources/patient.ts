import type { Page } from '@truewell/types';
import type { Patient, PatientInput, PatientPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function patientsApi(http: HttpClient) {
  const base = '/api/patients';
  return {
    list: (params?: ListParams) => http.get<Page<Patient>>(base, params),
    get: (id: string) => http.get<Patient>(`${base}/${id}`),
    create: (input: PatientInput) => http.post<Patient>(base, input),
    update: (id: string, patch: PatientPatch) => http.patch<Patient>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
