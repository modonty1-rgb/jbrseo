import type { FaqItem } from "@/app/content/landing/types";
import { COMPANY } from "@/lib/company";
import { SITE_LOGO_URL } from "@/lib/constants";

type Props = {
  countrySlug: "sa" | "eg";
  siteOrigin: string;
  faqs: FaqItem[];
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

export function LandingJsonLd({ countrySlug, siteOrigin, faqs, socialLinks, whatsappNumber }: Props) {
  const pageUrl = `${siteOrigin}/${countrySlug}`;
  const countryLabel = countrySlug === "eg" ? "مصر" : "السعودية";

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
    name: "جبر سيو",
    alternateName: ["JBRSEO", COMPANY.marketingName],
    legalName: COMPANY.legalName,
    url: siteOrigin,
    logo: SITE_LOGO_URL,
    description:
      "جبر سيو — محتوى عربي يجلب عملاء من جوجل: مقالات تُكتب وتُنشر وتُقاس شهرياً، لأصحاب الأعمال في السعودية ومصر.",
    areaServed: countryLabel,
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
    name: "جبر سيو",
    alternateName: "JBRSEO",
    url: `${siteOrigin}/`,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: siteOrigin,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: countryLabel,
        item: pageUrl,
      },
    ],
  };

  const validFaqs = (faqs ?? []).filter((f) => f.q?.trim() && f.a?.trim());
  const faqPage = validFaqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: validFaqs.map((f) => ({
          "@type": "Question",
          name: f.q.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a.trim(),
          },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  );
}
