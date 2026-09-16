'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react';

import { useCollectionsTrend, useDashboardSummary } from '@/api/dashboard/dashboard.queries';
import { useCustomers } from '@/api/customers/customers.queries';
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  type PaymentMethod,
} from '@/api/payments/payments.api';
import {
  useCreatePayment,
  useDeletePayment,
  usePayments,
} from '@/api/payments/payments.queries';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@/api/types';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { RecordPaymentDialog } from '@/components/dialogs/record-payment-dialog';
import { MetricCard } from '@/components/domain/metric-card';
import { MethodBadge } from '@/components/domain/pills';
import { CollectionsBarChart } from '@/components/charts/collections-bar-chart';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Pagination } from '@/components/ui/pagination';
import { formatCurrency, formatDate, initials } from '@/lib/format';

type MethodFilter = 'all' | PaymentMethod;

export default function PaymentsPage() {
  const { currency, isOwner } = useSession();

  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isRecordOpen, setIsRecordOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  /** A filter change resets the page with it; see the customers list. */
  const applyMethodFilter = (method: MethodFilter) => {
    setMethodFilter(method);
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
      method: methodFilter === 'all' ? undefined : methodFilter,
      customerId: customerFilter || undefined,
      sort: '-paidAt' as const,
    }),
    [customerFilter, methodFilter, page],
  );

  const paymentsQuery = usePayments(params);
  const summaryQuery = useDashboardSummary();
  const trendQuery = useCollectionsTrend(6);
  const customersQuery = useCustomers({ pageSize: MAX_PAGE_SIZE, sort: 'name' });
  const createPayment = useCreatePayment();
  const deletePayment = useDeletePayment();

  const payments = paymentsQuery.data?.items ?? [];

  const customerNames = useMemo(() => {
    const lookup = new Map<string, string>();
    for (const customer of customersQuery.data?.items ?? []) lookup.set(customer.id, customer.name);
    return lookup;
  }, [customersQuery.data]);

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deletePayment.mutateAsync(pendingDeleteId);
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
            Payments
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Money coming in</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every payment received across all customers.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsRecordOpen(true)}
          className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Record payment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <MetricCard
            label="Collected"
            value={formatCurrency(summaryQuery.data?.collected.value, currency, { compact: true })}
            metric={summaryQuery.data?.collected}
            hint="This month"
          />
          <MetricCard
            label="Outstanding"
            value={formatCurrency(summaryQuery.data?.outstanding.value, currency, { compact: true })}
            metric={summaryQuery.data?.outstanding}
            hint="Still to collect"
          />
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold">Monthly collections</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              What you actually received, month by month
            </p>
          </div>
          {trendQuery.isPending ? (
            <LoadingState label="Loading collections…" />
          ) : trendQuery.isError ? (
            <ErrorState error={trendQuery.error} onRetry={() => trendQuery.refetch()} />
          ) : (
            <CollectionsBarChart points={trendQuery.data?.points ?? []} currency={currency} />
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background overflow-x-auto">
          <button
            onClick={() => applyMethodFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              methodFilter === 'all' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All
          </button>
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method}
              onClick={() => applyMethodFilter(method)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                methodFilter === method
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {PAYMENT_METHOD_LABELS[method]}
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
        {paymentsQuery.isPending ? (
          <LoadingState label="Loading payments…" />
        ) : paymentsQuery.isError ? (
          <ErrorState
            error={paymentsQuery.error}
            fallback="We could not load your payments."
            onRetry={() => paymentsQuery.refetch()}
          />
        ) : payments.length === 0 ? (
          <EmptyState
            title={methodFilter === 'all' && !customerFilter ? 'No payments yet' : 'No matching payments'}
            description={
              methodFilter === 'all' && !customerFilter
                ? 'Record a payment when a customer settles all or part of a debt.'
                : 'Try a different method or customer filter.'
            }
            action={
              <Button size="sm" onClick={() => setIsRecordOpen(true)} className="rounded-full text-xs h-8">
                <Plus className="w-3.5 h-3.5" />
                Record payment
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
                    <Th>Received</Th>
                    <Th>Method</Th>
                    <Th>Reference</Th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => {
                    const customerName = customerNames.get(payment.customerId) ?? 'Customer';
                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.03 * index }}
                        className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-6 py-3.5">
                          <Link
                            href={`/payments/${payment.id}`}
                            className="flex items-center gap-2.5 group/link"
                          >
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                              {initials(customerName)}
                            </div>
                            <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                              {customerName}
                            </span>
                          </Link>
                        </td>
                        <td className="px-6 py-3.5 text-sm font-medium text-success">
                          +{formatCurrency(payment.amount, currency)}
                        </td>
                        <td className="px-6 py-3.5 text-sm text-muted-foreground">
                          {formatDate(payment.paidAt)}
                        </td>
                        <td className="px-6 py-3.5">
                          <MethodBadge method={payment.method} />
                        </td>
                        <td className="px-6 py-3.5 text-xs text-muted-foreground font-mono">
                          {payment.reference || '—'}
                        </td>
                        <td className="px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                aria-label={`Actions for the ${formatCurrency(payment.amount, currency)} payment`}
                                className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center"
                              >
                                <MoreHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem asChild className="text-xs gap-2">
                                <Link href={`/payments/${payment.id}`}>
                                  <Eye className="w-3.5 h-3.5" /> View
                                </Link>
                              </DropdownMenuItem>
                              {/* Voiding a payment is an owner-only action. */}
                              {isOwner && (
                                <DropdownMenuItem
                                  onClick={() => setPendingDeleteId(payment.id)}
                                  className="text-xs gap-2 text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Void payment
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
              meta={paymentsQuery.data?.meta}
              page={page}
              onPageChange={setPage}
              isLoading={paymentsQuery.isFetching}
              label="payments"
            />
          </>
        )}
      </div>

      <RecordPaymentDialog
        open={isRecordOpen}
        onOpenChange={setIsRecordOpen}
        onSubmit={(input) => createPayment.mutateAsync(input)}
        isSubmitting={createPayment.isPending}
        error={createPayment.error}
      />

      <DeleteConfirmationDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Void payment"
        description="The payment stops counting towards its debt, and that debt's balance is recalculated. This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deletePayment.isPending}
        error={deletePayment.error}
        confirmLabel="Void payment"
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
