'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Allergy, AllergyInput, AllergyPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useAllergies(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['allergies', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Allergy>>(key, () => api.allergies.list(params));

  const create = useCallback(
    async (input: AllergyInput) => {
      const created = await api.allergies.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: AllergyPatch) => {
      const updated = await api.allergies.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.allergies.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useAllergy(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Allergy>(id ? ['allergies', id] : null, () => api.allergies.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
