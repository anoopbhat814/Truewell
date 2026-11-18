import type { Page } from '@truewell/types';
import type { Prescription, PrescriptionInput, PrescriptionPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function prescriptionsApi(http: HttpClient) {
  const base = '/api/prescriptions';
  return {
    list: (params?: ListParams) => http.get<Page<Prescription>>(base, params),
    get: (id: string) => http.get<Prescription>(`${base}/${id}`),
    create: (input: PrescriptionInput) => http.post<Prescription>(base, input),
    update: (id: string, patch: PrescriptionPatch) => http.patch<Prescription>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
