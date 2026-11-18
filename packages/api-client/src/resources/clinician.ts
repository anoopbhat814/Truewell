import type { Page } from '@truewell/types';
import type { Clinician, ClinicianInput, ClinicianPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function cliniciansApi(http: HttpClient) {
  const base = '/api/clinicians';
  return {
    list: (params?: ListParams) => http.get<Page<Clinician>>(base, params),
    get: (id: string) => http.get<Clinician>(`${base}/${id}`),
    create: (input: ClinicianInput) => http.post<Clinician>(base, input),
    update: (id: string, patch: ClinicianPatch) => http.patch<Clinician>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
