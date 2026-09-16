'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  inviteMember,
  listMembers,
  removeMember,
  updateMember,
  type InviteMemberInput,
  type MemberListParams,
  type UpdateMemberInput,
} from '@/api/users/users.api';
import { queryKeys } from '@/api/query-keys';

export function useMembers(params?: MemberListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => listMembers(params),
    enabled,
  });
}

/** Owner/admin only. A duplicate address comes back as a 409. */
export function useInviteMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: InviteMemberInput) => inviteMember(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.audit.all });
    },
  });
}

/** Owner/admin only. Granting above your own role is refused with a 403. */
export function useUpdateMember(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateMemberInput) => updateMember(userId, input),
    onSuccess: (member) => {
      queryClient.setQueryData(queryKeys.users.detail(userId), member);
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.audit.all });
    },
  });
}

/** Owner only. Refused for the last owner (409) or the caller themselves (403). */
export function useRemoveMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => removeMember(userId),
    onSuccess: (_result, userId) => {
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(userId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.audit.all });
    },
  });
}
