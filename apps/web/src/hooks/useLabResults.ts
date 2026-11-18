'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, LabResult, LabResultInput, LabResultPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useLabResults(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['labResults', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<LabResult>>(key, () => api.labResults.list(params));

  const create = useCallback(
    async (input: LabResultInput) => {
      const created = await api.labResults.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: LabResultPatch) => {
      const updated = await api.labResults.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.labResults.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useLabResult(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<LabResult>(id ? ['labResults', id] : null, () => api.labResults.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
