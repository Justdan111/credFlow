'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Receipt, Search, Users, Wallet } from 'lucide-react';

import { MIN_SEARCH_LENGTH, totalResults, type SearchResult } from '@/api/search/search.api';
import { useSearch } from '@/api/search/search.queries';
import { useSession } from '@/components/providers/session-provider';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';

const ICONS = {
  customer: Users,
  debt: Receipt,
  payment: Wallet,
} as const;

const HREF_PREFIX = {
  customer: '/customers',
  debt: '/debts',
  payment: '/payments',
} as const;

/** Searches customers, debts and payments in one request. */
export function GlobalSearch() {
  const router = useRouter();
  const { currency } = useSession();

  const [term, setTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedTerm = useDebouncedValue(term, 250);
  const searchQuery = useSearch(debouncedTerm, isOpen);

  // Flattened so arrow keys can walk the whole dropdown, not one group at a time.
  const results: SearchResult[] = [
    ...(searchQuery.data?.customers ?? []),
    ...(searchQuery.data?.debts ?? []),
    ...(searchQuery.data?.payments ?? []),
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [isOpen]);

  const goTo = (result: SearchResult) => {
    setIsOpen(false);
    setTerm('');
    router.push(`${HREF_PREFIX[result.type]}/${result.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (results.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      goTo(results[activeIndex]);
    }
  };

  const isTermLongEnough = debouncedTerm.trim().length >= MIN_SEARCH_LENGTH;
  const showPanel = isOpen && term.trim().length > 0;

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md ml-12 lg:ml-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={term}
          onChange={(event) => {
            setTerm(event.target.value);
            setIsOpen(true);
            // Typing invalidates the highlighted row: by the time the debounced
            // results arrive, index 0 is the only one guaranteed to exist.
            setActiveIndex(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search customers, debts, payments…"
          aria-label="Search"
          role="combobox"
          aria-expanded={showPanel}
          aria-controls="global-search-results"
          className="w-full h-9 pl-9 pr-9 rounded-lg bg-muted/40 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
        />
        {searchQuery.isFetching && isTermLongEnough && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {showPanel && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-border bg-card shadow-lg shadow-black/5 overflow-hidden z-50 max-h-96 overflow-y-auto"
        >
          {!isTermLongEnough ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              Keep typing — at least {MIN_SEARCH_LENGTH} characters.
            </p>
          ) : searchQuery.isPending ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">Searching…</p>
          ) : searchQuery.isError ? (
            <p role="alert" className="px-4 py-3 text-xs text-destructive">
              Search is unavailable right now.
            </p>
          ) : totalResults(searchQuery.data) === 0 ? (
            <p className="px-4 py-3 text-xs text-muted-foreground">
              Nothing matches “{debouncedTerm}”.
            </p>
          ) : (
            <ul className="py-1">
              {results.map((result, index) => {
                const Icon = ICONS[result.type];
                return (
                  <li key={`${result.type}-${result.id}`}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={index === activeIndex}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => goTo(result)}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                        index === activeIndex ? 'bg-muted/60' : 'hover:bg-muted/40',
                      )}
                    >
                      <span className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium truncate">{result.title}</span>
                        <span className="block text-xs text-muted-foreground truncate">
                          {result.subtitle || capitalise(result.type)}
                        </span>
                      </span>
                      <span className="text-right shrink-0">
                        {result.amount !== undefined && (
                          <span className="block text-xs font-medium">
                            {formatCurrency(result.amount, currency)}
                          </span>
                        )}
                        {result.date && (
                          <span className="block text-[10px] text-muted-foreground">
                            {formatDate(result.date)}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
