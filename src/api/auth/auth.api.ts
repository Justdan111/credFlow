import { apiClient, unwrap } from '@/api/client';
import { setAccessToken } from '@/api/token-store';
import type { ApiEnvelope } from '@/api/types';

/** Mirrors `minPasswordLen`/`maxPasswordLen` in the backend auth service. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const USER_ROLES = ['owner', 'admin', 'member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** Roles allowed to edit the business profile and delete customers/debts. */
export function canAdminister(role: string | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

/** Only an owner may void a payment. */
export function isOwner(role: string | undefined): boolean {
  return role === 'owner';
}

export interface User {
  id: string;
  businessId: string;
  email: string;
  name: string;
  role: UserRole | string;
  createdAt: string;
  updatedAt: string;
}

/** The trimmed business view returned alongside login/registration. */
export interface AuthBusiness {
  id: string;
  name: string;
  industry?: string | null;
  size?: string | null;
  currency: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  business: AuthBusiness;
  accessToken: string;
}

/**
 * `PATCH /auth/me` answers with this flat profile, which carries `phone`.
 *
 * `GET /auth/me` deliberately answers with `{ user, business }` instead, so
 * `phone` is only ever seen in the response to an update. `UpdateProfileInput`
 * below documents what that means for the settings form.
 */
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole | string;
  createdAt: string;
  updatedAt: string;
}

/**
 * `GET /auth/me` — the signed-in user together with their business, which is
 * everything the shell needs (identity, role, currency, onboarding state) in
 * one request.
 */
export interface CurrentSession {
  user: User;
  business: AuthBusiness;
}

export interface Session {
  id: string;
  userAgent: string;
  createdAt: string;
  lastActiveAt: string;
  current: boolean;
}

export interface RegisterInput {
  businessName: string;
  industry: string;
  size: string;
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * An omitted key is left unchanged by the API. That matters for `phone`:
 * `GET /auth/me` does not return it, so a form that cannot show the current
 * value must omit the key rather than send an empty string, which would wipe a
 * stored number the user never saw.
 */
export interface UpdateProfileInput {
  name?: string;
  phone?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const result = unwrap(await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/login', input));
  setAccessToken(result.accessToken);
  return result;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const result = unwrap(await apiClient.post<ApiEnvelope<AuthResponse>>('/auth/register', input));
  setAccessToken(result.accessToken);
  return result;
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout');
  } finally {
    // Whatever the server said, this browser is done with the session.
    setAccessToken(null);
  }
}

export async function getCurrentSession(): Promise<CurrentSession> {
  return unwrap(await apiClient.get<ApiEnvelope<CurrentSession>>('/auth/me'));
}

export async function updateProfile(input: UpdateProfileInput): Promise<Profile> {
  return unwrap(await apiClient.patch<ApiEnvelope<Profile>>('/auth/me', input));
}

export async function changePassword(input: ChangePasswordInput): Promise<void> {
  await apiClient.post('/auth/change-password', input);
}

export async function listSessions(): Promise<Session[]> {
  return unwrap(await apiClient.get<ApiEnvelope<Session[]>>('/auth/sessions'));
}

export async function revokeSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/auth/sessions/${sessionId}`);
}

/**
 * Always resolves for a well-formed address, whether or not the account
 * exists — the backend answers 202 either way to avoid leaking which emails
 * are registered, and the UI must not undo that by branching on the result.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await apiClient.post('/auth/reset-password', input);
}
