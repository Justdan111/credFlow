'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Wallet } from 'lucide-react';

import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  newIdempotencyKey,
  type CreatePaymentInput,
  type PaymentMethod,
} from '@/api/payments/payments.api';
import { paymentSchema, type PaymentValues } from '@/api/payments/payments.schema';
import { CustomerSelect, DebtSelect } from '@/components/domain/entity-selects';
import { InlineError } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { optionalText, parseAmount, validateForm, type FieldErrors } from '@/lib/form';
import { dateInputToInstant, todayAsDateInput } from '@/lib/format';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreatePaymentInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
  /** Pre-selects the customer when opened from their own page. */
  customerId?: string;
  /**
   * Locks the payment to one debt, for the debt's own page. Both pickers are
   * hidden: the relationship comes from the URL, not from user input.
   */
  debtId?: string;
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  error,
  customerId,
  debtId,
}: RecordPaymentDialogProps) {
  const { currency } = useSession();
  const [values, setValues] = useState({
    customerId: customerId ?? '',
    debtId: debtId ?? '',
    amount: '',
    method: 'cash' as PaymentMethod,
    reference: '',
    notes: '',
    paidAt: todayAsDateInput(),
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<PaymentValues>>({});

  /**
   * One key per open dialog. Submitting twice — a double click, or a retry
   * after a timeout that actually succeeded — replays the first payment
   * instead of recording the money again.
   */
  const idempotencyKey = useMemo(() => (open ? newIdempotencyKey() : ''), [open]);

  /**
   * A debt belongs to exactly one customer, so picking a different customer
   * clears any debt already chosen rather than sending a mismatched pair.
   */
  const selectCustomer = (nextCustomerId: string) => {
    setValues((previous) => ({ ...previous, customerId: nextCustomerId, debtId: '' }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(paymentSchema, {
      ...values,
      customerId: customerId ?? values.customerId,
      debtId: debtId ?? values.debtId,
      amount: parseAmount(values.amount),
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await onSubmit({
        customerId: result.data.customerId,
        debtId: optionalText(result.data.debtId),
        amount: result.data.amount,
        method: result.data.method,
        reference: optionalText(result.data.reference),
        notes: optionalText(result.data.notes),
        paidAt: dateInputToInstant(result.data.paidAt),
        idempotencyKey,
      });
      setValues({
        customerId: customerId ?? '',
        debtId: debtId ?? '',
        amount: '',
        method: 'cash',
        reference: '',
        notes: '',
        paidAt: todayAsDateInput(),
      });
      setFieldErrors({});
      onOpenChange(false);
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  const selectedCustomerId = customerId ?? values.customerId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Wallet className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Record a payment</DialogTitle>
          <DialogDescription>
            Log money received. Linking it to a debt updates that debt&apos;s balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {!customerId && (
            <CustomerSelect
              value={values.customerId}
              onChange={selectCustomer}
              error={fieldErrors.customerId}
            />
          )}

          {!debtId && (
            <DebtSelect
              customerId={selectedCustomerId}
              value={values.debtId}
              onChange={(selected) => setValues((previous) => ({ ...previous, debtId: selected }))}
              error={fieldErrors.debtId}
            />
          )}

          <div className="grid grid-cols-2 gap-3">
            <FormField
              label={`Amount (${currency})`}
              htmlFor="payment-amount"
              error={fieldErrors.amount}
            >
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={values.amount}
                onChange={(event) => setValues({ ...values, amount: event.target.value })}
                className="h-11 rounded-lg bg-background/80 border-border"
              />
            </FormField>

            <FormField label="Date received" htmlFor="payment-date" error={fieldErrors.paidAt}>
              <Input
                type="date"
                max={todayAsDateInput()}
                value={values.paidAt}
                onChange={(event) => setValues({ ...values, paidAt: event.target.value })}
                className="h-11 rounded-lg bg-background/80 border-border"
              />
            </FormField>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Payment method</span>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const isActive = values.method === method;
                return (
                  <button
                    key={method}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setValues({ ...values, method })}
                    className={`text-center py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      isActive
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {PAYMENT_METHOD_LABELS[method]}
                  </button>
                );
              })}
            </div>
          </div>

          <FormField
            label="Reference"
            htmlFor="payment-reference"
            error={fieldErrors.reference}
            hint="Optional — transfer or receipt number"
          >
            <Input
              placeholder="e.g. TRF-00123"
              value={values.reference}
              onChange={(event) => setValues({ ...values, reference: event.target.value })}
              className="h-11 rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <FormField label="Notes" htmlFor="payment-notes" error={fieldErrors.notes} hint="Optional">
            <Textarea
              placeholder="Anything worth remembering about this payment…"
              value={values.notes}
              onChange={(event) => setValues({ ...values, notes: event.target.value })}
              className="rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <InlineError
            error={error}
            fallback="We could not record that payment."
            className="text-xs"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="rounded-full h-9 text-xs shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
            >
              {isSubmitting ? 'Recording…' : 'Record payment'}
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
