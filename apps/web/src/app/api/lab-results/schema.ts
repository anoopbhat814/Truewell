import { z } from 'zod';
import { ABNORMAL_FLAGS } from '@truewell/types';

export const labResultsCreateSchema = z.object({
  orderId: z.string().min(1),
  analyte: z.string().min(1).max(255),
  loincCode: z.string().min(1).max(255).nullish(),
  value: z.number(),
  unit: z.string().min(1).max(255),
  refLow: z.number().nullish(),
  refHigh: z.number().nullish(),
  flag: z.enum(ABNORMAL_FLAGS).optional(),
  releasedToPatient: z.boolean().optional(),
}).strict();

export const labResultsPatchSchema = labResultsCreateSchema.partial();

export type LabResultCreateBody = z.infer<typeof labResultsCreateSchema>;
