import { z } from 'zod';
import { APPOINTMENT_MODES, APPOINTMENT_STATUSES } from '@truewell/types';

export const appointmentsCreateSchema = z.object({
  patientId: z.string().min(1),
  clinicianId: z.string().min(1),
  typeId: z.string().min(1),
  locationId: z.string().min(1).nullish(),
  status: z.enum(APPOINTMENT_STATUSES).optional(),
  mode: z.enum(APPOINTMENT_MODES).optional(),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  reason: z.string().min(1).max(255).nullish(),
  cancelReason: z.string().min(1).max(255).nullish(),
}).strict();

export const appointmentsPatchSchema = appointmentsCreateSchema.partial();

export type AppointmentCreateBody = z.infer<typeof appointmentsCreateSchema>;
