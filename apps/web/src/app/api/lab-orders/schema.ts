import { z } from 'zod';
import { LAB_STATUSES } from '@truewell/types';

export const labOrdersCreateSchema = z.object({
  patientId: z.string().min(1),
  clinicianId: z.string().min(1),
  status: z.enum(LAB_STATUSES).optional(),
  panelCode: z.string().min(1).max(255),
  collectedAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const labOrdersPatchSchema = labOrdersCreateSchema.partial();

export type LabOrderCreateBody = z.infer<typeof labOrdersCreateSchema>;
