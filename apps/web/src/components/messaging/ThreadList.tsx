import Link from 'next/link';
import type { MessageThread } from '@truewell/types';
import { relativeTime } from '@truewell/utils';
import { sortThreads } from '@/services/messaging';

export function ThreadList({ threads, basePath, unread = {} }: { threads: MessageThread[]; basePath: string; unread?: Record<string, number> }) {
  const sorted = sortThreads(threads);
  if (sorted.length === 0) return <p className="tw-empty">No conversations yet.</p>;
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {sorted.map((t) => (
        <li key={t.id} style={{ borderBottom: '1px solid var(--tw-border)' }}>
          <Link href={`${basePath}/${t.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0.25rem', textDecoration: 'none' }}>
            <span style={{ fontWeight: unread[t.id] ? 700 : 400 }}>{t.subject}</span>
            <span style={{ color: 'var(--tw-muted)' }}>
              {unread[t.id] ? `${unread[t.id]} new - ` : ''}
              {relativeTime(t.lastMessageAt)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
