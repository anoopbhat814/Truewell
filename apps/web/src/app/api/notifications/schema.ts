import { z } from 'zod';
import { NOTIFICATION_KINDS } from '@truewell/types';

export const notificationsCreateSchema = z.object({
  userId: z.string().min(1),
  kind: z.enum(NOTIFICATION_KINDS),
  title: z.string().min(1).max(255),
  body: z.string().min(1).max(10000),
  readAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const notificationsPatchSchema = notificationsCreateSchema.partial();

export type NotificationCreateBody = z.infer<typeof notificationsCreateSchema>;
