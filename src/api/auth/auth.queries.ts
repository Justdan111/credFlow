'use client';

import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';

import {
  changePassword,
  getCurrentSession,
  listSessions,
  login,
  logout,
  register,
  requestPasswordReset,
  resetPassword,
  revokeSession,
  updateProfile,
  type ChangePasswordInput,
  type LoginInput,
  type RegisterInput,
  type Profile,
  type ResetPasswordInput,
  type UpdateProfileInput,
} from '@/api/auth/auth.api';
import { ApiError } from '@/api/errors';
import { queryKeys } from '@/api/query-keys';

export const authKeys = queryKeys.auth;

/** `enabled` holds it back until the session is restored, avoiding a certain 401. */
export function useCurrentSession(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: getCurrentSession,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.isUnauthorized) && failureCount < 2,
  });
}

/** The last update's response — the only place `phone` is exposed. */
export function useUpdatedProfile() {
  return useQuery<Profile | null>({
    queryKey: queryKeys.auth.profile(),
    // Never fetched; written only by useUpdateProfile.
    queryFn: () => null,
    enabled: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    onSuccess: () => resetSessionScopedCache(queryClient),
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RegisterInput) => register(input),
    onSuccess: () => resetSessionScopedCache(queryClient),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSettled: () => queryClient.clear(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.auth.profile(), profile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions() }),
  });
}

export function useSessions(enabled = true) {
  return useQuery({ queryKey: queryKeys.auth.sessions(), queryFn: listSessions, enabled });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => revokeSession(sessionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.auth.sessions() }),
  });
}

export function useRequestPasswordReset() {
  return useMutation({ mutationFn: (email: string) => requestPasswordReset(email) });
}

export function useResetPassword() {
  return useMutation({ mutationFn: (input: ResetPasswordInput) => resetPassword(input) });
}

/** Signing in as a different user must never show the previous tenant's rows. */
function resetSessionScopedCache(queryClient: QueryClient) {
  queryClient.clear();
}
