import type { Page } from '@truewell/types';
import type { Appointment, AppointmentInput, AppointmentPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function appointmentsApi(http: HttpClient) {
  const base = '/api/appointments';
  return {
    list: (params?: ListParams) => http.get<Page<Appointment>>(base, params),
    get: (id: string) => http.get<Appointment>(`${base}/${id}`),
    create: (input: AppointmentInput) => http.post<Appointment>(base, input),
    update: (id: string, patch: AppointmentPatch) => http.patch<Appointment>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
