import { z } from 'zod';

export const allergiesCreateSchema = z.object({
  patientId: z.string().min(1),
  substance: z.string().min(1).max(255),
  reaction: z.string().min(1).max(255).nullish(),
  severity: z.string().min(1).max(255).optional(),
}).strict();

export const allergiesPatchSchema = allergiesCreateSchema.partial();

export type AllergyCreateBody = z.infer<typeof allergiesCreateSchema>;
