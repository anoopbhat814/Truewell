import type { Appointment, CarePlanTask, Claim, LabResult, Prescription } from '@truewell/types';
import { needsReview } from './labs';
import { todays } from './appointments';

export interface ClinicianStats {
  visitsToday: number;
  videoToday: number;
  pendingRequests: number;
  labsToReview: number;
  draftPrescriptions: number;
  deniedClaims: number;
}

export function clinicianStats(input: {
  appointments: Appointment[];
  labs: LabResult[];
  prescriptions: Prescription[];
  claims?: Claim[];
  now?: Date;
}): ClinicianStats {
  const today = todays(input.appointments, input.now);
  return {
    visitsToday: today.length,
    videoToday: today.filter((a) => a.mode === 'VIDEO').length,
    pendingRequests: input.appointments.filter((a) => a.status === 'REQUESTED').length,
    labsToReview: needsReview(input.labs).length,
    draftPrescriptions: input.prescriptions.filter((p) => p.status === 'DRAFT').length,
    deniedClaims: (input.claims ?? []).filter((c) => c.status === 'DENIED').length,
  };
}

export interface PortalSummary {
  nextAppointment?: Appointment;
  activePrescriptions: number;
  newResults: number;
  openTasks: number;
}

export function portalSummary(input: {
  appointments: Appointment[];
  prescriptions: Prescription[];
  labs: LabResult[];
  tasks: CarePlanTask[];
  now?: Date;
}): PortalSummary {
  const now = input.now ?? new Date();
  const next = input.appointments
    .filter((a) => (a.status === 'CONFIRMED' || a.status === 'REQUESTED') && new Date(a.startsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  return {
    nextAppointment: next,
    activePrescriptions: input.prescriptions.filter((p) => p.status === 'SENT' || p.status === 'FILLED').length,
    newResults: input.labs.filter((l) => l.releasedToPatient).length,
    openTasks: input.tasks.filter((t) => !t.completedAt && t.assignee === 'PATIENT').length,
  };
}
