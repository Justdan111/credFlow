'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Plus } from 'lucide-react';

import { useCreateCustomer } from '@/api/customers/customers.queries';
import {
  useCollectionsTrend,
  useDashboardSummary,
  useRecentDebts,
  useRecentPayments,
  useRiskDistribution,
} from '@/api/dashboard/dashboard.queries';
import { AddCustomerDialog } from '@/components/dialogs/add-customer-dialog';
import { CollectionsTrendChart } from '@/components/charts/collections-trend-chart';
import { RiskDonutChart } from '@/components/charts/risk-donut-chart';
import { MetricCard } from '@/components/domain/metric-card';
import { DebtStatusPill, MethodBadge } from '@/components/domain/pills';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatNumber, initials } from '@/lib/format';

export default function DashboardPage() {
  const { user, currency } = useSession();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  const summaryQuery = useDashboardSummary();
  const trendQuery = useCollectionsTrend(6);
  const riskQuery = useRiskDistribution();
  const recentDebtsQuery = useRecentDebts(5);
  const recentPaymentsQuery = useRecentPayments(5);
  const createCustomer = useCreateCustomer();

  const summary = summaryQuery.data;
  // The summary carries its own currency, which is authoritative for the
  // figures it returns; the session value covers the first render.
  const displayCurrency = summary?.currency ?? currency;

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
            Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            {user?.name ? `Welcome back, ${user.name.split(' ')[0]}.` : 'Welcome back.'}
          </h1>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddCustomerOpen(true)}
          className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Add customer
        </Button>
      </div>

      {summaryQuery.isError ? (
        <div className="rounded-2xl border border-border bg-card">
          <ErrorState
            error={summaryQuery.error}
            fallback="We could not load your headline figures."
            onRetry={() => summaryQuery.refetch()}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Outstanding"
            value={formatCurrency(summary?.outstanding.value, displayCurrency, { compact: true })}
            metric={summary?.outstanding}
            hint="vs last month"
          />
          <MetricCard
            label="Overdue"
            value={formatCurrency(summary?.overdue.value, displayCurrency, { compact: true })}
            metric={summary?.overdue}
            lowerIsBetter
            hint={
              summary
                ? `${formatNumber(summary.overdue.customerCount)} customers · ${formatNumber(summary.overdue.newCount)} new`
                : undefined
            }
          />
          <MetricCard
            label="Customers"
            value={formatNumber(summary?.customers.value)}
            metric={summary?.customers}
            hint={summary ? `${formatNumber(summary.customers.newThisMonth)} this month` : undefined}
          />
          <MetricCard
            label="Collected"
            value={formatCurrency(summary?.collected.value, displayCurrency, { compact: true })}
            metric={summary?.collected}
            hint="This month"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2"
          title="Collections trend"
          description="Monthly collections against the closing outstanding balance"
          action={
            <div className="flex items-center gap-4 text-[11px]">
              <Legend color="bg-primary" label="Collected" />
              <Legend color="bg-primary/35" label="Outstanding" />
            </div>
          }
        >
          {trendQuery.isPending ? (
            <LoadingState label="Loading trend…" />
          ) : trendQuery.isError ? (
            <ErrorState error={trendQuery.error} onRetry={() => trendQuery.refetch()} />
          ) : (
            <CollectionsTrendChart
              points={trendQuery.data?.points ?? []}
              currency={trendQuery.data?.currency ?? displayCurrency}
            />
          )}
        </Panel>

        <Panel title="Risk distribution" description="Customers by risk level">
          {riskQuery.isPending ? (
            <LoadingState label="Loading risk mix…" />
          ) : riskQuery.isError ? (
            <ErrorState error={riskQuery.error} onRetry={() => riskQuery.refetch()} />
          ) : (
            <RiskDonutChart buckets={riskQuery.data ?? []} />
          )}
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <PanelHeader
            title="Needs attention"
            description="The most recent debts across your customers"
            href="/debts"
          />
          {recentDebtsQuery.isPending ? (
            <LoadingState label="Loading debts…" />
          ) : recentDebtsQuery.isError ? (
            <ErrorState error={recentDebtsQuery.error} onRetry={() => recentDebtsQuery.refetch()} />
          ) : (recentDebtsQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="No debts yet"
              description="Record what a customer owes to start tracking collections."
              action={
                <Button asChild size="sm" className="rounded-full text-xs h-8">
                  <Link href="/debts">Record a debt</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {(recentDebtsQuery.data ?? []).map((debt) => (
                <li key={debt.id}>
                  <Link
                    href={`/debts/${debt.id}`}
                    className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                        {initials(debt.customerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{debt.customerName}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDate(debt.dueDate)}
                          {debt.daysOverdue !== null && debt.daysOverdue > 0 && (
                            <span className="text-destructive"> · {debt.daysOverdue}d late</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-medium">
                        {formatCurrency(debt.amount, displayCurrency)}
                      </span>
                      <DebtStatusPill
                        status={debt.status}
                        overdue={(debt.daysOverdue ?? 0) > 0}
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <PanelHeader
            title="Recent payments"
            description="Money received most recently"
            href="/payments"
          />
          {recentPaymentsQuery.isPending ? (
            <LoadingState label="Loading payments…" />
          ) : recentPaymentsQuery.isError ? (
            <ErrorState
              error={recentPaymentsQuery.error}
              onRetry={() => recentPaymentsQuery.refetch()}
            />
          ) : (recentPaymentsQuery.data ?? []).length === 0 ? (
            <EmptyState
              title="No payments yet"
              description="Payments you record appear here as they come in."
              action={
                <Button asChild size="sm" className="rounded-full text-xs h-8">
                  <Link href="/payments">Record a payment</Link>
                </Button>
              }
            />
          ) : (
            <ul className="divide-y divide-border">
              {(recentPaymentsQuery.data ?? []).map((payment) => (
                <li key={payment.id}>
                  <Link
                    href={`/payments/${payment.id}`}
                    className="flex items-center justify-between gap-3 px-5 sm:px-6 py-3.5 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                        {initials(payment.customerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{payment.customerName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(payment.paidAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-medium text-success">
                        +{formatCurrency(payment.amount, displayCurrency)}
                      </span>
                      <MethodBadge method={payment.method} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AddCustomerDialog
        open={isAddCustomerOpen}
        onOpenChange={setIsAddCustomerOpen}
        onSubmit={(input) => createCustomer.mutateAsync(input)}
        isSubmitting={createCustomer.isPending}
        error={createCustomer.error}
      />
    </motion.div>
  );
}

function Panel({
  title,
  description,
  action,
  className,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-5 sm:p-6 ${className ?? ''}`}>
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

function PanelHeader({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-5 sm:p-6 border-b border-border">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <Link
        href={href}
        className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1 shrink-0"
      >
        View all
        <ArrowUpRight className="w-3 h-3" />
      </Link>
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
