import { apiClient, cleanParams, unwrap } from '@/api/client';
import type { ApiEnvelope } from '@/api/types';

/**
 * A headline number plus its movement against the previous period.
 *
 * `change` is null when the previous period was zero — a percentage change
 * from nothing is undefined, and the UI must show "no comparison" rather than
 * invent a figure.
 */
export interface Metric {
  value: number;
  change: number | null;
  direction?: 'up' | 'down' | 'flat' | '';
}

export interface DashboardSummary {
  currency: string;
  outstanding: Metric;
  overdue: Metric & {
    /** Distinct customers holding an overdue debt. */
    customerCount: number;
    /** How many of those first fell overdue this month. */
    newCount: number;
  };
  customers: Metric & { newThisMonth: number };
  collected: Metric;
}

export interface RecentDebt {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  /** `YYYY-MM-DD`. */
  dueDate: string;
  status: string;
  /** Null unless the debt is actually overdue. */
  daysOverdue: number | null;
}

export interface RecentPayment {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  method: string;
  paidAt: string;
}

export interface RiskBucket {
  riskLevel: string;
  customerCount: number;
  percentage: number;
}

export interface TrendPoint {
  /** `YYYY-MM`. */
  month: string;
  label: string;
  collections: number;
  /** Closing balance for that month, so points are comparable. */
  outstanding: number;
}

export interface CollectionsTrend {
  currency: string;
  points: TrendPoint[];
}

export async function getSummary(): Promise<DashboardSummary> {
  return unwrap(await apiClient.get<ApiEnvelope<DashboardSummary>>('/dashboard/summary'));
}

export async function getRecentDebts(limit?: number): Promise<RecentDebt[]> {
  const response = await apiClient.get<ApiEnvelope<RecentDebt[]>>('/dashboard/recent-debts', {
    params: cleanParams({ limit }),
  });
  return unwrap(response) ?? [];
}

export async function getRecentPayments(limit?: number): Promise<RecentPayment[]> {
  const response = await apiClient.get<ApiEnvelope<RecentPayment[]>>('/dashboard/recent-payments', {
    params: cleanParams({ limit }),
  });
  return unwrap(response) ?? [];
}

export async function getRiskDistribution(): Promise<RiskBucket[]> {
  const response = await apiClient.get<ApiEnvelope<RiskBucket[]>>('/dashboard/risk-distribution');
  return unwrap(response) ?? [];
}

export async function getCollectionsTrend(months?: number): Promise<CollectionsTrend> {
  const response = await apiClient.get<ApiEnvelope<CollectionsTrend>>(
    '/dashboard/collections-trend',
    { params: cleanParams({ months }) },
  );
  return unwrap(response);
}
