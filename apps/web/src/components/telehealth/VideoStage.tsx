'use client';

import type { JoinTicket } from '@truewell/types';
import { Button } from '@truewell/ui';

export interface VideoStageProps {
  ticket: JoinTicket;
  onLeave: () => void;
}

/** Embeds the provider room. The signed token is passed in the URL fragment so it never reaches server logs. */
export function VideoStage({ ticket, onLeave }: VideoStageProps) {
  const src = `${ticket.url}#token=${encodeURIComponent(ticket.token)}&exp=${ticket.expiresAt}`;
  return (
    <div>
      <iframe
        title="Telehealth visit"
        src={src}
        allow="camera; microphone; fullscreen; display-capture"
        className="tw-video"
        style={{ width: '100%', border: 0 }}
      />
      <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="danger" onClick={onLeave}>
          Leave visit
        </Button>
      </div>
    </div>
  );
}
