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

/**
 * The signed-in user and their business, in one request.
 *
 * `enabled` keeps it from firing before the session has been restored, which
 * would otherwise produce a guaranteed 401 on every cold load.
 */
export function useCurrentSession(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: getCurrentSession,
    enabled,
    staleTime: 5 * 60 * 1000,
    // A 401 here means the session is gone; retrying cannot change that.
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.isUnauthorized) && failureCount < 2,
  });
}

/**
 * The profile returned by the last successful update, which is the only place
 * `phone` is ever exposed — `GET /auth/me` does not include it.
 */
export function useUpdatedProfile() {
  return useQuery<Profile | null>({
    queryKey: queryKeys.auth.profile(),
    // Never fetched: this cache entry is only ever written by an update.
    queryFn: () => null,
    enabled: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => login(input),
    // The login payload carries a narrower user shape than `/auth/me`, so the
    // cache is refetched rather than seeded with a half-populated profile.
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
    // Everything cached belongs to the session that just ended.
    onSettled: () => queryClient.clear(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateProfile(input),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.auth.profile(), profile);
      // The name shown in the header and sidebar comes from `/auth/me`.
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.session() });
    },
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ChangePasswordInput) => changePassword(input),
    // Every other session was revoked server-side, so the list is now stale.
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

/**
 * Drops data belonging to whoever was signed in a moment ago. Signing in as a
 * different user must never show the previous tenant's rows.
 */
function resetSessionScopedCache(queryClient: QueryClient) {
  queryClient.clear();
}
