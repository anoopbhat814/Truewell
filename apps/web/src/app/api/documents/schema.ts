import { z } from 'zod';

export const documentsCreateSchema = z.object({
  patientId: z.string().min(1),
  title: z.string().min(1).max(255),
  category: z.string().min(1).max(255),
  storageKey: z.string().min(1).max(255),
}).strict();

export const documentsPatchSchema = documentsCreateSchema.partial();

export type DocumentCreateBody = z.infer<typeof documentsCreateSchema>;
