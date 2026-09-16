'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import type { RiskBucket } from '@/api/dashboard/dashboard.api';
import { riskColor } from '@/components/charts/chart-theme';
import { EmptyState } from '@/components/feedback/states';
import { formatNumber, formatPercent } from '@/lib/format';

/** The current risk mix, with the customer total called out in the middle. */
export function RiskDonutChart({ buckets }: { buckets: RiskBucket[] }) {
  const total = buckets.reduce((sum, bucket) => sum + bucket.customerCount, 0);

  if (total === 0) {
    return (
      <EmptyState
        title="No customers yet"
        description="Risk levels appear once you have customers to classify."
      />
    );
  }

  return (
    <>
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={buckets}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={2}
              dataKey="customerCount"
              nameKey="riskLevel"
              stroke="none"
            >
              {buckets.map((bucket) => (
                <Cell key={bucket.riskLevel} fill={riskColor(bucket.riskLevel)} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-semibold tracking-tight">{formatNumber(total)}</p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Customers</p>
        </div>
      </div>

      <div className="space-y-2 mt-4">
        {buckets.map((bucket) => (
          <div key={bucket.riskLevel} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: riskColor(bucket.riskLevel) }}
              />
              <span className="text-muted-foreground capitalize">{bucket.riskLevel} risk</span>
            </div>
            <span className="font-medium">
              {formatNumber(bucket.customerCount)} · {formatPercent(bucket.percentage, 0)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
