import { apiClient, cleanParams, unwrap, unwrapPage } from '@/api/client';
import type { UserRole } from '@/api/auth/auth.api';
import { USER_ROLES } from '@/api/auth/auth.api';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

export { USER_ROLES };
export type { UserRole };

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
};

export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  owner: 'Full access, including voiding payments and removing teammates.',
  admin: 'Can manage customers, debts, payments and the team.',
  member: 'Can record customers, debts and payments, but not delete them.',
};

/** Ascending privilege, matching the backend's own ordering. */
const ROLE_RANK: Record<string, number> = { member: 1, admin: 2, owner: 3 };

/**
 * Whether `actorRole` may grant `targetRole`.
 *
 * The API refuses a grant above the caller's own rank with a 403. Mirroring the
 * rule here means the UI offers only the roles that will actually be accepted,
 * rather than presenting a choice and then reporting a permission error.
 */
export function canGrantRole(actorRole: string | undefined, targetRole: string): boolean {
  return (ROLE_RANK[actorRole ?? ''] ?? 0) >= (ROLE_RANK[targetRole] ?? 0);
}

export function grantableRoles(actorRole: string | undefined): UserRole[] {
  return USER_ROLES.filter((role) => canGrantRole(actorRole, role));
}

export interface Member {
  id: string;
  businessId: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole | string;
  invitedBy: string | null;
  /**
   * Null for somebody who has never signed in — which is how an outstanding
   * invitation is told apart from an active teammate, with no separate
   * invitations resource to keep in sync.
   */
  lastActiveAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberListParams extends PageParams {
  role?: UserRole;
}

export interface InviteMemberInput {
  email: string;
  name: string;
  role: UserRole;
}

export interface UpdateMemberInput {
  name?: string;
  role?: UserRole;
}

/** An invitation is outstanding until the invitee redeems their emailed link. */
export function isInvitationPending(member: Member): boolean {
  return member.lastActiveAt === null;
}

export async function listMembers(params?: MemberListParams): Promise<Paginated<Member>> {
  const response = await apiClient.get<ApiEnvelope<Member[]>>('/users', {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

export async function getMember(userId: string): Promise<Member> {
  return unwrap(await apiClient.get<ApiEnvelope<Member>>(`/users/${userId}`));
}

/**
 * Invites a teammate. Requires the owner or admin role.
 *
 * The response carries the created member but never the invitation link: that
 * link is a credential for taking over the account, so it goes to the invitee's
 * inbox and nowhere else. Re-inviting issues a fresh link and burns the old one.
 */
export async function inviteMember(input: InviteMemberInput): Promise<Member> {
  const result = unwrap(
    await apiClient.post<ApiEnvelope<{ member: Member }>>('/users', input),
  );
  return result.member;
}

/** Requires the owner or admin role. */
export async function updateMember(userId: string, input: UpdateMemberInput): Promise<Member> {
  return unwrap(await apiClient.patch<ApiEnvelope<Member>>(`/users/${userId}`, input));
}

/**
 * Removes a teammate and ends their sessions. Owner only.
 *
 * The API refuses to remove the last owner (409) or the caller themselves (403).
 */
export async function removeMember(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}
