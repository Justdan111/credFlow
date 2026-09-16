import type { ZodType } from 'zod';

export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export type ValidationResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: FieldErrors<T> };

/**
 * Flattens schema issues into one message per field.
 *
 * Client-side validation is a UX affordance, never a security control — the
 * server re-checks everything regardless.
 */
export function validateForm<T>(schema: ZodType<T>, values: unknown): ValidationResult<T> {
  const parsed = schema.safeParse(values);
  if (parsed.success) {
    return { success: true, data: parsed.data, errors: null };
  }

  const errors: FieldErrors<T> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    // First message per field; a stack under one input reads as noise.
    if (typeof field === 'string' && !(field in errors)) {
      errors[field as keyof T & string] = issue.message;
    }
  }
  return { success: false, data: null, errors };
}

/** Omits an optional field rather than sending `""`. */
export function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function parseAmount(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
