import { useState, useEffect } from 'react';

export function useCountdown(expiresAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, expiresAt - now);
  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isExpired: diff === 0,
  };
}
