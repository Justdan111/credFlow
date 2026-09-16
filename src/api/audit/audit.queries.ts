'use client';

import { useQuery } from '@tanstack/react-query';

import { listAuditLog, type AuditListParams } from '@/api/audit/audit.api';
import { queryKeys } from '@/api/query-keys';

/** Owner/admin only; a member gets a 403. */
export function useAuditLog(params?: AuditListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.audit.list(params),
    queryFn: () => listAuditLog(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}
