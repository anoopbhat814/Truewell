import { z } from 'zod';

export const patientsCreateSchema = z.object({
  userId: z.string().min(1),
  mrn: z.string().min(1).max(255),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  sexAtBirth: z.string().min(1).max(255).nullish(),
  phone: z.string().min(1).max(255).nullish(),
  preferredLang: z.string().min(1).max(255).optional(),
  primaryClinicianId: z.string().min(1).nullish(),
}).strict();

export const patientsPatchSchema = patientsCreateSchema.partial();

export type PatientCreateBody = z.infer<typeof patientsCreateSchema>;
