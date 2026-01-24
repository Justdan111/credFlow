'use client';

import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`${mounted ? 'animate-fadeInDown' : 'opacity-0'} ${className}`}
      style={{
        animationDuration: '0.6s',
        animationFillMode: 'both',
      }}
    >
      {children}
    </div>
  );
}
