'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Appointment, AppointmentInput, AppointmentPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useAppointments(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['appointments', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Appointment>>(key, () => api.appointments.list(params));

  const create = useCallback(
    async (input: AppointmentInput) => {
      const created = await api.appointments.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: AppointmentPatch) => {
      const updated = await api.appointments.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.appointments.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useAppointment(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Appointment>(id ? ['appointments', id] : null, () => api.appointments.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
