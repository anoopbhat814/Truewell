'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, TextField } from '@truewell/ui';
import { api } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';
import type { SessionUser } from '@truewell/types';
import { homeFor } from '@/lib/rbac';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const form = useFormState<{ email: string; password: string }>(async (values) => {
    await api.http.post('/api/auth/login', values);
    const me = await api.http.get<SessionUser>('/api/auth/me');
    const next = params.get('next');
    router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : homeFor(me.role));
    router.refresh();
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.run({ email, password });
      }}
      noValidate
    >
      <TextField label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={form.firstError('email')} required />
      <TextField label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={form.firstError('password')} required />
      {form.error ? <p role="alert" className="tw-field__error">{form.error}</p> : null}
      <Button type="submit" loading={form.pending}>
        Sign in
      </Button>
    </form>
  );
}
