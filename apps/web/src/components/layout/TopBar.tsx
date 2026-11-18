'use client';

import { Button } from '@truewell/ui';
import { useSession } from '@/hooks/useSession';

export function TopBar() {
  const { user, signOut } = useSession();
  return (
    <div className="tw-topbar" style={{ padding: '0.75rem 2rem 0' }}>
      {user ? <span aria-live="polite">Signed in as {user.role.replace('_', ' ').toLowerCase()}</span> : null}
      <Button variant="secondary" onClick={signOut}>
        Sign out
      </Button>
    </div>
  );
}
