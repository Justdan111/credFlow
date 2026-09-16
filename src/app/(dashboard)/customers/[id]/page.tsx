'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Wallet,
} from 'lucide-react';

import {
  useCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/api/customers/customers.queries';
import { useCreateDebt, useCustomerDebts } from '@/api/debts/debts.queries';
import { useCreatePayment, useCustomerPayments } from '@/api/payments/payments.queries';
import { MAX_PAGE_SIZE } from '@/api/types';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { EditCustomerDialog } from '@/components/dialogs/edit-customer-dialog';
import { RecordDebtDialog } from '@/components/dialogs/record-debt-dialog';
import { RecordPaymentDialog } from '@/components/dialogs/record-payment-dialog';
import { CustomerNotes } from '@/components/domain/customer-notes';
import { DebtStatusPill, MethodBadge, RiskPill } from '@/components/domain/pills';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, initials } from '@/lib/format';

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const customerId = params.id;
  const { currency, canAdminister } = useSession();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRecordDebtOpen, setIsRecordDebtOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const customerQuery = useCustomer(customerId);
  const debtsQuery = useCustomerDebts(customerId, { pageSize: MAX_PAGE_SIZE, sort: 'dueDate' });
  const paymentsQuery = useCustomerPayments(customerId, {
    pageSize: MAX_PAGE_SIZE,
    sort: '-paidAt',
  });

  const updateCustomer = useUpdateCustomer(customerId);
  const deleteCustomer = useDeleteCustomer();
  const createDebt = useCreateDebt();
  const createPayment = useCreatePayment();

  const debts = useMemo(() => debtsQuery.data?.items ?? [], [debtsQuery.data]);
  const payments = useMemo(() => paymentsQuery.data?.items ?? [], [paymentsQuery.data]);

  /**
   * The API has no per-customer totals endpoint, so the exposure is summed
   * from the customer's own debts and payments. Both lists are requested at
   * the maximum page size, and the counts shown come from the server's `meta`
   * so a customer beyond that many records is visibly partial rather than
   * quietly wrong.
   */
  const totals = useMemo(() => {
    const billed = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const outstanding = debts.reduce((sum, debt) => sum + debt.amountRemaining, 0);
    const collected = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const overdueCount = debts.filter((debt) => debt.overdue).length;
    return { billed, outstanding, collected, overdueCount };
  }, [debts, payments]);

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      router.replace('/customers');
    } catch {
    }
  };

  if (customerQuery.isPending) {
    return <LoadingState label="Loading customer…" />;
  }

  if (customerQuery.isError || !customerQuery.data) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card">
        <ErrorState
          error={customerQuery.error}
          fallback="We could not find that customer."
          onRetry={() => customerQuery.refetch()}
        />
        <div className="pb-8 flex justify-center">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs h-8">
            <Link href="/customers">Back to customers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customer = customerQuery.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div>
        <Link
          href="/customers"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to customers
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-lg font-semibold">
              {initials(customer.name)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  Customer
                </p>
                <RiskPill level={customer.riskLevel} suffix=" risk" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
                {customer.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Added {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordPaymentOpen(true)}
              className="rounded-full text-xs h-9"
            >
              <Wallet className="w-3.5 h-3.5" />
              Record payment
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecordDebtOpen(true)}
              className="rounded-full text-xs h-9"
            >
              <Plus className="w-3.5 h-3.5" />
              Record debt
            </Button>
            <Button
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10 shadow-sm shadow-primary/20"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
            {canAdminister && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteOpen(true)}
                className="rounded-full text-xs h-9 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI
          label="Outstanding"
          value={formatCurrency(totals.outstanding, currency)}
          hint={`${debtsQuery.data?.meta.total ?? 0} debts · ${totals.overdueCount} overdue`}
        />
        <KPI label="Total billed" value={formatCurrency(totals.billed, currency)} hint="All debts recorded" />
        <KPI
          label="Paid to date"
          value={formatCurrency(totals.collected, currency)}
          hint={`${paymentsQuery.data?.meta.total ?? 0} payments`}
        />
        <KPI
          label="Credit limit"
          value={formatCurrency(customer.creditLimit, currency)}
          hint={
            customer.creditLimit > 0 && totals.outstanding > customer.creditLimit
              ? 'Over limit'
              : 'Approved cap'
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <Section title="Open debts" href="/debts">
            {debtsQuery.isPending ? (
              <LoadingState label="Loading debts…" />
            ) : debtsQuery.isError ? (
              <ErrorState error={debtsQuery.error} onRetry={() => debtsQuery.refetch()} />
            ) : debts.length === 0 ? (
              <EmptyState
                title="No debts yet"
                description={`Record what ${customer.name} owes to start tracking it.`}
              />
            ) : (
              <ul className="divide-y divide-border">
                {debts.map((debt) => (
                  <li key={debt.id}>
                    <Link
                      href={`/debts/${debt.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:bg-muted/20 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{formatCurrency(debt.amount, currency)}</p>
                        <p className="text-xs text-muted-foreground">
                          Due {formatDate(debt.dueDate)} ·{' '}
                          {formatCurrency(debt.amountRemaining, currency)} remaining
                        </p>
                      </div>
                      <DebtStatusPill status={debt.status} overdue={debt.overdue} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <CustomerNotes customerId={customerId} customerName={customer.name} />

          <Section title="Payments" href="/payments">
            {paymentsQuery.isPending ? (
              <LoadingState label="Loading payments…" />
            ) : paymentsQuery.isError ? (
              <ErrorState error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
            ) : payments.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Payments recorded against this customer appear here."
              />
            ) : (
              <ul className="divide-y divide-border">
                {payments.map((payment) => (
                  <li key={payment.id}>
                    <Link
                      href={`/payments/${payment.id}`}
                      className="flex items-center justify-between gap-3 py-3 hover:bg-muted/20 -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-success">
                          +{formatCurrency(payment.amount, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(payment.paidAt)}
                          {payment.reference ? ` · ${payment.reference}` : ''}
                        </p>
                      </div>
                      <MethodBadge method={payment.method} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <div className="space-y-4">
          <Section title="Contact">
            <div className="space-y-3">
              <ContactRow icon={Phone} label="Phone" value={customer.phone} href={customer.phone ? `tel:${customer.phone}` : undefined} />
              <ContactRow icon={Mail} label="Email" value={customer.email} href={customer.email ? `mailto:${customer.email}` : undefined} />
              <ContactRow icon={Building2} label="Company" value={customer.companyName} />
              <ContactRow icon={MapPin} label="Address" value={customer.address} />
            </div>
          </Section>

          {customer.notes && (
            <Section title="Internal notes">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {customer.notes}
              </p>
            </Section>
          )}
        </div>
      </div>

      <EditCustomerDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        customer={customer}
        currency={currency}
        onSubmit={(input) => updateCustomer.mutateAsync(input)}
        isSubmitting={updateCustomer.isPending}
        error={updateCustomer.error}
      />

      <RecordDebtDialog
        open={isRecordDebtOpen}
        onOpenChange={setIsRecordDebtOpen}
        customerId={customerId}
        onSubmit={(input) => createDebt.mutateAsync(input)}
        isSubmitting={createDebt.isPending}
        error={createDebt.error}
      />

      <RecordPaymentDialog
        open={isRecordPaymentOpen}
        onOpenChange={setIsRecordPaymentOpen}
        customerId={customerId}
        onSubmit={(input) => createPayment.mutateAsync(input)}
        isSubmitting={createPayment.isPending}
        error={createPayment.error}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete customer"
        description={`${customer.name} will no longer appear in your lists. Their debts and payments stay on record. This cannot be undone.`}
        onConfirm={handleDelete}
        isLoading={deleteCustomer.isPending}
        error={deleteCustomer.error}
      />
    </motion.div>
  );
}

function KPI({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-xl sm:text-2xl font-semibold tracking-tight mt-2">{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-sm font-semibold">{title}</p>
        {href && (
          <Link
            href={href}
            className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value?: string | null;
  href?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
        <Icon className="w-3 h-3" strokeWidth={2} />
        {label}
      </div>
      {value ? (
        href ? (
          <a href={href} className="text-sm hover:underline underline-offset-4 break-words">
            {value}
          </a>
        ) : (
          <p className="text-sm break-words">{value}</p>
        )
      ) : (
        <p className="text-sm text-muted-foreground">Not provided</p>
      )}
    </div>
  );
}
