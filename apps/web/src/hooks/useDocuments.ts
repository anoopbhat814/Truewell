'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, Document, DocumentInput, DocumentPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useDocuments(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['documents', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<Document>>(key, () => api.documents.list(params));

  const create = useCallback(
    async (input: DocumentInput) => {
      const created = await api.documents.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: DocumentPatch) => {
      const updated = await api.documents.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.documents.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useDocument(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<Document>(id ? ['documents', id] : null, () => api.documents.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
