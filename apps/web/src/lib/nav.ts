import type { Role } from '@truewell/types';

export interface NavItem {
  href: string;
  label: string;
  roles?: Role[];
}

export const PORTAL_NAV: NavItem[] = [
  { href: '/portal', label: 'Overview' },
  { href: '/portal/appointments', label: 'Appointments' },
  { href: '/portal/prescriptions', label: 'Prescriptions' },
  { href: '/portal/labs', label: 'Lab results' },
  { href: '/portal/care-plans', label: 'Care plans' },
  { href: '/portal/messages', label: 'Messages' },
  { href: '/portal/billing', label: 'Billing & insurance' },
  { href: '/portal/profile', label: 'Profile' },
];

export const CLINICIAN_NAV: NavItem[] = [
  { href: '/clinician', label: 'Dashboard' },
  { href: '/clinician/schedule', label: 'Schedule' },
  { href: '/clinician/patients', label: 'Patients' },
  { href: '/clinician/prescribe', label: 'Prescribe', roles: ['CLINICIAN'] },
  { href: '/clinician/labs', label: 'Lab review', roles: ['CLINICIAN', 'NURSE', 'ADMIN'] },
  { href: '/clinician/messages', label: 'Inbox' },
  { href: '/clinician/claims', label: 'Claims', roles: ['BILLING', 'ADMIN'] },
];

export function navFor(items: NavItem[], role: Role): NavItem[] {
  return items.filter((i) => !i.roles || i.roles.includes(role));
}
