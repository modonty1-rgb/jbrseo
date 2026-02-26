import type { Metadata } from "next";
import { LandingHeader } from "@/app/components/layout/LandingHeader";
import Hero from "@/app/components/landing/Hero";
import WhyNow from "@/app/components/landing/WhyNow";
import HowItWorks from "@/app/components/landing/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes";
import SocialProof from "@/app/components/landing/SocialProof";
import PricingTeaser from "@/app/components/landing/PricingTeaser";
import FAQ from "@/app/components/landing/FAQ";
import FinalCTA from "@/app/components/landing/FinalCTA";
import { Footer } from "@/app/components/layout/Footer";
import LandingJsonLd from "@/app/components/landing/LandingJsonLd";
import { seo } from "@/app/content/landing";

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  alternates: { canonical: seo.canonical },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: seo.canonical,
    locale: seo.ogLocale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export default function Home() {
  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      <LandingJsonLd />
      <LandingHeader />
      <main>
        <Hero />
        <WhyNow />
        <HowItWorks />
        <Outcomes />
        <SocialProof />
        <PricingTeaser />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
