/** Shared types for static landing content (SA/EG). Single source for component props. */

import type { PricingContent } from "./price-section-types";

export type OutcomeToken = "accent" | "success" | "destructive";

export type OutcomeItem = {
  icon: string;
  metric: string;
  title: string;
  line: string;
  token: OutcomeToken;
};

export type FaqItem = { q: string; a: string; tag: string };

export type FaqTagToken = "accent" | "success" | "primary" | "destructive";

export const TAG_TOKENS: Record<string, FaqTagToken> = {
  "النتائج": "accent",
  "الخدمة": "success",
  "الاشتراك": "accent",
  "لمن؟": "primary",
  "التسعير": "destructive",
  "الخطة": "accent",
};

export type Testimonial = {
  name: string;
  role: string;
  company: string;
  quote: string;
  metric: string;
  avatarImg: string;
  stars: number;
  tag: string;
  /** Optional video testimonial URL (YouTube, etc.) */
  videoUrl?: string;
  /** Optional label for the video button */
  videoLabel?: string;
  /** Optional site link; when set, shown on public site for this testimonial */
  siteLink?: string;
};

export type NavLink = { href: string; label: string };

export type FooterLink = { label: string; href: string };

export type LegalSection = {
  title: string;
  updatedAt?: string;
  body: string;
};

export type AboutStoryBlock = {
  label: string;
  title: string;
  body: string;
};

export type AboutValue = {
  title: string;
  body: string;
};

export type AboutLegalInfo = {
  legalName: string;
  registrationCountry: string;
  crNumber: string;
  foundedAt: string;
  address: string;
  email: string;
  phone: string;
  note?: string;
};

export type AboutCta = {
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type TeamPageMember = {
  name: string;
  role: string;
  bio: string;
  avatarColor: string;
  avatarUrl?: string;
};

export type StaticLanding = {
  hero: {
    sectionImage?: string;
    proof: string;
    h1Line1: string;
    h1Line2: string;
    sub: string;
    benefits: { objection: string; answer: string }[];
    trust: string[];
    guaranteeBadge?: string;
  };
  whyNow: {
    sectionImage?: string;
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    costs: { month: string; label: string; desc: string; value: string; icon: string; severity: number }[];
    reasons: { icon: string; title: string; body: string }[];
    ctaText: string;
    ctaHighlight: string;
    daysTarget: number;
  };
  howItWorks: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { num: string; icon: string; title: string; line: string; tag: string }[];
    guarantee: string;
  };
  outcomes: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    outcomes: OutcomeItem[];
    badgeText: string;
    message: string;
    messageHighlight: string;
  };
  socialProof: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
    founding: string;
  };
  faq: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    faqs: FaqItem[];
    ctaLabel: string;
  };
  finalCta: {
    sectionImage?: string;
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    seats: { total: number; taken: number };
    benefits: string[];
    wa: string;
  };
  header: {
    seats: { total: number; taken: number };
    announcementPrefix: string;
    announcementSuffix: string;
    bannerText?: string;
  };
  footer: {
    tagline: string;
    desc: string;
  };
  pricing: PricingContent;
  pricingPage: {
    title: string;
    description: string;
    h1: string;
    intro: string;
  };
  privacy: LegalSection;
  terms: LegalSection;
  about: {
    hero: {
      eyebrow?: string;
      title: string;
      subtitle: string;
    };
    storyBlocks: AboutStoryBlock[];
    values: AboutValue[];
    fitFor: string[];
    notFitFor: string[];
    legalInfo: AboutLegalInfo;
    cta: AboutCta;
  };
  team: {
    coreTeam: TeamPageMember[];
    executionTeam: TeamPageMember[];
  };
};
