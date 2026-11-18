import { formatCents } from '@truewell/utils';
import { StatTile } from '@/components/layout/StatTile';
import type { BalanceSummary as Summary } from '@/services/billing';

export function BalanceSummary({ summary }: { summary: Summary }) {
  return (
    <div className="tw-grid">
      <StatTile label="Billed to date" value={formatCents(summary.billed)} />
      <StatTile label="Paid by insurance" value={formatCents(summary.insurancePaid)} />
      <StatTile label="Estimated you owe" value={formatCents(summary.patientOwes)} tone={summary.patientOwes > 0 ? 'warning' : undefined} />
      <StatTile label="Open claims" value={summary.openClaims} />
    </div>
  );
}
