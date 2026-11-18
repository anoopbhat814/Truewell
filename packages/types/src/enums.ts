// Enum values mirror prisma/schema.prisma and services/api/app/models/enums.py.

export const ROLES = ['PATIENT', 'CLINICIAN', 'NURSE', 'FRONT_DESK', 'BILLING', 'ADMIN'] as const;
export type Role = (typeof ROLES)[number];

export const APPOINTMENT_STATUSES = [
  'REQUESTED',
  'CONFIRMED',
  'CHECKED_IN',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
] as const;
export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export const APPOINTMENT_MODES = ['IN_PERSON', 'VIDEO', 'PHONE'] as const;
export type AppointmentMode = (typeof APPOINTMENT_MODES)[number];

export const SESSION_STATUSES = ['SCHEDULED', 'WAITING_ROOM', 'LIVE', 'ENDED', 'FAILED'] as const;
export type SessionStatus = (typeof SESSION_STATUSES)[number];

export const PRESCRIPTION_STATUSES = ['DRAFT', 'SENT', 'FILLED', 'CANCELLED', 'EXPIRED'] as const;
export type PrescriptionStatus = (typeof PRESCRIPTION_STATUSES)[number];

export const LAB_STATUSES = ['ORDERED', 'COLLECTED', 'IN_PROCESS', 'RESULTED', 'CANCELLED'] as const;
export type LabStatus = (typeof LAB_STATUSES)[number];

export const ABNORMAL_FLAGS = ['NORMAL', 'LOW', 'HIGH', 'CRITICAL_LOW', 'CRITICAL_HIGH'] as const;
export type AbnormalFlag = (typeof ABNORMAL_FLAGS)[number];

export const CARE_PLAN_STATUSES = ['DRAFT', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'REVOKED'] as const;
export type CarePlanStatus = (typeof CARE_PLAN_STATUSES)[number];

export const CLAIM_STATUSES = ['DRAFT', 'SUBMITTED', 'ACCEPTED', 'DENIED', 'PAID', 'APPEALED'] as const;
export type ClaimStatus = (typeof CLAIM_STATUSES)[number];

export const REMINDER_CHANNELS = ['EMAIL', 'SMS', 'PUSH'] as const;
export type ReminderChannel = (typeof REMINDER_CHANNELS)[number];

export const REMINDER_STATUSES = ['PENDING', 'SENT', 'FAILED', 'CANCELLED'] as const;
export type ReminderStatus = (typeof REMINDER_STATUSES)[number];

export const NOTIFICATION_KINDS = [
  'APPOINTMENT',
  'LAB_RESULT',
  'MESSAGE',
  'PRESCRIPTION',
  'BILLING',
  'SYSTEM',
] as const;
export type NotificationKind = (typeof NOTIFICATION_KINDS)[number];
