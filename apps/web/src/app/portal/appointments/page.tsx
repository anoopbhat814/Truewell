import type { Metadata } from 'next';
import Link from 'next/link';
import type { Appointment, AppointmentType, Clinician } from '@truewell/types';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { clinicianNames, indexBy, loadSessionsByAppointment } from '@/lib/lookup';
import { apiList } from '@/lib/server-api';
import { past, upcoming } from '@/services/appointments';

export const metadata: Metadata = { title: 'Appointments' };

export default async function AppointmentsPage() {
  const [appointments, clinicians, types, sessions] = await Promise.all([
    apiList<Appointment>('/appointments'),
    apiList<Clinician>('/clinicians'),
    apiList<AppointmentType>('/appointment-types'),
    loadSessionsByAppointment(),
  ]);
  const names = await clinicianNames(clinicians);
  const shared = { clinicians: names, types: indexBy(types), sessions };

  return (
    <>
      <PageHeader title="Appointments" actions={<Link className="tw-btn tw-btn--primary" href="/portal/appointments/new">Request appointment</Link>} />
      <h2>Upcoming</h2>
      <AppointmentList appointments={upcoming(appointments)} emptyText="No upcoming appointments." {...shared} />
      <h2>History</h2>
      <AppointmentList appointments={past(appointments).slice(0, 10)} emptyText="No past appointments." {...shared} />
    </>
  );
}
