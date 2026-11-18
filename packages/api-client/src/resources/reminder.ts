import type { Page } from '@truewell/types';
import type { Reminder, ReminderInput, ReminderPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function remindersApi(http: HttpClient) {
  const base = '/api/reminders';
  return {
    list: (params?: ListParams) => http.get<Page<Reminder>>(base, params),
    get: (id: string) => http.get<Reminder>(`${base}/${id}`),
    create: (input: ReminderInput) => http.post<Reminder>(base, input),
    update: (id: string, patch: ReminderPatch) => http.patch<Reminder>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
