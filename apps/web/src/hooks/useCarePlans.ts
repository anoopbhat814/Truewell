'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, CarePlan, CarePlanInput, CarePlanPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useCarePlans(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['carePlans', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<CarePlan>>(key, () => api.carePlans.list(params));

  const create = useCallback(
    async (input: CarePlanInput) => {
      const created = await api.carePlans.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: CarePlanPatch) => {
      const updated = await api.carePlans.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.carePlans.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useCarePlan(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CarePlan>(id ? ['carePlans', id] : null, () => api.carePlans.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
