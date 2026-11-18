'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, AppointmentType, AppointmentTypeInput, AppointmentTypePatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useAppointmentTypes(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['appointmentTypes', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<AppointmentType>>(key, () => api.appointmentTypes.list(params));

  const create = useCallback(
    async (input: AppointmentTypeInput) => {
      const created = await api.appointmentTypes.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: AppointmentTypePatch) => {
      const updated = await api.appointmentTypes.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.appointmentTypes.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useAppointmentType(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AppointmentType>(id ? ['appointmentTypes', id] : null, () => api.appointmentTypes.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
