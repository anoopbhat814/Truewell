'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Claim, ClaimInput, ClaimPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useClaims(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['claims', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Claim>>(key, () => api.claims.list(params));

  const create = useCallback(
    async (input: ClaimInput) => {
      const created = await api.claims.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: ClaimPatch) => {
      const updated = await api.claims.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.claims.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useClaim(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Claim>(id ? ['claims', id] : null, () => api.claims.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
