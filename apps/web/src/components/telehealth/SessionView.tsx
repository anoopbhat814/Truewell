'use client';

import { useJoinSession } from '@/hooks/useJoinSession';
import { VideoStage } from './VideoStage';
import { WaitingRoom } from './WaitingRoom';

export function SessionView({ sessionId, startsAt, clinicianName }: { sessionId: string; startsAt: string; clinicianName: string }) {
  const { ticket, error, joining, join, leave } = useJoinSession(sessionId);
  if (ticket) return <VideoStage ticket={ticket} onLeave={leave} />;
  return <WaitingRoom startsAt={startsAt} clinicianName={clinicianName} joining={joining} error={error} onJoin={join} />;
}
