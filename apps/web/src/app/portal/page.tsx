import type { Metadata } from 'next';
import Link from 'next/link';
import type { Appointment, CarePlanTask, LabResult, Prescription } from '@truewell/types';
import { Card, StatusBadge } from '@truewell/ui';
import { formatDateTime } from '@truewell/utils';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatTile } from '@/components/layout/StatTile';
import { apiList } from '@/lib/server-api';
import { getSession } from '@/lib/session';
import { portalSummary } from '@/services/dashboard';

export const metadata: Metadata = { title: 'Overview' };

export default async function PortalHome() {
  const session = getSession();
  const [appointments, prescriptions, labs, tasks] = await Promise.all([
    apiList<Appointment>('/appointments'),
    apiList<Prescription>('/prescriptions'),
    apiList<LabResult>('/lab-results'),
    apiList<CarePlanTask>('/care-plan-tasks'),
  ]);
  const summary = portalSummary({ appointments, prescriptions, labs, tasks });
  const next = summary.nextAppointment;

  return (
    <>
      <PageHeader title="Welcome back" subtitle={session ? `Signed in securely as ${session.role.toLowerCase()}` : undefined} />
      <div className="tw-grid">
        <StatTile label="Active prescriptions" value={summary.activePrescriptions} href="/portal/prescriptions" />
        <StatTile label="Released results" value={summary.newResults} href="/portal/labs" />
        <StatTile label="Care plan tasks for you" value={summary.openTasks} href="/portal/care-plans" />
      </div>
      <Card title="Next appointment" actions={<Link href="/portal/appointments/new">Request a visit</Link>}>
        {next ? (
          <p style={{ margin: 0 }}>
            <strong>{formatDateTime(next.startsAt)}</strong> <StatusBadge status={next.status} />
            {next.reason ? <span> - {next.reason}</span> : null}
          </p>
        ) : (
          <p style={{ margin: 0 }}>You have nothing scheduled. Request a visit whenever you are ready.</p>
        )}
      </Card>
    </>
  );
}
