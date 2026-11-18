import { z } from 'zod';

export const carePlanGoalsCreateSchema = z.object({
  carePlanId: z.string().min(1),
  description: z.string().min(1).max(255),
  metric: z.string().min(1).max(255).nullish(),
  targetValue: z.number().nullish(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  achievedAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const carePlanGoalsPatchSchema = carePlanGoalsCreateSchema.partial();

export type CarePlanGoalCreateBody = z.infer<typeof carePlanGoalsCreateSchema>;
