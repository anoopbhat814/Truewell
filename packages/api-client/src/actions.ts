import type { Appointment, Claim, JoinTicket, OpenSlot, Prescription, CarePlanProgress, TelehealthSession } from '@truewell/types';
import type { HttpClient } from './http';

/** Non-CRUD endpoints (state transitions and computed views). */
export function actionsApi(http: HttpClient) {
  return {
    openSlots: (clinicianId: string, day: string, minutes = 20) =>
      http.get<OpenSlot[]>('/api/scheduling/open-slots', { clinicianId, day, minutes }),
    cancelAppointment: (id: string, reason: string) =>
      http.patch<Appointment>(`/api/appointments/${id}`, { status: 'CANCELLED', cancelReason: reason }),
    joinSession: (id: string) => http.post<JoinTicket>(`/api/telehealth/sessions/${id}/join`),
    endSession: (id: string) => http.post<TelehealthSession>(`/api/telehealth/sessions/${id}/end`),
    sendPrescription: (id: string) => http.post<Prescription>(`/api/prescriptions/${id}/send`),
    cancelPrescription: (id: string) => http.post<Prescription>(`/api/prescriptions/${id}/cancel`),
    carePlanProgress: (id: string) => http.get<CarePlanProgress>(`/api/care-plans/${id}/progress`),
    markMessageRead: (id: string) => http.post(`/api/messages/${id}/read`),
    submitClaim: (id: string) => http.post<Claim>(`/api/insurance/claims/${id}/submit`),
    adjudicateClaim: (id: string, allowedCents: number, denialCode?: string) =>
      http.post<Claim>(`/api/insurance/claims/${id}/adjudicate`, { allowedCents, denialCode }),
  };
}
