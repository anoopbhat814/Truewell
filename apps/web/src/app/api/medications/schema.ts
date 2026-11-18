import { z } from 'zod';

export const medicationsCreateSchema = z.object({
  rxnormCode: z.string().min(1).max(255),
  name: z.string().min(1).max(255),
  strength: z.string().min(1).max(255).nullish(),
  form: z.string().min(1).max(255).nullish(),
  isControlled: z.boolean().optional(),
}).strict();

export const medicationsPatchSchema = medicationsCreateSchema.partial();

export type MedicationCreateBody = z.infer<typeof medicationsCreateSchema>;
