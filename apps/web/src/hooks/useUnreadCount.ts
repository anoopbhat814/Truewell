'use client';

import useSWR from 'swr';
import type { Notification, Page } from '@truewell/types';
import { api } from '@/lib/client';

export function useUnreadCount(pollMs = 60_000) {
  const { data } = useSWR<Page<Notification>>('notifications-unread', () => api.notifications.list({ limit: 100 }), {
    refreshInterval: pollMs,
    revalidateOnFocus: true,
  });
  return (data?.items ?? []).filter((n) => !n.readAt).length;
}
