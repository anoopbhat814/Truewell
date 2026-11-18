import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { CarePlan, CarePlanGoal, CarePlanTask } from '@truewell/types';
import { Card, StatusBadge } from '@truewell/ui';
import { GoalList } from '@/components/care/GoalList';
import { TaskChecklist } from '@/components/care/TaskChecklist';
import { PageHeader } from '@/components/layout/PageHeader';
import { apiGet, apiList, ServerApiError } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Care plan' };

export default async function CarePlanDetail({ params }: { params: { id: string } }) {
  try {
    const plan = await apiGet<CarePlan>(`/care-plans/${params.id}`);
    const [goals, tasks] = await Promise.all([
      apiList<CarePlanGoal>('/care-plan-goals', { carePlanId: plan.id }),
      apiList<CarePlanTask>('/care-plan-tasks', { carePlanId: plan.id }),
    ]);
    return (
      <>
        <PageHeader title={plan.title} subtitle={plan.summary ?? undefined} actions={<StatusBadge status={plan.status} />} />
        <Card title="Goals">
          <GoalList goals={goals} />
        </Card>
        <Card title="Tasks">
          <TaskChecklist initial={tasks} editableBy="PATIENT" />
        </Card>
      </>
    );
  } catch (e) {
    if (e instanceof ServerApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
