import type { Metadata } from 'next';
import type { LabResult } from '@truewell/types';
import { Card } from '@truewell/ui';
import { LabReviewQueue } from '@/components/clinician/LabReviewQueue';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';
import { needsReview, sortForReview } from '@/services/labs';

export const metadata: Metadata = { title: 'Lab review' };

export default async function LabReviewPage() {
  const results = await apiList<LabResult>('/lab-results', { releasedToPatient: false });
  return (
    <>
      <PageHeader title="Lab review" subtitle="Critical values are never released automatically." />
      <Card>
        <LabReviewQueue results={sortForReview(needsReview(results))} />
      </Card>
    </>
  );
}
