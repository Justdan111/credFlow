/**
 * Presentation helpers.
 *
 * Currency is never hard-coded: every business picks its own on onboarding and
 * the API echoes it back with each financial payload, so amounts are always
 * formatted with the currency the caller was given.
 */

const DEFAULT_LOCALE = 'en-NG';

export function formatCurrency(
  amount: number | null | undefined,
  currency = 'NGN',
  options: { compact?: boolean } = {},
): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) return '—';

  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency,
    notation: options.compact ? 'compact' : 'standard',
    maximumFractionDigits: options.compact ? 1 : 2,
    minimumFractionDigits: options.compact ? 0 : 2,
  }).format(amount);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat(DEFAULT_LOCALE).format(value);
}

/** Percentages arrive from the API already scaled (92.5 means 92.5%). */
export function formatPercent(value: number | null | undefined, fractionDigits = 1): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return `${value.toFixed(fractionDigits)}%`;
}

/** Renders a change figure with its sign, or a dash when there is no baseline. */
export function formatChange(change: number | null | undefined): string {
  if (change === null || change === undefined || !Number.isFinite(change)) return '—';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function formatDate(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatDateTime(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return '—';
  return new Intl.DateTimeFormat(DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/** "3 days ago" / "in 5 days", falling back to an absolute date past a month. */
export function formatRelative(value: string | null | undefined): string {
  const date = parseDate(value);
  if (!date) return '—';

  const diffDays = Math.round((date.getTime() - Date.now()) / 86_400_000);
  if (Math.abs(diffDays) > 30) return formatDate(value);

  const relative = new Intl.RelativeTimeFormat(DEFAULT_LOCALE, { numeric: 'auto' });
  return relative.format(diffDays, 'day');
}

/** Initials for an avatar chip; never more than two letters. */
export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  const letters = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
  return letters || '?';
}

/** `YYYY-MM-DD` for a `<input type="date">`, in the browser's local timezone. */
export function toDateInputValue(value: string | Date | null | undefined): string {
  const date = value instanceof Date ? value : parseDate(value);
  if (!date) return '';
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10);
}

export function todayAsDateInput(): string {
  return toDateInputValue(new Date());
}

/**
 * Converts a date input into the RFC 3339 instant the payments API expects.
 * Midday local time is used so a timezone shift cannot move the payment onto
 * the previous or next day.
 */
export function dateInputToInstant(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Whole days until a due date; negative once it is in the past. */
export function daysUntil(value: string | null | undefined): number | null {
  const date = parseDate(value);
  if (!date) return null;
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

function parseDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
