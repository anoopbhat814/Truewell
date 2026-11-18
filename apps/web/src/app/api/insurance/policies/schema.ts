import { z } from 'zod';

export const insurancePoliciesCreateSchema = z.object({
  patientId: z.string().min(1),
  payerName: z.string().min(1).max(255),
  memberId: z.string().min(1).max(255),
  groupNumber: z.string().min(1).max(255).nullish(),
  planType: z.string().min(1).max(255),
  copayCents: z.number().int().nonnegative().optional(),
  deductibleCents: z.number().int().nonnegative().optional(),
  effectiveOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  terminatesOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullish(),
}).strict();

export const insurancePoliciesPatchSchema = insurancePoliciesCreateSchema.partial();

export type InsurancePolicyCreateBody = z.infer<typeof insurancePoliciesCreateSchema>;
