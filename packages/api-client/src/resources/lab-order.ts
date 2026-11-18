import type { Page } from '@truewell/types';
import type { LabOrder, LabOrderInput, LabOrderPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function labOrdersApi(http: HttpClient) {
  const base = '/api/lab-orders';
  return {
    list: (params?: ListParams) => http.get<Page<LabOrder>>(base, params),
    get: (id: string) => http.get<LabOrder>(`${base}/${id}`),
    create: (input: LabOrderInput) => http.post<LabOrder>(base, input),
    update: (id: string, patch: LabOrderPatch) => http.patch<LabOrder>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
