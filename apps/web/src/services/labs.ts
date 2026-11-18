import type { LabResult } from '@truewell/types';
import { isCritical } from '@truewell/utils';

export interface AnalyteSeries {
  analyte: string;
  unit: string;
  latest: LabResult;
  history: LabResult[];
  trend: 'up' | 'down' | 'flat';
}

export function seriesByAnalyte(results: LabResult[]): AnalyteSeries[] {
  const groups = new Map<string, LabResult[]>();
  for (const r of results) groups.set(r.analyte, [...(groups.get(r.analyte) ?? []), r]);
  return [...groups.entries()]
    .map(([analyte, rows]) => {
      const history = [...rows].sort((a, b) => a.resultedAt.localeCompare(b.resultedAt));
      const latest = history[history.length - 1]!;
      const prev = history[history.length - 2];
      const trend = !prev || prev.value === latest.value ? 'flat' : latest.value > prev.value ? 'up' : 'down';
      return { analyte, unit: latest.unit, latest, history, trend } as AnalyteSeries;
    })
    .sort((a, b) => a.analyte.localeCompare(b.analyte));
}

export function needsReview(results: LabResult[]): LabResult[] {
  return results.filter((r) => !r.releasedToPatient && (isCritical(r.flag) || r.flag !== 'NORMAL'));
}

export function abnormalCount(results: LabResult[]): number {
  return results.filter((r) => r.flag !== 'NORMAL').length;
}

export function sortForReview(results: LabResult[]): LabResult[] {
  const weight = (r: LabResult) => (isCritical(r.flag) ? 0 : r.flag === 'NORMAL' ? 2 : 1);
  return [...results].sort((a, b) => weight(a) - weight(b) || b.resultedAt.localeCompare(a.resultedAt));
}
