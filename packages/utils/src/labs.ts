import type { AbnormalFlag } from '@truewell/types';

export interface RangeInput {
  value: number;
  refLow?: number | null;
  refHigh?: number | null;
}

/** Mirrors services/api/app/services/lab_result.py so the UI can preview flags before submit. */
export function classifyResult({ value, refLow, refHigh }: RangeInput): AbnormalFlag {
  if (refLow != null && refHigh != null) {
    const span = refHigh - refLow;
    if (value < refLow - span * 0.5) return 'CRITICAL_LOW';
    if (value > refHigh + span * 0.5) return 'CRITICAL_HIGH';
  }
  if (refLow != null && value < refLow) return 'LOW';
  if (refHigh != null && value > refHigh) return 'HIGH';
  return 'NORMAL';
}

export function isCritical(flag: AbnormalFlag): boolean {
  return flag === 'CRITICAL_LOW' || flag === 'CRITICAL_HIGH';
}

export function formatRange(low?: number | null, high?: number | null, unit = ''): string {
  const suffix = unit ? ` ${unit}` : '';
  if (low != null && high != null) return `${low} - ${high}${suffix}`;
  if (low != null) return `>= ${low}${suffix}`;
  if (high != null) return `<= ${high}${suffix}`;
  return 'No reference range';
}

/** Position of a value along its reference range, clamped to 0..1, for range bars. */
export function rangePosition({ value, refLow, refHigh }: RangeInput): number | null {
  if (refLow == null || refHigh == null || refHigh <= refLow) return null;
  const span = refHigh - refLow;
  const pos = (value - (refLow - span * 0.5)) / (span * 2);
  return Math.min(1, Math.max(0, pos));
}
