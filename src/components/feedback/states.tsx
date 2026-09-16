'use client';

import { AlertCircle, Inbox, Loader2 } from 'lucide-react';

import { getErrorMessage } from '@/api/errors';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * The three things a data-backed surface can be showing — loading, failed, or
 * legitimately empty — written once so every list and panel says it the same
 * way.
 */

export function FullPageLoader({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div
      role="status"
      className={cn('flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground', className)}
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      {label}
    </div>
  );
}

export function ErrorState({
  error,
  fallback = 'We could not load this data.',
  onRetry,
  className,
}: {
  error: unknown;
  fallback?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 px-6 text-center',
        className,
      )}
    >
      <div className="w-9 h-9 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
        <AlertCircle className="w-4 h-4" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm">{getErrorMessage(error, fallback)}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="rounded-full h-8 text-xs">
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-3 py-14 px-6 text-center', className)}
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        <Inbox className="w-4 h-4" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/** A one-line error under a form or next to an action. */
export function InlineError({ error, fallback, className }: { error: unknown; fallback?: string; className?: string }) {
  if (!error) return null;
  return (
    <p role="alert" className={cn('text-sm text-destructive', className)}>
      {getErrorMessage(error, fallback)}
    </p>
  );
}

/** A one-line confirmation after a successful action. */
export function InlineSuccess({ message, className }: { message: string | null; className?: string }) {
  if (!message) return null;
  return (
    <p role="status" className={cn('text-sm text-success', className)}>
      {message}
    </p>
  );
}
