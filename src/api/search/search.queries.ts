'use client';

import { useQuery } from '@tanstack/react-query';

import { MIN_SEARCH_LENGTH, search } from '@/api/search/search.api';
import { queryKeys } from '@/api/query-keys';

/** Pass an already-debounced term: one request per keystroke races. */
export function useSearch(term: string, enabled = true) {
  const trimmed = term.trim();
  return useQuery({
    queryKey: queryKeys.search.term(trimmed),
    queryFn: () => search(trimmed),
    enabled: enabled && trimmed.length >= MIN_SEARCH_LENGTH,
    staleTime: 15 * 1000,
  });
}
