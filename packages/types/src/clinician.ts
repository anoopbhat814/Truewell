export interface Clinician {
  id: string;
  userId: string;
  organizationId: string;
  npi: string;
  specialty: string;
  title: string | null;
  acceptingNew: boolean;
}

export interface ClinicianInput {
  userId: string;
  organizationId: string;
  npi: string;
  specialty: string;
  title?: string | null;
  acceptingNew?: boolean;
}

export type ClinicianPatch = Partial<ClinicianInput>;
