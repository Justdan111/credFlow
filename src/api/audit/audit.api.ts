import { apiClient, cleanParams, unwrapPage } from '@/api/client';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

/** Destructive and financial actions only; reads are never recorded. */
export const AUDIT_ACTIONS = [
  'customer.deleted',
  'debt.updated',
  'debt.deleted',
  'debt.marked_paid',
  'payment.created',
  'payment.updated',
  'payment.voided',
  'business.updated',
  'user.invited',
  'user.role_changed',
  'user.removed',
  'auth.password_changed',
] as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  'customer.deleted': 'Deleted a customer',
  'debt.updated': 'Updated a debt',
  'debt.deleted': 'Deleted a debt',
  'debt.marked_paid': 'Marked a debt paid',
  'payment.created': 'Recorded a payment',
  'payment.updated': 'Corrected a payment',
  'payment.voided': 'Voided a payment',
  'business.updated': 'Updated the business profile',
  'user.invited': 'Invited a teammate',
  'user.role_changed': 'Changed a teammate’s role',
  'user.removed': 'Removed a teammate',
  'auth.password_changed': 'Changed their password',
};

export const AUDIT_ENTITY_TYPES = ['customer', 'debt', 'payment', 'business', 'user'] as const;
export type AuditEntityType = (typeof AUDIT_ENTITY_TYPES)[number];

export interface AuditEntry {
  id: string;
  businessId: string;
  /** Null once that user is removed; the denormalised name and email remain. */
  actorId: string | null;
  actorEmail: string;
  actorName: string;
  action: AuditAction | string;
  entityType: AuditEntityType | string;
  entityId: string | null;
  /** Whatever makes the entry readable later: an amount, a granted role. */
  metadata: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
}

export interface AuditListParams extends PageParams {
  action?: AuditAction;
  entityType?: AuditEntityType;
  entityId?: string;
  actorId?: string;
}

/** Requires the owner or admin role. */
export async function listAuditLog(params?: AuditListParams): Promise<Paginated<AuditEntry>> {
  const response = await apiClient.get<ApiEnvelope<AuditEntry[]>>('/audit-logs', {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}
