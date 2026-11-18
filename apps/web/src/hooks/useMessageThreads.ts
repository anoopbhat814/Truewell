'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, MessageThread, MessageThreadInput, MessageThreadPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useMessageThreads(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['messageThreads', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<MessageThread>>(key, () => api.messageThreads.list(params));

  const create = useCallback(
    async (input: MessageThreadInput) => {
      const created = await api.messageThreads.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: MessageThreadPatch) => {
      const updated = await api.messageThreads.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.messageThreads.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useMessageThread(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<MessageThread>(id ? ['messageThreads', id] : null, () => api.messageThreads.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
