import { rangePosition } from '@truewell/utils';

export interface RangeBarProps {
  value: number;
  refLow?: number | null;
  refHigh?: number | null;
}

/** Visualises where a lab value sits relative to its reference interval. */
export function RangeBar({ value, refLow, refHigh }: RangeBarProps) {
  const pos = rangePosition({ value, refLow, refHigh });
  if (pos === null) return null;
  return (
    <div className="tw-rangebar" aria-hidden="true">
      <div className="tw-rangebar__normal" />
      <div className="tw-rangebar__marker" style={{ left: `${pos * 100}%` }} />
    </div>
  );
}
