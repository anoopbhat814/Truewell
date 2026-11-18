import type { PrescriptionStatus } from './enums';

export interface Prescription {
  id: string;
  patientId: string;
  clinicianId: string;
  medicationId: string;
  pharmacyId: string | null;
  status: PrescriptionStatus;
  dosage: string;
  frequency: string;
  quantity: number;
  refills: number;
  instructions: string | null;
  issuedAt: string | null;
  expiresAt: string | null;
}

export interface PrescriptionInput {
  patientId: string;
  clinicianId: string;
  medicationId: string;
  pharmacyId?: string | null;
  status?: PrescriptionStatus;
  dosage: string;
  frequency: string;
  quantity: number;
  refills?: number;
  instructions?: string | null;
  issuedAt?: string | null;
  expiresAt?: string | null;
}

export type PrescriptionPatch = Partial<PrescriptionInput>;
