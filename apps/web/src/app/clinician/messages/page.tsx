import type { Metadata } from 'next';
import type { MessageThread } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThreadList } from '@/components/messaging/ThreadList';
import { apiList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Inbox' };

export default async function InboxPage() {
  const threads = await apiList<MessageThread>('/message-threads');
  return (
    <>
      <PageHeader title="Inbox" />
      <Card>
        <ThreadList threads={threads} basePath="/clinician/messages" />
      </Card>
    </>
  );
}
