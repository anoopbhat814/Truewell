export interface CarePlanTask {
  id: string;
  carePlanId: string;
  title: string;
  assignee: string;
  dueOn: string | null;
  completedAt: string | null;
}

export interface CarePlanTaskInput {
  carePlanId: string;
  title: string;
  assignee?: string;
  dueOn?: string | null;
  completedAt?: string | null;
}

export type CarePlanTaskPatch = Partial<CarePlanTaskInput>;
