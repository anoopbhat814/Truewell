import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { PORTAL_NAV } from '@/lib/nav';
import { getSession } from '@/lib/session';

export default function PortalLayout({ children }: { children: ReactNode }) {
  const user = getSession();
  if (!user) redirect('/login?next=/portal');
  if (user.role !== 'PATIENT') redirect('/clinician');
  return (
    <AppShell user={user} nav={PORTAL_NAV}>
      {children}
    </AppShell>
  );
}
