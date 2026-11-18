import type { Claim, InsurancePolicy } from '@truewell/types';
import { estimatePatientShare, sumCents } from '@truewell/utils';

export interface BalanceSummary {
  billed: number;
  insurancePaid: number;
  patientOwes: number;
  openClaims: number;
}

export function summarizeClaims(claims: Claim[], policy?: Pick<InsurancePolicy, 'copayCents' | 'deductibleCents'>): BalanceSummary {
  const live = claims.filter((c) => c.status !== 'DRAFT');
  const billed = sumCents(live.map((c) => c.totalCents));
  const insurancePaid = sumCents(live.map((c) => c.paidCents));
  const owedEstimate = policy
    ? sumCents(
        live
          .filter((c) => c.allowedCents != null)
          .map((c) => estimatePatientShare(c.allowedCents as number, policy.copayCents, 0)),
      )
    : 0;
  return {
    billed,
    insurancePaid,
    patientOwes: owedEstimate,
    openClaims: live.filter((c) => c.status === 'SUBMITTED' || c.status === 'ACCEPTED' || c.status === 'APPEALED').length,
  };
}

export function worklist(claims: Claim[]): Claim[] {
  const order: Record<string, number> = { DENIED: 0, DRAFT: 1, SUBMITTED: 2, APPEALED: 3, ACCEPTED: 4, PAID: 5 };
  return [...claims].sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9) || b.totalCents - a.totalCents);
}

export function activePolicy(policies: InsurancePolicy[], today: string): InsurancePolicy | undefined {
  return policies.find((p) => p.effectiveOn <= today && (!p.terminatesOn || p.terminatesOn >= today));
}
