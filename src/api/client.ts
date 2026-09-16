import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { toApiError } from '@/api/errors';
import { clearAccessToken, getAccessToken, setAccessToken } from '@/api/token-store';
import { DEFAULT_PAGE_SIZE, type ApiEnvelope, type ApiMeta, type Paginated } from '@/api/types';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') ?? 'http://localhost:8080/api';

// A 401 from these is the answer, not an expired token — retrying would loop.
const NON_REFRESHABLE_PATHS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

/** `_retried` marks a request that has already been replayed once. */
type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

/** `withCredentials` carries the httpOnly refresh cookie. */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

/** Refresh uses a bare client: `apiClient` would recurse through its own 401 handler. */
const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.set('Authorization', `Bearer ${token}`);
  return config;
});

/** Single-flight guard: concurrent 401s share one refresh round-trip. */
let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  refreshInFlight ??= refreshClient
    .post<ApiEnvelope<{ accessToken: string }>>('/auth/refresh')
    .then(({ data }) => {
      const token = data.data.accessToken;
      setAccessToken(token);
      return token;
    })
    .catch(() => {
      // The session is gone; subscribers redirect to sign-in.
      clearAccessToken();
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(toApiError(error));
    }

    const request = error.config as RetriableConfig | undefined;
    const path = request?.url ?? '';
    const skipRefresh =
      !request || request._retried || NON_REFRESHABLE_PATHS.some((p) => path.startsWith(p));

    if (skipRefresh) {
      return Promise.reject(toApiError(error));
    }

    const token = await refreshAccessToken();
    if (!token) return Promise.reject(toApiError(error));

    request._retried = true;
    request.headers.set('Authorization', `Bearer ${token}`);
    return apiClient(request);
  },
);

export function restoreSession(): Promise<string | null> {
  return refreshAccessToken();
}

export function unwrap<T>(response: AxiosResponse<ApiEnvelope<T>>): T {
  return response.data.data;
}

/** `meta` is synthesised when the server omits it, so callers never null-check it. */
export function unwrapPage<T>(
  response: AxiosResponse<ApiEnvelope<T[]>>,
  requested: { page?: number; pageSize?: number } = {},
): Paginated<T> {
  const items = response.data.data ?? [];
  const meta: ApiMeta = response.data.meta ?? {
    page: requested.page ?? 1,
    pageSize: requested.pageSize ?? DEFAULT_PAGE_SIZE,
    total: items.length,
  };
  return { items, meta };
}

/** Drops empty values: some routes treat `?search=` as a real (empty) filter. */
export function cleanParams<T extends object>(params?: T): Partial<T> | undefined {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );
  return entries.length ? (Object.fromEntries(entries) as Partial<T>) : undefined;
}
