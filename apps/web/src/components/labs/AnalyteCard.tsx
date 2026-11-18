import { Card, StatusBadge } from '@truewell/ui';
import { formatDateTime } from '@truewell/utils';
import type { AnalyteSeries } from '@/services/labs';
import { TrendChart } from './TrendChart';

const ARROW = { up: 'Rising', down: 'Falling', flat: 'Stable' } as const;

export function AnalyteCard({ series }: { series: AnalyteSeries }) {
  const { latest } = series;
  return (
    <Card title={series.analyte} actions={<StatusBadge status={latest.flag} />}>
      <p style={{ fontSize: '1.6rem', margin: 0, fontWeight: 700 }}>
        {latest.value} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{series.unit}</span>
      </p>
      <p style={{ color: 'var(--tw-muted)', margin: '0.25rem 0 0.75rem' }}>
        {ARROW[series.trend]} - {formatDateTime(latest.resultedAt)}
      </p>
      <TrendChart series={series} />
    </Card>
  );
}
