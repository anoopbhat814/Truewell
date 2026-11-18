'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Appointment } from '@truewell/types';
import { Button, StatusBadge, Table } from '@truewell/ui';
import { formatTimeRange } from '@truewell/utils';
import { api } from '@/lib/client';

const NEXT_STEP: Partial<Record<Appointment['status'], { label: string; to: Appointment['status'] }>> = {
  REQUESTED: { label: 'Confirm', to: 'CONFIRMED' },
  CONFIRMED: { label: 'Check in', to: 'CHECKED_IN' },
  CHECKED_IN: { label: 'Start', to: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Complete', to: 'COMPLETED' },
};

export function TodaySchedule({ appointments, patientNames }: { appointments: Appointment[]; patientNames: Record<string, string> }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function advance(a: Appointment, to: Appointment['status']) {
    setBusy(a.id);
    setError(null);
    try {
      await api.appointments.update(a.id, { status: to });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update the appointment');
    } finally {
      setBusy(null);
    }
  }

  return (
    <>
      {error ? <p role="alert" className="tw-field__error">{error}</p> : null}
      <Table
        caption="Schedule"
        rows={appointments}
        rowKey={(a) => a.id}
        empty="No visits scheduled."
        columns={[
          { key: 'time', header: 'Time', render: (a) => formatTimeRange(a.startsAt, a.endsAt) },
          { key: 'patient', header: 'Patient', render: (a) => patientNames[a.patientId] ?? 'Unknown patient' },
          { key: 'mode', header: 'Format', render: (a) => a.mode.replace('_', ' ').toLowerCase() },
          { key: 'reason', header: 'Reason', render: (a) => a.reason ?? '-' },
          { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
          {
            key: 'actions',
            header: '',
            render: (a) => {
              const step = NEXT_STEP[a.status];
              return step ? (
                <Button variant="secondary" loading={busy === a.id} onClick={() => void advance(a, step.to)}>
                  {step.label}
                </Button>
              ) : null;
            },
          },
        ]}
      />
    </>
  );
}
