import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Appointment, Clinician, TelehealthSession } from '@truewell/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { SessionView } from '@/components/telehealth/SessionView';
import { apiGet, ServerApiError } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Video visit' };

export default async function TelehealthPage({ params }: { params: { id: string } }) {
  try {
    const session = await apiGet<TelehealthSession>(`/telehealth/sessions/${params.id}`);
    const appt = await apiGet<Appointment>(`/appointments/${session.appointmentId}`);
    const clinician = await apiGet<Clinician>(`/clinicians/${appt.clinicianId}`);
    return (
      <>
        <PageHeader title="Video visit" />
        <SessionView sessionId={session.id} startsAt={appt.startsAt} clinicianName={`${clinician.title ?? 'Dr.'} (${clinician.specialty})`} />
      </>
    );
  } catch (e) {
    if (e instanceof ServerApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
