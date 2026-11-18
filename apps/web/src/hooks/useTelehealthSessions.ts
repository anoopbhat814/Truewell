'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, TelehealthSession, TelehealthSessionInput, TelehealthSessionPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useTelehealthSessions(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['telehealthSessions', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<TelehealthSession>>(key, () => api.telehealthSessions.list(params));

  const create = useCallback(
    async (input: TelehealthSessionInput) => {
      const created = await api.telehealthSessions.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: TelehealthSessionPatch) => {
      const updated = await api.telehealthSessions.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.telehealthSessions.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useTelehealthSession(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<TelehealthSession>(id ? ['telehealthSessions', id] : null, () => api.telehealthSessions.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
