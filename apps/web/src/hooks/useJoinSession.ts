'use client';

import { useCallback, useState } from 'react';
import type { JoinTicket } from '@truewell/types';
import { ApiError } from '@truewell/api-client';
import { actions } from '@/lib/client';

export function useJoinSession(sessionId: string) {
  const [ticket, setTicket] = useState<JoinTicket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);

  const join = useCallback(async () => {
    setJoining(true);
    setError(null);
    try {
      setTicket(await actions.joinSession(sessionId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not join the session. Check your connection and try again.');
    } finally {
      setJoining(false);
    }
  }, [sessionId]);

  const leave = useCallback(() => setTicket(null), []);
  return { ticket, error, joining, join, leave };
}
