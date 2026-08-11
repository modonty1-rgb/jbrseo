import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAllPlans } from "@/app/actions/pricing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { CALC_ROLES } from "@/app/components/landing/calc-roles";
import { MathCompare } from "@/app/components/landing/sections/MathCompare";
import { InlineCalculator } from "./_components/InlineCalculator";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";

/**
 * What a content team actually costs, and what the alternative costs.
 *
 * This ran 810px on the landing, directly above the prices — a full argument placed in
 * front of a reader who was on their way to a number. It works better as its own page:
 * someone comparing an in-house hire against a subscription is running a specific search,
 * and a page that answers only that question can rank for it. The landing keeps a
 * one-line hook with the headline figure.
 *
 * No country segment, matching /about and /faq. Salaries are the same defaults for both
 * markets; the currency label follows the reader's country.
 */

const CANONICAL = `${DEFAULT_PUBLIC_SITE_ORIGIN}/cost-comparison`;
// Trimmed from 65 rendered characters to 44: the tail «مقارنة الرواتب مقابل الاشتراك»
// repeated what the question already asks, and was the part Google cut.
const TITLE = "كم يكلّفك فريق محتوى وسيو؟";
const DESCRIPTION =
  "ست وظائف مطلوبة لتشغيل محتوى يظهر في جوجل — كاتب، مصمم، متخصص سيو، مدير سوشال، مونتير، مطوّر. احسب تكلفتها السنوية وقارنها باشتراك واحد.";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const images = await siteOgImages();
  return {
    title: TITLE,
    description: DESCRIPTION,
    robots: PUBLIC_INDEX_FOLLOW_ROBOTS,
    alternates: { canonical: CANONICAL, languages: sharedLanguages(CANONICAL) },
    openGraph: { ...SHARED_OPEN_GRAPH, title: TITLE, description: DESCRIPTION, url: CANONICAL, images },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images },
  };
}

export default async function CostComparisonPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const countrySlug = country === "EG" ? "eg" : "sa";
  const currency = country === "EG" ? "ج.م" : "ر.س";
  const plans = await getAllPlans(country);
  const visiblePlans = plans.filter((p) => p.visible);

  /**
   * The plan the comparison is made against — the featured one, or the first priced plan.
   * Resolved here and handed to both halves so the argument and the calculator can never
   * quote different figures for the same subscription.
   */
  const featured = visiblePlans.find(
    (p) => !!p.featuredBadge && p.featuredBadge.trim() !== "" && p.priceMonthly > 0,
  );
  const plan = featured ?? visiblePlans.find((p) => p.priceMonthly > 0);
  // `priceYearly` holds the monthly-equivalent on annual billing.
  const planAnnual = plan ? (plan.priceYearly > 0 ? plan.priceYearly : plan.priceMonthly) * 12 : 0;
  const planName = plan?.name ?? "مدونتي";

  /**
   * The roles as structured data.
   *
   * An `ItemList` of the six jobs is what this page is actually about, and it is the part
   * an assistant answering "what roles do I need for SEO content?" can lift. The salary
   * figures stay out of the markup — they are defaults a reader adjusts in the calculator,
   * not prices we are quoting.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": CANONICAL,
        url: CANONICAL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ar",
        mainEntity: {
          "@type": "ItemList",
          name: "الوظائف المطلوبة لتشغيل محتوى يظهر في نتائج البحث",
          numberOfItems: CALC_ROLES.length,
          itemListElement: CALC_ROLES.map((r, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: r.label,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa` },
          { "@type": "ListItem", position: 2, name: "مقارنة التكلفة", item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <h1 className="text-balance text-center text-2xl font-black text-foreground sm:text-3xl">
          كم يكلّفك فريق محتوى وسيو؟
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {DESCRIPTION}
        </p>
      </div>

      {/* The argument, then the tool that lets the reader re-run it with their own
          numbers. Both open on the page — this route exists for exactly this, so nothing
          here hides behind a button. */}
      <MathCompare visiblePlans={visiblePlans} currency={currency} />

      <InlineCalculator
        planAnnual={planAnnual}
        planName={planName}
        currency={currency}
        pricingHref={`/${countrySlug}#pricing`}
      />

      <div className="mx-auto max-w-5xl px-4 pb-16 text-center sm:px-6">
        <Link
          href={`/${countrySlug}#pricing`}
          className="inline-flex items-center gap-2 rounded-xl bg-success px-6 py-3 text-sm font-bold text-success-foreground no-underline transition hover:opacity-90"
        >
          شوف الباقات والأسعار
          <ArrowLeft className="size-4" aria-hidden />
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">
          الرواتب أعلاه حدود دنيا تقريبية — عدّلها بالحاسبة فوق حسب سوقك.
        </p>
      </div>
    </>
  );
}
