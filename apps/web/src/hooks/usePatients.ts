'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Patient, PatientInput, PatientPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function usePatients(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['patients', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Patient>>(key, () => api.patients.list(params));

  const create = useCallback(
    async (input: PatientInput) => {
      const created = await api.patients.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: PatientPatch) => {
      const updated = await api.patients.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.patients.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function usePatient(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Patient>(id ? ['patients', id] : null, () => api.patients.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
