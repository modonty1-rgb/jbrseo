import { safeJsonLd } from "@/lib/seo-meta";
import type { FaqItem } from "@/app/content/landing/types";
import type { Plan as DBPlan } from "@prisma/client";
import { COMPANY } from "@/lib/company";
import { ORGANIZATION_LOGO_URL } from "@/lib/constants";

type Props = {
  countrySlug: "sa" | "eg";
  siteOrigin: string;
  faqs: FaqItem[];
  /**
   * The same array the pricing cards render.
   *
   * Passed in rather than fetched here on purpose: a second query is a second source, and
   * a Service/Offer graph that disagrees with the price on the page is worse than no
   * graph at all — Google reads the markup, the buyer reads the card, and the gap is the
   * kind that gets a rich result suppressed.
   */
  plans: DBPlan[];
  whatsappNumber?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitterX?: string;
    youtube?: string;
    tiktok?: string;
  };
};

export function LandingJsonLd({ countrySlug, siteOrigin, faqs, plans, socialLinks, whatsappNumber }: Props) {
  const pageUrl = `${siteOrigin}/${countrySlug}`;
  const countryLabel = countrySlug === "eg" ? "مصر" : "السعودية";

  /**
   * The subscription itself, as an offer catalogue.
   *
   * The site published prices to readers and declared nothing about them — the one
   * high-value node it was missing. Every field is read from the same `plans` array the
   * cards render, so the two cannot drift: no literals, no second query.
   *
   * `priceCurrency` follows the country because the amounts do. Free tiers are dropped:
   * an Offer at 0 describes a purchase nobody makes and dilutes the set.
   *
   * These prices are VAT-inclusive, which `priceSpecification.valueAddedTaxIncluded`
   * states rather than leaves a crawler to assume.
   */
  const paidPlans = plans.filter((p) => p.priceMonthly > 0);
  const priceCurrency = countrySlug === "eg" ? "EGP" : "SAR";
  const service = paidPlans.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: "اشتراك محتوى وسيو — جبر سيو",
        serviceType: "تحسين الظهور في محركات البحث وصناعة المحتوى",
        provider: { "@id": `${siteOrigin}/#organization` },
        areaServed: countrySlug === "eg" ? "EG" : "SA",
        inLanguage: "ar",
        offers: paidPlans.map((p) => ({
          "@type": "Offer",
          name: p.name,
          url: `${pageUrl}#pricing`,
          price: String(p.priceMonthly),
          priceCurrency,
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: String(p.priceMonthly),
            priceCurrency,
            valueAddedTaxIncluded: true,
            unitCode: "MON",
          },
        })),
      }
    : null;

  const sameAs = [
    socialLinks?.facebook,
    socialLinks?.instagram,
    socialLinks?.linkedin,
    socialLinks?.twitterX,
    socialLinks?.youtube,
    socialLinks?.tiktok,
  ].filter((u): u is string => typeof u === "string" && u.length > 0);

  /**
   * Who owns this website. Google and the AI engines read this node to identify the
   * business behind the domain, so every value here has to describe jbrseo.com.
   *
   * It used to describe Modonty: name "مدونتي", Modonty's logo, Modonty's description.
   * The titles and meta descriptions were cleaned earlier and this was missed — and it
   * is the one place that actually names the entity. Modonty is the platform being sold
   * here, not the owner of this domain, so it belongs in the page copy, not in this node.
   *
   * `contactPoint`, `telephone` and `email` are Google's recommended properties for an
   * Organization — "the best way for a user to contact your business". The values are
   * the ones already published on /privacy and /terms, read from one source.
   */
  const phone = whatsappNumber?.trim() ? `+${whatsappNumber.replace(/\D/g, "")}` : undefined;

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    // A stable `@id`, so this is ONE entity across the site.
    // Three nodes described this company with three names and no shared identifier —
    // here as «جبر سيو» with no `@id`, on /about as «شركة جبر الجنوبية» with
    // `#organization`, and inside the article payload as «شركة جبر سيو». Google merges
    // entities by `@id`; without one it had three companies claiming the same url.
    "@id": `${siteOrigin}/#organization`,
    name: "جبر سيو",
    alternateName: ["JBRSEO", COMPANY.marketingName],
    legalName: COMPANY.legalName,
    url: siteOrigin,
    // The 143×46 wordmark is below Google's 112px minimum height for an Organization
    // logo — the same reason `DEFAULT_OG_IMAGE_URL` exists. This uses the padded raster
    // variant so the property is actually eligible.
    logo: {
      "@type": "ImageObject",
      url: ORGANIZATION_LOGO_URL,
      width: 1200,
      height: 630,
    },
    description:
      "جبر سيو — محتوى عربي يجلب عملاء من جوجل: مقالات تُكتب وتُنشر وتُقاس شهرياً، لأصحاب الأعمال في السعودية ومصر.",
    // Both markets on both landings. `countryLabel` made /sa and /eg publish two
    // contradictory descriptions of one company — now that they share an `@id`, the
    // contradiction would be between two copies of the same entity.
    areaServed: ["SA", "EG"],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address,
      addressLocality: COMPANY.city,
      addressCountry: "SA",
    },
    email: COMPANY.email,
    ...(phone && { telephone: phone }),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: COMPANY.email,
      ...(phone && { telephone: phone }),
      areaServed: countrySlug === "eg" ? "EG" : "SA",
      availableLanguage: ["Arabic", "English"],
    },
    sameAs,
  };

  /**
   * The name Google prints under the link in the results.
   *
   * Without this node that name is guessed: "generation of site names on the Google
   * Search results page is completely automated". Google's own ranking of the inputs is
   * explicit — "WebSite structured data is most important, if you want to specify a
   * preference" — and until now the site had no WebSite node anywhere.
   *
   * Two constraints from the same page shape where it goes and what `url` holds:
   * the markup "must be on the home page of the site", and `url` is "the canonical home
   * page of your site's domain". The domain root redirects to the country landing, so
   * the crawler fetching "/" arrives here — this component renders on /sa and /eg only —
   * while `url` stays the domain root, identical on both so the two pages describe one
   * site rather than two. Inner pages deliberately get nothing: "Subdirectory-level
   * pages cannot have site names".
   */
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    name: "جبر سيو",
    alternateName: "JBRSEO",
    url: `${siteOrigin}/`,
    inLanguage: "ar",
    // Points at the Organization by id rather than restating it — one entity, referenced.
    publisher: { "@id": `${siteOrigin}/#organization` },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        // `/sa`, not the bare origin: "/" 307-redirects, and a breadcrumb item should be
        // a URL that resolves. Matches `buildPageJsonLd` and /about.
        item: `${siteOrigin}/sa`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: countryLabel,
        item: pageUrl,
      },
    ],
  };

  /**
   * The FAQ card moved to `/faq` and is deliberately not emitted here.
   *
   * Google grants FAQ rich results to a page whose main content is the FAQ, and the
   * marked-up answers have to be the answers the visitor can see. The landing now shows
   * three questions; claiming eighteen in its structured data would describe a page that
   * does not exist and put two URLs forward for the same card.
   *
   * It also removes the largest JSON payload the landing was shipping — eighteen full
   * answers inlined in the HTML of the page whose speed matters most.
   */
  const faqPage = null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumb) }}
      />
      {service && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(service) }}
        />
      )}
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqPage) }}
        />
      )}
    </>
  );
}
