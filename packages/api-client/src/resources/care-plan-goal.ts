import type { Page } from '@truewell/types';
import type { CarePlanGoal, CarePlanGoalInput, CarePlanGoalPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function carePlanGoalsApi(http: HttpClient) {
  const base = '/api/care-plan-goals';
  return {
    list: (params?: ListParams) => http.get<Page<CarePlanGoal>>(base, params),
    get: (id: string) => http.get<CarePlanGoal>(`${base}/${id}`),
    create: (input: CarePlanGoalInput) => http.post<CarePlanGoal>(base, input),
    update: (id: string, patch: CarePlanGoalPatch) => http.patch<CarePlanGoal>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
