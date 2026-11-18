'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Claim } from '@truewell/types';
import { Button } from '@truewell/ui';
import { actions } from '@/lib/client';

export function ClaimActions({ claim }: { claim: Claim }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(fn: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      await fn();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Action failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <span>
      {claim.status === 'DRAFT' ? (
        <Button variant="secondary" loading={busy} onClick={() => void run(() => actions.submitClaim(claim.id))}>
          Submit
        </Button>
      ) : null}
      {claim.status === 'SUBMITTED' ? (
        <Button variant="secondary" loading={busy} onClick={() => void run(() => actions.adjudicateClaim(claim.id, Math.round(claim.totalCents * 0.8)))}>
          Accept at 80%
        </Button>
      ) : null}
      {error ? <span role="alert" className="tw-field__error"> {error}</span> : null}
    </span>
  );
}
