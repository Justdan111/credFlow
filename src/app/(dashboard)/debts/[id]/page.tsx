'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Mail,
  Pencil,
  Phone,
  Trash2,
  Wallet,
} from 'lucide-react';

import { useCustomer } from '@/api/customers/customers.queries';
import {
  useDebt,
  useDeleteDebt,
  useMarkDebtPaid,
  useUpdateDebt,
} from '@/api/debts/debts.queries';
import { useCreateDebtPayment, useDebtPayments } from '@/api/payments/payments.queries';
import { MAX_PAGE_SIZE } from '@/api/types';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { EditDebtDialog } from '@/components/dialogs/edit-debt-dialog';
import { RecordPaymentDialog } from '@/components/dialogs/record-payment-dialog';
import { DebtStatusPill, MethodBadge } from '@/components/domain/pills';
import { EmptyState, ErrorState, InlineError, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatRelative, daysUntil, initials } from '@/lib/format';

export default function DebtDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const debtId = params.id;
  const { currency, canAdminister } = useSession();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const debtQuery = useDebt(debtId);
  const debt = debtQuery.data;

  const customerQuery = useCustomer(debt?.customerId ?? '', Boolean(debt?.customerId));
  const paymentsQuery = useDebtPayments(debtId, { pageSize: MAX_PAGE_SIZE, sort: '-paidAt' });

  const updateDebt = useUpdateDebt(debtId);
  const deleteDebt = useDeleteDebt();
  const markPaid = useMarkDebtPaid();
  const createPayment = useCreateDebtPayment(debtId);

  const handleDelete = async () => {
    try {
      await deleteDebt.mutateAsync(debtId);
      router.replace('/debts');
    } catch {
      // Shown inside the dialog.
    }
  };

  if (debtQuery.isPending) {
    return <LoadingState label="Loading debt…" />;
  }

  if (debtQuery.isError || !debt) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card">
        <ErrorState
          error={debtQuery.error}
          fallback="We could not find that debt."
          onRetry={() => debtQuery.refetch()}
        />
        <div className="pb-8 flex justify-center">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs h-8">
            <Link href="/debts">Back to debts</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customer = customerQuery.data;
  const payments = paymentsQuery.data?.items ?? [];
  const daysToDue = daysUntil(debt.dueDate);
  const isSettled = debt.status === 'paid';
  const progress =
    debt.amount > 0 ? Math.min(100, Math.round((debt.amountPaid / debt.amount) * 100)) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      <div>
        <Link
          href="/debts"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to debts
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Debt
              </p>
              <DebtStatusPill status={debt.status} overdue={debt.overdue} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
              {formatCurrency(debt.amount, currency)}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {customer ? (
                <>
                  Owed by{' '}
                  <Link
                    href={`/customers/${debt.customerId}`}
                    className="text-foreground hover:underline underline-offset-4"
                  >
                    {customer.name}
                  </Link>
                </>
              ) : (
                'Loading customer…'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {!isSettled && (
              <>
                <Button
                  size="sm"
                  onClick={() => setIsPaymentOpen(true)}
                  className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10 shadow-sm shadow-primary/20"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Record payment
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markPaid.mutate(debtId)}
                  disabled={markPaid.isPending}
                  className="rounded-full text-xs h-9"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {markPaid.isPending ? 'Closing…' : 'Mark as paid'}
                </Button>
              </>
            )}
            {canAdminister && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="rounded-full text-xs h-9"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                  className="rounded-full text-xs h-9 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <InlineError error={markPaid.error} fallback="We could not close that debt." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Amount" value={formatCurrency(debt.amount, currency)} hint="Original balance" />
        <KPI label="Paid" value={formatCurrency(debt.amountPaid, currency)} hint={`${progress}% settled`} />
        <KPI
          label="Remaining"
          value={formatCurrency(debt.amountRemaining, currency)}
          hint={isSettled ? 'Fully settled' : 'Still to collect'}
        />
        <KPI
          label="Due"
          value={formatDate(debt.dueDate)}
          hint={
            isSettled
              ? `Closed ${formatDate(debt.paidAt)}`
              : daysToDue === null
                ? undefined
                : daysToDue < 0
                  ? `${Math.abs(daysToDue)} days overdue`
                  : `Due ${formatRelative(debt.dueDate)}`
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <Section title="Collection progress">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isSettled ? 'bg-success' : debt.overdue ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(debt.amountPaid, currency)} of {formatCurrency(debt.amount, currency)}{' '}
              collected
            </p>
          </Section>

          <Section title="Payments against this debt">
            {paymentsQuery.isPending ? (
              <LoadingState label="Loading payments…" />
            ) : paymentsQuery.isError ? (
              <ErrorState error={paymentsQuery.error} onRetry={() => paymentsQuery.refetch()} />
            ) : payments.length === 0 ? (
              <EmptyState
                title="No payments yet"
                description="Record a payment to bring this balance down."
                action={
                  !isSettled ? (
                    <Button size="sm" onClick={() => setIsPaymentOpen(true)} className="rounded-full text-xs h-8">
                      <Wallet className="w-3.5 h-3.5" />
                      Record payment
                    </Button>
                  ) : undefined
                }
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

          {debt.description && (
            <Section title="Description">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {debt.description}
              </p>
            </Section>
          )}
        </div>

        <div className="space-y-4">
          <Section title="Timeline">
            <div className="space-y-2.5 text-sm">
              <MetaRow label="Issued" value={formatDate(debt.issuedDate)} />
              <MetaRow label="Due" value={formatDate(debt.dueDate)} />
              <MetaRow label="Recorded" value={formatDate(debt.createdAt)} />
              {debt.paidAt && <MetaRow label="Settled" value={formatDate(debt.paidAt)} />}
            </div>
          </Section>

          {customer && (
            <Section title="Customer">
              <Link
                href={`/customers/${customer.id}`}
                className="flex items-center gap-3 hover:bg-muted/20 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
                  {initials(customer.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{customer.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Credit limit {formatCurrency(customer.creditLimit, currency)}
                  </p>
                </div>
              </Link>

              <div className="space-y-2 mt-3">
                {customer.phone && (
                  <a
                    href={`tel:${customer.phone}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </a>
                )}
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </a>
                )}
                {!isSettled && daysToDue !== null && (
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarClock className="w-3 h-3" />
                    {daysToDue < 0
                      ? `${Math.abs(daysToDue)} days past due`
                      : `${daysToDue} days to go`}
                  </p>
                )}
              </div>
            </Section>
          )}
        </div>
      </div>

      <EditDebtDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        debt={debt}
        currency={currency}
        onSubmit={(input) => updateDebt.mutateAsync(input)}
        isSubmitting={updateDebt.isPending}
        error={updateDebt.error}
      />

      <RecordPaymentDialog
        open={isPaymentOpen}
        onOpenChange={setIsPaymentOpen}
        customerId={debt.customerId}
        debtId={debt.id}
        // The nested route derives the customer from the debt, so only the
        // money details are sent.
        onSubmit={({ amount, method, reference, notes, paidAt, idempotencyKey }) =>
          createPayment.mutateAsync({ amount, method, reference, notes, paidAt, idempotencyKey })
        }
        isSubmitting={createPayment.isPending}
        error={createPayment.error}
      />

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Delete debt"
        description="This removes the debt from your records. Payments already recorded against it stay, but stop counting towards it. This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteDebt.isPending}
        error={deleteDebt.error}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm font-semibold mb-4">{title}</p>
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}
