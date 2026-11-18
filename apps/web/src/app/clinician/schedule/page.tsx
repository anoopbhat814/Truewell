import type { Metadata } from 'next';
import type { Appointment, Patient } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { TodaySchedule } from '@/components/clinician/TodaySchedule';
import { patientNames } from '@/lib/lookup';
import { apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';
import { groupByDay, upcoming } from '@/services/appointments';

export const metadata: Metadata = { title: 'Schedule' };

export default async function SchedulePage() {
  const session = getSession();
  const [appointments, patients] = await Promise.all([
    apiList<Appointment>('/appointments', session?.clinicianId ? { clinicianId: session.clinicianId } : {}),
    apiList<Patient>('/patients'),
  ]);
  const names = patientNames(patients);
  return (
    <>
      <PageHeader title="Schedule" />
      {groupByDay(upcoming(appointments)).map(({ day, items }) => (
        <Card key={day} title={new Date(`${day}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}>
          <TodaySchedule appointments={items} patientNames={names} />
        </Card>
      ))}
    </>
  );
}
