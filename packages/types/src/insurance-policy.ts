export interface InsurancePolicy {
  id: string;
  patientId: string;
  payerName: string;
  memberId: string;
  groupNumber: string | null;
  planType: string;
  copayCents: number;
  deductibleCents: number;
  effectiveOn: string;
  terminatesOn: string | null;
}

export interface InsurancePolicyInput {
  patientId: string;
  payerName: string;
  memberId: string;
  groupNumber?: string | null;
  planType: string;
  copayCents?: number;
  deductibleCents?: number;
  effectiveOn: string;
  terminatesOn?: string | null;
}

export type InsurancePolicyPatch = Partial<InsurancePolicyInput>;
