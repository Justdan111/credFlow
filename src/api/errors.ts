import axios from 'axios';
import type { ApiEnvelope } from '@/api/types';

/** The only error type the UI sees, so no component imports Axios. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }

  /** 0 means the request never reached the API (offline, DNS, CORS). */
  get isNetworkError() {
    return this.status === 0;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }

  get isConflict() {
    return this.status === 409;
  }

  get isValidation() {
    return this.status === 400 || this.status === 422;
  }

  get isRateLimited() {
    return this.status === 429;
  }
}

const NETWORK_MESSAGE =
  'Cannot reach the CredFlow API. Check your connection and try again.';
const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (axios.isAxiosError(error)) {
    const response = error.response;
    if (!response) {
      return new ApiError(NETWORK_MESSAGE, 0);
    }

    const body = response.data as Partial<ApiEnvelope<unknown>> | undefined;
    const message = body?.error?.message ?? statusMessage(response.status);
    return new ApiError(message, response.status, body?.error?.code);
  }

  if (error instanceof Error) {
    return new ApiError(error.message || FALLBACK_MESSAGE, 0);
  }

  return new ApiError(FALLBACK_MESSAGE, 0);
}

/**
 * Message to render for a failed request. `fallback` covers the case where the
 * server message is too technical for the surface showing it.
 */
export function getErrorMessage(error: unknown, fallback = FALLBACK_MESSAGE): string {
  if (!error) return fallback;
  const apiError = toApiError(error);
  return apiError.message || fallback;
}

function statusMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Your session has expired. Please sign in again.';
    case 403:
      return 'You do not have permission to do that.';
    case 404:
      return 'We could not find what you were looking for.';
    case 409:
      return 'That change conflicts with the current state of your data.';
    case 413:
      return 'That request was too large.';
    case 429:
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return status >= 500 ? 'The server ran into a problem. Please try again.' : FALLBACK_MESSAGE;
  }
}
