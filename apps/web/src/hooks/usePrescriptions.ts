'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Prescription, PrescriptionInput, PrescriptionPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function usePrescriptions(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['prescriptions', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Prescription>>(key, () => api.prescriptions.list(params));

  const create = useCallback(
    async (input: PrescriptionInput) => {
      const created = await api.prescriptions.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: PrescriptionPatch) => {
      const updated = await api.prescriptions.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.prescriptions.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function usePrescription(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Prescription>(id ? ['prescriptions', id] : null, () => api.prescriptions.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
