import type { Page } from '@truewell/types';
import type { Message, MessageInput, MessagePatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function messagesApi(http: HttpClient) {
  const base = '/api/messages';
  return {
    list: (params?: ListParams) => http.get<Page<Message>>(base, params),
    get: (id: string) => http.get<Message>(`${base}/${id}`),
    create: (input: MessageInput) => http.post<Message>(base, input),
    update: (id: string, patch: MessagePatch) => http.patch<Message>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
