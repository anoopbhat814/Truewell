export interface Patient {
  id: string;
  userId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sexAtBirth: string | null;
  phone: string | null;
  preferredLang: string;
  primaryClinicianId: string | null;
}

export interface PatientInput {
  userId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sexAtBirth?: string | null;
  phone?: string | null;
  preferredLang?: string;
  primaryClinicianId?: string | null;
}

export type PatientPatch = Partial<PatientInput>;
