/** Shared types for static landing content (SA/EG). Single source for component props. */

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
  /** Optional video testimonial URL (YouTube, etc.) */
  videoUrl?: string;
  /** Optional fallback media image shown when video is not set */
  mediaImage?: string;
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

export type TrustBarClient = {
  name: string;
  logoUrl: string;
  href?: string;
};

export type HeroBrandTag = {
  ariaLabel: string;
  prefix: string;
  badge: string;
  suffix: string;
};

export type StaticLanding = {
  hero: {
    sectionImage?: string;
    proof: string;
    h1Line1: string;
    h1Line2: string;
    sub: string;
    brandTag?: HeroBrandTag;
    trust: string[];
    guaranteeBadge?: string;
    trustBarClients?: TrustBarClient[];
  };
  whyNow: {
    sectionImage?: string;
    title1: string;
    subtitle: string;
    costs: { month: string; label: string; desc: string; icon: string }[];
  };
  howItWorks: {
    sectionImage?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    steps: { num: string; title: string; line: string; icon?: string; tag?: string }[];
    guarantee?: string;
  };
  socialProof: {
    sectionImage?: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
  };
  faq: {
    sectionImage?: string;
    title: string;
    faqs: FaqItem[];
    ctaLabel: string;
  };
  finalCta: {
    sectionImage?: string;
    title1: string;
    title2: string;
    subtitle: string;
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
