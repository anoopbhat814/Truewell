'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, LabOrder, LabOrderInput, LabOrderPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useLabOrders(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['labOrders', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<LabOrder>>(key, () => api.labOrders.list(params));

  const create = useCallback(
    async (input: LabOrderInput) => {
      const created = await api.labOrders.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: LabOrderPatch) => {
      const updated = await api.labOrders.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.labOrders.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useLabOrder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<LabOrder>(id ? ['labOrders', id] : null, () => api.labOrders.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
