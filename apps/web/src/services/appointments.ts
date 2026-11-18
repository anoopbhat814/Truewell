import type { Appointment, AppointmentStatus } from '@truewell/types';
import { isSameDay, minutesUntil, toIsoDate } from '@truewell/utils';

const ACTIVE: AppointmentStatus[] = ['REQUESTED', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'];
export const CANCEL_NOTICE_MINUTES = 120;
export const JOIN_OPENS_MINUTES = 10;

export function upcoming(appointments: Appointment[], now = new Date()): Appointment[] {
  return appointments
    .filter((a) => ACTIVE.includes(a.status) && new Date(a.endsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

export function past(appointments: Appointment[], now = new Date()): Appointment[] {
  return appointments
    .filter((a) => !ACTIVE.includes(a.status) || new Date(a.endsAt) <= now)
    .sort((a, b) => b.startsAt.localeCompare(a.startsAt));
}

export function canCancel(a: Appointment, now = new Date()): boolean {
  return (a.status === 'REQUESTED' || a.status === 'CONFIRMED') && minutesUntil(a.startsAt, now) >= CANCEL_NOTICE_MINUTES;
}

export function canJoinVideo(a: Appointment, now = new Date()): boolean {
  if (a.mode !== 'VIDEO' || (a.status !== 'CONFIRMED' && a.status !== 'CHECKED_IN' && a.status !== 'IN_PROGRESS')) return false;
  return minutesUntil(a.startsAt, now) <= JOIN_OPENS_MINUTES && new Date(a.endsAt).getTime() + 30 * 60_000 > now.getTime();
}

export function groupByDay(appointments: Appointment[]): Array<{ day: string; items: Appointment[] }> {
  const map = new Map<string, Appointment[]>();
  for (const a of [...appointments].sort((x, y) => x.startsAt.localeCompare(y.startsAt))) {
    const key = toIsoDate(new Date(a.startsAt));
    map.set(key, [...(map.get(key) ?? []), a]);
  }
  return [...map.entries()].map(([day, items]) => ({ day, items }));
}

export function todays(appointments: Appointment[], now = new Date()): Appointment[] {
  return appointments.filter((a) => isSameDay(new Date(a.startsAt), now) && a.status !== 'CANCELLED');
}
