'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Message, MessageInput, MessagePatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useMessages(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['messages', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Message>>(key, () => api.messages.list(params));

  const create = useCallback(
    async (input: MessageInput) => {
      const created = await api.messages.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: MessagePatch) => {
      const updated = await api.messages.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.messages.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useMessage(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Message>(id ? ['messages', id] : null, () => api.messages.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
