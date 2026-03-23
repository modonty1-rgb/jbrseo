export type SiteSettingsSeo = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogLocale: string;
};

export type SiteSettingsTracking = {
  gtmId: string;
  hotjarId: string;
  fbPixelId: string;
};

export type GlobalSiteSettings = {
  gtmId: string;
  hotjarId: string;
  fbPixelId: string;
  whatsappNumber: string;
};

export type SiteSettingsSite = {
  showSectionCounter: boolean;
  ctaLabel: string;
  /** Optional WhatsApp number for wa.me links (per country). Digits only when building link. */
  whatsappNumber?: string;
};

export type SiteSettingsSectionImages = {
  hero: string;
  whyNow: string;
  howItWorks: string;
  outcomes: string;
  socialProof: string;
  faq: string;
  finalCta: string;
};

export type SiteSettingsImages = {
  logoWhite: string;
  logoLight: string;
  contactAvatar: string;
  contactAvatarAlt: string;
  sectionHero: string;
  sectionHeroAlt: string;
  sectionWhyNow: string;
  sectionWhyNowAlt: string;
  sectionHowItWorks: string;
  sectionHowItWorksAlt: string;
  sectionOutcomes: string;
  sectionOutcomesAlt: string;
  sectionSocialProof: string;
  sectionSocialProofAlt: string;
  sectionFaq: string;
  sectionFaqAlt: string;
  sectionFinalCta: string;
  sectionFinalCtaAlt: string;
};

export type SiteSettingsPricingTeaser = {
  cta: string;
  sectionHeadings: {
    eyebrow: string;
    title: string;
    highlightBadge: string;
  };
};

export type SiteSettingsJson = {
  seo: SiteSettingsSeo;
  tracking: SiteSettingsTracking;
  site: SiteSettingsSite;
  images: SiteSettingsImages;
  pricingTeaser: SiteSettingsPricingTeaser;
};

export const DEFAULT_SITE_SETTINGS_JSON: SiteSettingsJson = {
  seo: {
    title: "",
    description: "",
    canonical: "",
    ogImage: "",
    ogLocale: "ar_SA",
  },
  tracking: { gtmId: "", hotjarId: "", fbPixelId: "" },
  site: { showSectionCounter: false, ctaLabel: "ابدأ مجاناً — بدون بطاقة", whatsappNumber: "" },
  images: {
    logoWhite: "",
    logoLight: "",
    contactAvatar: "",
    contactAvatarAlt: "",
    sectionHero: "",
    sectionHeroAlt: "",
    sectionWhyNow: "",
    sectionWhyNowAlt: "",
    sectionHowItWorks: "",
    sectionHowItWorksAlt: "",
    sectionOutcomes: "",
    sectionOutcomesAlt: "",
    sectionSocialProof: "",
    sectionSocialProofAlt: "",
    sectionFaq: "",
    sectionFaqAlt: "",
    sectionFinalCta: "",
    sectionFinalCtaAlt: "",
  },
  pricingTeaser: {
    cta: "",
    sectionHeadings: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
  },
};
