import React from 'react';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Watercolor wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute -top-40 -right-20 w-180 h-180 bg-primary/20 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 -left-32 w-140 h-140 bg-accent/12 rounded-full blur-[150px]" />
        <div className="absolute top-40 left-1/3 w-125 h-125 bg-primary/10 rounded-full blur-[150px]" />

        {/* Grain */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12] mix-blend-overlay"
          xmlns="http://www.w3.org/2000/svg"
        >
          <filter id="auth-noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix values="0 0 0 0 0.35 0 0 0 0 0.15 0 0 0 0 0.55 0 0 0 0.6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#auth-noise)" />
        </svg>
      </div>

      {/* Top brand */}
      <header className="absolute top-0 inset-x-0 z-10 px-6 sm:px-10 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center">
              <Wallet className="w-4 h-4 text-background" strokeWidth={2} />
            </div>
            <span className="font-semibold tracking-tight text-[15px]">
              CredFlow
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}
