import { z } from 'zod';
import { CARE_PLAN_STATUSES } from '@truewell/types';

export const carePlansCreateSchema = z.object({
  patientId: z.string().min(1),
  clinicianId: z.string().min(1),
  title: z.string().min(1).max(255),
  status: z.enum(CARE_PLAN_STATUSES).optional(),
  startsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endsOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
  summary: z.string().min(1).max(255).nullish(),
}).strict();

export const carePlansPatchSchema = carePlansCreateSchema.partial();

export type CarePlanCreateBody = z.infer<typeof carePlansCreateSchema>;
