'use client';

import { useSyncExternalStore } from 'react';

/** No external store to watch: the value is constant per environment. */
const subscribe = () => () => {};

/**
 * False during server rendering and the first client render, true afterwards.
 *
 * Used for UI that depends on browser-only state — the resolved colour theme,
 * for one — where rendering the real value immediately would cause a
 * hydration mismatch. `useSyncExternalStore` expresses this without the
 * set-state-in-an-effect pattern.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
