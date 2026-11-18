import type { Page } from '@truewell/types';
import type { AvailabilitySlot, AvailabilitySlotInput, AvailabilitySlotPatch } from '@truewell/types';
import type { HttpClient, ListParams } from '../http';

export function availabilitySlotsApi(http: HttpClient) {
  const base = '/api/availability';
  return {
    list: (params?: ListParams) => http.get<Page<AvailabilitySlot>>(base, params),
    get: (id: string) => http.get<AvailabilitySlot>(`${base}/${id}`),
    create: (input: AvailabilitySlotInput) => http.post<AvailabilitySlot>(base, input),
    update: (id: string, patch: AvailabilitySlotPatch) => http.patch<AvailabilitySlot>(`${base}/${id}`, patch),
    remove: (id: string) => http.delete<void>(`${base}/${id}`),
  };
}
