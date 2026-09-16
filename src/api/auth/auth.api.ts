import { apiClient, unwrap } from '@/api/client';
import { setAccessToken } from '@/api/token-store';
import type { ApiEnvelope } from '@/api/types';

/** Mirrors `minPasswordLen`/`maxPasswordLen` in the backend auth service. */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export const USER_ROLES = ['owner', 'admin', 'member'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function canAdminister(role: string | undefined): boolean {
  return role === 'owner' || role === 'admin';
}

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

/** The `PATCH /auth/me` response. `GET /auth/me` returns `CurrentSession`, so
 *  `phone` is only ever visible in the reply to an update. */
export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole | string;
  createdAt: string;
  updatedAt: string;
}

/** `GET /auth/me` — identity, role, currency and onboarding state in one request. */
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

/** An omitted key is left unchanged. Omit `phone` rather than sending `''`:
 *  the form cannot show the stored value, so an empty string would wipe it. */
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

/** Resolves whether or not the account exists — the API answers 202 either way,
 *  and branching on the result would leak which addresses are registered. */
export async function requestPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email });
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await apiClient.post('/auth/reset-password', input);
}
