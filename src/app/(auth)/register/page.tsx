'use client'

import React from "react"

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const router = useRouter();
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    router.push('/onboarding');
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left Side - Background Image with Gradient (Desktop Only) */}
      <div className="hidden lg:flex flex-col justify-between p-8 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-white">CredFlow</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Start Your Free Trial Today
          </h2>
          <p className="text-purple-100 text-lg">
            No credit card required. Get access to all features for 14 days.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3 text-purple-100">
            <svg className="w-5 h-5 text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Unlimited debt tracking</span>
          </div>
          <div className="flex items-center gap-3 text-purple-100">
            <svg className="w-5 h-5 text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Real-time payment tracking</span>
          </div>
          <div className="flex items-center gap-3 text-purple-100">
            <svg className="w-5 h-5 text-purple-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Advanced analytics dashboard</span>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-0">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-bold text-foreground">CredFlow</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Create Account</h1>
              <p className="text-foreground/60">Join thousands of African SMEs</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-sm font-medium">Business Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="businessName"
                    placeholder="Your business name"
                    required
                    className="pl-10 bg-muted border-border"
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    required
                    className="pl-10 bg-muted border-border"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="pl-10 bg-muted border-border"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    required
                    className="pl-10 pr-10 bg-muted border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-foreground/40 hover:text-foreground/60"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground/40" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    required
                    className="pl-10 pr-10 bg-muted border-border"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-foreground/40 hover:text-foreground/60"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start gap-2 pt-2">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/50 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-foreground/70">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:text-primary/80 font-semibold">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link href="#" className="text-primary hover:text-primary/80 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Create Account Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 h-11 font-semibold text-base mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-foreground/70 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
