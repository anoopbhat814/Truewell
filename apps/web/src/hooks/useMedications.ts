'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Medication, MedicationInput, MedicationPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useMedications(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['medications', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Medication>>(key, () => api.medications.list(params));

  const create = useCallback(
    async (input: MedicationInput) => {
      const created = await api.medications.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: MedicationPatch) => {
      const updated = await api.medications.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.medications.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useMedication(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Medication>(id ? ['medications', id] : null, () => api.medications.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
