'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Pharmacy, PharmacyInput, PharmacyPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function usePharmacies(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['pharmacies', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Pharmacy>>(key, () => api.pharmacies.list(params));

  const create = useCallback(
    async (input: PharmacyInput) => {
      const created = await api.pharmacies.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: PharmacyPatch) => {
      const updated = await api.pharmacies.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.pharmacies.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function usePharmacy(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Pharmacy>(id ? ['pharmacies', id] : null, () => api.pharmacies.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
