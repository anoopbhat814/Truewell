'use client';

import useSWR from 'swr';
import type { SessionUser } from '@truewell/types';
import { api } from '@/lib/client';

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR<SessionUser>('session', () => api.http.get<SessionUser>('/api/auth/me'), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
  });
  const signOut = async () => {
    await api.http.post('/api/auth/logout');
    await mutate(undefined, { revalidate: false });
    window.location.assign('/login');
  };
  return { user: data, isLoading, isSignedOut: !!error, signOut };
}
