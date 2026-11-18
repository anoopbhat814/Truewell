import type { AppointmentMode, AppointmentStatus } from './enums';

export interface Appointment {
  id: string;
  patientId: string;
  clinicianId: string;
  typeId: string;
  locationId: string | null;
  status: AppointmentStatus;
  mode: AppointmentMode;
  startsAt: string;
  endsAt: string;
  reason: string | null;
  cancelReason: string | null;
}

export interface AppointmentInput {
  patientId: string;
  clinicianId: string;
  typeId: string;
  locationId?: string | null;
  status?: AppointmentStatus;
  mode?: AppointmentMode;
  startsAt: string;
  endsAt: string;
  reason?: string | null;
  cancelReason?: string | null;
}

export type AppointmentPatch = Partial<AppointmentInput>;
