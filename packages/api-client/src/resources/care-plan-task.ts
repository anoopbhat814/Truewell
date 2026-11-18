import type { Page } from '@truewell/types';
import type { CarePlanTask, CarePlanTaskInput, CarePlanTaskPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function carePlanTasksApi(http: HttpClient) {
  const base = '/api/care-plan-tasks';
  return {
    list: (params?: ListParams) => http.get<Page<CarePlanTask>>(base, params),
    get: (id: string) => http.get<CarePlanTask>(`${base}/${id}`),
    create: (input: CarePlanTaskInput) => http.post<CarePlanTask>(base, input),
    update: (id: string, patch: CarePlanTaskPatch) => http.patch<CarePlanTask>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
