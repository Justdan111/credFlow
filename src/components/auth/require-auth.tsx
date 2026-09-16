'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/components/providers/session-provider';
import { FullPageLoader } from '@/components/feedback/states';

interface RequireAuthProps {
  children: React.ReactNode;
  /** The onboarding screen opts out, or it would redirect to itself. */
  requireOnboarding?: boolean;
}

/**
 * A navigation convenience, not the security boundary — the API checks the
 * token and role on every request regardless.
 */
export function RequireAuth({ children, requireOnboarding = true }: RequireAuthProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { status, business } = useSession();

  const needsOnboarding =
    requireOnboarding && status === 'authenticated' && business?.onboardingCompleted === false;

  useEffect(() => {
    if (status === 'unauthenticated') {
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
