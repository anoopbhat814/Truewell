'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import type { Message, Page } from '@truewell/types';
import { actions, api } from '@/lib/client';
import { Composer } from './Composer';
import { MessageBubble } from './MessageBubble';

export function ThreadView({ threadId, viewerUserId, initial }: { threadId: string; viewerUserId: string; initial: Message[] }) {
  const { data, mutate } = useSWR<Page<Message>>(['thread', threadId], () => api.messages.list({ threadId, limit: 100 }), {
    fallbackData: { items: initial, total: initial.length, offset: 0, limit: 100 },
    refreshInterval: 15_000,
  });
  const messages = [...(data?.items ?? [])].sort((a, b) => a.sentAt.localeCompare(b.sentAt));

  useEffect(() => {
    const unread = messages.filter((m) => m.senderId !== viewerUserId && !m.readAt);
    void Promise.all(unread.map((m) => actions.markMessageRead(m.id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  return (
    <div>
      <div className="tw-thread" aria-live="polite" style={{ marginBottom: '1rem' }}>
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} mine={m.senderId === viewerUserId} />
        ))}
      </div>
      <Composer threadId={threadId} onSent={() => void mutate()} />
    </div>
  );
}
