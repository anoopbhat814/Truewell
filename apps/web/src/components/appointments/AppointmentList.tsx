'use client';

import { useState } from 'react';
import type { Appointment, AppointmentType, Clinician } from '@truewell/types';
import { EmptyState } from '@truewell/ui';
import { AppointmentCard } from './AppointmentCard';
import { CancelDialog } from './CancelDialog';

export interface AppointmentListProps {
  appointments: Appointment[];
  clinicians: Record<string, string>;
  types: Record<string, AppointmentType | undefined>;
  sessions: Record<string, string | undefined>;
  emptyText?: string;
}

export function AppointmentList({ appointments, clinicians, types, sessions, emptyText = 'No appointments to show.' }: AppointmentListProps) {
  const [target, setTarget] = useState<Appointment | null>(null);
  if (appointments.length === 0) return <EmptyState title={emptyText} />;
  return (
    <>
      {appointments.map((a) => (
        <AppointmentCard
          key={a.id}
          appointment={a}
          clinicianName={clinicians[a.clinicianId]}
          typeLabel={types[a.typeId]?.label}
          sessionId={sessions[a.id]}
          onCancel={setTarget}
        />
      ))}
      <CancelDialog appointment={target} onClose={() => setTarget(null)} />
    </>
  );
}

export type { Clinician };
