'use client';

import { useState } from 'react';
import { ArrowRight, Receipt } from 'lucide-react';

import type { CreateDebtInput } from '@/api/debts/debts.api';
import { debtSchema, type DebtValues } from '@/api/debts/debts.schema';
import { CustomerSelect } from '@/components/domain/entity-selects';
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
import { todayAsDateInput } from '@/lib/format';

interface RecordDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateDebtInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
  /** Pre-selects the customer when opened from their own page. */
  customerId?: string;
}

export function RecordDebtDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  error,
  customerId,
}: RecordDebtDialogProps) {
  const { currency } = useSession();
  const [values, setValues] = useState({
    customerId: customerId ?? '',
    amount: '',
    description: '',
    issuedDate: todayAsDateInput(),
    dueDate: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<DebtValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(debtSchema, {
      ...values,
      customerId: customerId ?? values.customerId,
      amount: parseAmount(values.amount),
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await onSubmit({
        customerId: result.data.customerId,
        amount: result.data.amount,
        description: optionalText(result.data.description),
        issuedDate: optionalText(result.data.issuedDate),
        dueDate: result.data.dueDate,
      });
      setValues({
        customerId: customerId ?? '',
        amount: '',
        description: '',
        issuedDate: todayAsDateInput(),
        dueDate: '',
      });
      setFieldErrors({});
      onOpenChange(false);
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Receipt className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Record a debt</DialogTitle>
          <DialogDescription>
            Track what a customer owes and when they said they&apos;d pay.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {!customerId && (
            <CustomerSelect
              value={values.customerId}
              onChange={(id) => setValues((previous) => ({ ...previous, customerId: id }))}
              error={fieldErrors.customerId}
            />
          )}

          <FormField
            label={`Amount owed (${currency})`}
            htmlFor="debt-amount"
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

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Issued" htmlFor="debt-issued" error={fieldErrors.issuedDate}>
              <Input
                type="date"
                value={values.issuedDate}
                onChange={(event) => setValues({ ...values, issuedDate: event.target.value })}
                className="h-11 rounded-lg bg-background/80 border-border"
              />
            </FormField>

            <FormField label="Due" htmlFor="debt-due" error={fieldErrors.dueDate}>
              <Input
                type="date"
                // The API rejects a due date before the issue date; the input
                // stops it being picked in the first place.
                min={values.issuedDate || undefined}
                value={values.dueDate}
                onChange={(event) => setValues({ ...values, dueDate: event.target.value })}
                className="h-11 rounded-lg bg-background/80 border-border"
              />
            </FormField>
          </div>

          <FormField
            label="Description"
            htmlFor="debt-description"
            error={fieldErrors.description}
            hint="Optional"
          >
            <Textarea
              placeholder="What was supplied, invoice number, agreed terms…"
              value={values.description}
              onChange={(event) => setValues({ ...values, description: event.target.value })}
              className="rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <InlineError error={error} fallback="We could not record that debt." className="text-xs" />

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
              {isSubmitting ? 'Recording…' : 'Record debt'}
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
