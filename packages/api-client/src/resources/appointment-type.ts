import type { Page } from '@truewell/types';
import type { AppointmentType, AppointmentTypeInput, AppointmentTypePatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function appointmentTypesApi(http: HttpClient) {
  const base = '/api/appointment-types';
  return {
    list: (params?: ListParams) => http.get<Page<AppointmentType>>(base, params),
    get: (id: string) => http.get<AppointmentType>(`${base}/${id}`),
    create: (input: AppointmentTypeInput) => http.post<AppointmentType>(base, input),
    update: (id: string, patch: AppointmentTypePatch) => http.patch<AppointmentType>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
