import { apiClient, setAccessToken, unwrap } from '@/api/client';
import type { ApiResponse } from '@/api/types';

export interface User {
  id: string;
  businessId: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  currency: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  business: Business;
  accessToken: string;
}

export interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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

export async function login(input: LoginInput) {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', input);
  const result = unwrap(response);
  setAccessToken(result.accessToken);
  return result;
}

export async function register(input: RegisterInput) {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', input);
  const result = unwrap(response);
  setAccessToken(result.accessToken);
  return result;
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiResponse<Profile>>('/auth/me');
  return unwrap(response);
}

export async function logout() {
  await apiClient.post('/auth/logout');
  setAccessToken(null);
}

export async function refreshAccessToken() {
  const response = await apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh');
  const result = unwrap(response);
  setAccessToken(result.accessToken);
  return result.accessToken;
}