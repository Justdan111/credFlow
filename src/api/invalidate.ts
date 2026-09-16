'use client';

import type { QueryClient } from '@tanstack/react-query';

import { derivedQueryKeys, queryKeys } from '@/api/query-keys';

/**
 * A payment changes its debt, its customer's exposure and every aggregate built
 * on them, so money-moving writes invalidate the whole cluster rather than
 * hand-picking keys at each call site.
 */
export function invalidateFinancials(queryClient: QueryClient): void {
  const roots = [
    queryKeys.customers.all,
    queryKeys.debts.all,
    queryKeys.payments.all,
    ...derivedQueryKeys,
  ];
  for (const queryKey of roots) {
    void queryClient.invalidateQueries({ queryKey });
  }
}

export function invalidateAfterOnboarding(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
  invalidateFinancials(queryClient);
}
