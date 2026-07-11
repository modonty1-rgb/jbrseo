export type PricingPlan = {
  name: string;
  forWho: string;
  cta: string;
  ctaLink?: string;
  price?: string;
  annualPrice?: string;
  badge?: string;
  highlight?: boolean;
  features?: string[];
};

export type SectionHeadings = {
  socialProof?: { eyebrow: string; title: string };
  pricingTeaser?: { eyebrow: string; title: string; highlightBadge?: string };
  faq?: { eyebrow: string; title: string };
};

import type { StaticLanding } from "@/app/content/landing/types";

export type SocialLinks = {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitterX?: string;
  youtube?: string;
  tiktok?: string;
  snapchat?: string;
};

export type LandingContent = {
  staticLanding?: StaticLanding;
  landing: {
    hero: { h1: string; subheadline: string; benefits: string[]; proof: string; cta: string };
    socialProof: {
      testimonial: { name: string; role: string; quote: string; metric: string; image?: string };
      testimonials?: { name: string; role: string; quote: string; metric: string; image?: string }[];
      stats: { value: string; label: string }[];
    };
    pricingTeaser: { plans: PricingPlan[] };
    faq: { question: string; answer: string }[];
    finalCta: { headline: string; cta: string };
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    ogLocale: string;
  };
  landingImages: Record<string, string>;
  sectionImages?: {
    hero: string;
    socialProof: string;
    faq: string;
    finalCta: string;
  };
  sectionImageAlts?: {
    hero: string;
    socialProof: string;
    faq: string;
    finalCta: string;
  };
  tracking: { gtmId: string };
  siteSettings: { ctaLabel: string; whatsappNumber?: string; socialLinks?: SocialLinks };
  sectionHeadings: SectionHeadings;
  footer: { brandName: string; copyright: string };
  pricingPage: { title: string; description: string; h1: string; intro: string };
};

export type SupportedCountry = "SA" | "EG";
