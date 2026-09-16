'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Receipt, Trash2 } from 'lucide-react';

import { useCustomer } from '@/api/customers/customers.queries';
import { useDebt } from '@/api/debts/debts.queries';
import { useDeletePayment, usePayment } from '@/api/payments/payments.queries';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { DebtStatusPill, MethodBadge } from '@/components/domain/pills';
import { ErrorState, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatDateTime, initials } from '@/lib/format';

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const paymentId = params.id;
  const { currency, isOwner } = useSession();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const paymentQuery = usePayment(paymentId);
  const payment = paymentQuery.data;

  const customerQuery = useCustomer(payment?.customerId ?? '', Boolean(payment?.customerId));
  const debtQuery = useDebt(payment?.debtId ?? '', Boolean(payment?.debtId));

  const deletePayment = useDeletePayment();

  const handleDelete = async () => {
    try {
      await deletePayment.mutateAsync(paymentId);
      router.replace('/payments');
    } catch {
      // Shown inside the dialog.
    }
  };

  if (paymentQuery.isPending) {
    return <LoadingState label="Loading payment…" />;
  }

  if (paymentQuery.isError || !payment) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-card">
        <ErrorState
          error={paymentQuery.error}
          fallback="We could not find that payment."
          onRetry={() => paymentQuery.refetch()}
        />
        <div className="pb-8 flex justify-center">
          <Button asChild variant="outline" size="sm" className="rounded-full text-xs h-8">
            <Link href="/payments">Back to payments</Link>
          </Button>
        </div>
      </div>
    );
  }

  const customer = customerQuery.data;
  const debt = debtQuery.data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      <div>
        <Link
          href="/payments"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to payments
        </Link>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Payment
              </p>
              <MethodBadge method={payment.method} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-success">
              +{formatCurrency(payment.amount, currency)}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Received {formatDateTime(payment.paidAt)}
            </p>
          </div>

          {/* Voiding a payment is owner-only; the API rejects anyone else. */}
          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteOpen(true)}
              className="rounded-full text-xs h-9 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Void payment
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <Section title="Details">
            <div className="space-y-2.5">
              <MetaRow label="Amount" value={formatCurrency(payment.amount, currency)} />
              <MetaRow label="Received" value={formatDateTime(payment.paidAt)} />
              <MetaRow label="Reference" value={payment.reference || 'None'} mono />
              <MetaRow label="Recorded" value={formatDateTime(payment.createdAt)} />
            </div>
          </Section>

          {payment.notes && (
            <Section title="Notes">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {payment.notes}
              </p>
            </Section>
          )}

          <Section title="Applied to">
            {!payment.debtId ? (
              <p className="text-sm text-muted-foreground">
                Not linked to a specific debt — this payment credits the customer&apos;s balance
                only.
              </p>
            ) : debtQuery.isPending ? (
              <LoadingState label="Loading debt…" />
            ) : debt ? (
              <Link
                href={`/debts/${debt.id}`}
                className="flex items-center justify-between gap-3 hover:bg-muted/20 -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(debt.amount, currency)}</p>
                    <p className="text-xs text-muted-foreground">
                      Due {formatDate(debt.dueDate)} ·{' '}
                      {formatCurrency(debt.amountRemaining, currency)} remaining
                    </p>
                  </div>
                </div>
                <DebtStatusPill status={debt.status} overdue={debt.overdue} />
              </Link>
            ) : (
              <p className="text-sm text-muted-foreground">
                The linked debt is no longer available.
              </p>
            )}
          </Section>
        </div>

        <div className="space-y-4">
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
                  <p className="text-xs text-muted-foreground truncate capitalize">
                    {customer.riskLevel} risk
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
              </div>
            </Section>
          )}
        </div>
      </div>

      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <p className="text-sm font-semibold mb-4">{title}</p>
      {children}
    </div>
  );
}

function MetaRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
