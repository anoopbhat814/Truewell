import type { Metadata } from 'next';
import type { MessageThread } from '@truewell/types';
import { Card } from '@truewell/ui';
import { PageHeader } from '@/components/layout/PageHeader';
import { ThreadList } from '@/components/messaging/ThreadList';
import { apiList } from '@/lib/server-api';

export const metadata: Metadata = { title: 'Messages' };

export default async function MessagesPage() {
  const threads = await apiList<MessageThread>('/message-threads');
  return (
    <>
      <PageHeader title="Messages" subtitle="Secure conversations with your care team." />
      <Card>
        <ThreadList threads={threads} basePath="/portal/messages" />
      </Card>
    </>
  );
}
