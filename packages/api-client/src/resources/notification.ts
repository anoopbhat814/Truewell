import type { Page } from '@truewell/types';
import type { Notification, NotificationInput, NotificationPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function notificationsApi(http: HttpClient) {
  const base = '/api/notifications';
  return {
    list: (params?: ListParams) => http.get<Page<Notification>>(base, params),
    get: (id: string) => http.get<Notification>(`${base}/${id}`),
    create: (input: NotificationInput) => http.post<Notification>(base, input),
    update: (id: string, patch: NotificationPatch) => http.patch<Notification>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
