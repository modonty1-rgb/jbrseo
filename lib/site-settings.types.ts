export type SiteSettingsSeo = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogLocale: string;
};

export type SiteSettingsTracking = {
  gtmId: string;
};

export type GlobalSiteSettings = {
  gtmId: string;
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
  tracking: { gtmId: "" },
  site: { showSectionCounter: false, ctaLabel: "ابدأ مجاناً — بدون بطاقة", whatsappNumber: "" },
  pricingTeaser: {
    cta: "",
    sectionHeadings: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
  },
};
