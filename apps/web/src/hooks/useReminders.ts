'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Reminder, ReminderInput, ReminderPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useReminders(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['reminders', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Reminder>>(key, () => api.reminders.list(params));

  const create = useCallback(
    async (input: ReminderInput) => {
      const created = await api.reminders.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: ReminderPatch) => {
      const updated = await api.reminders.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.reminders.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useReminder(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Reminder>(id ? ['reminders', id] : null, () => api.reminders.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
