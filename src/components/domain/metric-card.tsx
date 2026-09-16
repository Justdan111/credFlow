import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

import type { Metric } from '@/api/dashboard/dashboard.api';
import { formatChange } from '@/lib/format';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  hint?: string;
  metric?: Metric;
  /**
   * True when a *fall* is the good outcome — overdue debt, for instance. It
   * decides the colour of the change badge; without it a shrinking overdue
   * balance would be painted red.
   */
  lowerIsBetter?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  value,
  hint,
  metric,
  lowerIsBetter = false,
  className,
}: MetricCardProps) {
  const change = metric?.change ?? null;
  const direction = metric?.direction ?? (change === null ? '' : change > 0 ? 'up' : change < 0 ? 'down' : 'flat');
  const isPositive = direction === 'up' ? !lowerIsBetter : direction === 'down' ? lowerIsBetter : true;

  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition-all',
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
          {label}
        </p>
        {change !== null && (
          <div
            className={cn(
              'text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5',
              direction === 'flat'
                ? 'bg-muted text-muted-foreground'
                : isPositive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive',
            )}
            title="Compared with the previous period"
          >
            {direction === 'up' ? (
              <ArrowUp className="w-2.5 h-2.5" />
            ) : direction === 'down' ? (
              <ArrowDown className="w-2.5 h-2.5" />
            ) : (
              <Minus className="w-2.5 h-2.5" />
            )}
            {formatChange(change)}
          </div>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}
