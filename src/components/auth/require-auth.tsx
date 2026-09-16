'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/components/providers/session-provider';
import { FullPageLoader } from '@/components/feedback/states';

interface RequireAuthProps {
  children: React.ReactNode;
  /**
   * Sends users who have not finished onboarding to `/onboarding`. The
   * onboarding screen itself opts out, or it would redirect to itself.
   */
  requireOnboarding?: boolean;
}

/**
 * Client-side gate for authenticated screens.
 *
 * This is a navigation convenience, not the security boundary: every protected
 * route is enforced by the API, which checks the bearer token and the caller's
 * role on each request. Hiding a page a user cannot use is a courtesy; the
 * server is what actually says no.
 */
export function RequireAuth({ children, requireOnboarding = true }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, business } = useSession();

  const needsOnboarding =
    requireOnboarding && status === 'authenticated' && business?.onboardingCompleted === false;

  useEffect(() => {
    if (status === 'unauthenticated') {
      // `next` brings the user back to where they were headed after signing in.
      const next = encodeURIComponent(pathname);
      router.replace(`/login?next=${next}`);
    }
  }, [pathname, router, status]);

  useEffect(() => {
    if (needsOnboarding) router.replace('/onboarding');
  }, [needsOnboarding, router]);

  if (status !== 'authenticated') {
    return <FullPageLoader label="Checking your session…" />;
  }

  if (needsOnboarding) {
    return <FullPageLoader label="Finishing your setup…" />;
  }

  return <>{children}</>;
}
