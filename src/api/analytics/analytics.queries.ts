'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import {
  exportAnalyticsCsv,
  getCollectionRate,
  getCustomerSegments,
  getRiskTrend,
} from '@/api/analytics/analytics.api';
import { queryKeys } from '@/api/query-keys';

const AGGREGATE_STALE_TIME = 60 * 1000;

export function useCollectionRate(months = 6, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.collectionRate(months),
    queryFn: () => getCollectionRate(months),
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useRiskTrend(months = 6, enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.riskTrend(months),
    queryFn: () => getRiskTrend(months),
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

export function useCustomerSegments(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics.customerSegments(),
    queryFn: getCustomerSegments,
    enabled,
    staleTime: AGGREGATE_STALE_TIME,
  });
}

/**
 * Downloads the CSV export.
 *
 * A mutation rather than a query: it is a user-triggered side effect with a
 * file as its result, and caching a blob would serve a stale download.
 */
export function useExportAnalytics() {
  return useMutation({
    mutationFn: async (months: number) => {
      const blob = await exportAnalyticsCsv(months);
      downloadBlob(blob, `credflow-analytics-${new Date().toISOString().slice(0, 10)}.csv`);
    },
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Releasing the object URL keeps the blob from being held for the page's life.
  URL.revokeObjectURL(url);
}
