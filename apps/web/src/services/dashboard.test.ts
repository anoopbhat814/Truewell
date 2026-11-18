import { describe, expect, it } from 'vitest';
import type { Appointment, CarePlanTask, LabResult, Prescription } from '@truewell/types';
import { clinicianStats, portalSummary } from './dashboard';

const NOW = new Date('2025-06-02T12:00:00Z');
const appt = (over: Partial<Appointment>): Appointment => ({
  id: 'a', patientId: 'p', clinicianId: 'c', typeId: 't', locationId: null, status: 'CONFIRMED', mode: 'IN_PERSON',
  startsAt: '2025-06-02T15:00:00Z', endsAt: '2025-06-02T15:20:00Z', reason: null, cancelReason: null, ...over,
});

describe('dashboard summaries', () => {
  it('computes clinician stats', () => {
    const stats = clinicianStats({
      now: NOW,
      appointments: [appt({}), appt({ id: 'v', mode: 'VIDEO' }), appt({ id: 'r', status: 'REQUESTED', startsAt: '2025-06-09T10:00:00Z' })],
      labs: [{ flag: 'HIGH', releasedToPatient: false } as LabResult],
      prescriptions: [{ status: 'DRAFT' } as Prescription, { status: 'SENT' } as Prescription],
    });
    expect(stats).toMatchObject({ visitsToday: 2, videoToday: 1, pendingRequests: 1, labsToReview: 1, draftPrescriptions: 1, deniedClaims: 0 });
  });

  it('computes the patient overview', () => {
    const s = portalSummary({
      now: NOW,
      appointments: [appt({ id: 'later', startsAt: '2025-06-10T10:00:00Z' }), appt({ id: 'soon' })],
      prescriptions: [{ status: 'FILLED' } as Prescription],
      labs: [{ releasedToPatient: true } as LabResult, { releasedToPatient: false } as LabResult],
      tasks: [
        { completedAt: null, assignee: 'PATIENT' } as CarePlanTask,
        { completedAt: null, assignee: 'CLINICIAN' } as CarePlanTask,
      ],
    });
    expect(s.nextAppointment?.id).toBe('soon');
    expect(s).toMatchObject({ activePrescriptions: 1, newResults: 1, openTasks: 1 });
  });
});
