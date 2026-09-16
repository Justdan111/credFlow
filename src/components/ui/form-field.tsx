'use client';

import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  /** Ties the label, the control and its error message together for screen readers. */
  htmlFor: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * One labelled control with its validation message.
 *
 * Rendering the error here (rather than in each form) is what keeps the
 * `aria-describedby`/`aria-invalid` wiring consistent everywhere.
 */
export function FormField({ label, htmlFor, error, hint, className, children }: FormFieldProps) {
  const describedBy = error ? `${htmlFor}-error` : hint ? `${htmlFor}-hint` : undefined;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      {React.isValidElement<Record<string, unknown>>(children)
        ? React.cloneElement(children, {
            id: htmlFor,
            'aria-invalid': error ? true : undefined,
            'aria-describedby': describedBy,
          })
        : children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
