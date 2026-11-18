import { z } from 'zod';
import { CLAIM_STATUSES } from '@truewell/types';

export const claimsCreateSchema = z.object({
  patientId: z.string().min(1),
  policyId: z.string().min(1),
  appointmentId: z.string().min(1).nullish(),
  status: z.enum(CLAIM_STATUSES).optional(),
  totalCents: z.number().int().nonnegative(),
  allowedCents: z.number().int().nonnegative().nullish(),
  paidCents: z.number().int().nonnegative().nullish(),
  denialCode: z.string().min(1).max(255).nullish(),
  submittedAt: z.string().datetime({ offset: true }).nullish(),
  adjudicatedAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const claimsPatchSchema = claimsCreateSchema.partial();

export type ClaimCreateBody = z.infer<typeof claimsCreateSchema>;
