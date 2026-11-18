import { describe, expect, it } from 'vitest';
import type { Message, MessageThread } from '@truewell/types';
import { preview, sortThreads, unreadCount, validateDraft } from './messaging';

const msg = (over: Partial<Message>): Message => ({ id: 'm', threadId: 't', senderId: 'a', body: 'hi', readAt: null, sentAt: 'x', ...over });
const thread = (over: Partial<MessageThread>): MessageThread => ({
  id: 't', patientId: 'p', clinicianId: null, subject: 's', archived: false, lastMessageAt: '2025-01-01', ...over,
});

describe('messaging services', () => {
  it('counts only unread messages from others', () => {
    expect(unreadCount([msg({}), msg({ readAt: 'y' }), msg({ senderId: 'me' })], 'me')).toBe(2);
  });

  it('sorts newest first and hides archived threads', () => {
    const ids = sortThreads([thread({ id: 'old' }), thread({ id: 'new', lastMessageAt: '2025-02-01' }), thread({ id: 'gone', archived: true })]).map((t) => t.id);
    expect(ids).toEqual(['new', 'old']);
  });

  it('previews and validates', () => {
    expect(preview('a   b\n c')).toBe('a b c');
    expect(preview('x'.repeat(200), 10)).toHaveLength(10);
    expect(validateDraft('   ')).toMatch(/before sending/);
    expect(validateDraft('ok')).toBeNull();
  });
});
