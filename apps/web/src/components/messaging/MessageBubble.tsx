import type { Message } from '@truewell/types';
import { formatDateTime } from '@truewell/utils';

export function MessageBubble({ message, mine }: { message: Message; mine: boolean }) {
  return (
    <div className={`tw-bubble${mine ? ' tw-bubble--mine' : ''}`}>
      <div style={{ whiteSpace: 'pre-wrap' }}>{message.body}</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
        {formatDateTime(message.sentAt)}
        {mine && message.readAt ? ' - Read' : ''}
      </div>
    </div>
  );
}
