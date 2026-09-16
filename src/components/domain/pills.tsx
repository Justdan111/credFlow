import type { PaymentMethod } from '@/api/payments/payments.api';
import { PAYMENT_METHOD_LABELS } from '@/api/payments/payments.api';
import { cn } from '@/lib/utils';

/**
 * Status vocabulary comes from the API in lower case (`low`, `pending`,
 * `bank_transfer`). These pills own the mapping to a human label and a colour,
 * so no page has to guess at casing — the class of bug where a filter silently
 * matches nothing.
 */

const TONES = {
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-destructive/10 text-destructive',
  neutral: 'bg-muted text-muted-foreground',
} as const;

const DOTS = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
  neutral: 'bg-muted-foreground',
} as const;

type Tone = keyof typeof TONES;

function Pill({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap',
        TONES[tone],
        className,
      )}
    >
      <span className={cn('w-1 h-1 rounded-full', DOTS[tone])} />
      {children}
    </span>
  );
}

const RISK_TONES: Record<string, Tone> = { low: 'success', medium: 'warning', high: 'danger' };

export function RiskPill({ level, suffix = '' }: { level: string; suffix?: string }) {
  const key = level?.toLowerCase() ?? '';
  return (
    <Pill tone={RISK_TONES[key] ?? 'neutral'}>
      {capitalise(key || 'unknown')}
      {suffix}
    </Pill>
  );
}

/**
 * A debt's displayed state is its status plus whether it is late: the API
 * keeps `overdue` separate from `status` because an overdue debt is still
 * "pending" as far as the ledger is concerned.
 */
export function DebtStatusPill({ status, overdue = false }: { status: string; overdue?: boolean }) {
  const key = status?.toLowerCase() ?? '';
  if (key === 'paid') return <Pill tone="success">Paid</Pill>;
  if (overdue) return <Pill tone="danger">Overdue</Pill>;
  if (key === 'partial') return <Pill tone="warning">Part paid</Pill>;
  if (key === 'pending') return <Pill tone="warning">Pending</Pill>;
  return <Pill tone="neutral">{capitalise(key || 'unknown')}</Pill>;
}

export function MethodBadge({ method }: { method: string }) {
  const label = PAYMENT_METHOD_LABELS[method as PaymentMethod] ?? capitalise(method.replace(/_/g, ' '));
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-foreground whitespace-nowrap">
      {label}
    </span>
  );
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
