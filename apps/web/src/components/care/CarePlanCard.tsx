import Link from 'next/link';
import type { CarePlan, CarePlanTask } from '@truewell/types';
import { Card, ProgressBar, StatusBadge } from '@truewell/ui';
import { completion } from '@truewell/utils';

export function CarePlanCard({ plan, tasks }: { plan: CarePlan; tasks: CarePlanTask[] }) {
  const pct = completion(tasks);
  return (
    <Card title={<Link href={`/portal/care-plans/${plan.id}`}>{plan.title}</Link>} actions={<StatusBadge status={plan.status} />}>
      {plan.summary ? <p style={{ marginTop: 0 }}>{plan.summary}</p> : null}
      <ProgressBar value={pct} label={`${plan.title} progress`} />
      <p style={{ color: 'var(--tw-muted)', marginBottom: 0 }}>
        {pct}% of tasks complete since {plan.startsOn}
      </p>
    </Card>
  );
}
