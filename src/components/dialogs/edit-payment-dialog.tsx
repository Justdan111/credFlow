'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  type Payment,
  type PaymentMethod,
  type UpdatePaymentInput,
} from '@/api/payments/payments.api';
import { updatePaymentSchema, type UpdatePaymentValues } from '@/api/payments/payments.schema';
import { InlineError } from '@/components/feedback/states';
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
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { parseAmount, validateForm, type FieldErrors } from '@/lib/form';
import { dateInputToInstant, toDateInputValue, todayAsDateInput } from '@/lib/format';

interface EditPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment;
  currency: string;
  /** True when this payment is attached to a debt, which the amount affects. */
  isLinkedToDebt: boolean;
  onSubmit: (input: UpdatePaymentInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
}

export function EditPaymentDialog({
  open,
  onOpenChange,
  payment,
  currency,
  isLinkedToDebt,
  onSubmit,
  isSubmitting,
  error,
}: EditPaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Pencil className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Correct this payment</DialogTitle>
          <DialogDescription>
            {isLinkedToDebt
              ? 'The linked debt’s balance is recalculated to match.'
              : 'This payment is not attached to a debt, so only its own record changes.'}
          </DialogDescription>
        </DialogHeader>

        {open && (
          <EditPaymentForm
            payment={payment}
            currency={currency}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditPaymentForm({
  payment,
  currency,
  onSubmit,
  onClose,
  isSubmitting,
  error,
}: {
  payment: Payment;
  currency: string;
  onSubmit: (input: UpdatePaymentInput) => Promise<unknown>;
  onClose: () => void;
  isSubmitting: boolean;
  error?: unknown;
}) {
  const [values, setValues] = useState(() => ({
    amount: String(payment.amount),
    method: (payment.method as PaymentMethod) ?? 'cash',
    reference: payment.reference ?? '',
    notes: payment.notes ?? '',
    paidAt: toDateInputValue(payment.paidAt),
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<UpdatePaymentValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(updatePaymentSchema, {
      ...values,
      amount: parseAmount(values.amount),
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      // Reference and notes are sent even when empty: here an empty field is a
      // deliberate "clear this", and the form shows the stored value, so the
      // user can see what they are clearing.
      await onSubmit({
        amount: result.data.amount,
        method: result.data.method,
        reference: result.data.reference,
        notes: result.data.notes,
        paidAt: dateInputToInstant(result.data.paidAt),
      });
      onClose();
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label={`Amount (${currency})`}
          htmlFor="edit-payment-amount"
          error={fieldErrors.amount}
        >
          <Input
            type="number"
            min="0"
            step="0.01"
            value={values.amount}
            onChange={(event) => setValues({ ...values, amount: event.target.value })}
            className="h-11 rounded-lg"
          />
        </FormField>

        <FormField label="Date received" htmlFor="edit-payment-date" error={fieldErrors.paidAt}>
          <Input
            type="date"
            max={todayAsDateInput()}
            value={values.paidAt}
            onChange={(event) => setValues({ ...values, paidAt: event.target.value })}
            className="h-11 rounded-lg"
          />
        </FormField>
      </div>

      <FormField label="Method" htmlFor="edit-payment-method" error={fieldErrors.method}>
        <Select
          value={values.method}
          onChange={(event) =>
            setValues({ ...values, method: event.target.value as PaymentMethod })
          }
          className="h-11 rounded-lg"
        >
          {PAYMENT_METHODS.map((method) => (
            <option key={method} value={method}>
              {PAYMENT_METHOD_LABELS[method]}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Reference"
        htmlFor="edit-payment-reference"
        error={fieldErrors.reference}
        hint="Clear the field to remove it"
      >
        <Input
          value={values.reference}
          onChange={(event) => setValues({ ...values, reference: event.target.value })}
          className="h-11 rounded-lg"
        />
      </FormField>

      <FormField label="Notes" htmlFor="edit-payment-notes" error={fieldErrors.notes}>
        <Textarea
          value={values.notes}
          onChange={(event) => setValues({ ...values, notes: event.target.value })}
          className="rounded-lg"
        />
      </FormField>

      <p className="text-xs text-muted-foreground rounded-lg border border-border bg-muted/30 p-3">
        A correction cannot move this payment to a different customer or debt — that would
        change two balances at once. Void it and record it again instead.
      </p>

      <InlineError error={error} fallback="We could not save that correction." className="text-xs" />

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
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
          {isSubmitting ? 'Saving…' : 'Save correction'}
        </Button>
      </DialogFooter>
    </form>
  );
}
