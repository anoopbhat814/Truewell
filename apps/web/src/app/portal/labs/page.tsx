import type { Metadata } from 'next';
import type { LabResult } from '@truewell/types';
import { Card } from '@truewell/ui';
import { AnalyteCard } from '@/components/labs/AnalyteCard';
import { LabResultTable } from '@/components/labs/LabResultTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';
import { abnormalCount, seriesByAnalyte } from '@/services/labs';

export const metadata: Metadata = { title: 'Lab results' };

export default async function LabsPage() {
  const results = await apiList<LabResult>('/lab-results');
  const series = seriesByAnalyte(results);
  const flagged = abnormalCount(results);
  return (
    <>
      <PageHeader
        title="Lab results"
        subtitle={flagged ? `${flagged} result${flagged === 1 ? '' : 's'} outside the reference range. Your clinician will follow up if needed.` : 'All released results are within range.'}
      />
      <div className="tw-grid">
        {series.map((s) => (
          <AnalyteCard key={s.analyte} series={s} />
        ))}
      </div>
      <Card title="All results">
        <LabResultTable results={results} />
      </Card>
    </>
  );
}
