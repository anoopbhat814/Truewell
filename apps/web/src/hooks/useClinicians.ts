'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Clinician, ClinicianInput, ClinicianPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useClinicians(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['clinicians', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Clinician>>(key, () => api.clinicians.list(params));

  const create = useCallback(
    async (input: ClinicianInput) => {
      const created = await api.clinicians.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: ClinicianPatch) => {
      const updated = await api.clinicians.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.clinicians.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useClinician(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Clinician>(id ? ['clinicians', id] : null, () => api.clinicians.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
