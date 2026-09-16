'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AUDIT_ACTIONS,
  AUDIT_ACTION_LABELS,
  type AuditAction,
  type AuditEntry,
} from '@/api/audit/audit.api';
import { useAuditLog } from '@/api/audit/audit.queries';
import { ApiError } from '@/api/errors';
import { DEFAULT_PAGE_SIZE } from '@/api/types';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Pagination } from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { formatCurrency, formatDateTime, initials } from '@/lib/format';

/** Where an entry's subject can be opened, when it still exists. */
const ENTITY_HREF: Record<string, string> = {
  customer: '/customers',
  debt: '/debts',
  payment: '/payments',
};

export function ActivityPanel() {
  const { currency, canAdminister } = useSession();

  const [action, setAction] = useState<AuditAction | ''>('');
  const [page, setPage] = useState(1);

  const params = useMemo(
    () => ({ page, pageSize: DEFAULT_PAGE_SIZE, action: action || undefined }),
    [action, page],
  );

  // A member gets a 403 from this route; asking at all would just log a
  // rejection, so the request is not made.
  const auditQuery = useAuditLog(params, canAdminister);

  const applyActionFilter = (next: AuditAction | '') => {
    setAction(next);
    setPage(1);
  };

  if (!canAdminister) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <p className="text-sm font-semibold">Activity</p>
        <p className="text-xs text-muted-foreground mt-2">
          Only an owner or admin can see who changed what.
        </p>
      </div>
    );
  }

  const entries = auditQuery.data?.items ?? [];

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-6 sm:p-7 pb-4">
        <div>
          <p className="text-sm font-semibold">Activity</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Every deletion and money movement, with who did it. Reads are not recorded.
          </p>
        </div>
        <Select
          aria-label="Filter by action"
          value={action}
          onChange={(event) => applyActionFilter(event.target.value as AuditAction | '')}
          className="h-9 sm:w-56 text-xs rounded-lg"
        >
          <option value="">All activity</option>
          {AUDIT_ACTIONS.map((value) => (
            <option key={value} value={value}>
              {AUDIT_ACTION_LABELS[value]}
            </option>
          ))}
        </Select>
      </div>

      {auditQuery.isPending ? (
        <LoadingState label="Loading activity…" />
      ) : auditQuery.isError ? (
        <ErrorState
          error={auditQuery.error}
          fallback={
            auditQuery.error instanceof ApiError && auditQuery.error.isForbidden
              ? 'Only an owner or admin can see this.'
              : 'We could not load your activity.'
          }
          onRetry={() => auditQuery.refetch()}
        />
      ) : entries.length === 0 ? (
        <EmptyState
          title={action ? 'Nothing matches that filter' : 'No activity yet'}
          description={
            action
              ? 'Try a different action.'
              : 'Deletions, corrections and money movements will appear here as they happen.'
          }
        />
      ) : (
        <>
          <ul className="divide-y divide-border border-t border-border">
            {entries.map((entry) => (
              <ActivityRow key={entry.id} entry={entry} currency={currency} />
            ))}
          </ul>
          <Pagination
            meta={auditQuery.data?.meta}
            page={page}
            onPageChange={setPage}
            isLoading={auditQuery.isFetching}
            label="entries"
          />
        </>
      )}
    </div>
  );
}

function ActivityRow({ entry, currency }: { entry: AuditEntry; currency: string }) {
  const label = AUDIT_ACTION_LABELS[entry.action as AuditAction] ?? entry.action;
  const href = entry.entityId ? ENTITY_HREF[entry.entityType] : undefined;
  const detail = describeMetadata(entry, currency);

  return (
    <li className="flex items-start gap-3 px-6 sm:px-7 py-3.5">
      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0 mt-0.5">
        {initials(entry.actorName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm">
          <span className="font-medium">{entry.actorName}</span>{' '}
          <span className="text-muted-foreground">{label.toLowerCase()}</span>
          {detail && <span className="text-muted-foreground"> · {detail}</span>}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          {formatDateTime(entry.createdAt)}
          {/* A deleted row has no page left to open, so the link is dropped
              rather than pointing at a 404. */}
          {href && entry.entityId && !isDeletion(entry.action) && (
            <>
              {' · '}
              <Link
                href={`${href}/${entry.entityId}`}
                className="hover:underline underline-offset-4"
              >
                View {entry.entityType}
              </Link>
            </>
          )}
        </p>
      </div>
    </li>
  );
}

function isDeletion(action: string): boolean {
  return action.endsWith('.deleted') || action.endsWith('.voided') || action.endsWith('.removed');
}

/**
 * Turns the free-form metadata into one readable clause.
 *
 * The API stores whatever made an entry meaningful — an amount, a granted role —
 * so this reads the keys it knows and stays quiet about the rest rather than
 * dumping JSON at somebody trying to reconstruct an incident.
 */
function describeMetadata(entry: AuditEntry, currency: string): string {
  const { metadata } = entry;
  const parts: string[] = [];

  if (typeof metadata.amount === 'number') {
    parts.push(formatCurrency(metadata.amount, currency));
  }
  if (typeof metadata.name === 'string') {
    parts.push(metadata.name);
  }
  if (typeof metadata.email === 'string') {
    parts.push(metadata.email);
  }
  if (typeof metadata.role === 'string') {
    parts.push(`as ${metadata.role}`);
  }
  if (typeof metadata.currency === 'string') {
    parts.push(metadata.currency);
  }

  return parts.join(' · ');
}
