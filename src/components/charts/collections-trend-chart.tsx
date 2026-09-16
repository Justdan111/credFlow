'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { TrendPoint } from '@/api/dashboard/dashboard.api';
import { axisProps, chartColors, tooltipStyle } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';
import { formatCurrency } from '@/lib/format';

const SERIES_LABELS: Record<string, string> = {
  collections: 'Collected',
  outstanding: 'Outstanding',
};

/** Collections against the closing outstanding balance, month by month. */
export function CollectionsTrendChart({
  points,
  currency,
}: {
  points: TrendPoint[];
  currency: string;
}) {
  if (points.length === 0) {
    return (
      <EmptyState
        title="Not enough history yet"
        description="This chart fills in as debts and payments accumulate month by month."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={points} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis
          {...axisProps}
          tickFormatter={(value: number) => formatCurrency(value, currency, { compact: true })}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(value, name) => [
            formatCurrency(Number(value), currency),
            SERIES_LABELS[String(name)] ?? String(name),
          ]}
        />
        <Line
          type="monotone"
          dataKey="collections"
          stroke={chartColors.primary}
          strokeWidth={2}
          dot={{ fill: chartColors.primary, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="outstanding"
          stroke={chartColors.primarySoft}
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={{ fill: chartColors.primarySoft, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
