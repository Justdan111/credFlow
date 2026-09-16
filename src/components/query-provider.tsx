'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { ApiError } from '@/api/errors';

/**
 * Retries transport failures, never rejections.
 *
 * A 4xx is a decision the server already made — invalid input, a missing
 * record, a role the user does not have — and repeating the request cannot
 * change it. Retrying would only delay the error the user needs to see.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (error instanceof ApiError && error.status >= 400 && error.status < 500) return false;
  return failureCount < 2;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Created lazily and once per browser session: a client shared across users
  // would leak one tenant's cached rows into another's session.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: shouldRetry,
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
