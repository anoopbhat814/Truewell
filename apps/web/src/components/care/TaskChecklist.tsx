'use client';

import { useState } from 'react';
import type { CarePlanTask } from '@truewell/types';
import { api } from '@/lib/client';

export function TaskChecklist({ initial, editableBy }: { initial: CarePlanTask[]; editableBy: CarePlanTask['assignee'] }) {
  const [tasks, setTasks] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function toggle(task: CarePlanTask) {
    const completedAt = task.completedAt ? null : new Date().toISOString();
    setTasks((ts) => ts.map((t) => (t.id === task.id ? { ...t, completedAt } : t)));
    try {
      await api.carePlanTasks.update(task.id, { completedAt });
      setError(null);
    } catch {
      setTasks((ts) => ts.map((t) => (t.id === task.id ? task : t)));
      setError('Could not save that change. Please try again.');
    }
  }

  return (
    <div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((t) => {
          const mine = t.assignee === editableBy;
          return (
            <li key={t.id} style={{ display: 'flex', gap: '0.6rem', padding: '0.4rem 0' }}>
              <input id={`task-${t.id}`} type="checkbox" checked={!!t.completedAt} disabled={!mine} onChange={() => void toggle(t)} />
              <label htmlFor={`task-${t.id}`} style={{ textDecoration: t.completedAt ? 'line-through' : 'none' }}>
                {t.title}
                {t.dueOn ? <span style={{ color: 'var(--tw-muted)' }}> (due {t.dueOn})</span> : null}
              </label>
            </li>
          );
        })}
      </ul>
      {error ? <p role="alert" className="tw-field__error">{error}</p> : null}
    </div>
  );
}
