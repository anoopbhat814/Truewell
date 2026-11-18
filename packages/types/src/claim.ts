import type { ClaimStatus } from './enums';

export interface Claim {
  id: string;
  patientId: string;
  policyId: string;
  appointmentId: string | null;
  status: ClaimStatus;
  totalCents: number;
  allowedCents: number | null;
  paidCents: number | null;
  denialCode: string | null;
  submittedAt: string | null;
  adjudicatedAt: string | null;
}

export interface ClaimInput {
  patientId: string;
  policyId: string;
  appointmentId?: string | null;
  status?: ClaimStatus;
  totalCents: number;
  allowedCents?: number | null;
  paidCents?: number | null;
  denialCode?: string | null;
  submittedAt?: string | null;
  adjudicatedAt?: string | null;
}

export type ClaimPatch = Partial<ClaimInput>;
