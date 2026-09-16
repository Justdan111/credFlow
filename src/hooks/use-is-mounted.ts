'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/** False during SSR and the first client render, so browser-only state can be
 *  rendered after hydration without a mismatch. */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
