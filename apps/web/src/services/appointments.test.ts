import { describe, expect, it } from 'vitest';
import type { Appointment } from '@truewell/types';
import { canCancel, canJoinVideo, groupByDay, past, todays, upcoming } from './appointments';

const NOW = new Date('2025-06-02T12:00:00Z');
const base: Appointment = {
  id: 'a1', patientId: 'p', clinicianId: 'c', typeId: 't', locationId: null, status: 'CONFIRMED', mode: 'VIDEO',
  startsAt: '2025-06-02T15:00:00Z', endsAt: '2025-06-02T15:20:00Z', reason: null, cancelReason: null,
};
const make = (over: Partial<Appointment>): Appointment => ({ ...base, ...over });

describe('appointment rules', () => {
  it('splits upcoming and past, newest first for history', () => {
    const list = [
      make({ id: 'late', startsAt: '2025-06-05T10:00:00Z', endsAt: '2025-06-05T10:20:00Z' }),
      make({ id: 'soon' }),
      make({ id: 'done', status: 'COMPLETED', startsAt: '2025-05-01T10:00:00Z', endsAt: '2025-05-01T10:20:00Z' }),
      make({ id: 'gone', status: 'CANCELLED' }),
    ];
    expect(upcoming(list, NOW).map((a) => a.id)).toEqual(['soon', 'late']);
    expect(past(list, NOW).map((a) => a.id)).toEqual(['gone', 'done']);
  });

  it('enforces the cancellation notice window', () => {
    expect(canCancel(make({}), NOW)).toBe(true);
    expect(canCancel(make({ startsAt: '2025-06-02T13:00:00Z' }), NOW)).toBe(false);
    expect(canCancel(make({ status: 'COMPLETED' }), NOW)).toBe(false);
  });

  it('opens the video waiting room ten minutes early', () => {
    expect(canJoinVideo(make({}), NOW)).toBe(false);
    expect(canJoinVideo(make({}), new Date('2025-06-02T14:51:00Z'))).toBe(true);
    expect(canJoinVideo(make({ mode: 'PHONE' }), new Date('2025-06-02T14:55:00Z'))).toBe(false);
    expect(canJoinVideo(make({}), new Date('2025-06-02T16:00:00Z'))).toBe(false);
  });

  it('groups by calendar day in order', () => {
    const groups = groupByDay([make({ id: 'b', startsAt: '2025-06-03T09:00:00Z' }), make({ id: 'a' })]);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.items[0]?.id).toBe('a');
  });

  it('finds todays non-cancelled visits', () => {
    expect(todays([make({}), make({ id: 'x', status: 'CANCELLED' })], NOW)).toHaveLength(1);
  });
});
