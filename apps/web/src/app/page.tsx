import Link from 'next/link';
import { redirect } from 'next/navigation';
import { homeFor } from '@/lib/rbac';
import { getSession } from '@/lib/session';

const HIGHLIGHTS = [
  ['Book and manage visits', 'See open times, request appointments and cancel online.'],
  ['Join video visits', 'A browser-based waiting room with no downloads.'],
  ['Understand your results', 'Lab values with reference ranges, released after clinician review.'],
  ['Message your care team', 'Secure threads with attachments, not email.'],
];

export default function HomePage() {
  const session = getSession();
  if (session) redirect(homeFor(session.role));
  return (
    <main id="main" className="tw-main" style={{ margin: '0 auto', textAlign: 'center' }}>
      <h1>Care that fits around your life</h1>
      <p>Truewell brings your appointments, prescriptions, lab results and care plan together.</p>
      <p>
        <Link href="/login">Sign in</Link> or <Link href="/register">create a patient account</Link>
      </p>
      <div className="tw-grid" style={{ textAlign: 'left', marginTop: '2rem' }}>
        {HIGHLIGHTS.map(([title, body]) => (
          <section key={title} className="tw-card">
            <div className="tw-card__body">
              <h2 className="tw-card__title">{title}</h2>
              <p>{body}</p>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
