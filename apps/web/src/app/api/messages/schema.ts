import { z } from 'zod';

export const messagesCreateSchema = z.object({
  threadId: z.string().min(1),
  body: z.string().min(1).max(10000),
  readAt: z.string().datetime({ offset: true }).nullish(),
}).strict();

export const messagesPatchSchema = messagesCreateSchema.partial();

export type MessageCreateBody = z.infer<typeof messagesCreateSchema>;
