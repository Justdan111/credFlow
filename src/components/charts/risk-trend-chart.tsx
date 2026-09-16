'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { RiskTrendPoint } from '@/api/analytics/analytics.api';
import { axisProps, chartColors, tooltipStyle } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';

/** Customer counts by risk level over time, from the daily risk snapshots. */
export function RiskTrendChart({ points }: { points: RiskTrendPoint[] }) {
  if (points.length === 0) {
    return (
      <EmptyState
        title="History is still being recorded"
        description="Risk levels are snapshotted daily, so this chart fills in over the coming days."
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={points} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />
        <XAxis dataKey="label" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey="low"
          stackId="risk"
          stroke={chartColors.low}
          fill={chartColors.low}
          fillOpacity={0.35}
        />
        <Area
          type="monotone"
          dataKey="medium"
          stackId="risk"
          stroke={chartColors.medium}
          fill={chartColors.medium}
          fillOpacity={0.35}
        />
        <Area
          type="monotone"
          dataKey="high"
          stackId="risk"
          stroke={chartColors.high}
          fill={chartColors.high}
          fillOpacity={0.35}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
