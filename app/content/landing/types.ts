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
};

export type NavLink = { href: string; label: string };

export type FooterLink = { label: string; href: string };

export type StaticLanding = {
  hero: {
    sectionImage?: string;
    heroImageAlt: string;
    proof: string;
    h1Line1: string;
    h1Line2: string;
    sub: string;
    benefits: { objection: string; answer: string }[];
    cta: string;
    trust: string[];
    stats: { icon: string; num: string; label: string }[];
    seatsTotal: number;
    seatsTaken: number;
    socialLine: string;
    ctaLink: string;
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
    ctaBtn: string;
    ctaLink: string;
    ctaHighlight: string;
    daysTarget: number;
  };
  howItWorks: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    steps: { num: string; icon: string; title: string; line: string; tag: string }[];
    ctaLink: string;
    cta: string;
    guarantee: string;
  };
  outcomes: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    outcomes: OutcomeItem[];
    ctaLink: string;
    cta: string;
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
    ctaBtn: string;
    waLink: string;
  };
  finalCta: {
    sectionImage?: string;
    eyebrow: string;
    title1: string;
    title2: string;
    subtitle: string;
    seats: { total: number; taken: number };
    benefits: string[];
    cta: string;
    ctaLink: string;
    wa: string;
    waLink: string;
  };
  header: {
    navLinks: NavLink[];
    ctaLabel: string;
    seats: { total: number; taken: number };
    announcementPrefix: string;
    announcementSuffix: string;
    bookCta: string;
  };
  footer: {
    tagline: string;
    desc: string;
    wa: string;
    waLink: string;
    links: FooterLink[];
    legal: FooterLink[];
    brandName: string;
    copyright: string;
  };
  pricing: PricingContent;
  pricingPage: {
    title: string;
    description: string;
    h1: string;
    intro: string;
  };
};
