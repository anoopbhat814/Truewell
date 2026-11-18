import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main id="main" style={{ maxWidth: 420, margin: '4rem auto', padding: '0 1rem' }}>
      <h2 style={{ color: 'var(--tw-primary)' }}>Truewell</h2>
      <section className="tw-card">
        <div className="tw-card__body">{children}</div>
      </section>
    </main>
  );
}
