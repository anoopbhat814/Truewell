const MINUTE = 60_000;

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * MINUTE);
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function ageFromDob(dob: string | Date, now: Date = new Date()): number {
  const birth = typeof dob === 'string' ? new Date(`${dob}T00:00:00`) : dob;
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  if (beforeBirthday) age -= 1;
  return age;
}

export function formatDateTime(iso: string, locale = 'en-US', timeZone?: string): string {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(new Date(iso));
}

export function formatTimeRange(startIso: string, endIso: string, locale = 'en-US', timeZone?: string): string {
  const fmt = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone });
  return `${fmt.format(new Date(startIso))} - ${fmt.format(new Date(endIso))}`;
}

export function relativeTime(iso: string, now: Date = new Date()): string {
  const diffMin = Math.round((new Date(iso).getTime() - now.getTime()) / MINUTE);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const abs = Math.abs(diffMin);
  if (abs < 60) return rtf.format(diffMin, 'minute');
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), 'hour');
  return rtf.format(Math.round(diffMin / (60 * 24)), 'day');
}

export function minutesUntil(iso: string, now: Date = new Date()): number {
  return Math.round((new Date(iso).getTime() - now.getTime()) / MINUTE);
}
