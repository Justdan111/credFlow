import type { CustomerListParams } from '@/api/customers/customers.api';
import type { DebtListParams } from '@/api/debts/debts.api';
import type { PaymentListParams } from '@/api/payments/payments.api';

/**
 * Every cache key in one place.
 *
 * Money moves across features — recording a payment changes a debt, a
 * customer's balance, the dashboard tiles and the analytics series — so
 * invalidation is cross-cutting by nature. Keeping the keys together lets
 * `invalidateFinancials` below stay correct as features are added, instead of
 * each mutation guessing which other modules it should touch.
 */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    /** `GET /auth/me` — the signed-in user plus their business. */
    session: () => [...queryKeys.auth.all, 'session'] as const,
    /** The flat profile echoed back by `PATCH /auth/me`; carries `phone`. */
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    sessions: () => [...queryKeys.auth.all, 'sessions'] as const,
  },
  businesses: {
    all: ['businesses'] as const,
    current: () => [...queryKeys.businesses.all, 'current'] as const,
    onboardingStatus: () => [...queryKeys.businesses.all, 'onboarding-status'] as const,
  },
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (params?: CustomerListParams) => [...queryKeys.customers.lists(), params ?? {}] as const,
    detail: (customerId: string) => [...queryKeys.customers.all, 'detail', customerId] as const,
  },
  debts: {
    all: ['debts'] as const,
    lists: () => [...queryKeys.debts.all, 'list'] as const,
    list: (params?: DebtListParams) => [...queryKeys.debts.lists(), params ?? {}] as const,
    byCustomer: (customerId: string, params?: Omit<DebtListParams, 'customerId'>) =>
      [...queryKeys.debts.all, 'by-customer', customerId, params ?? {}] as const,
    detail: (debtId: string) => [...queryKeys.debts.all, 'detail', debtId] as const,
  },
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (params?: PaymentListParams) => [...queryKeys.payments.lists(), params ?? {}] as const,
    byCustomer: (customerId: string, params?: Omit<PaymentListParams, 'customerId'>) =>
      [...queryKeys.payments.all, 'by-customer', customerId, params ?? {}] as const,
    byDebt: (debtId: string, params?: Omit<PaymentListParams, 'debtId'>) =>
      [...queryKeys.payments.all, 'by-debt', debtId, params ?? {}] as const,
    detail: (paymentId: string) => [...queryKeys.payments.all, 'detail', paymentId] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    summary: () => [...queryKeys.dashboard.all, 'summary'] as const,
    recentDebts: (limit?: number) => [...queryKeys.dashboard.all, 'recent-debts', limit] as const,
    recentPayments: (limit?: number) =>
      [...queryKeys.dashboard.all, 'recent-payments', limit] as const,
    riskDistribution: () => [...queryKeys.dashboard.all, 'risk-distribution'] as const,
    collectionsTrend: (months?: number) =>
      [...queryKeys.dashboard.all, 'collections-trend', months] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    collectionRate: (months?: number) =>
      [...queryKeys.analytics.all, 'collection-rate', months] as const,
    riskTrend: (months?: number) => [...queryKeys.analytics.all, 'risk-trend', months] as const,
    customerSegments: () => [...queryKeys.analytics.all, 'customer-segments'] as const,
  },
} as const;

/**
 * Aggregates that are derived from customers, debts and payments. Any write to
 * one of those invalidates these too, otherwise the dashboard keeps showing a
 * total that no longer matches the rows below it.
 */
export const derivedQueryKeys = [queryKeys.dashboard.all, queryKeys.analytics.all] as const;
