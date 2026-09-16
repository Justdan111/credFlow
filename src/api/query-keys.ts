import type { AuditListParams } from '@/api/audit/audit.api';
import type { CustomerListParams } from '@/api/customers/customers.api';
import type { DebtListParams } from '@/api/debts/debts.api';
import type { NoteListParams } from '@/api/notes/notes.api';
import type { PaymentListParams } from '@/api/payments/payments.api';
import type { MemberListParams } from '@/api/users/users.api';

/** Every cache key in one place, so cross-feature invalidation stays correct. */
export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
    /** Only `PATCH /auth/me` returns this shape; it is the only source of `phone`. */
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
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: MemberListParams) => [...queryKeys.users.lists(), params ?? {}] as const,
    detail: (userId: string) => [...queryKeys.users.all, 'detail', userId] as const,
  },
  notes: {
    all: ['notes'] as const,
    byCustomer: (customerId: string, params?: NoteListParams) =>
      [...queryKeys.notes.all, 'by-customer', customerId, params ?? {}] as const,
  },
  audit: {
    all: ['audit-logs'] as const,
    list: (params?: AuditListParams) => [...queryKeys.audit.all, 'list', params ?? {}] as const,
  },
  search: {
    all: ['search'] as const,
    term: (term: string) => [...queryKeys.search.all, term] as const,
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

/** Aggregates derived from customers, debts and payments. */
export const derivedQueryKeys = [
  queryKeys.dashboard.all,
  queryKeys.analytics.all,
  queryKeys.audit.all,
  queryKeys.search.all,
] as const;
