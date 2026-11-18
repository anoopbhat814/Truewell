import { z } from 'zod';

export const appointmentTypesCreateSchema = z.object({
  code: z.string().min(1).max(255),
  label: z.string().min(1).max(255),
  durationMinutes: z.number().int().nonnegative(),
  telehealthOk: z.boolean().optional(),
  priceCents: z.number().int().nonnegative().optional(),
}).strict();

export const appointmentTypesPatchSchema = appointmentTypesCreateSchema.partial();

export type AppointmentTypeCreateBody = z.infer<typeof appointmentTypesCreateSchema>;
