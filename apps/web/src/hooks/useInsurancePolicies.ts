'use client';

import useSWR from 'swr';
import { useCallback } from 'react';
import type { Page, InsurancePolicy, InsurancePolicyInput, InsurancePolicyPatch } from '@truewell/types';
import { api } from '@/lib/client';

export function useInsurancePolicies(params?: Record<string, string | number | boolean | undefined>) {
  const key = ['insurancePolicies', params ?? {}] as const;
  const { data, error, isLoading, mutate } = useSWR<Page<InsurancePolicy>>(key, () => api.insurancePolicies.list(params));

  const create = useCallback(
    async (input: InsurancePolicyInput) => {
      const created = await api.insurancePolicies.create(input);
      await mutate();
      return created;
    },
    [mutate],
  );

  const update = useCallback(
    async (id: string, patch: InsurancePolicyPatch) => {
      const updated = await api.insurancePolicies.update(id, patch);
      await mutate();
      return updated;
    },
    [mutate],
  );

  const remove = useCallback(
    async (id: string) => {
      await api.insurancePolicies.remove(id);
      await mutate();
    },
    [mutate],
  );

  return { items: data?.items ?? [], total: data?.total ?? 0, error, isLoading, create, update, remove, refresh: mutate };
}

export function useInsurancePolicy(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<InsurancePolicy>(id ? ['insurancePolicies', id] : null, () => api.insurancePolicies.get(id as string));
  return { item: data, error, isLoading, refresh: mutate };
}
