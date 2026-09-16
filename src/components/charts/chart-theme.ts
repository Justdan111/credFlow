/**
 * One palette for every chart.
 *
 * Recharts needs concrete colour values rather than Tailwind classes, so the
 * design tokens are mirrored here once. Keeping them in a single module is
 * what stops two charts showing "high risk" in two different reds.
 */
export const chartColors = {
  primary: 'oklch(0.588 0.233 293)',
  primarySoft: 'oklch(0.588 0.233 293 / 0.35)',
  primaryFaint: 'oklch(0.588 0.233 293 / 0.15)',
  muted: 'oklch(0.502 0.032 257)',
  grid: 'oklch(0.912 0.058 293 / 0.5)',
  low: 'oklch(0.698 0.195 145)',
  medium: 'oklch(0.745 0.155 75)',
  high: 'oklch(0.628 0.258 27)',
} as const;

export const axisProps = {
  stroke: chartColors.muted,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

export const tooltipStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'var(--foreground)',
} as const;

/** Colour for a risk bucket, whatever casing the API used. */
export function riskColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return chartColors.low;
    case 'medium':
      return chartColors.medium;
    case 'high':
      return chartColors.high;
    default:
      return chartColors.muted;
  }
}
