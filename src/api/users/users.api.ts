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

const ROLE_RANK: Record<string, number> = { member: 1, admin: 2, owner: 3 };

/** Mirrors the API's rule so the UI offers only roles that will be accepted. */
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
  /** Null until they first sign in, which is how a pending invite is detected. */
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

/** Owner/admin. The invitation link is never returned — it goes only to the
 *  invitee's inbox. Re-inviting issues a fresh link and burns the old one. */
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

/** Owner only. Refused for the last owner (409) or the caller themselves (403). */
export async function removeMember(userId: string): Promise<void> {
  await apiClient.delete(`/users/${userId}`);
}
