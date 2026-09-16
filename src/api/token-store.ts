/**
 * In-memory holder for the short-lived access token.
 *
 * The token deliberately never touches `localStorage` or a readable cookie:
 * anything JavaScript can read, injected JavaScript can exfiltrate. Losing it
 * on reload is not a problem because the refresh token lives in an httpOnly,
 * SameSite=Strict cookie, so `POST /auth/refresh` rebuilds the session on boot.
 */

let accessToken: string | null = null;

type Listener = (token: string | null) => void;

const listeners = new Set<Listener>();

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  if (accessToken === token) return;
  accessToken = token;
  for (const listener of listeners) listener(token);
}

export function clearAccessToken(): void {
  setAccessToken(null);
}

/**
 * Notifies when the token appears or disappears, so the session provider can
 * react to a refresh that failed deep inside an unrelated request.
 */
export function subscribeToAccessToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
