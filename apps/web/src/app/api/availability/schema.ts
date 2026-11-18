import { z } from 'zod';

export const availabilitySlotsCreateSchema = z.object({
  clinicianId: z.string().min(1),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  isBooked: z.boolean().optional(),
}).strict();

export const availabilitySlotsPatchSchema = availabilitySlotsCreateSchema.partial();

export type AvailabilitySlotCreateBody = z.infer<typeof availabilitySlotsCreateSchema>;
