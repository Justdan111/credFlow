'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Check, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [password, setPassword] = useState('');

  const rules = [
    { label: 'At least 8 characters', valid: password.length >= 8 },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'One number', valid: /\d/.test(password) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
          >
            <Check className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Password reset.
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
            Your password has been updated. You can now sign in with your new password.
          </p>
          <Button
            asChild
            className="w-full h-11 rounded-full mt-8 text-sm shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Link href="/login">
              Go to sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

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
            <KeyRound className="w-3 h-3 text-primary" strokeWidth={2.25} />
            <span className="text-xs font-medium text-primary tracking-wide">
              New password
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Set a new password.
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Choose a password you haven&apos;t used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground"
            >
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="space-y-1.5">
            <Label
              htmlFor="confirm"
              className="text-xs font-medium text-muted-foreground"
            >
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter password"
                required
                className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border pr-10 focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Live rules */}
          <ul className="space-y-1.5 pt-1">
            {rules.map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                    r.valid ? 'bg-primary/15' : 'bg-muted/60'
                  }`}
                >
                  <Check
                    className={`w-2 h-2 transition-colors ${
                      r.valid ? 'text-primary' : 'text-muted-foreground/50'
                    }`}
                    strokeWidth={3}
                  />
                </div>
                <span
                  className={
                    r.valid ? 'text-foreground/80' : 'text-muted-foreground'
                  }
                >
                  {r.label}
                </span>
              </li>
            ))}
          </ul>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full mt-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {isLoading ? 'Resetting…' : 'Reset password'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Remembered it?{' '}
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
