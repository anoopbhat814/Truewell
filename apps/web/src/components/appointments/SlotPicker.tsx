'use client';

import type { OpenSlot } from '@truewell/types';
import { Spinner } from '@truewell/ui';

export interface SlotPickerProps {
  slots: OpenSlot[];
  selected: string | null;
  onSelect: (slot: OpenSlot) => void;
  loading?: boolean;
}

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

export function SlotPicker({ slots, selected, onSelect, loading }: SlotPickerProps) {
  if (loading) return <Spinner label="Loading open times" />;
  if (slots.length === 0) return <p className="tw-empty">No open times that day. Try another date.</p>;
  return (
    <div role="radiogroup" aria-label="Open appointment times" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {slots.map((slot) => {
        const active = selected === slot.startsAt;
        return (
          <button
            key={slot.startsAt}
            type="button"
            role="radio"
            aria-checked={active}
            className={`tw-btn ${active ? 'tw-btn--primary' : 'tw-btn--secondary'}`}
            onClick={() => onSelect(slot)}
          >
            {timeFmt.format(new Date(slot.startsAt))}
          </button>
        );
      })}
    </div>
  );
}
