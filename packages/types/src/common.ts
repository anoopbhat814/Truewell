export interface Page<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
}

export interface ApiErrorBody {
  error: { code: string; message: string; details?: Record<string, unknown> };
}

export interface SessionUser {
  userId: string;
  role: import('./enums').Role;
  patientId: string | null;
  clinicianId: string | null;
  displayName?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  tokenType: 'bearer';
  expiresIn: number;
}

export interface OpenSlot {
  startsAt: string;
  endsAt: string;
}

export interface JoinTicket {
  room: string;
  url: string;
  token: string;
  expiresAt: number;
}

export interface CarePlanProgress {
  total: number;
  completed: number;
  percent: number;
}
