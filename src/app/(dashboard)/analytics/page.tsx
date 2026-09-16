'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

import {
  useCollectionRate,
  useCustomerSegments,
  useExportAnalytics,
  useRiskTrend,
} from '@/api/analytics/analytics.queries';
import { CollectionRateChart } from '@/components/charts/collection-rate-chart';
import { CustomerSegmentsChart } from '@/components/charts/customer-segments-chart';
import { RiskTrendChart } from '@/components/charts/risk-trend-chart';
import { ErrorState, InlineError, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatPercent } from '@/lib/format';

const RANGE_OPTIONS = [3, 6, 12] as const;

export default function AnalyticsPage() {
  const { currency, canAdminister } = useSession();
  const [months, setMonths] = useState<number>(6);

  const collectionRateQuery = useCollectionRate(months);
  const riskTrendQuery = useRiskTrend(months);
  const segmentsQuery = useCustomerSegments();
  const exportAnalytics = useExportAnalytics();

  const rate = collectionRateQuery.data;
  const displayCurrency = rate?.currency ?? currency;

  /**
   * Headline figures are derived only from what the API actually returns. A
   * metric the backend cannot support (retention, days-to-collect) is left out
   * rather than invented — a fabricated number on a finance screen is worse
   * than a missing one.
   */
  const headline = useMemo(() => {
    const points = rate?.points ?? [];
    if (points.length === 0) return null;

    const collected = points.reduce((sum, point) => sum + point.actual, 0);
    const best = points.reduce((top, point) => (point.actual > top.actual ? point : top), points[0]);
    const ratedPoints = points.filter((point) => point.rate !== null);
    const averageRate =
      ratedPoints.length === 0
        ? null
        : ratedPoints.reduce((sum, point) => sum + (point.rate ?? 0), 0) / ratedPoints.length;

    return {
      collected,
      average: collected / points.length,
      best,
      averageRate,
    };
  }, [rate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
            Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Your business, in numbers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Collection performance, risk, and where your value sits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-full border border-border bg-background">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setMonths(option)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  months === option
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {option}m
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportAnalytics.mutate(months)}
            disabled={exportAnalytics.isPending}
            className="rounded-full text-xs h-9"
          >
            <Download className="w-3.5 h-3.5" />
            {exportAnalytics.isPending ? 'Preparing…' : 'Export CSV'}
          </Button>
        </div>
      </div>

      <InlineError error={exportAnalytics.error} fallback="We could not prepare the export." />

      {collectionRateQuery.isPending ? (
        <div className="rounded-2xl border border-border bg-card">
          <LoadingState label="Loading analytics…" />
        </div>
      ) : collectionRateQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card">
          <ErrorState
            error={collectionRateQuery.error}
            fallback="We could not load your collection performance."
            onRetry={() => collectionRateQuery.refetch()}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat
            label={`Collected (${months}m)`}
            value={formatCurrency(headline?.collected, displayCurrency, { compact: true })}
          />
          <Stat
            label="Monthly average"
            value={formatCurrency(headline?.average, displayCurrency, { compact: true })}
          />
          <Stat
            label="Best month"
            value={headline?.best ? formatCurrency(headline.best.actual, displayCurrency, { compact: true }) : '—'}
            hint={headline?.best?.label}
          />
          <Stat
            label="Target attainment"
            value={headline?.averageRate === null || headline?.averageRate === undefined ? '—' : formatPercent(headline.averageRate)}
            hint={
              rate?.target === null || rate?.target === undefined
                ? 'No monthly target set'
                : `Target ${formatCurrency(rate.target, displayCurrency, { compact: true })}/month`
            }
          />
        </div>
      )}

      {rate && rate.target === null && (
        <p className="text-xs text-muted-foreground">
          {canAdminister ? (
            <>
              Set a monthly collection target in{' '}
              <Link href="/settings" className="text-foreground hover:underline underline-offset-4">
                settings
              </Link>{' '}
              to track attainment over time.
            </>
          ) : (
            'No monthly collection target is set for this business yet.'
          )}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel
          title="Collection performance"
          description={rate?.target === null ? 'What you collected each month' : 'Collected against target'}
        >
          {collectionRateQuery.isPending ? (
            <LoadingState />
          ) : collectionRateQuery.isError ? (
            <ErrorState error={collectionRateQuery.error} onRetry={() => collectionRateQuery.refetch()} />
          ) : (
            <CollectionRateChart
              points={rate?.points ?? []}
              currency={displayCurrency}
              hasTarget={rate?.target !== null && rate?.target !== undefined}
            />
          )}
        </Panel>

        <Panel
          title="Risk over time"
          description={
            riskTrendQuery.data?.meta.historyStartedAt
              ? `Recorded since ${formatDate(riskTrendQuery.data.meta.historyStartedAt)}`
              : 'Customer risk levels, snapshotted daily'
          }
          action={
            <div className="flex items-center gap-3 text-[11px]">
              <Legend color="bg-success" label="Low" />
              <Legend color="bg-warning" label="Med" />
              <Legend color="bg-destructive" label="High" />
            </div>
          }
        >
          {riskTrendQuery.isPending ? (
            <LoadingState />
          ) : riskTrendQuery.isError ? (
            <ErrorState error={riskTrendQuery.error} onRetry={() => riskTrendQuery.refetch()} />
          ) : (
            <RiskTrendChart points={riskTrendQuery.data?.points ?? []} />
          )}
        </Panel>
      </div>

      <Panel
        title="Customer value distribution"
        description="How many customers sit in each lifetime-debt band"
      >
        {segmentsQuery.isPending ? (
          <LoadingState />
        ) : segmentsQuery.isError ? (
          <ErrorState error={segmentsQuery.error} onRetry={() => segmentsQuery.refetch()} />
        ) : (
          <CustomerSegmentsChart segments={segmentsQuery.data?.segments ?? []} />
        )}
      </Panel>
    </motion.div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-semibold tracking-tight mt-2">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}
