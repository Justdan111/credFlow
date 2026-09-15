import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const ACCESS_TOKEN_KEY = 'credflow.accessToken';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config;
    if (
      error.response?.status !== 401 ||
      !request ||
      request.url?.endsWith('/auth/refresh') ||
      request.url?.endsWith('/auth/login')
    ) {
      return Promise.reject(error);
    }

    if (!refreshPromise) {
      refreshPromise = apiClient
        .post<{ data: { accessToken: string } }>('/auth/refresh')
        .then(({ data }) => {
          const token = data.data.accessToken;
          setAccessToken(token);
          return token;
        })
        .catch(() => {
          setAccessToken(null);
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const token = await refreshPromise;
    if (!token) return Promise.reject(error);
    request.headers.Authorization = `Bearer ${token}`;
    return apiClient(request);
  },
);

export function unwrap<T>({ data }: { data: { data: T } }) {
  return data.data;
}