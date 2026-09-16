'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { TrendPoint } from '@/api/dashboard/dashboard.api';
import { axisProps, chartColors, tooltipStyle } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';
import { formatCurrency } from '@/lib/format';

export function CollectionsBarChart({
  points,
  currency,
}: {
  points: TrendPoint[];
  currency: string;
}) {
  if (points.length === 0) {
    return (
      <EmptyState
        title="No collections yet"
        description="Once payments are recorded, your monthly totals appear here."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={points} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: chartColors.primaryFaint }}
          formatter={(value) => [formatCurrency(Number(value), currency), 'Collected']}
        />
        <Bar dataKey="collections" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
