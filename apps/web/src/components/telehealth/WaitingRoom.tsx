'use client';

import { Button, Card } from '@truewell/ui';
import { useCountdown } from '@/hooks/useCountdown';

export interface WaitingRoomProps {
  startsAt: string;
  clinicianName: string;
  joining: boolean;
  error: string | null;
  onJoin: () => void;
}

export function WaitingRoom({ startsAt, clinicianName, joining, error, onJoin }: WaitingRoomProps) {
  const { label, done } = useCountdown(startsAt);
  return (
    <Card title="Video visit waiting room">
      <p>
        Your visit with <strong>{clinicianName}</strong> {done ? 'is ready to begin.' : `starts in ${label}.`}
      </p>
      <ul>
        <li>Find a quiet, private space with good lighting.</li>
        <li>Allow camera and microphone access when your browser asks.</li>
        <li>Have your medication list and questions handy.</li>
      </ul>
      {error ? <p role="alert" className="tw-field__error">{error}</p> : null}
      <Button loading={joining} onClick={onJoin}>
        Join visit
      </Button>
    </Card>
  );
}
