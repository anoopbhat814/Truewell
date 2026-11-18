import type { Page } from '@truewell/types';
import type { MessageThread, MessageThreadInput, MessageThreadPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function messageThreadsApi(http: HttpClient) {
  const base = '/api/message-threads';
  return {
    list: (params?: ListParams) => http.get<Page<MessageThread>>(base, params),
    get: (id: string) => http.get<MessageThread>(`${base}/${id}`),
    create: (input: MessageThreadInput) => http.post<MessageThread>(base, input),
    update: (id: string, patch: MessageThreadPatch) => http.patch<MessageThread>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
