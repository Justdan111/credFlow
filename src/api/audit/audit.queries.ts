'use client';

import { useQuery } from '@tanstack/react-query';

import { listAuditLog, type AuditListParams } from '@/api/audit/audit.api';
import { queryKeys } from '@/api/query-keys';

/**
 * The audit trail. Requires the owner or admin role; a member gets a 403, which
 * the calling screen renders as a permission message rather than an error.
 */
export function useAuditLog(params?: AuditListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: () => listAuditLog(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}
