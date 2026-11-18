import type { Metadata } from 'next';
import type { Claim, InsurancePolicy } from '@truewell/types';
import { Card } from '@truewell/ui';
import { toIsoDate } from '@truewell/utils';
import { BalanceSummary } from '@/components/billing/BalanceSummary';
import { ClaimTable } from '@/components/billing/ClaimTable';
import { PolicyCard } from '@/components/billing/PolicyCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';
import { activePolicy, summarizeClaims } from '@/services/billing';

export const metadata: Metadata = { title: 'Billing & insurance' };

export default async function BillingPage() {
  const [policies, claims] = await Promise.all([apiList<InsurancePolicy>('/insurance/policies'), apiList<Claim>('/insurance/claims')]);
  const policy = activePolicy(policies, toIsoDate(new Date()));
  return (
    <>
      <PageHeader title="Billing & insurance" />
      <BalanceSummary summary={summarizeClaims(claims, policy)} />
      {policy ? <PolicyCard policy={policy} /> : <p className="tw-empty">No active insurance policy on file. Contact the front desk to add one.</p>}
      <Card title="Claims">
        <ClaimTable claims={claims.filter((c) => c.status !== 'DRAFT')} />
      </Card>
    </>
  );
}
