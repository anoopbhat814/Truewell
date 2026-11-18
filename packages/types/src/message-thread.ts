export interface MessageThread {
  id: string;
  patientId: string;
  clinicianId: string | null;
  subject: string;
  archived: boolean;
  lastMessageAt: string;
}

export interface MessageThreadInput {
  patientId: string;
  clinicianId?: string | null;
  subject: string;
  archived?: boolean;
}

export type MessageThreadPatch = Partial<MessageThreadInput>;
