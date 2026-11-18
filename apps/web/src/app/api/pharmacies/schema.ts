import { z } from 'zod';

export const pharmaciesCreateSchema = z.object({
  name: z.string().min(1).max(255),
  ncpdpId: z.string().min(1).max(255),
  phone: z.string().min(1).max(255).nullish(),
  city: z.string().min(1).max(255),
  region: z.string().min(1).max(255),
}).strict();

export const pharmaciesPatchSchema = pharmaciesCreateSchema.partial();

export type PharmacyCreateBody = z.infer<typeof pharmaciesCreateSchema>;
