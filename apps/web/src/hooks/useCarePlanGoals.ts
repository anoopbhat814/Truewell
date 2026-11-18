'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, CarePlanGoal, CarePlanGoalInput, CarePlanGoalPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useCarePlanGoals(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['carePlanGoals', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<CarePlanGoal>>(key, () => api.carePlanGoals.list(params));

  const create = useCallback(
    async (input: CarePlanGoalInput) => {
      const created = await api.carePlanGoals.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: CarePlanGoalPatch) => {
      const updated = await api.carePlanGoals.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.carePlanGoals.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useCarePlanGoal(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<CarePlanGoal>(id ? ['carePlanGoals', id] : null, () => api.carePlanGoals.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
