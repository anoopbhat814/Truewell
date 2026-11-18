import type { AbnormalFlag } from './enums';

export interface LabResult {
  id: string;
  orderId: string;
  analyte: string;
  loincCode: string | null;
  value: number;
  unit: string;
  refLow: number | null;
  refHigh: number | null;
  flag: AbnormalFlag;
  releasedToPatient: boolean;
  resultedAt: string;
}

export interface LabResultInput {
  orderId: string;
  analyte: string;
  loincCode?: string | null;
  value: number;
  unit: string;
  refLow?: number | null;
  refHigh?: number | null;
  flag?: AbnormalFlag;
  releasedToPatient?: boolean;
}

export type LabResultPatch = Partial<LabResultInput>;
