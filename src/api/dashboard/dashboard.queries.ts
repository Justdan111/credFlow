'use client';

import { useQuery } from '@tanstack/react-query';

import {
  getCollectionsTrend,
  getRecentDebts,
  getRecentPayments,
  getRiskDistribution,
  getSummary,
} from '@/api/dashboard/dashboard.api';
import { queryKeys } from '@/api/query-keys';

/** Aggregates are recomputed server-side; a minute of staleness is plenty. */
const AGGREGATE_STALE_TIME = 60 * 1000;

export function useDashboardSummary(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: getSummary,
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useRecentDebts(limit = 5, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentDebts(limit),
    queryFn: () => getRecentDebts(limit),
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useRecentPayments(limit = 5, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.recentPayments(limit),
    queryFn: () => getRecentPayments(limit),
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useRiskDistribution(enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.riskDistribution(),
    queryFn: getRiskDistribution,
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useCollectionsTrend(months = 6, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dashboard.collectionsTrend(months),
    queryFn: () => getCollectionsTrend(months),
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}
