import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Message, MessageThread } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThreadView } from '@/components/messaging/ThreadView';
import { apiGet, apiList, ServerApiError } from '@/lib/server-api';
import { getSession } from '@/lib/session';

export const metadata: Metadata = { title: 'Conversation' };

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const session = getSession();
  try {
    const thread = await apiGet<MessageThread>(`/message-threads/${params.id}`);
    const messages = await apiList<Message>('/messages', { threadId: thread.id });
    return (
      <>
        <PageHeader title={thread.subject} />
        <Card>
          <ThreadView threadId={thread.id} viewerUserId={session?.userId ?? ''} initial={messages} />
        </Card>
      </>
    );
  } catch (e) {
    if (e instanceof ServerApiError && (e.status === 404 || e.status === 403)) notFound();
    throw e;
  }
}
