import type { Metadata } from 'next';
import type { Appointment, Claim, LabResult, Patient, Prescription } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/layout/StatTile';
import { TodaySchedule } from '@/components/clinician/TodaySchedule';
import { patientNames } from '@/lib/lookup';
import { apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';
import { todays } from '@/services/appointments';
import { clinicianStats } from '@/services/dashboard';

export const metadata: Metadata = { title: 'Dashboard' };

export default async function ClinicianDashboard() {
  const session = getSession();
  const canSeeClaims = session?.role === 'BILLING' || session?.role === 'ADMIN';
  const [appointments, labs, prescriptions, patients, claims] = await Promise.all([
    apiList<Appointment>('/appointments', session?.clinicianId ? { clinicianId: session.clinicianId } : {}),
    apiList<LabResult>('/lab-results'),
    apiList<Prescription>('/prescriptions'),
    apiList<Patient>('/patients'),
    canSeeClaims ? apiList<Claim>('/insurance/claims') : Promise.resolve([] as Claim[]),
  ]);
  const stats = clinicianStats({ appointments, labs, prescriptions, claims });

  return (
    <>
      <PageHeader title="Clinician dashboard" subtitle="Your panel at a glance" />
      <div className="tw-grid">
        <StatTile label="Visits today" value={stats.visitsToday} href="/clinician/schedule" />
        <StatTile label="Video visits today" value={stats.videoToday} />
        <StatTile label="Pending requests" value={stats.pendingRequests} tone={stats.pendingRequests ? 'warning' : undefined} />
        <StatTile label="Labs to review" value={stats.labsToReview} href="/clinician/labs" tone={stats.labsToReview ? 'danger' : undefined} />
        <StatTile label="Draft prescriptions" value={stats.draftPrescriptions} />
        {canSeeClaims ? <StatTile label="Denied claims" value={stats.deniedClaims} href="/clinician/claims" tone={stats.deniedClaims ? 'danger' : undefined} /> : null}
      </div>
      <Card title="Today">
        <TodaySchedule appointments={todays(appointments)} patientNames={patientNames(patients)} />
      </Card>
    </>
  );
}
