'use client';

import Navbar from '@/components/landing/navbar';
import HeroSection from '@/components/landing/hero-section';
import QuickStartSection from '@/components/landing/how-it-woks';
import ProductInActionSection from '@/components/landing/product-in-action-section';
import BeforeAfterSection from '@/components/landing/before-after-section';
import RoadmapSection from '@/components/landing/roadmap-section';
import PricingSection from '@/components/landing/pricing-section';
import FAQSection from '@/components/landing/faq-section';
import CTASection from '@/components/landing/cta-section';
import Footer from '@/components/landing/footer';
import SmoothScroll from '@/components/smooth-scroll';

export default function Page() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroSection />
        <QuickStartSection />
        <ProductInActionSection />
        <BeforeAfterSection />
        <RoadmapSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </div>
    </SmoothScroll>
  );
}
