import { apiClient, cleanParams, unwrap } from '@/api/client';
import type { ApiEnvelope } from '@/api/types';

/** The API rejects a shorter term: almost every row would match. */
export const MIN_SEARCH_LENGTH = 2;

export type SearchResultType = 'customer' | 'debt' | 'payment';

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  amount?: number;
  date?: string;
}

export interface SearchResults {
  query: string;
  customers: SearchResult[];
  debts: SearchResult[];
  payments: SearchResult[];
}

const EMPTY_RESULTS: SearchResults = {
  query: '',
  customers: [],
  debts: [],
  payments: [],
};

/** `%` and `_` are escaped server-side, so they match literally. */
export async function search(term: string, limit?: number): Promise<SearchResults> {
  const trimmed = term.trim();
  // Short-circuits rather than sending a request the API answers with 400.
  if (trimmed.length < MIN_SEARCH_LENGTH) return { ...EMPTY_RESULTS, query: trimmed };

  const response = await apiClient.get<ApiEnvelope<SearchResults>>('/search', {
    params: cleanParams({ q: trimmed, limit }),
  });
  return unwrap(response);
}

export function totalResults(results: SearchResults | undefined): number {
  if (!results) return 0;
  return results.customers.length + results.debts.length + results.payments.length;
}
