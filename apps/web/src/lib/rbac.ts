import type { Role } from '@truewell/types';

const STAFF: Role[] = ['CLINICIAN', 'NURSE', 'FRONT_DESK', 'BILLING', 'ADMIN'];

export const isStaff = (role: Role) => STAFF.includes(role);

export function homeFor(role: Role): string {
  return role === 'PATIENT' ? '/portal' : '/clinician';
}

/** Route prefix -> roles allowed. Longest prefix wins. */
const ACCESS: Array<[string, Role[]]> = [
  ['/portal', ['PATIENT']],
  ['/clinician/claims', ['BILLING', 'ADMIN']],
  ['/clinician/prescribe', ['CLINICIAN']],
  ['/clinician', STAFF],
];

export function canAccess(pathname: string, role: Role): boolean {
  const rule = ACCESS.filter(([prefix]) => pathname === prefix || pathname.startsWith(`${prefix}/`)).sort(
    (a, b) => b[0].length - a[0].length,
  )[0];
  return rule ? rule[1].includes(role) : true;
}
