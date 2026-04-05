"use client"

import { Navbar } from "@/components/navbar"
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  PricingSection,
  CTASection,
  Footer,
} from "@/components/landing-sections"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
