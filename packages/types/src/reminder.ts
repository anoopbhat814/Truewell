import type { ReminderChannel, ReminderStatus } from './enums';

export interface Reminder {
  id: string;
  patientId: string;
  appointmentId: string | null;
  channel: ReminderChannel;
  status: ReminderStatus;
  message: string;
  sendAt: string;
  sentAt: string | null;
  attempts: number;
  lastError: string | null;
}

export interface ReminderInput {
  patientId: string;
  appointmentId?: string | null;
  channel: ReminderChannel;
  status?: ReminderStatus;
  message: string;
  sendAt: string;
  sentAt?: string | null;
  attempts?: number;
  lastError?: string | null;
}

export type ReminderPatch = Partial<ReminderInput>;
