"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const POLL_MS = 60_000;
const ENDPOINT = "/api/tally";

interface TallyResponse {
  total: number;
  throttled?: boolean;
  error?: string;
}

// Module-level pubsub so a successful bumpTally() call updates every
// useTally() consumer in the page immediately, instead of waiting for
// the next poll cycle.
type TallyListener = (total: number) => void;
const tallyListeners = new Set<TallyListener>();

function broadcast(total: number) {
  tallyListeners.forEach((fn) => fn(total));
}

/**
 * Read-only hook: fetches the global tally on mount, polls every
 * 60s, and accepts optimistic local bumps via `bumpLocal`.
 */
export function useTally() {
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);
  const mounted = useRef(true);

  const fetchTotal = useCallback(async () => {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      if (!res.ok) throw new Error("bad-status");
      const data = (await res.json()) as TallyResponse;
      if (!mounted.current) return;
      setTotal(data.total);
      setError(false);
    } catch {
      if (!mounted.current) return;
      setError(true);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchTotal();
    const id = window.setInterval(fetchTotal, POLL_MS);

    // Subscribe to in-page bumps so this consumer updates instantly
    // when bumpTally() succeeds elsewhere in the same window.
    const listener: TallyListener = (newTotal) => {
      if (mounted.current) {
        setTotal(newTotal);
        setError(false);
      }
    };
    tallyListeners.add(listener);

    return () => {
      mounted.current = false;
      window.clearInterval(id);
      tallyListeners.delete(listener);
    };
  }, [fetchTotal]);

  const bumpLocal = useCallback(() => {
    setTotal((t) => (typeof t === "number" ? t + 1 : t));
  }, []);

  return { total, error, refresh: fetchTotal, bumpLocal };
}

/**
 * Fire-and-forget POST to increment the global counter. Returns the
 * server's new total when successful (useful for syncing optimistic UI).
 * Failures are silent — the counter is best-effort and undercount is
 * acceptable.
 */
export async function bumpTally(): Promise<number | null> {
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      cache: "no-store",
      keepalive: true, // survive page navigation
    });
    if (!res.ok) return null;
    const data = (await res.json()) as TallyResponse;
    if (typeof data.total === "number") {
      broadcast(data.total);
    }
    return data.total;
  } catch {
    return null;
  }
}
