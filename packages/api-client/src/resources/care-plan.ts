import type { Page } from '@truewell/types';
import type { CarePlan, CarePlanInput, CarePlanPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function carePlansApi(http: HttpClient) {
  const base = '/api/care-plans';
  return {
    list: (params?: ListParams) => http.get<Page<CarePlan>>(base, params),
    get: (id: string) => http.get<CarePlan>(`${base}/${id}`),
    create: (input: CarePlanInput) => http.post<CarePlan>(base, input),
    update: (id: string, patch: CarePlanPatch) => http.patch<CarePlan>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
