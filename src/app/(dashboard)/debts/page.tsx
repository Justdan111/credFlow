'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

import { useCustomers } from '@/api/customers/customers.queries';
import { DEBT_STATUSES, type DebtStatus } from '@/api/debts/debts.api';
import { useCreateDebt, useDebts, useDeleteDebt, useMarkDebtPaid } from '@/api/debts/debts.queries';
import { useDashboardSummary } from '@/api/dashboard/dashboard.queries';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/api/types';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { RecordDebtDialog } from '@/components/dialogs/record-debt-dialog';
import { MetricCard } from '@/components/domain/metric-card';
import { DebtStatusPill } from '@/components/domain/pills';
import { EmptyState, ErrorState, InlineError, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { formatCurrency, formatDate, formatNumber, initials } from '@/lib/format';

type StatusFilter = 'all' | DebtStatus | 'overdue';

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...DEBT_STATUSES.map((status) => ({
    value: status as StatusFilter,
    label: status === 'partial' ? 'Part paid' : status.charAt(0).toUpperCase() + status.slice(1),
  })),
  { value: 'overdue', label: 'Overdue' },
];

export default function DebtsPage() {
  const { currency, canAdminister } = useSession();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /** A filter change resets the page with it; see the customers list. */
  const applyStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    setPage(1);
  };

  const applyCustomerFilter = (customer: string) => {
    setCustomerFilter(customer);
    setPage(1);
  };

  const params = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      // `overdue` is a flag, not a status: an overdue debt is still "pending".
      status: statusFilter === 'all' || statusFilter === 'overdue' ? undefined : statusFilter,
      overdue: statusFilter === 'overdue' ? ('true' as const) : undefined,
      customerId: customerFilter || undefined,
      sort: 'dueDate' as const,
    }),
    [customerFilter, page, statusFilter],
  );

  const debtsQuery = useDebts(params);
  const summaryQuery = useDashboardSummary();
  const customersQuery = useCustomers({ pageSize: MAX_PAGE_SIZE, sort: 'name' });
  const createDebt = useCreateDebt();
  const deleteDebt = useDeleteDebt();
  const markPaid = useMarkDebtPaid();

  const debts = debtsQuery.data?.items ?? [];
  const summary = summaryQuery.data;

  // Debts carry no customer name, so it is resolved once rather than per row.
  const customerNames = useMemo(() => {
    const lookup = new Map<string, string>();
    for (const customer of customersQuery.data?.items ?? []) lookup.set(customer.id, customer.name);
    return lookup;
  }, [customersQuery.data]);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteDebt.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
    } catch {
      // Shown inside the dialog.
    }
  };

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
            Debts
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Track what&apos;s owed
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All outstanding, overdue, and settled debts.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsRecordOpen(true)}
          className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Record debt
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Outstanding"
          value={formatCurrency(summary?.outstanding.value, currency, { compact: true })}
          metric={summary?.outstanding}
          hint="Across all open debts"
        />
        <MetricCard
          label="Overdue"
          value={formatCurrency(summary?.overdue.value, currency, { compact: true })}
          metric={summary?.overdue}
          lowerIsBetter
          hint={
            summary
              ? `${formatNumber(summary.overdue.customerCount)} customers · ${formatNumber(summary.overdue.newCount)} new`
              : undefined
          }
        />
        <MetricCard
          label="Collected"
          value={formatCurrency(summary?.collected.value, currency, { compact: true })}
          metric={summary?.collected}
          hint="This month"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background overflow-x-auto">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => applyStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <select
          value={customerFilter}
          onChange={(event) => applyCustomerFilter(event.target.value)}
          aria-label="Filter by customer"
          className="h-10 rounded-lg border border-border bg-background px-3 text-sm sm:max-w-xs focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
        >
          <option value="">All customers</option>
          {(customersQuery.data?.items ?? []).map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {debtsQuery.isPending ? (
          <LoadingState label="Loading debts…" />
        ) : debtsQuery.isError ? (
          <ErrorState
            error={debtsQuery.error}
            fallback="We could not load your debts."
            onRetry={() => debtsQuery.refetch()}
          />
        ) : debts.length === 0 ? (
          <EmptyState
            title={statusFilter === 'all' && !customerFilter ? 'No debts recorded' : 'No matching debts'}
            description={
              statusFilter === 'all' && !customerFilter
                ? 'Record what a customer owes to start tracking collections.'
                : 'Try a different status or customer filter.'
            }
            action={
              <Button size="sm" onClick={() => setIsRecordOpen(true)} className="rounded-full text-xs h-8">
                <Plus className="w-3.5 h-3.5" />
                Record debt
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <Th>Customer</Th>
                    <Th>Amount</Th>
                    <Th>Remaining</Th>
                    <Th>Due</Th>
                    <Th>Status</Th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt, index) => {
                    const customerName = customerNames.get(debt.customerId) ?? 'Customer';
                    return (
                      <motion.tr
                        key={debt.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.03 * index }}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-6 py-3.5">
                          <Link href={`/debts/${debt.id}`} className="flex items-center gap-2.5 group/link">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              {initials(customerName)}
                            </div>
                            <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                              {customerName}
                            </span>
                          </Link>
                        </td>
                        <td className="px-6 py-3.5 text-sm font-medium">
                          {formatCurrency(debt.amount, currency)}
                        </td>
                        <td className="px-6 py-3.5 text-sm">
                          {formatCurrency(debt.amountRemaining, currency)}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-muted-foreground">
                          {formatDate(debt.dueDate)}
                        </td>
                        <td className="px-6 py-3.5">
                          <DebtStatusPill status={debt.status} overdue={debt.overdue} />
                        </td>
                        <td className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                aria-label={`Actions for the ${formatCurrency(debt.amount, currency)} debt`}
                                className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem asChild className="text-xs gap-2">
                                <Link href={`/debts/${debt.id}`}>
                                  <Eye className="w-3.5 h-3.5" /> View
                                </Link>
                              </DropdownMenuItem>
                              {debt.status !== 'paid' && (
                                <DropdownMenuItem
                                  onClick={() => markPaid.mutate(debt.id)}
                                  className="text-xs gap-2"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark as paid
                                </DropdownMenuItem>
                              )}
                              {canAdminister && (
                                <DropdownMenuItem
                                  onClick={() => setPendingDeleteId(debt.id)}
                                  className="text-xs gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination
              meta={debtsQuery.data?.meta}
              page={page}
              onPageChange={setPage}
              isLoading={debtsQuery.isFetching}
              label="debts"
            />
          </>
        )}
      </div>

      <InlineError error={markPaid.error} fallback="We could not mark that debt as paid." />

      <RecordDebtDialog
        open={isRecordOpen}
        onOpenChange={setIsRecordOpen}
        onSubmit={(input) => createDebt.mutateAsync(input)}
        isSubmitting={createDebt.isPending}
        error={createDebt.error}
      />

      <DeleteConfirmationDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete debt"
        description="This removes the debt from your records. Payments already recorded against it stay, but stop counting towards it. This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteDebt.isPending}
        error={deleteDebt.error}
      />
    </motion.div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">
      {children}
    </th>
  );
}
