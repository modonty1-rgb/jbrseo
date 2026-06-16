import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { getNavLinks, getFooterLinks, LEGAL_LINKS } from "@/lib/site-links";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { updateSection } from "@/app/actions/content-sections";
import { HeroSectionForm } from "../HeroSectionForm";
import { WhyNowSectionForm } from "../WhyNowSectionForm";
import { HowItWorksSectionForm } from "../HowItWorksSectionForm";
import { SocialProofSectionForm } from "../SocialProofSectionForm";
import { FaqSectionForm } from "../FaqSectionForm";
import { FinalCtaSectionForm } from "../FinalCtaSectionForm";
import { PrivacySectionForm } from "../PrivacySectionForm";
import { TermsSectionForm } from "../TermsSectionForm";
import { AboutSectionForm } from "../AboutSectionForm";
import { TeamSectionForm } from "../TeamSectionForm";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { AdminFormFeedback } from "../../components/AdminFormFeedback";

const CONTENT_KEYS = [
  "hero",
  "whyNow",
  "howItWorks",
  "socialProof",
  "faq",
  "finalCta",
  "header",
  "footer",
  "pricingPage",
  "privacy",
  "terms",
  "about",
  "team",
] as const;

type ContentKey = (typeof CONTENT_KEYS)[number];

const SECTION_LABELS: Record<ContentKey, string> = {
  hero: "قسم الهيرو",
  whyNow: "قسم لماذا الآن",
  howItWorks: "قسم كيف يعمل",
  socialProof: "قسم الشهادات",
  faq: "قسم الأسئلة الشائعة",
  finalCta: "قسم الدعوة النهائية",
  header: "Header section",
  footer: "Slogan",
  pricingPage: "Pricing page section",
  privacy: "Privacy page",
  terms: "Terms page",
  about: "About page",
  team: "Team page",
};

const PAGE_HEADING_OVERRIDES: Partial<
  Record<ContentKey, { h1: string; tab: string }>
> = {
  privacy: { h1: "صفحة الخصوصية", tab: "سياسة الخصوصية" },
  terms: { h1: "صفحة الشروط", tab: "شروط الاستخدام" },
  team: { h1: "فريق العمل", tab: "فريق العمل" },
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
  searchParams: Promise<{ country?: string }>;
}) {
  const { section } = await params;
  const country = await getCountry(searchParams);
  const isLinksSection = section === "links";
  if (!isLinksSection && !isContentKey(section)) notFound();

  // DB is the single source of truth. Missing section → empty object, admin fills it.
  let sectionData: unknown;
  let heroCtaLabel = "ابدأ مجاناً — بدون بطاقة";

  if (isLinksSection) {
    sectionData = {
      navLinks: getNavLinks(country as SupportedCountry),
      footerLinks: getFooterLinks(country as SupportedCountry),
      legal: LEGAL_LINKS,
    };
  } else {
    const override = await getLandingSectionOverride(section as ContentKey);
    sectionData = override ?? {};

    if (section === "hero") {
      const ctaLabelOverride = await getLandingSectionOverride("ctaLabel");
      if (
        ctaLabelOverride &&
        typeof ctaLabelOverride === "object" &&
        "ctaLabel" in ctaLabelOverride &&
        typeof (ctaLabelOverride as { ctaLabel?: string }).ctaLabel === "string"
      ) {
        heroCtaLabel = (ctaLabelOverride as { ctaLabel: string }).ctaLabel;
      }
    }
  }

  const headingOverride = isContentKey(section)
    ? PAGE_HEADING_OVERRIDES[section]
    : undefined;
  const label = headingOverride
    ? headingOverride.h1
    : isLinksSection
      ? "Links section"
      : SECTION_LABELS[section as ContentKey];
  const cardTabLabel = headingOverride ? headingOverride.tab : label;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">{label}</h1>
      </div>
      <Suspense fallback={null}>
        <AdminFormFeedback />
      </Suspense>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
          {cardTabLabel}
        </div>
        <div className="p-4">
          {!isLinksSection && section === "hero" && (
            <HeroSectionForm
              key={country}
              hero={sectionData as StaticLanding["hero"]}
              country={country}
              ctaLabel={heroCtaLabel}
            />
          )}
          {!isLinksSection && section === "whyNow" && (
            <WhyNowSectionForm
              key={country}
              section={sectionData as StaticLanding["whyNow"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "socialProof" && (
            <SocialProofSectionForm
              key={country}
              section={sectionData as StaticLanding["socialProof"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "faq" && (
            <FaqSectionForm
              key={country}
              section={sectionData as StaticLanding["faq"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "finalCta" && (
            <FinalCtaSectionForm
              key={country}
              section={sectionData as StaticLanding["finalCta"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "privacy" && (
            <PrivacySectionForm
              key={country}
              section={sectionData as StaticLanding["privacy"]}
            />
          )}
          {!isLinksSection && section === "terms" && (
            <TermsSectionForm
              key={country}
              section={sectionData as StaticLanding["terms"]}
            />
          )}
          {!isLinksSection && section === "about" && (
            <AboutSectionForm
              key={country}
              section={sectionData as StaticLanding["about"]}
              country={country}
            />
          )}
          {!isLinksSection && section === "team" && (
            <TeamSectionForm
              key={country}
              section={sectionData as StaticLanding["team"]}
              country={country}
            />
          )}
          {!isLinksSection &&
            section !== "hero" &&
            section !== "whyNow" &&
            section !== "howItWorks" &&
            section !== "socialProof" &&
            section !== "faq" &&
            section !== "finalCta" &&
            section !== "header" &&
            section !== "footer" &&
            section !== "about" &&
            section !== "team" &&
            section !== "privacy" &&
            section !== "terms" && (
            <form key={country} action={updateSection} className="space-y-3">
              <input type="hidden" name="country" value={country} />
              <input type="hidden" name="section" value={section} />
              <input
                type="hidden"
                name="redirect"
                value={`/admin/content/${section}?country=${country}`}
              />
              <h2 className="text-sm font-semibold text-muted-foreground">
                Edit raw JSON for this section
              </h2>
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
              key={country}
              section={sectionData as StaticLanding["howItWorks"]}
              country={country}
            />
          )}
        </div>
      </div>
    </div>
  );
}
