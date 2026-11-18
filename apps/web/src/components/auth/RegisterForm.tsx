'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField } from '@truewell/ui';
import { api } from '@/lib/client';
import { useFormState } from '@/hooks/useFormState';

const EMPTY = { firstName: '', lastName: '', email: '', dateOfBirth: '', password: '' };

export function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(EMPTY);
  const set = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value }));

  const form = useFormState<typeof EMPTY>(async (v) => {
    await api.http.post('/api/auth/register', { ...v, displayName: `${v.firstName} ${v.lastName}`.trim() });
    router.push('/login?registered=1');
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void form.run(values);
      }}
      noValidate
    >
      <TextField label="First name" value={values.firstName} onChange={set('firstName')} error={form.firstError('firstName')} required />
      <TextField label="Last name" value={values.lastName} onChange={set('lastName')} error={form.firstError('lastName')} required />
      <TextField label="Email" type="email" autoComplete="email" value={values.email} onChange={set('email')} error={form.firstError('email')} required />
      <TextField label="Date of birth" type="date" value={values.dateOfBirth} onChange={set('dateOfBirth')} error={form.firstError('dateOfBirth')} required />
      <TextField
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 12 characters, mixing upper and lower case, numbers or symbols."
        value={values.password}
        onChange={set('password')}
        error={form.firstError('password')}
        required
      />
      {form.error ? <p role="alert" className="tw-field__error">{form.error}</p> : null}
      <Button type="submit" loading={form.pending}>
        Create account
      </Button>
    </form>
  );
}
