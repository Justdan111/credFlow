import { apiClient, cleanParams, unwrap } from '@/api/client';
import type { ApiEnvelope } from '@/api/types';

export interface CollectionRatePoint {
  month: string;
  label: string;
  actual: number;
  /** Null when the business has set no monthly collection target. */
  target: number | null;
  /** Percentage of target achieved; null alongside a null target. */
  rate: number | null;
}

export interface CollectionRate {
  currency: string;
  target: number | null;
  points: CollectionRatePoint[];
}

export interface RiskTrendPoint {
  month: string;
  label: string;
  low: number;
  medium: number;
  high: number;
}

/**
 * Risk history comes from daily snapshots, so a short series can mean either
 * young history or no customers. `meta` is what tells those apart.
 */
export interface RiskTrend {
  points: RiskTrendPoint[];
  meta: {
    historyStartedAt: string | null;
    monthsAvailable: number;
  };
}

export interface CustomerSegment {
  label: string;
  min: number;
  /** Null means the top, unbounded segment. */
  max: number | null;
  customerCount: number;
}

export interface CustomerSegments {
  currency: string;
  segments: CustomerSegment[];
}

export async function getCollectionRate(months?: number): Promise<CollectionRate> {
  const response = await apiClient.get<ApiEnvelope<CollectionRate>>('/analytics/collection-rate', {
    params: cleanParams({ months }),
  });
  return unwrap(response);
}

export async function getRiskTrend(months?: number): Promise<RiskTrend> {
  const response = await apiClient.get<ApiEnvelope<RiskTrend>>('/analytics/risk-trend', {
    params: cleanParams({ months }),
  });
  return unwrap(response);
}

export async function getCustomerSegments(): Promise<CustomerSegments> {
  return unwrap(
    await apiClient.get<ApiEnvelope<CustomerSegments>>('/analytics/customer-segments'),
  );
}

/**
 * Downloads the analytics export.
 *
 * This route streams a CSV file rather than the JSON envelope, so the response
 * is read as a blob and must not go through `unwrap`.
 */
export async function exportAnalyticsCsv(months?: number): Promise<Blob> {
  const response = await apiClient.get('/analytics/export', {
    params: cleanParams({ format: 'csv', months }),
    responseType: 'blob',
  });
  return response.data as Blob;
}
