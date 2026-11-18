'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Notification, NotificationInput, NotificationPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useNotifications(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['notifications', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Notification>>(key, () => api.notifications.list(params));

  const create = useCallback(
    async (input: NotificationInput) => {
      const created = await api.notifications.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: NotificationPatch) => {
      const updated = await api.notifications.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.notifications.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useNotification(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Notification>(id ? ['notifications', id] : null, () => api.notifications.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
