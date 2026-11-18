import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create account' };

export default function RegisterPage() {
  return (
    <>
      <h1>Create your account</h1>
      <RegisterForm />
      <p style={{ marginTop: '1rem' }}>
        Already registered? <Link href="/login">Sign in</Link>
      </p>
    </>
  );
}
