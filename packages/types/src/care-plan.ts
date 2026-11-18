import type { CarePlanStatus } from './enums';

export interface CarePlan {
  id: string;
  patientId: string;
  clinicianId: string;
  title: string;
  status: CarePlanStatus;
  startsOn: string;
  endsOn: string | null;
  summary: string | null;
}

export interface CarePlanInput {
  patientId: string;
  clinicianId: string;
  title: string;
  status?: CarePlanStatus;
  startsOn: string;
  endsOn?: string | null;
  summary?: string | null;
}

export type CarePlanPatch = Partial<CarePlanInput>;
