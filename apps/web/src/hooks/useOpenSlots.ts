'use client';

import useSWR from 'swr';
import type { OpenSlot } from '@truewell/types';
import { actions } from '@/lib/client';

export function useOpenSlots(clinicianId: string | null, day: string | null, minutes = 20) {
  const key = clinicianId && day ? (['open-slots', clinicianId, day, minutes] as const) : null;
  const { data, error, isLoading } = useSWR<OpenSlot[]>(key, () => actions.openSlots(clinicianId as string, day as string, minutes));
  return { slots: data ?? [], error, isLoading };
}
