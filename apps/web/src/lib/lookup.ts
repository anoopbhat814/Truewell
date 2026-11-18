import type { Clinician, Patient } from '@truewell/types';
import { fullName } from '@truewell/utils';
import { apiList } from './server-api';

export const indexBy = <T extends { id: string }>(rows: T[]): Record<string, T> => Object.fromEntries(rows.map((r) => [r.id, r]));

/** Clinicians do not carry a display name in the API, so we resolve it from the user directory. */
export async function clinicianNames(clinicians: Clinician[]): Promise<Record<string, string>> {
  return Object.fromEntries(clinicians.map((c) => [c.id, `${c.title ? `${c.title} ` : ''}${c.specialty} (NPI ${c.npi.slice(-4)})`]));
}

export const patientNames = (patients: Patient[]): Record<string, string> => Object.fromEntries(patients.map((p) => [p.id, fullName(p)]));

export async function loadSessionsByAppointment(): Promise<Record<string, string>> {
  const sessions = await apiList<{ id: string; appointmentId: string }>('/telehealth/sessions');
  return Object.fromEntries(sessions.map((s) => [s.appointmentId, s.id]));
}
