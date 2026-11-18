import type { CarePlanGoal } from '@truewell/types';
import { Badge } from '@truewell/ui';

export function GoalList({ goals }: { goals: CarePlanGoal[] }) {
  if (goals.length === 0) return <p className="tw-empty">No goals have been set yet.</p>;
  return (
    <ul style={{ paddingLeft: '1.1rem' }}>
      {goals.map((g) => (
        <li key={g.id} style={{ marginBottom: '0.5rem' }}>
          {g.description}{' '}
          {g.achievedAt ? <Badge tone="success">achieved</Badge> : g.targetDate ? <Badge>target {g.targetDate}</Badge> : null}
          {g.metric && g.targetValue != null ? (
            <div style={{ color: 'var(--tw-muted)', fontSize: '0.85rem' }}>
              Target {g.metric}: {g.targetValue}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
