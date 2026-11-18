'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, AvailabilitySlot, AvailabilitySlotInput, AvailabilitySlotPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useAvailabilitySlots(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['availabilitySlots', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<AvailabilitySlot>>(key, () => api.availabilitySlots.list(params));

  const create = useCallback(
    async (input: AvailabilitySlotInput) => {
      const created = await api.availabilitySlots.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: AvailabilitySlotPatch) => {
      const updated = await api.availabilitySlots.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.availabilitySlots.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useAvailabilitySlot(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<AvailabilitySlot>(id ? ['availabilitySlots', id] : null, () => api.availabilitySlots.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
