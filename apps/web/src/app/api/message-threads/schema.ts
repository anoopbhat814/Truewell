import { z } from 'zod';

export const messageThreadsCreateSchema = z.object({
  patientId: z.string().min(1),
  clinicianId: z.string().min(1).nullish(),
  subject: z.string().min(1).max(255),
  archived: z.boolean().optional(),
}).strict();

export const messageThreadsPatchSchema = messageThreadsCreateSchema.partial();

export type MessageThreadCreateBody = z.infer<typeof messageThreadsCreateSchema>;
