'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { canAdminister, isOwner, type AuthBusiness, type User } from '@/api/auth/auth.api';
import { useCurrentSession, useLogout } from '@/api/auth/auth.queries';
import { restoreSession } from '@/api/client';
import { getAccessToken, subscribeToAccessToken } from '@/api/token-store';

export type SessionStatus = 'restoring' | 'authenticated' | 'unauthenticated';

interface SessionValue {
  status: SessionStatus;
  user: User | undefined;
  business: AuthBusiness | undefined;
  /** The business currency, with a safe default before the session loads. */
  currency: string;
  role: string | undefined;
  /** May edit the business profile and delete customers and debts. */
  canAdminister: boolean;
  /** May void payments. */
  isOwner: boolean;
  signOut: () => Promise<void>;
  isSigningOut: boolean;
}

const SessionContext = createContext<SessionValue | null>(null);

/**
 * Owns "is somebody signed in, and who".
 *
 * The access token lives in memory only, so a reload starts with nothing. The
 * httpOnly refresh cookie is the durable credential: one `POST /auth/refresh`
 * on boot either restores the session or proves there is none. `GET /auth/me`
 * then returns the user and their business together, so the whole shell —
 * identity, role, currency, onboarding state — costs one request.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(() => Boolean(getAccessToken()));
  const [isRestoring, setIsRestoring] = useState(!getAccessToken());

  useEffect(() => {
    // Keeps the provider in step with a refresh that succeeded — or failed —
    // inside an unrelated request deep in the app.
    const unsubscribe = subscribeToAccessToken((token) => setHasToken(Boolean(token)));
    return unsubscribe;
  }, []);

  useEffect(() => {
    // A token already in memory means the session never lapsed — `isRestoring`
    // was initialised false and there is nothing to rebuild.
    if (getAccessToken()) return;

    let active = true;
    void restoreSession().finally(() => {
      if (active) setIsRestoring(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const sessionQuery = useCurrentSession(hasToken);
  const logoutMutation = useLogout();

  const status: SessionStatus = useMemo(() => {
    if (isRestoring) return 'restoring';
    if (!hasToken) return 'unauthenticated';
    if (sessionQuery.isPending) return 'restoring';
    return sessionQuery.isSuccess ? 'authenticated' : 'unauthenticated';
  }, [hasToken, isRestoring, sessionQuery.isPending, sessionQuery.isSuccess]);

  const signOut = useCallback(async () => {
    await logoutMutation.mutateAsync();
  }, [logoutMutation]);

  const user = sessionQuery.data?.user;
  const business = sessionQuery.data?.business;

  const value = useMemo<SessionValue>(
    () => ({
      status,
      user,
      business,
      currency: business?.currency ?? 'NGN',
      role: user?.role,
      canAdminister: canAdminister(user?.role),
      isOwner: isOwner(user?.role),
      signOut,
      isSigningOut: logoutMutation.isPending,
    }),
    [business, logoutMutation.isPending, signOut, status, user],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used inside a SessionProvider');
  }
  return context;
}
