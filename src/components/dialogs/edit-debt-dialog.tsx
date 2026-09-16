'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import type { Debt, UpdateDebtInput } from '@/api/debts/debts.api';
import { updateDebtSchema, type UpdateDebtValues } from '@/api/debts/debts.schema';
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
import { Textarea } from '@/components/ui/textarea';
import { parseAmount, validateForm, type FieldErrors } from '@/lib/form';
import { toDateInputValue } from '@/lib/format';

interface EditDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  debt: Debt;
  currency: string;
  onSubmit: (input: UpdateDebtInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
}

/**
 * Amount, description and due date are the only editable fields — the API
 * deliberately does not let a debt be reassigned to another customer.
 */
export function EditDebtDialog({
  open,
  onOpenChange,
  debt,
  currency,
  onSubmit,
  isSubmitting,
  error,
}: EditDebtDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Pencil className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Edit debt</DialogTitle>
          <DialogDescription>Adjust the amount, due date, or description.</DialogDescription>
        </DialogHeader>

        {/* Mounted only while open, so the form always reflects the debt as it
            stands now. */}
        {open && (
          <EditDebtForm
            debt={debt}
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

function EditDebtForm({
  debt,
  currency,
  onSubmit,
  onClose,
  isSubmitting,
  error,
}: {
  debt: Debt;
  currency: string;
  onSubmit: (input: UpdateDebtInput) => Promise<unknown>;
  onClose: () => void;
  isSubmitting: boolean;
  error?: unknown;
}) {
  const [values, setValues] = useState(() => ({
    amount: String(debt.amount),
    description: debt.description ?? '',
    issuedDate: toDateInputValue(debt.issuedDate),
    dueDate: toDateInputValue(debt.dueDate),
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<UpdateDebtValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(updateDebtSchema, {
      ...values,
      amount: parseAmount(values.amount),
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await onSubmit({
        amount: result.data.amount,
        description: result.data.description,
        dueDate: result.data.dueDate,
      });
      onClose();
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField
        label={`Amount (${currency})`}
        htmlFor="edit-debt-amount"
        error={fieldErrors.amount}
        hint={
          debt.amountPaid > 0
            ? 'Payments already recorded stay attached and the balance is recalculated.'
            : undefined
        }
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

      <FormField label="Due date" htmlFor="edit-debt-due" error={fieldErrors.dueDate}>
        <Input
          type="date"
          min={values.issuedDate || undefined}
          value={values.dueDate}
          onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
          className="h-11 rounded-lg"
        />
      </FormField>

      <FormField
        label="Description"
        htmlFor="edit-debt-description"
        error={fieldErrors.description}
        hint="Optional"
      >
        <Textarea
          value={values.description}
          onChange={(event) => setValues({ ...values, description: event.target.value })}
          className="rounded-lg"
        />
      </FormField>

      <InlineError error={error} fallback="We could not save those changes." className="text-xs" />

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
          {isSubmitting ? 'Saving…' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
  );
}
