import type { Page } from '@truewell/types';
import type { Document, DocumentInput, DocumentPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function documentsApi(http: HttpClient) {
  const base = '/api/documents';
  return {
    list: (params?: ListParams) => http.get<Page<Document>>(base, params),
    get: (id: string) => http.get<Document>(`${base}/${id}`),
    create: (input: DocumentInput) => http.post<Document>(base, input),
    update: (id: string, patch: DocumentPatch) => http.patch<Document>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
