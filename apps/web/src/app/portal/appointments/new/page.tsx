import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { AppointmentType, Clinician } from '@truewell/types';
import { BookingForm } from '@/components/appointments/BookingForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { clinicianNames } from '@/lib/lookup';
import { apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Request appointment' };

export default async function NewAppointmentPage() {
  const session = getSession();
  if (!session?.patientId) redirect('/portal');
  const [clinicians, types] = await Promise.all([apiList<Clinician>('/clinicians'), apiList<AppointmentType>('/appointment-types')]);
  const names = await clinicianNames(clinicians);
  const accepting = clinicians.filter((c) => c.acceptingNew).map((c) => ({ ...c, name: names[c.id] ?? c.specialty }));
  return (
    <>
      <PageHeader title="Request an appointment" subtitle="Choose a visit type, a clinician and an open time." />
      <BookingForm patientId={session.patientId} clinicians={accepting} types={types} />
    </>
  );
}
