'use client';

import type { QueryClient } from '@tanstack/react-query';

import { derivedQueryKeys, queryKeys } from '@/api/query-keys';

/**
 * Marks everything a money-moving write can affect as stale.
 *
 * Debts, payments and customers are entangled: a payment changes its debt's
 * remaining balance, which changes the customer's exposure, which changes the
 * dashboard and analytics aggregates. Invalidating the whole cluster once is
 * both cheaper to reason about and safer than hand-picking keys at each call
 * site, where a missed one shows the user a stale number.
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

/** Onboarding writes a business profile, a customer and a debt in one call. */
export function invalidateAfterOnboarding(queryClient: QueryClient): void {
  void queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
  invalidateFinancials(queryClient);
}
