'use client';

import { useEffect, useState } from 'react';

export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useCountdown(targetIso: string) {
  const compute = () => Math.ceil((new Date(targetIso).getTime() - Date.now()) / 1000);
  const [seconds, setSeconds] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setSeconds(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetIso]);
  return { seconds, label: formatCountdown(seconds), done: seconds <= 0 };
}
