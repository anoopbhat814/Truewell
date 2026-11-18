import type { Page } from '@truewell/types';
import type { LabResult, LabResultInput, LabResultPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function labResultsApi(http: HttpClient) {
  const base = '/api/lab-results';
  return {
    list: (params?: ListParams) => http.get<Page<LabResult>>(base, params),
    get: (id: string) => http.get<LabResult>(`${base}/${id}`),
    create: (input: LabResultInput) => http.post<LabResult>(base, input),
    update: (id: string, patch: LabResultPatch) => http.patch<LabResult>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
