/**
 * Shared shapes for the CredFlow REST contract.
 *
 * Every JSON endpoint answers with the same envelope, so unwrapping lives in
 * one place (`src/api/client.ts`) instead of being repeated per request.
 */

export interface ApiMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiErrorBody {
  message: string;
  code?: string;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: ApiMeta | null;
  error: ApiErrorBody | null;
}

/** A list response paired with the pagination metadata the server reported. */
export interface Paginated<T> {
  items: T[];
  meta: ApiMeta;
}

/** Query parameters every list endpoint accepts. */
export interface PageParams {
  page?: number;
  pageSize?: number;
}

export const DEFAULT_PAGE_SIZE = 20;
/** Mirrors `maxPageSize` in the backend services; larger values are clamped. */
export const MAX_PAGE_SIZE = 100;

export function totalPages(meta: ApiMeta | undefined): number {
  if (!meta || meta.pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(meta.total / meta.pageSize));
}
