import type { Metadata } from "next";
import { headers } from "next/headers";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";
import { FaqSection } from "@/app/components/landing/sections/FaqSection";

/**
 * Every question, on a page whose whole job is answering them.
 *
 * Eighteen questions were the longest block on the landing — 2,077px a reader scrolled
 * past on the way to the prices. Here they cost nothing, and they earn something they
 * could not earn there: `FAQPage` structured data on a URL where the FAQ *is* the main
 * content, which is the condition Google states for it. The landing keeps three and
 * links here.
 *
 * No country segment, like `/about` and `/terms`: one Arabic answer serves Saudi Arabia
 * and Egypt, and the hreflang pair below says so rather than splitting the page in two.
 */

const CANONICAL = `${DEFAULT_PUBLIC_SITE_ORIGIN}/faq`;
// 65 rendered characters trimmed to 40. «كل سؤال … بإجابة صريحة» is the description's
// job; the title's job is to be readable in full in a result.
const TITLE = "الأسئلة الشائعة عن السيو والمحتوى";
const DESCRIPTION =
  "إجابات مباشرة عن الاشتراك، النتائج، التسعير، والضمانات — بلا وعود مبالغة. أسئلة أصحاب الأنشطة في السعودية ومصر كما تصلنا.";

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

export default async function FaqPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const [staticLanding, content] = await Promise.all([
    getStaticLandingWithOverrides(),
    getLandingContent(country),
  ]);

  const faqs = staticLanding.faq?.faqs ?? [];
  const whatsappLink = getWhatsAppLink(country, content.siteSettings?.whatsappNumber);

  /**
   * The FAQ card, built from the same list the page renders below.
   *
   * Google requires the marked-up answer to be the answer a visitor can see. Deriving it
   * from `faqs` rather than maintaining a parallel copy is what guarantees that stays
   * true when someone edits a question in the admin.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // The FAQPage node only exists when there are questions to describe.
      // `faqs` falls back to `[]` when the DB row is missing, and `FaqSection` returns
      // null on an empty list — so the page would have rendered no visible Q&A while
      // publishing a FAQPage whose `mainEntity` was an empty array. Google requires at
      // least one Question, and requires the marked-up answer to be one a visitor can
      // see; an empty node fails both at once.
      ...(faqs.length > 0
        ? [{
            "@type": "FAQPage",
            "@id": CANONICAL,
            url: CANONICAL,
            name: TITLE,
            inLanguage: "ar",
            mainEntity: faqs.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa` },
          { "@type": "ListItem", position: 2, name: "الأسئلة الشائعة", item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-5xl px-4 pt-14 sm:px-6">
        <h1 className="text-center text-2xl font-black text-foreground sm:text-3xl">
          الأسئلة الشائعة
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          {DESCRIPTION}
        </p>
      </div>

      {/* The same component the landing uses, without a limit — one implementation, so a
          styling fix reaches both places and the two can never disagree. */}
      <FaqSection faqs={faqs} whatsappLink={whatsappLink} />
    </>
  );
}
