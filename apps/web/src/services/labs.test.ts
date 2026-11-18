import { describe, expect, it } from 'vitest';
import type { LabResult } from '@truewell/types';
import { abnormalCount, needsReview, seriesByAnalyte, sortForReview } from './labs';

const r = (over: Partial<LabResult>): LabResult => ({
  id: 'r', orderId: 'o', analyte: 'Glucose', loincCode: null, value: 90, unit: 'mg/dL', refLow: 70, refHigh: 99,
  flag: 'NORMAL', releasedToPatient: true, resultedAt: '2025-01-01T00:00:00Z', ...over,
});

describe('lab services', () => {
  it('builds per-analyte series with a trend', () => {
    const series = seriesByAnalyte([
      r({ id: '1', value: 90, resultedAt: '2025-01-01T00:00:00Z' }),
      r({ id: '2', value: 110, flag: 'HIGH', resultedAt: '2025-03-01T00:00:00Z' }),
      r({ id: '3', analyte: 'Potassium', value: 4, unit: 'mmol/L' }),
    ]);
    expect(series.map((s) => s.analyte)).toEqual(['Glucose', 'Potassium']);
    expect(series[0]?.trend).toBe('up');
    expect(series[0]?.latest.id).toBe('2');
    expect(series[1]?.trend).toBe('flat');
  });

  it('queues unreleased abnormal results for review, critical first', () => {
    const rows = [
      r({ id: 'n', releasedToPatient: false }),
      r({ id: 'h', flag: 'HIGH', releasedToPatient: false }),
      r({ id: 'c', flag: 'CRITICAL_HIGH', releasedToPatient: false }),
    ];
    expect(needsReview(rows).map((x) => x.id)).toEqual(['h', 'c']);
    expect(sortForReview(rows).map((x) => x.id)).toEqual(['c', 'h', 'n']);
    expect(abnormalCount(rows)).toBe(2);
  });
});
