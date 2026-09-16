'use client';

import { useQuery } from '@tanstack/react-query';

import { MIN_SEARCH_LENGTH, search } from '@/api/search/search.api';
import { queryKeys } from '@/api/query-keys';

/**
 * Global search across customers, debts and payments.
 *
 * Pass an already-debounced term: one request per keystroke both hammers the
 * API and races, since a slow early response can land after a later one.
 */
export function useSearch(term: string, enabled = true) {
  const trimmed = term.trim();
  return useQuery({
    queryKey: queryKeys.search.term(trimmed),
    queryFn: () => search(trimmed),
    enabled: enabled && trimmed.length >= MIN_SEARCH_LENGTH,
    // Results go stale quickly in a list people are actively editing, but not
    // within the few seconds a dropdown stays open.
    staleTime: 15 * 1000,
  });
}
