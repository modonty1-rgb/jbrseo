export interface Section {
  title: string;
  icon: string;
  features: string[];
}

export interface Plan {
  id: string;
  name: string;
  persona: string;
  price: { mo: number; yr: number };
  cta: string;
  ctaClass: string;
  featured: boolean;
  badge: string | null;
  badgeGold?: boolean;
  accent: string;
  accentBg: string;
  articles: string;
  guarantee: boolean;
  highlights: string[];
  sections: Section[];
}

export interface TrustItem {
  icon: string;
  label: string;
}

export interface PricingHero {
  socialProof: string;
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
}

export interface PricingBottomCta {
  headline: string;
  subheadline: string;
  primaryBtn: string;
  secondaryBtn: string;
  footnote: string;
}

export interface PricingUI {
  freeLabel: string;
  perMonth: string;
  savedYearly: string;
  offer12_18: string;
  billingAnnual: string;
  billingMonthly: string;
  guarantee: string;
  youGet: string;
  moreDetails: string;
  whatsapp: string;
  activeNow: string;
  monthly: string;
  yearly: string;
  save20: string;
  banner12Title: string;
  banner12Sub: string;
  dialectLabel: string;
  dialectSA: string;
  dialectEG: string;
  trustTitle: string;
}

export interface PricingContent {
  ANNOUNCEMENT: string;
  HERO: PricingHero;
  PLANS: Plan[];
  TRUST_ITEMS: TrustItem[];
  BOTTOM_CTA: PricingBottomCta;
  UI: PricingUI;
}
