'use client';

import { useState } from 'react';
import { Pencil } from 'lucide-react';

import type { Customer, UpdateCustomerInput } from '@/api/customers/customers.api';
import { RISK_LEVELS, type RiskLevel } from '@/api/customers/customers.api';
import { customerSchema, type CustomerValues } from '@/api/customers/customers.schema';
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

interface EditCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer;
  currency: string;
  onSubmit: (input: UpdateCustomerInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
}

export function EditCustomerDialog({
  open,
  onOpenChange,
  customer,
  currency,
  onSubmit,
  isSubmitting,
  error,
}: EditCustomerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Pencil className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Edit customer</DialogTitle>
          <DialogDescription>Update contact details, risk and credit terms.</DialogDescription>
        </DialogHeader>

        {/* The form is mounted only while the dialog is open, so every visit
            starts from the record as it stands now rather than from edits
            abandoned last time. */}
        {open && (
          <EditCustomerForm
            customer={customer}
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

function EditCustomerForm({
  customer,
  currency,
  onSubmit,
  onClose,
  isSubmitting,
  error,
}: {
  customer: Customer;
  currency: string;
  onSubmit: (input: UpdateCustomerInput) => Promise<unknown>;
  onClose: () => void;
  isSubmitting: boolean;
  error?: unknown;
}) {
  const [values, setValues] = useState(() => ({
    name: customer.name,
    email: customer.email ?? '',
    phone: customer.phone ?? '',
    companyName: customer.companyName ?? '',
    address: customer.address ?? '',
    riskLevel: (customer.riskLevel as RiskLevel) ?? 'low',
    creditLimit: String(customer.creditLimit ?? 0),
    notes: customer.notes ?? '',
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<CustomerValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(customerSchema, {
      ...values,
      creditLimit: parseAmount(values.creditLimit) ?? 0,
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      // PATCH semantics: an empty string is a deliberate "clear this field",
      // which is not the same as omitting the key.
      await onSubmit(result.data);
      onClose();
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  const update =
    (field: keyof typeof values) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((previous) => ({ ...previous, [field]: event.target.value }));

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Name" htmlFor="edit-name" error={fieldErrors.name}>
        <Input value={values.name} onChange={update('name')} className="h-11 rounded-lg" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Email" htmlFor="edit-email" error={fieldErrors.email}>
          <Input
            type="email"
            value={values.email}
            onChange={update('email')}
            className="h-11 rounded-lg"
          />
        </FormField>
        <FormField label="Phone" htmlFor="edit-phone" error={fieldErrors.phone}>
          <Input
            type="tel"
            value={values.phone}
            onChange={update('phone')}
            className="h-11 rounded-lg"
          />
        </FormField>
      </div>

      <FormField label="Company" htmlFor="edit-company" error={fieldErrors.companyName}>
        <Input
          value={values.companyName}
          onChange={update('companyName')}
          className="h-11 rounded-lg"
        />
      </FormField>

      <FormField label="Address" htmlFor="edit-address" error={fieldErrors.address}>
        <Input value={values.address} onChange={update('address')} className="h-11 rounded-lg" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Risk level" htmlFor="edit-risk" error={fieldErrors.riskLevel}>
          <Select value={values.riskLevel} onChange={update('riskLevel')} className="h-11 rounded-lg">
            {RISK_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField
          label={`Credit limit (${currency})`}
          htmlFor="edit-credit-limit"
          error={fieldErrors.creditLimit}
        >
          <Input
            type="number"
            min="0"
            step="0.01"
            value={values.creditLimit}
            onChange={update('creditLimit')}
            className="h-11 rounded-lg"
          />
        </FormField>
      </div>

      <FormField
        label="Notes"
        htmlFor="edit-notes"
        error={fieldErrors.notes}
        hint="Only your team sees these"
      >
        <Textarea value={values.notes} onChange={update('notes')} className="rounded-lg" />
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
