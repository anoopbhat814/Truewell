import type { ReactNode } from 'react';
import type { SessionUser } from '@truewell/types';
import type { NavItem } from '@/lib/nav';
import { navFor } from '@/lib/nav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell({ user, nav, children }: { user: SessionUser; nav: NavItem[]; children: ReactNode }) {
  return (
    <div className="tw-shell">
      <Sidebar items={navFor(nav, user.role)} />
      <div>
        <TopBar />
        <main id="main" className="tw-main">
          {children}
        </main>
      </div>
    </div>
  );
}
