import type { ReactNode } from 'react';
import { cx } from './cx';

export type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={cx('tw-badge', `tw-badge--${tone}`)}>{children}</span>;
}

const STATUS_TONES: Record<string, Tone> = {
  CONFIRMED: 'info',
  CHECKED_IN: 'info',
  IN_PROGRESS: 'info',
  LIVE: 'success',
  COMPLETED: 'success',
  PAID: 'success',
  FILLED: 'success',
  ACTIVE: 'success',
  NORMAL: 'success',
  REQUESTED: 'warning',
  DRAFT: 'warning',
  PENDING: 'warning',
  LOW: 'warning',
  HIGH: 'warning',
  ON_HOLD: 'warning',
  CANCELLED: 'neutral',
  EXPIRED: 'neutral',
  NO_SHOW: 'danger',
  DENIED: 'danger',
  FAILED: 'danger',
  CRITICAL_LOW: 'danger',
  CRITICAL_HIGH: 'danger',
  REVOKED: 'danger',
};

export function statusTone(status: string): Tone {
  return STATUS_TONES[status] ?? 'neutral';
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={statusTone(status)}>{status.replace(/_/g, ' ').toLowerCase()}</Badge>;
}
