'use client';

import { Button, Card } from '@truewell/ui';

export default function ClinicianError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Card title="We could not load this page">
      <p>Your information is safe. Please try again in a moment.</p>
      {error.digest ? <p style={{ color: 'var(--tw-muted)' }}>Reference: {error.digest}</p> : null}
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
