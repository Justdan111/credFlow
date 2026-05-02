"use client"

import BenefitsSection from '@/components/landing/benefits-section'
import CTASection from '@/components/landing/cta-section'
import FeaturesSection from '@/components/landing/features-section'
import Footer from '@/components/landing/footer'
import HeroSection from '@/components/landing/hero-section'
import HowItWorksSection from '@/components/landing/how-it-woks'
import Navbar from '@/components/landing/navbar'
import PricingSection from '@/components/landing/pricing-section'
import TestimonialsSection from '@/components/landing/testimonials-section'
import FAQSection from '@/components/landing/faq-section'
import ScreenshotsSection from '@/components/landing/screenshots-section'


export default function page() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <ScreenshotsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
