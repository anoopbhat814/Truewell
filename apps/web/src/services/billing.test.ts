import { describe, expect, it } from 'vitest';
import type { Claim, InsurancePolicy } from '@truewell/types';
import { activePolicy, summarizeClaims, worklist } from './billing';

const claim = (over: Partial<Claim>): Claim => ({
  id: 'c', patientId: 'p', policyId: 'pol', appointmentId: null, status: 'PAID', totalCents: 10_000, allowedCents: 8_000,
  paidCents: 5_000, denialCode: null, submittedAt: null, adjudicatedAt: null, ...over,
});

describe('billing services', () => {
  it('summarises billed and paid amounts and ignores drafts', () => {
    const s = summarizeClaims(
      [claim({}), claim({ id: 'd', status: 'DRAFT', totalCents: 99_999 }), claim({ id: 's', status: 'SUBMITTED', paidCents: null, allowedCents: null })],
      { copayCents: 3_000, deductibleCents: 0 },
    );
    expect(s.billed).toBe(20_000);
    expect(s.insurancePaid).toBe(5_000);
    expect(s.openClaims).toBe(1);
    expect(s.patientOwes).toBeGreaterThan(0);
  });

  it('puts denied claims first in the worklist', () => {
    const ids = worklist([claim({ id: 'paid' }), claim({ id: 'den', status: 'DENIED' }), claim({ id: 'sub', status: 'SUBMITTED' })]).map((c) => c.id);
    expect(ids).toEqual(['den', 'sub', 'paid']);
  });

  it('finds the policy in force', () => {
    const p = (id: string, effectiveOn: string, terminatesOn: string | null) => ({ id, effectiveOn, terminatesOn }) as InsurancePolicy;
    expect(activePolicy([p('old', '2020-01-01', '2021-01-01'), p('now', '2024-01-01', null)], '2025-06-01')?.id).toBe('now');
  });
});
