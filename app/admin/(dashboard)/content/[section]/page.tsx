import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getStaticLanding } from "@/app/content/landing/get-static-landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { getNavLinks, getFooterLinks, LEGAL_LINKS } from "@/lib/site-links";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { updateSection } from "@/app/actions/content-sections";
import { HeroSectionForm } from "../HeroSectionForm";
import { WhyNowSectionForm } from "../WhyNowSectionForm";
import { HowItWorksSectionForm } from "../HowItWorksSectionForm";
import { OutcomesSectionForm } from "../OutcomesSectionForm";
import { SocialProofSectionForm } from "../SocialProofSectionForm";
import { FaqSectionForm } from "../FaqSectionForm";
import { FinalCtaSectionForm } from "../FinalCtaSectionForm";
import { HeaderSectionForm } from "../HeaderSectionForm";
import { FooterSectionForm } from "../FooterSectionForm";
import { PricingSectionForm } from "../PricingSectionForm";
import { PrivacySectionForm } from "../PrivacySectionForm";
import { TermsSectionForm } from "../TermsSectionForm";
import { AboutSectionForm } from "../AboutSectionForm";
import { TeamSectionForm } from "../TeamSectionForm";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";

const CONTENT_KEYS = [
  "hero",
  "whyNow",
  "howItWorks",
  "outcomes",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricing",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
] as const;

type ContentKey = (typeof CONTENT_KEYS)[number];

const SECTION_LABELS: Record<ContentKey, string> = {
  hero: "Hero section",
  whyNow: "Why now section",
  howItWorks: "How it works section",
  outcomes: "Outcomes section",
  socialProof: "Social proof section",
  faq: "FAQ section",
  finalCta: "Final CTA section",
  header: "Header section",
  footer: "Slogan",
  pricing: "Pricing section",
  pricingPage: "Pricing page section",
  privacy: "Privacy page",
  terms: "Terms page",
  about: "About page",
  team: "Team page",
};

function isContentKey(s: string): s is ContentKey {
  return CONTENT_KEYS.includes(s as ContentKey);
}

function humanLabel(key: string, section?: string): string {
  const map: Record<string, string> = {
    sectionImage: "صورة القسم",
    heroImageAlt: "نص بديل صورة البطل",
    proof: "إثبات",
    h1Line1: "السطر الأول من العنوان",
    h1Line2: "السطر الثاني من العنوان",
    sub: "النص الفرعي",
    benefits: "المزايا",
    objection: "اعتراض",
    answer: "إجابة",
    cta: "نص الزر",
    trust: "عناصر الثقة",
    stats: "الإحصائيات",
    icon: "أيقونة",
    num: "رقم",
    label: "تسمية",
    eyebrow: "اسم القسم",
    title1: "العنوان ١",
    title2: "العنوان ٢",
    subtitle: "العنوان الفرعي",
    costs: "التكاليف",
    month: "الشهر",
    desc: "الوصف",
    value: "القيمة",
    severity: "الدرجة",
    reasons: "الأسباب",
    title: "العنوان",
    body: "المحتوى",
    ctaText: "نص الدعوة",
    ctaBtn: "زر الدعوة",
    ctaHighlight: "تمييز الدعوة",
    daysTarget: "الهدف بالأيام",
    steps: "الخطوات",
    line: "السطر",
    tag: "الوسم",
    guarantee: "الضمان",
    outcomes: "النتائج",
    metric: "المقياس",
    token: "النوع",
    badgeText: "نص الشارة",
    message: "الرسالة",
    messageHighlight: "تمييز الرسالة",
    testimonials: "الشهادات",
    name: "الاسم",
    role: "الدور",
    company: "الشركة",
    quote: "الاقتباس",
    avatarImg: "صورة الشخص",
    stars: "النجوم",
    founding: "تأسيس",
    faqs: "الأسئلة الشائعة",
    q: "سؤال",
    a: "جواب",
    ctaLabel: "تسمية الزر",
    waLink: "رابط واتساب",
    seats: "المقاعد",
    total: "الإجمالي",
    taken: "المحجوز",
    wa: "واتساب",
    navLinks: "القائمة الرئيسية",
    href: "الرابط",
    announcementPrefix: "بداية الإعلان",
    announcementSuffix: "نهاية الإعلان",
    bookCta: "زر الحجز",
    tagline: "الشعار",
    links: "الروابط",
    footerLinks: "روابط التذييل",
    legal: "قانوني",
    brandName: "العلامة",
    copyright: "حقوق النشر",
    ANNOUNCEMENT: "الإعلان",
    PLANS: "الخطط",
    TRUST_ITEMS: "عناصر الثقة",
    BOTTOM_CTA: "الدعوة السفلية",
    UI: "واجهة المستخدم",
    socialProof: "إثبات اجتماعي",
    subheadline: "العنوان الفرعي",
    id: "المعرف",
    persona: "الشخصية",
    price: "السعر",
    mo: "شهري",
    yr: "سنوي",
    ctaClass: "صنف الزر",
    featured: "مميز",
    badge: "شارة",
    badgeGold: "شارة ذهبية",
    accent: "لون التمييز",
    accentBg: "خلفية التمييز",
    articles: "المقالات",
    highlights: "أبرز النقاط",
    sections: "الأقسام",
    features: "المميزات",
    headline: "العنوان",
    primaryBtn: "الزر الرئيسي",
    secondaryBtn: "الزر الثانوي",
    footnote: "الحاشية",
    freeLabel: "تسمية مجاني",
    perMonth: "شهرياً",
    savedYearly: "وفر سنوياً",
    offer12_18: "عرض ١٢–١٨",
    billingAnnual: "الدفع السنوي",
    annualEquiv18: "مكافئ ١٨ شهر",
    annualAvgMonthly: "معدّل شهري (سنوي)",
    totalAnnual: "الإجمالي السنوي",
    pricingBelowHintMonthly: "تلميح تحت التبديل (شهري)",
    pricingBelowHintAnnual: "تلميح تحت التبديل (سنوي)",
    priceDetailsToggle: "عنوان تفاصيل السعر",
    pricingFullComparisonLabel: "رابط مقارنة الباقات",
    billingMonthly: "الدفع الشهري",
    youGet: "ما تحصل عليه",
    moreDetails: "تفاصيل أكثر",
    whatsapp: "واتساب",
    monthly: "شهري",
    yearly: "سنوي",
    save20: "اكسب ٦ أشهر مجاناً",
    banner12Title: "عنوان البانر",
    banner12Sub: "نص البانر",
    trustTitle: "عنوان الثقة",
    intro: "المقدمة",
  };
  if (map[key]) return map[key];
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

function SectionView({ data, section }: { data: unknown; section?: string }) {
  if (data === null || data === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return <span className="text-foreground">{String(data)}</span>;
  }
  if (Array.isArray(data)) {
    return (
      <ul className="list-none space-y-1 text-sm pl-0">
        {data.map((item, i) => (
          <li key={i} className="pl-2">
            {typeof item === "object" && item !== null ? (
              <div className="mt-1 rounded border border-border bg-muted/30 p-2">
                <SectionView data={item} section={section} />
              </div>
            ) : (
              <SectionView data={item} section={section} />
            )}
          </li>
        ))}
      </ul>
    );
  }
  if (typeof data === "object") {
    const obj = data as Record<string, unknown>;
    const keys = Object.keys(obj);
    const isNavLink =
      keys.length === 2 &&
      keys.every((k) => k === "href" || k === "label") &&
      typeof obj.href === "string" &&
      typeof obj.label === "string";
    if (isNavLink) {
      return (
        <div className="rounded border border-border/60 bg-card p-2">
          <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 font-semibold text-muted-foreground">
            <span>اسم الرابط</span>
            <span className="text-xs font-normal text-muted-foreground" aria-label="للرجوع فقط">
              link : {String(obj.href)}
            </span>
          </div>
          <div className="text-foreground">{String(obj.label)}</div>
        </div>
      );
    }
    const entries = Object.entries(obj);
    return (
      <dl className="grid gap-2 text-sm">
        {entries.map(([key, value]) => (
          <div key={key} className="rounded border border-border/60 bg-card p-2">
            <dt className="mb-1 font-semibold text-muted-foreground">{humanLabel(key, section)}</dt>
            <dd>
              <SectionView data={value} section={section} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return <span>{String(data)}</span>;
}

export default async function AdminContentSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ country?: string; useDefault?: string }>;
}) {
  const { section } = await params;
  const country = await getCountry(searchParams);
  const { useDefault } = await searchParams;
  const data = getStaticLanding(country) as StaticLanding;
  const isLinksSection = section === "links";
  if (!isLinksSection && !isContentKey(section)) notFound();

  let sectionData: unknown = isLinksSection
    ? { navLinks: getNavLinks(country as SupportedCountry), footerLinks: getFooterLinks(country as SupportedCountry), legal: LEGAL_LINKS }
    : data[section];

  // HERO: special flow
  // - If DB override exists (and useDefault !== "1") → use DB.
  // - Else if useDefault === "1" → use static TS hero.
  // - Else (no override, no default requested) → start from empty hero.
  if (!isLinksSection && section === "hero") {
    const staticHero = data.hero;
    let heroData: StaticLanding["hero"];

    if (useDefault === "1") {
      heroData = staticHero;
    } else {
      const override = await getLandingSectionOverride(country as SupportedCountry, "hero");
      if (override !== null && override !== undefined) {
        heroData = override as StaticLanding["hero"];
      } else {
        heroData = {
          sectionImage: "",
          proof: "",
          h1Line1: "",
          h1Line2: "",
          sub: "",
          benefits: [],
          trust: [],
        };
      }
    }

    sectionData = heroData;
  }

  // WHY NOW: same pattern as hero
  if (!isLinksSection && section === "whyNow") {
    const staticWhyNow = data.whyNow;
    let whyNowData: StaticLanding["whyNow"];

    if (useDefault === "1") {
      whyNowData = staticWhyNow;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "whyNow",
      );
      if (override !== null && override !== undefined) {
        whyNowData = override as StaticLanding["whyNow"];
      } else {
        whyNowData = {
          sectionImage: "",
          eyebrow: "",
          title1: "",
          title2: "",
          subtitle: "",
          costs: [],
          reasons: [],
          ctaText: "",
          ctaHighlight: "",
          daysTarget: 0,
        };
      }
    }

    sectionData = whyNowData;
  }

  // HOW IT WORKS: use override if present, otherwise static
  if (!isLinksSection && section === "howItWorks") {
    const staticHowItWorks = data.howItWorks;
    let howItWorksData: StaticLanding["howItWorks"];

    if (useDefault === "1") {
      howItWorksData = staticHowItWorks;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "howItWorks",
      );
      if (override !== null && override !== undefined) {
        howItWorksData = override as StaticLanding["howItWorks"];
      } else {
        howItWorksData = staticHowItWorks;
      }
    }

    sectionData = howItWorksData;
  }

  // OUTCOMES: use override if present, otherwise static
  if (!isLinksSection && section === "outcomes") {
    const staticOutcomes = data.outcomes;
    let outcomesData: StaticLanding["outcomes"];

    if (useDefault === "1") {
      outcomesData = staticOutcomes;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "outcomes",
      );
      if (override !== null && override !== undefined) {
        outcomesData = override as StaticLanding["outcomes"];
      } else {
        outcomesData = staticOutcomes;
      }
    }

    sectionData = outcomesData;
  }

  // SOCIAL PROOF: use override if present, otherwise static
  if (!isLinksSection && section === "socialProof") {
    const staticSocialProof = data.socialProof;
    let socialProofData: StaticLanding["socialProof"];

    if (useDefault === "1") {
      socialProofData = staticSocialProof;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "socialProof",
      );
      if (override !== null && override !== undefined) {
        socialProofData = override as StaticLanding["socialProof"];
      } else {
        socialProofData = staticSocialProof;
      }
    }

    sectionData = socialProofData;
  }

  // FAQ: use override if present, otherwise static
  if (!isLinksSection && section === "faq") {
    const staticFaq = data.faq;
    let faqData: StaticLanding["faq"];

    if (useDefault === "1") {
      faqData = staticFaq;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "faq",
      );
      if (override !== null && override !== undefined) {
        faqData = override as StaticLanding["faq"];
      } else {
        faqData = staticFaq;
      }
    }

    sectionData = faqData;
  }

  // FINAL CTA: use override if present, otherwise static
  if (!isLinksSection && section === "finalCta") {
    const staticFinalCta = data.finalCta;
    let finalCtaData: StaticLanding["finalCta"];

    if (useDefault === "1") {
      finalCtaData = staticFinalCta;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "finalCta",
      );
      if (override !== null && override !== undefined) {
        finalCtaData = override as StaticLanding["finalCta"];
      } else {
        finalCtaData = staticFinalCta;
      }
    }

    sectionData = finalCtaData;
  }

  // HEADER: use override if present, otherwise static
  if (!isLinksSection && section === "header") {
    const staticHeader = data.header;
    let headerData: StaticLanding["header"];

    if (useDefault === "1") {
      headerData = staticHeader;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "header",
      );
      if (override !== null && override !== undefined) {
        headerData = override as StaticLanding["header"];
      } else {
        headerData = staticHeader;
      }
    }

    sectionData = headerData;
  }

  // FOOTER: use override if present, otherwise static
  if (!isLinksSection && section === "footer") {
    const staticFooter = data.footer;
    let footerData: StaticLanding["footer"];

    if (useDefault === "1") {
      footerData = staticFooter;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "footer",
      );
      if (override !== null && override !== undefined) {
        footerData = override as StaticLanding["footer"];
      } else {
        footerData = staticFooter;
      }
    }

    sectionData = footerData;
  }

  if (!isLinksSection && section === "pricing") {
    const staticPricing = data.pricing;
    let pricingData: StaticLanding["pricing"];

    if (useDefault === "1") {
      pricingData = staticPricing;
    } else {
      const override = await getLandingSectionOverride(
        country as SupportedCountry,
        "pricing",
      );
      if (override !== null && override !== undefined) {
        pricingData = override as StaticLanding["pricing"];
      } else {
        pricingData = staticPricing;
      }
    }

    sectionData = pricingData;
  }

  if (
    !isLinksSection &&
    section !== "hero" &&
    section !== "whyNow" &&
    section !== "howItWorks" &&
    section !== "outcomes" &&
    section !== "socialProof" &&
    section !== "faq" &&
    section !== "finalCta" &&
    section !== "header" &&
    section !== "footer" &&
    section !== "about" &&
    section !== "team" &&
    useDefault !== "1" &&
    isContentKey(section)
  ) {
    const override = await getLandingSectionOverride(country as SupportedCountry, section as ContentKey);
    if (override !== null && override !== undefined) {
      sectionData = override;
    }
  }

  if (!isLinksSection && section === "about") {
    const defaultAbout = data.about as StaticLanding["about"];
    if (useDefault === "1") {
      sectionData = defaultAbout;
    } else {
      const override = await getLandingSectionOverride(country as SupportedCountry, "about");
      if (override !== null && override !== undefined && typeof override === "object") {
        sectionData = { ...defaultAbout, ...(override as object) } as StaticLanding["about"];
      } else {
        sectionData = defaultAbout;
      }
    }
  }

  if (!isLinksSection && section === "team") {
    const staticTeam = data.team;
    let teamData: StaticLanding["team"];
    if (useDefault === "1") {
      teamData = staticTeam;
    } else {
      const override = await getLandingSectionOverride(country as SupportedCountry, "team");
      if (override !== null && override !== undefined) {
        teamData = override as StaticLanding["team"];
      } else {
        teamData = staticTeam;
      }
    }
    sectionData = teamData;
  }

  if (section === "footer" && sectionData && typeof sectionData === "object" && !Array.isArray(sectionData)) {
    const rest = sectionData as Record<string, unknown>;
    sectionData = rest;
  }

  const label = isLinksSection ? "Links section" : SECTION_LABELS[section as ContentKey];

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">{label}</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
          {label}
        </div>
        <div className="p-4">
          {!isLinksSection && section === "hero" && (
            <HeroSectionForm
              hero={sectionData as StaticLanding["hero"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "whyNow" && (
            <WhyNowSectionForm
              section={sectionData as StaticLanding["whyNow"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "outcomes" && (
            <OutcomesSectionForm
              section={sectionData as StaticLanding["outcomes"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "socialProof" && (
            <SocialProofSectionForm
              section={sectionData as StaticLanding["socialProof"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "faq" && (
            <FaqSectionForm
              section={sectionData as StaticLanding["faq"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "finalCta" && (
            <FinalCtaSectionForm
              section={sectionData as StaticLanding["finalCta"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "header" && (
            <HeaderSectionForm
              section={sectionData as StaticLanding["header"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "footer" && (
            <FooterSectionForm
              section={sectionData as StaticLanding["footer"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "pricing" && (
            <PricingSectionForm
              section={sectionData as StaticLanding["pricing"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "privacy" && (
            <PrivacySectionForm
              section={sectionData as StaticLanding["privacy"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "terms" && (
            <TermsSectionForm
              section={sectionData as StaticLanding["terms"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "about" && (
            <AboutSectionForm
              section={sectionData as StaticLanding["about"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "team" && (
            <TeamSectionForm
              section={sectionData as StaticLanding["team"]}
              country={country}
            />
          )}
          {!isLinksSection &&
            section !== "hero" &&
            section !== "whyNow" &&
            section !== "howItWorks" &&
            section !== "outcomes" &&
            section !== "socialProof" &&
            section !== "faq" &&
            section !== "finalCta" &&
            section !== "header" &&
            section !== "footer" &&
            section !== "about" &&
            section !== "team" &&
            section !== "pricing" &&
            section !== "privacy" &&
            section !== "terms" && (
            <form action={updateSection} className="space-y-3">
              <input type="hidden" name="country" value={country} />
              <input type="hidden" name="section" value={section} />
              <input
                type="hidden"
                name="redirect"
                value={`/admin/content/${section}?country=${country}`}
              />
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-muted-foreground">
                  Edit raw JSON for this section
                </h2>
                <a
                  href={`/admin/content/${section}?country=${country}&useDefault=1`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Load default
                </a>
              </div>
              <Textarea
                name="data"
                defaultValue={JSON.stringify(sectionData, null, 2)}
                className="min-h-[260px] w-full font-mono text-xs focus-visible:ring-primary"
              />
              <Button type="submit" size="sm">
                Save section
              </Button>
            </form>
          )}
          {!isLinksSection && section === "howItWorks" && (
            <HowItWorksSectionForm
              section={sectionData as StaticLanding["howItWorks"]}
              country={country}
            />
          )}
        </div>
      </div>
    </div>
  );
}
