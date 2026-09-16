// The access token is held in memory only — never localStorage — so injected
// JavaScript cannot read it. The httpOnly refresh cookie restores it on reload.

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

export function subscribeToAccessToken(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
