import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="tw-main" style={{ textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p>The page you asked for does not exist, or you do not have access to it.</p>
      <Link href="/">Return home</Link>
    </main>
  );
}
