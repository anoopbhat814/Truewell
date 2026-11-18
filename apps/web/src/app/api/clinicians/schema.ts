import { z } from 'zod';

export const cliniciansCreateSchema = z.object({
  userId: z.string().min(1),
  organizationId: z.string().min(1),
  npi: z.string().min(1).max(255),
  specialty: z.string().min(1).max(255),
  title: z.string().min(1).max(255).nullish(),
  acceptingNew: z.boolean().optional(),
}).strict();

export const cliniciansPatchSchema = cliniciansCreateSchema.partial();

export type ClinicianCreateBody = z.infer<typeof cliniciansCreateSchema>;
