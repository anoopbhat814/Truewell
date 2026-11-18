export interface TaskLike {
  completedAt: string | null;
  dueOn: string | null;
}

export function completion(tasks: TaskLike[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.completedAt).length / tasks.length) * 100);
}

export function overdue(tasks: TaskLike[], today: string): TaskLike[] {
  return tasks.filter((t) => !t.completedAt && t.dueOn !== null && t.dueOn < today);
}

export function nextDue(tasks: TaskLike[]): TaskLike | undefined {
  return tasks
    .filter((t) => !t.completedAt && t.dueOn)
    .sort((a, b) => (a.dueOn as string).localeCompare(b.dueOn as string))[0];
}
