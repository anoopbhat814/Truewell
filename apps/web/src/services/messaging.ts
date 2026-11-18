import type { Message, MessageThread } from '@truewell/types';

export function unreadCount(messages: Message[], viewerUserId: string): number {
  return messages.filter((m) => m.senderId !== viewerUserId && !m.readAt).length;
}

export function sortThreads(threads: MessageThread[]): MessageThread[] {
  return [...threads]
    .filter((t) => !t.archived)
    .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export function preview(body: string, max = 80): string {
  const flat = body.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}...` : flat;
}

export function validateDraft(body: string): string | null {
  const trimmed = body.trim();
  if (!trimmed) return 'Write a message before sending.';
  if (trimmed.length > 10_000) return 'Messages are limited to 10,000 characters.';
  return null;
}
