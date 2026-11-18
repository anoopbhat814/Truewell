import type { AnalyteSeries } from '@/services/labs';

/** Minimal inline SVG trend line; avoids a charting dependency for small series. */
export function TrendChart({ series, width = 220, height = 48 }: { series: AnalyteSeries; width?: number; height?: number }) {
  const values = series.history.map((r) => r.value);
  if (values.length < 2) return <span style={{ color: 'var(--tw-muted)' }}>Single result</span>;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1);
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(height - 4 - ((v - min) / span) * (height - 8)).toFixed(1)}`).join(' ');
  return (
    <svg width={width} height={height} role="img" aria-label={`${series.analyte} trend, ${series.trend}`}>
      <polyline fill="none" stroke="var(--tw-primary)" strokeWidth="2" points={points} />
    </svg>
  );
}
