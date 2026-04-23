"use client";

import { Navbar } from "@/components/navbar";
import {
  SplashSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  CTASection,
  Footer,
} from "./_components/landing-section";

export default function Home() {
  return (
    <div className='min-h-screen bg-background scrollbar-none'>
      <Navbar />
      <main className='pt-16'>
        <SplashSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
