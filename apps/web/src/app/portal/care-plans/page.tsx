import type { Metadata } from 'next';
import type { CarePlan, CarePlanTask } from '@truewell/types';
import { CarePlanCard } from '@/components/care/CarePlanCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Care plans' };

export default async function CarePlansPage() {
  const [plans, tasks] = await Promise.all([apiList<CarePlan>('/care-plans'), apiList<CarePlanTask>('/care-plan-tasks')]);
  const visible = plans.filter((p) => p.status !== 'DRAFT' && p.status !== 'REVOKED');
  return (
    <>
      <PageHeader title="Care plans" />
      {visible.length === 0 ? <p className="tw-empty">Your care team has not shared a plan yet.</p> : null}
      {visible.map((p) => (
        <CarePlanCard key={p.id} plan={p} tasks={tasks.filter((t) => t.carePlanId === p.id)} />
      ))}
    </>
  );
}
