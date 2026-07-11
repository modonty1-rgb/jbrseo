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
  /** Legacy flat body (Markdown). Still rendered when sections is absent. */
  body: string;
  /** Optional short intro shown above the sections list. */
  intro?: string;
  /** Structured sections — preferred over `body`. Each renders as its own card with an icon. */
  sections?: LegalSectionBlock[];
};

export type LegalSectionBlock = {
  id: string;
  /** Kebab-case name of a Lucide icon (mapped in the renderer). */
  icon: string;
  title: string;
  /** Markdown body — supports paragraphs, bullet lists, and sub-headings. */
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
    /** Optional mission strip shown right under the hero. */
    mission?: {
      title?: string;
      body: string;
      taglineOne?: string;
      taglineTwo?: string;
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
