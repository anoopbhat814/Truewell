import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Appointment, AppointmentType, Clinician } from '@truewell/types';
import { Card, StatusBadge } from '@truewell/ui';
import { formatDateTime, formatTimeRange } from '@truewell/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, ServerApiError } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Appointment details' };

export default async function AppointmentDetail({ params }: { params: { id: string } }) {
  let appt: Appointment;
  try {
    appt = await apiGet<Appointment>(`/appointments/${params.id}`);
  } catch (e) {
    if (e instanceof ServerApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
  const [type, clinician] = await Promise.all([
    apiGet<AppointmentType>(`/appointment-types/${appt.typeId}`),
    apiGet<Clinician>(`/clinicians/${appt.clinicianId}`),
  ]);
  return (
    <>
      <PageHeader title={type.label} actions={<StatusBadge status={appt.status} />} />
      <Card title="When and where">
        <p>{formatDateTime(appt.startsAt)} ({formatTimeRange(appt.startsAt, appt.endsAt)})</p>
        <p>Clinician: {clinician.specialty}</p>
        <p>Format: {appt.mode.replace('_', ' ').toLowerCase()}</p>
        {appt.reason ? <p>Reason: {appt.reason}</p> : null}
        {appt.cancelReason ? <p>Cancellation reason: {appt.cancelReason}</p> : null}
      </Card>
    </>
  );
}
