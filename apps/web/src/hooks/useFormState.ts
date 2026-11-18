'use client';

import { useState } from 'react';
import { ApiError } from '@truewell/api-client';

export type FieldErrors = Record<string, string[] | undefined>;

/** Wraps an async submit handler and exposes pending, top-level and per-field errors. */
export function useFormState<T>(submit: (values: T) => Promise<void>) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function run(values: T) {
    setPending(true);
    setError(null);
    setFieldErrors({});
    try {
      await submit(values);
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.message);
        const issues = e.details?.issues as FieldErrors | undefined;
        if (issues) setFieldErrors(issues);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setPending(false);
    }
  }

  return { pending, error, fieldErrors, run, firstError: (name: string) => fieldErrors[name]?.[0] };
}
