'use client';

import { Button } from '@truewell/ui';

export default function AuthError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert">
      <h1>We could not complete that request</h1>
      <p>Please check your connection and try again.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
