export interface Medication {
  id: string;
  rxnormCode: string;
  name: string;
  strength: string | null;
  form: string | null;
  isControlled: boolean;
}

export interface MedicationInput {
  rxnormCode: string;
  name: string;
  strength?: string | null;
  form?: string | null;
  isControlled?: boolean;
}

export type MedicationPatch = Partial<MedicationInput>;
