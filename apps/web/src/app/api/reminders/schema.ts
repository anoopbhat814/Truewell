import { z } from 'zod';
import { REMINDER_CHANNELS, REMINDER_STATUSES } from '@truewell/types';

export const remindersCreateSchema = z.object({
  patientId: z.string().min(1),
  appointmentId: z.string().min(1).nullish(),
  channel: z.enum(REMINDER_CHANNELS),
  status: z.enum(REMINDER_STATUSES).optional(),
  message: z.string().min(1).max(255),
  sendAt: z.string().datetime({ offset: true }),
  sentAt: z.string().datetime({ offset: true }).nullish(),
  attempts: z.number().int().nonnegative().optional(),
  lastError: z.string().min(1).max(255).nullish(),
}).strict();

export const remindersPatchSchema = remindersCreateSchema.partial();

export type ReminderCreateBody = z.infer<typeof remindersCreateSchema>;
