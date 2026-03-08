export type SiteSettingsSeo = {
  title: string;
  description: string;
  canonical: string;
  ogLocale: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogType: string;
  ogSiteName: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

export type SiteSettingsTracking = {
  gtmId: string;
  hotjarId: string;
  fbPixelId: string;
};

export type SiteSettingsSite = {
  showSectionCounter: boolean;
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
  sectionHero: string;
  sectionWhyNow: string;
  sectionHowItWorks: string;
  sectionOutcomes: string;
  sectionSocialProof: string;
  sectionFaq: string;
  sectionFinalCta: string;
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
    ogLocale: "ar_SA",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogImageWidth: "1200",
    ogImageHeight: "630",
    ogType: "website",
    ogSiteName: "JBRSEO",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  },
  tracking: { gtmId: "", hotjarId: "", fbPixelId: "" },
  site: { showSectionCounter: false },
  images: {
    logoWhite: "",
    logoLight: "",
    contactAvatar: "",
    sectionHero: "",
    sectionWhyNow: "",
    sectionHowItWorks: "",
    sectionOutcomes: "",
    sectionSocialProof: "",
    sectionFaq: "",
    sectionFinalCta: "",
  },
  pricingTeaser: {
    cta: "",
    sectionHeadings: { eyebrow: "الخطط", title: "اختر خطتك", highlightBadge: "الأكثر شيوعاً" },
  },
};
