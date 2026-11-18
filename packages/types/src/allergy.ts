export interface Allergy {
  id: string;
  patientId: string;
  substance: string;
  reaction: string | null;
  severity: string;
}

export interface AllergyInput {
  patientId: string;
  substance: string;
  reaction?: string | null;
  severity?: string;
}

export type AllergyPatch = Partial<AllergyInput>;
