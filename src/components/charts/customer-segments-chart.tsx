'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { CustomerSegment } from '@/api/analytics/analytics.api';
import { axisProps, chartColors, tooltipStyle } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';
import { formatNumber } from '@/lib/format';

/**
 * Customers bucketed by lifetime debt value. The API sends the bounds with
 * each segment, so no currency thresholds are hard-coded here.
 */
export function CustomerSegmentsChart({ segments }: { segments: CustomerSegment[] }) {
  const hasCustomers = segments.some((segment) => segment.customerCount > 0);

  if (!hasCustomers) {
    return (
      <EmptyState
        title="No customer value data yet"
        description="Segments appear once customers have debts recorded against them."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={segments} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
        <XAxis type="number" allowDecimals={false} {...axisProps} />
        <YAxis dataKey="label" type="category" width={110} {...axisProps} />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: chartColors.primaryFaint }}
          formatter={(value) => [formatNumber(Number(value)), 'Customers']}
        />
        <Bar dataKey="customerCount" fill={chartColors.primary} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
