'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="tw-main" style={{ textAlign: 'center' }}>
      <h1>Something went wrong</h1>
      <p>Please try again. If the problem continues, contact support@truewell.example.</p>
      <button className="tw-btn tw-btn--primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
