import type { LabStatus } from './enums';

export interface LabOrder {
  id: string;
  patientId: string;
  clinicianId: string;
  status: LabStatus;
  panelCode: string;
  collectedAt: string | null;
}

export interface LabOrderInput {
  patientId: string;
  clinicianId: string;
  status?: LabStatus;
  panelCode: string;
  collectedAt?: string | null;
}

export type LabOrderPatch = Partial<LabOrderInput>;
