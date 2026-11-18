import type { SessionStatus } from './enums';

export interface TelehealthSession {
  id: string;
  appointmentId: string;
  roomName: string;
  status: SessionStatus;
  startedAt: string | null;
  endedAt: string | null;
  recordingConsent: boolean;
}

export interface TelehealthSessionInput {
  appointmentId: string;
  roomName: string;
  status?: SessionStatus;
  startedAt?: string | null;
  endedAt?: string | null;
  recordingConsent?: boolean;
}

export type TelehealthSessionPatch = Partial<TelehealthSessionInput>;
