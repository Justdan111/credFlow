import type { ZodType } from 'zod';

/** One message per field, keyed by the field name the form renders. */
export type FieldErrors<T> = Partial<Record<keyof T & string, string>>;

export type ValidationResult<T> =
  | { success: true; data: T; errors: null }
  | { success: false; data: null; errors: FieldErrors<T> };

/**
 * Validates form state against a schema and flattens the issues into the shape
 * inputs render directly.
 *
 * Client-side validation is a UX affordance, never a security control: the
 * schemas here mirror the API's rules so the user gets an instant answer, and
 * the server re-checks everything regardless.
 */
export function validateForm<T>(schema: ZodType<T>, values: unknown): ValidationResult<T> {
  const parsed = schema.safeParse(values);
  if (parsed.success) {
    return { success: true, data: parsed.data, errors: null };
  }

  const errors: FieldErrors<T> = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    // Keep the first message per field: a stack of messages under one input
    // reads as noise.
    if (typeof field === 'string' && !(field in errors)) {
      errors[field as keyof T & string] = issue.message;
    }
  }
  return { success: false, data: null, errors };
}

/**
 * Turns an empty input into `undefined` so optional fields are omitted from the
 * request body rather than sent as `""`.
 */
export function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

/** Parses a money input, returning `undefined` when it is blank or not a number. */
export function parseAmount(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
