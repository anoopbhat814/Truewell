import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default function LoginPage({ searchParams }: { searchParams: { registered?: string } }) {
  return (
    <>
      <h1>Sign in</h1>
      {searchParams.registered ? <p role="status">Account created. Sign in to continue.</p> : null}
      <Suspense>
        <LoginForm />
      </Suspense>
      <p style={{ marginTop: '1rem' }}>
        New to Truewell? <Link href="/register">Create an account</Link>
      </p>
    </>
  );
}
