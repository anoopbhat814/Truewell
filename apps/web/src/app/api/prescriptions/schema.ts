import { z } from 'zod';
import { PRESCRIPTION_STATUSES } from '@truewell/types';

export const prescriptionsCreateSchema = z.object({
  patientId: z.string().min(1),
  clinicianId: z.string().min(1),
  medicationId: z.string().min(1),
  pharmacyId: z.string().min(1).nullish(),
  status: z.enum(PRESCRIPTION_STATUSES).optional(),
  dosage: z.string().min(1).max(255),
  frequency: z.string().min(1).max(255),
  quantity: z.number().int().nonnegative(),
  refills: z.number().int().nonnegative().optional(),
  instructions: z.string().min(1).max(255).nullish(),
  issuedAt: z.string().datetime({ offset: true }).nullish(),
  expiresAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const prescriptionsPatchSchema = prescriptionsCreateSchema.partial();

export type PrescriptionCreateBody = z.infer<typeof prescriptionsCreateSchema>;
