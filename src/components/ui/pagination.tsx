'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { ApiMeta } from '@/api/types';
import { totalPages } from '@/api/types';
import { formatNumber } from '@/lib/format';

interface PaginationProps {
  meta: ApiMeta | undefined;
  page: number;
  onPageChange: (page: number) => void;
  /** Disables the controls while the next page is in flight. */
  isLoading?: boolean;
  /** Plural noun for the counter, e.g. "customers". */
  label: string;
}

/**
 * Server-driven pagination: the page number is the source of truth and every
 * change re-queries. Nothing is sliced client-side, so the count in the footer
 * is always the count the API reported.
 */
export function Pagination({ meta, page, onPageChange, isLoading = false, label }: PaginationProps) {
  const pages = totalPages(meta);
  const total = meta?.total ?? 0;
  const pageSize = meta?.pageSize ?? 0;
  const firstOnPage = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastOnPage = Math.min(page * pageSize, total);

  return (
    <div className="px-6 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">
        {total === 0
          ? `No ${label}`
          : `Showing ${formatNumber(firstOnPage)}–${formatNumber(lastOnPage)} of ${formatNumber(total)} ${label}`}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={isLoading || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="w-3 h-3" />
          Previous
        </Button>
        <span className="text-xs text-muted-foreground px-2">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={isLoading || page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
