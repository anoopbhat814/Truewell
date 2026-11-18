import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { CLINICIAN_NAV } from '@/lib/nav';
import { getSession } from '@/lib/session';

export default function ClinicianLayout({ children }: { children: ReactNode }) {
  const user = getSession();
  if (!user) redirect('/login?next=/clinician');
  if (user.role === 'PATIENT') redirect('/portal');
  return (
    <AppShell user={user} nav={CLINICIAN_NAV}>
      {children}
    </AppShell>
  );
}
