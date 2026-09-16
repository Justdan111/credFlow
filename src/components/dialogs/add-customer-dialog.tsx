'use client';

import { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';

import type { CreateCustomerInput } from '@/api/customers/customers.api';
import { RISK_LEVELS } from '@/api/customers/customers.api';
import {
  quickAddCustomerSchema,
  type QuickAddCustomerValues,
} from '@/api/customers/customers.schema';
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
import { optionalText, validateForm, type FieldErrors } from '@/lib/form';

interface AddCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateCustomerInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
}

const EMPTY = { name: '', email: '', phone: '', riskLevel: 'low' as const };

export function AddCustomerDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  error,
}: AddCustomerDialogProps) {
  const [values, setValues] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<QuickAddCustomerValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(quickAddCustomerSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      // Only email and phone are optional; sending "" would store an empty
      // string where the column should stay null.
      await onSubmit({
        name: result.data.name,
        email: optionalText(result.data.email),
        phone: optionalText(result.data.phone),
        riskLevel: result.data.riskLevel,
      });
      setValues(EMPTY);
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
          <UserPlus className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Add a customer</DialogTitle>
          <DialogDescription>
            Save their details so you can start tracking what they owe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Name" htmlFor="customer-name" error={fieldErrors.name}>
            <Input
              placeholder="e.g. ABC Stores Ltd"
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              className="h-11 rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <FormField
            label="Email"
            htmlFor="customer-email"
            error={fieldErrors.email}
            hint="Optional"
          >
            <Input
              type="email"
              placeholder="customer@example.com"
              value={values.email}
              onChange={(event) => setValues({ ...values, email: event.target.value })}
              className="h-11 rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <FormField
            label="Phone"
            htmlFor="customer-phone"
            error={fieldErrors.phone}
            hint="Optional"
          >
            <Input
              type="tel"
              placeholder="+234 800 000 0000"
              value={values.phone}
              onChange={(event) => setValues({ ...values, phone: event.target.value })}
              className="h-11 rounded-lg bg-background/80 border-border"
            />
          </FormField>

          <FormField label="Risk level" htmlFor="customer-risk" error={fieldErrors.riskLevel}>
            <Select
              value={values.riskLevel}
              onChange={(event) =>
                setValues({ ...values, riskLevel: event.target.value as typeof values.riskLevel })
              }
              className="h-11 rounded-lg bg-background/80"
            >
              {RISK_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </option>
              ))}
            </Select>
          </FormField>

          <InlineError error={error} fallback="We could not add that customer." className="text-xs" />

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
              {isSubmitting ? 'Adding…' : 'Add customer'}
              {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
