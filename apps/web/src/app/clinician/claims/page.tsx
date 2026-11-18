import type { Metadata } from 'next';
import type { Claim } from '@truewell/types';
import { Card } from '@truewell/ui';
import { ClaimActions } from '@/components/clinician/ClaimActions';
import { ClaimTable } from '@/components/billing/ClaimTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';
import { worklist } from '@/services/billing';

export const metadata: Metadata = { title: 'Claims' };

export default async function ClaimsPage() {
  const claims = await apiList<Claim>('/insurance/claims');
  return (
    <>
      <PageHeader title="Claims worklist" subtitle="Denied claims are listed first." />
      <Card>
        <ClaimTable claims={worklist(claims)} actions={(c) => <ClaimActions claim={c} />} />
      </Card>
    </>
  );
}
