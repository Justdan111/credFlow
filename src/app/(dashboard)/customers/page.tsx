'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';

import { RISK_LEVELS, type RiskLevel } from '@/api/customers/customers.api';
import {
  useCreateCustomer,
  useCustomers,
  useDeleteCustomer,
} from '@/api/customers/customers.queries';
import { DEFAULT_PAGE_SIZE } from '@/api/types';
import { AddCustomerDialog } from '@/components/dialogs/add-customer-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { RiskPill } from '@/components/domain/pills';
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
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { formatCurrency, initials } from '@/lib/format';

const RISK_FILTERS = [{ value: 'all', label: 'All' }, ...RISK_LEVELS.map((level) => ({
  value: level,
  label: level.charAt(0).toUpperCase() + level.slice(1),
}))];

export default function CustomersPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading customers…" />}>
      <CustomersView />
    </Suspense>
  );
}

function CustomersView() {
  const searchParams = useSearchParams();
  const { currency, canAdminister } = useSession();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchTerm);

  /**
   * Changing a filter resets the page with it: page 4 of the old result set is
   * meaningless against the new one, and a stale page number shows an empty
   * table for a search that actually has matches.
   */
  const applySearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const applyRiskFilter = (risk: 'all' | RiskLevel) => {
    setRiskFilter(risk);
    setPage(1);
  };

  const params = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      search: debouncedSearch.trim() || undefined,
      // The API's vocabulary is lower case; sending "Low" is a 400.
      riskLevel: riskFilter === 'all' ? undefined : riskFilter,
      sort: '-createdAt' as const,
    }),
    [debouncedSearch, page, riskFilter],
  );

  const customersQuery = useCustomers(params);
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();

  const customers = customersQuery.data?.items ?? [];
  const meta = customersQuery.data?.meta;

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteCustomer.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
    } catch {
      // Shown inside the dialog from the mutation's error state.
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
            Customers
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">All customers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {meta ? `${meta.total} in total` : 'Everyone you extend credit to.'}
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Add customer
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search by name or email…"
            aria-label="Search customers"
            value={searchTerm}
            onChange={(event) => applySearch(event.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background">
          {RISK_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => applyRiskFilter(filter.value as 'all' | RiskLevel)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                riskFilter === filter.value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {customersQuery.isPending ? (
          <LoadingState label="Loading customers…" />
        ) : customersQuery.isError ? (
          <ErrorState
            error={customersQuery.error}
            fallback="We could not load your customers."
            onRetry={() => customersQuery.refetch()}
          />
        ) : customers.length === 0 ? (
          <EmptyState
            title={debouncedSearch || riskFilter !== 'all' ? 'No matching customers' : 'No customers yet'}
            description={
              debouncedSearch || riskFilter !== 'all'
                ? 'Try a different search term or risk filter.'
                : 'Add the first person or business you extend credit to.'
            }
            action={
              <Button size="sm" onClick={() => setIsAddOpen(true)} className="rounded-full text-xs h-8">
                <Plus className="w-3.5 h-3.5" />
                Add customer
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
                    <Th>Contact</Th>
                    <Th>Credit limit</Th>
                    <Th>Risk</Th>
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.03 * index }}
                      className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/customers/${customer.id}`}
                          className="flex items-center gap-2.5 group/link"
                        >
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                            {initials(customer.name)}
                          </div>
                          <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                            {customer.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="text-sm">{customer.phone || '—'}</p>
                        <p className="text-xs text-muted-foreground">
                          {customer.email || 'No email provided'}
                        </p>
                      </td>
                      <td className="px-6 py-3.5 text-sm font-medium">
                        {formatCurrency(customer.creditLimit, currency)}
                      </td>
                      <td className="px-6 py-3.5">
                        <RiskPill level={customer.riskLevel} />
                      </td>
                      <td className="px-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              aria-label={`Actions for ${customer.name}`}
                              className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center"
                            >
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem asChild className="text-xs gap-2">
                              <Link href={`/customers/${customer.id}`}>
                                <Eye className="w-3.5 h-3.5" /> View
                              </Link>
                            </DropdownMenuItem>
                            {/* Deleting a customer is owner/admin only; the API
                                enforces it, so members never see the option. */}
                            {canAdminister && (
                              <DropdownMenuItem
                                onClick={() => setPendingDeleteId(customer.id)}
                                className="text-xs gap-2 text-destructive focus:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              meta={meta}
              page={page}
              onPageChange={setPage}
              isLoading={customersQuery.isFetching}
              label="customers"
            />
          </>
        )}
      </div>

      <InlineError error={deleteCustomer.error} fallback="We could not delete that customer." />

      <AddCustomerDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={(input) => createCustomer.mutateAsync(input)}
        isSubmitting={createCustomer.isPending}
        error={createCustomer.error}
      />

      <DeleteConfirmationDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Delete customer"
        description="Their debts and payments stay on record, but the customer will no longer appear in your lists. This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteCustomer.isPending}
        error={deleteCustomer.error}
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
