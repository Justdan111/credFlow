'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/onboarding');
    }, 500);
  };

  const perks = [
    'Free forever plan · No credit card',
    '14-day Growth trial included',
    'Cancel anytime',
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Eyebrow */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-6">
            <span className="text-xs font-medium text-primary tracking-wide">
              Create your account
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Start collecting smarter.
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Set up your business in under 5 minutes.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="businessName"
              className="text-xs font-medium text-muted-foreground"
            >
              Business name
            </Label>
            <Input
              id="businessName"
              placeholder="e.g. Bello Traders Ltd"
              required
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="fullName"
              className="text-xs font-medium text-muted-foreground"
            >
              Your name
            </Label>
            <Input
              id="fullName"
              placeholder="Amina Bello"
              required
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-xs font-medium text-muted-foreground"
            >
              Work email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@business.com"
              required
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                required
                className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border pr-10 focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              id="terms"
              type="checkbox"
              required
              className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-2 focus:ring-primary/30 mt-0.5 accent-primary"
            />
            <span className="text-xs text-muted-foreground">
              I agree to the{' '}
              <Link href="#" className="text-foreground hover:underline underline-offset-4">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-foreground hover:underline underline-offset-4">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full mt-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {isLoading ? 'Creating account…' : 'Create account'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        {/* Perks */}
        <ul className="mt-6 space-y-1.5">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-2 h-2 text-primary" strokeWidth={3} />
              </div>
              {p}
            </li>
          ))}
        </ul>

        {/* Login link */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
