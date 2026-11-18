import Link from 'next/link';
import type { Appointment } from '@truewell/types';
import { Card, StatusBadge } from '@truewell/ui';
import { formatDateTime, formatTimeRange } from '@truewell/utils';
import { canCancel, canJoinVideo } from '@/services/appointments';

export interface AppointmentCardProps {
  appointment: Appointment;
  clinicianName?: string;
  typeLabel?: string;
  sessionId?: string;
  onCancel?: (a: Appointment) => void;
}

export function AppointmentCard({ appointment: a, clinicianName, typeLabel, sessionId, onCancel }: AppointmentCardProps) {
  const joinable = sessionId && canJoinVideo(a);
  return (
    <Card
      title={typeLabel ?? 'Appointment'}
      actions={<StatusBadge status={a.status} />}
      aria-label={`${typeLabel ?? 'Appointment'} on ${formatDateTime(a.startsAt)}`}
    >
      <p style={{ margin: 0 }}>
        <strong>{formatDateTime(a.startsAt)}</strong> ({formatTimeRange(a.startsAt, a.endsAt)})
      </p>
      {clinicianName ? <p style={{ margin: '0.25rem 0' }}>With {clinicianName}</p> : null}
      <p style={{ margin: '0.25rem 0', color: 'var(--tw-muted)' }}>
        {a.mode === 'VIDEO' ? 'Video visit' : a.mode === 'PHONE' ? 'Phone visit' : 'In person'}
        {a.reason ? ` - ${a.reason}` : ''}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        {joinable ? (
          <Link className="tw-btn tw-btn--primary" href={`/portal/telehealth/${sessionId}`}>
            Join video visit
          </Link>
        ) : null}
        {onCancel && canCancel(a) ? (
          <button type="button" className="tw-btn tw-btn--secondary" onClick={() => onCancel(a)}>
            Cancel
          </button>
        ) : null}
      </div>
    </Card>
  );
}
