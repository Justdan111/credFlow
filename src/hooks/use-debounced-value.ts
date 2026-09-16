'use client';

import { useEffect, useState } from 'react';

/**
 * Delays a fast-changing value so it can drive a server query.
 *
 * Search boxes are the reason this exists: sending one request per keystroke
 * both hammers the API and races — a slow early response can land after a
 * later one and repaint the table with stale rows.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
