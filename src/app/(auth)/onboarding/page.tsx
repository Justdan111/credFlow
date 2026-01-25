'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, Building2, User, Plus, TrendingDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

type Step = 'business' | 'customer' | 'debt' | 'complete'

const STEPS: { id: Step; title: string; description: string }[] = [
  { id: 'business', title: 'Business Info', description: 'Tell us about your business' },
  { id: 'customer', title: 'Add Customer', description: 'Add your first customer' },
  { id: 'debt', title: 'Add Debt', description: 'Record your first debt' },
  { id: 'complete', title: 'Complete', description: 'You\'re all set!' },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('business')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    industry: '',
    businessSize: '',
    customerName: '',
    customerEmail: '',
    debtAmount: '',
    dueDate: '',
  })

  const currentStepIndex = STEPS.findIndex(s => s.id === currentStep)

  const handleNext = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const steps: Step[] = ['business', 'customer', 'debt', 'complete']
      const nextIndex = steps.indexOf(currentStep) + 1
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex] as Step)
      }
    }, 500)
  }

  const handlePrev = () => {
    const steps: Step[] = ['business', 'customer', 'debt', 'complete']
    const prevIndex = steps.indexOf(currentStep) - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex] as Step)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="text-center space-y-8">
            {/* Success Animation */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-scaleIn">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-foreground">Welcome to CredFlow!</h1>
              <p className="text-foreground/60 text-lg">
                Your account is all set up. Start managing your business debts like a pro.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 h-11 font-semibold text-base"
              >
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                className="w-full border-border h-11 bg-transparent"
                asChild
              >
                <Link href="/dashboard">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-bold text-foreground">CredFlow</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Let&apos;s Get Started
          </h1>
          <p className="text-foreground/60">
            Set up your account in just 3 quick steps
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    index < currentStepIndex
                      ? 'bg-green-500 text-white'
                      : index === currentStepIndex
                        ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                        : 'bg-muted text-foreground/50'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                      index < currentStepIndex ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-foreground/60 text-center">
            Step {currentStepIndex + 1} of {STEPS.length - 1}: {STEPS[currentStepIndex].description}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <div className="animate-fadeInUp min-h-96">
            {currentStep === 'business' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Business Information</h2>
                    <p className="text-foreground/60">Help us understand your business better</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Industry</Label>
                    <select
                      value={formData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select your industry</option>
                      <option value="retail">Retail</option>
                      <option value="services">Services</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="agriculture">Agriculture</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Business Size</Label>
                    <select
                      value={formData.businessSize}
                      onChange={(e) => handleInputChange('businessSize', e.target.value)}
                      className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select business size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-100">51-100 employees</option>
                      <option value="100+">100+ employees</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'customer' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Add Your First Customer</h2>
                    <p className="text-foreground/60">Who does your business extend credit to?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Customer Name</Label>
                    <Input
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="e.g., John's Store"
                      className="mt-2 bg-muted border-border"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Customer Email</Label>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="customer@example.com"
                      className="mt-2 bg-muted border-border"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 'debt' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Record Your First Debt</h2>
                    <p className="text-foreground/60">How much does the customer owe you?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Debt Amount</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-4 top-2.5 text-foreground/60">₦</span>
                      <Input
                        type="number"
                        value={formData.debtAmount}
                        onChange={(e) => handleInputChange('debtAmount', e.target.value)}
                        placeholder="0.00"
                        className="pl-8 bg-muted border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Due Date</Label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="mt-2 bg-muted border-border"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-8 border-t border-border">
            <Button
              onClick={handlePrev}
              disabled={currentStep === 'business'}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="flex-1" />

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
            >
              <span className="hidden sm:inline">{currentStep === 'debt' ? 'Complete Setup' : 'Next'}</span>
              <span className="sm:hidden">{currentStep === 'debt' ? 'Complete' : 'Next'}</span>
              {currentStep !== 'debt' && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <Link
            href="/dashboard"
            className="text-sm text-foreground/60 hover:text-foreground transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  )
}
