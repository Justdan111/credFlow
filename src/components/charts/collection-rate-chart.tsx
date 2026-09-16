'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { CollectionRatePoint } from '@/api/analytics/analytics.api';
import { axisProps, chartColors, tooltipStyle } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';
import { formatCurrency } from '@/lib/format';

const SERIES_LABELS: Record<string, string> = { actual: 'Collected', target: 'Target' };

/**
 * Collected against target. The target series is only drawn when a target
 * exists — an empty bar beside every month would read as "missed by 100%".
 */
export function CollectionRateChart({
  points,
  currency,
  hasTarget,
}: {
  points: CollectionRatePoint[];
  currency: string;
  hasTarget: boolean;
}) {
  if (points.length === 0) {
    return (
      <EmptyState
        title="No collection history yet"
        description="Record payments to see how each month compares."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={points} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ fill: chartColors.primaryFaint }}
          formatter={(value, name) => [
            formatCurrency(Number(value), currency),
            SERIES_LABELS[String(name)] ?? String(name),
          ]}
        />
        {hasTarget && <Bar dataKey="target" fill={chartColors.primaryFaint} radius={[4, 4, 0, 0]} />}
        <Bar dataKey="actual" fill={chartColors.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
