import { z } from 'zod';
import { SESSION_STATUSES } from '@truewell/types';

export const telehealthSessionsCreateSchema = z.object({
  appointmentId: z.string().min(1),
  roomName: z.string().min(1).max(255),
  status: z.enum(SESSION_STATUSES).optional(),
  startedAt: z.string().datetime({ offset: true }).nullish(),
  endedAt: z.string().datetime({ offset: true }).nullish(),
  recordingConsent: z.boolean().optional(),
}).strict();

export const telehealthSessionsPatchSchema = telehealthSessionsCreateSchema.partial();

export type TelehealthSessionCreateBody = z.infer<typeof telehealthSessionsCreateSchema>;
