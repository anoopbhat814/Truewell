import { z } from 'zod';

export const carePlanTasksCreateSchema = z.object({
  carePlanId: z.string().min(1),
  title: z.string().min(1).max(255),
  assignee: z.string().min(1).max(255).optional(),
  dueOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  completedAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const carePlanTasksPatchSchema = carePlanTasksCreateSchema.partial();

export type CarePlanTaskCreateBody = z.infer<typeof carePlanTasksCreateSchema>;
