'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, CarePlanTask, CarePlanTaskInput, CarePlanTaskPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useCarePlanTasks(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['carePlanTasks', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<CarePlanTask>>(key, () => api.carePlanTasks.list(params));

  const create = useCallback(
    async (input: CarePlanTaskInput) => {
      const created = await api.carePlanTasks.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: CarePlanTaskPatch) => {
      const updated = await api.carePlanTasks.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.carePlanTasks.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useCarePlanTask(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CarePlanTask>(id ? ['carePlanTasks', id] : null, () => api.carePlanTasks.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
