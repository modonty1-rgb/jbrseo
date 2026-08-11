import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import { ClientLogoTile } from "@/app/components/clients/ClientLogoTile";
import { toArabicDigits } from "@/app/components/landing/landing-helpers";
import { siteOgImages } from "@/lib/getGlobalSeo";
import { DEFAULT_PUBLIC_SITE_ORIGIN, PUBLIC_INDEX_FOLLOW_ROBOTS, safeJsonLd, SHARED_OPEN_GRAPH, sharedLanguages } from "@/lib/seo-meta";

/**
 * The full client roster, on a page of its own.
 *
 * On the landing this wall was a client section that shipped framer-motion, a Radix
 * Select and a category filter, and serialised all thirty clients — names, industries,
 * URLs — into the page payload to render four visible tiles. The other twenty-six sat
 * behind an expand button most readers never press, so the landing paid for a roster it
 * did not show. The landing keeps four logos and a link; the roster lives here.
 *
 * Grouped by sector as static sections rather than filtered by a control: with the whole
 * list on screen, a heading does what a filter did and costs no JavaScript. It also gives
 * each sector a crawlable heading, and thirty business names on an indexable URL is real
 * search material the landing could never expose.
 *
 * No country segment, like `/about` and `/faq`: the same roster serves both markets.
 */

const CANONICAL = `${DEFAULT_PUBLIC_SITE_ORIGIN}/clients`;
// 70 characters with the appended " | JBRSEO" — past Google's SERP cut-off, so the
// suffix and the last words were being truncated away. 41 now, and it leads with the
// word people search.
const TITLE = "عملاؤنا — أنشطة نبني حضورها في جوجل";
const DESCRIPTION =
  "قائمة الأنشطة السعودية والعربية التي تبني حضورها معنا على منصة مدونتي — مقسّمة حسب القطاع، وكل اسم يوصلك لصفحته.";

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

export default async function ClientsPage() {
  const bundle = await getModontyTrustBundle();

  // Group by the sector tab the bundle already assigns, preserving the order the tab
  // list is built in so the biggest sectors come first and "أخرى" lands last.
  const bySector = bundle.industries
    .map((tab) => ({
      ...tab,
      logos: bundle.logos.filter((l) => l.industryKey === tab.key),
    }))
    .filter((s) => s.logos.length > 0);

  // Anyone whose sector was never set falls outside every tab; they still belong on the
  // page, so they get their own group at the end rather than vanishing.
  const unsorted = bundle.logos.filter((l) => !l.industryKey);

  /**
   * `ItemList` of the clients, derived from the same array the page renders.
   *
   * Each entry points at the client's own page on Modonty, which is where the name
   * actually resolves to something — a list of names with no destinations is not an
   * entity list, it is decoration.
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        "@id": CANONICAL,
        url: CANONICAL,
        name: TITLE,
        inLanguage: "ar",
        numberOfItems: bundle.total,
        itemListElement: bundle.logos.map((logo, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: logo.name,
          url: logo.href,
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${CANONICAL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${DEFAULT_PUBLIC_SITE_ORIGIN}/sa` },
          { "@type": "ListItem", position: 2, name: "عملاؤنا", item: CANONICAL },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
        <h1 className="text-balance text-center text-2xl font-semibold leading-[1.3] text-foreground sm:text-3xl">
          عملاء نبني حضورهم في البحث والذكاء الاصطناعي
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-center text-[14.5px] leading-[1.75] text-muted-foreground sm:text-base">
          {toArabicDigits(bundle.total)} نشاطاً اختارنا لبناء حضوره — مقسّمة حسب القطاع، وكل اسم يوصلك لصفحته.
        </p>
      </div>

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 md:space-y-14 md:py-14">
        {[...bySector, ...(unsorted.length > 0 ? [{ key: "__none__", label: "قطاعات أخرى", count: unsorted.length, logos: unsorted }] : [])].map(
          (sector) => (
            <section key={sector.key} aria-labelledby={`sector-${encodeURIComponent(sector.key)}`}>
              <div className="mb-4 flex items-center gap-2.5 md:mb-6">
                <span className="h-4 w-1 rounded-full bg-success" aria-hidden />
                <h2
                  id={`sector-${encodeURIComponent(sector.key)}`}
                  className="text-[15px] font-bold leading-[1.4] text-foreground md:text-[17px]"
                >
                  {sector.label}
                </h2>
                <span className="text-[12px] text-muted-foreground">
                  · {toArabicDigits(sector.logos.length)} نشاط
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 md:justify-start md:gap-x-4">
                {sector.logos.map((logo) => (
                  <ClientLogoTile
                    key={logo.slug}
                    logo={logo}
                    className="w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-36 lg:w-40"
                  />
                ))}
              </div>
            </section>
          ),
        )}

        <div className="flex justify-center pt-2">
          <Link
            href="/#pricing"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[14px] font-bold text-primary-foreground no-underline shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 motion-reduce:transform-none md:text-base"
          >
            ابدأ حضورك أنت كمان
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
