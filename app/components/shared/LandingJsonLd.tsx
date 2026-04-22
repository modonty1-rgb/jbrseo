import type { LandingContent } from "@/lib/landing-content.types";
import { SITE_LOGO_URL } from "@/lib/constants";
import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

function buildJsonLd(content: LandingContent, countrySlug: "sa" | "eg") {
  const { seo, landing } = content;
  const fallbackOrigin = DEFAULT_PUBLIC_SITE_ORIGIN;
  const rawUrl = seo.canonical?.trim() || fallbackOrigin;
  const pageUrl = rawUrl.replace(/^https?:\/\/jbrseo\.com(?=\/|$)/i, "https://www.jbrseo.com");
  const orgId = `${pageUrl.replace(/\/$/, "")}#organization`;
  const siteOrigin = DEFAULT_PUBLIC_SITE_ORIGIN;

  const social = content.siteSettings?.socialLinks ?? {};
  const socialUrlsFromCms = [
    social.facebook,
    social.instagram,
    social.linkedin,
    social.twitterX,
    social.youtube,
    social.tiktok,
    social.snapchat,
  ].filter(Boolean) as string[];

  const sameAsDefault = [
    "https://twitter.com/jbrseo",
    "https://www.linkedin.com/company/jbrseo",
    "https://www.instagram.com/jbrseo",
  ];
  const sameAs = Array.from(new Set([...sameAsDefault, ...socialUrlsFromCms]));

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: "مدونتي | JBRSEO",
    url: siteOrigin,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
      width: 200,
      height: 60,
    },
    description: "منصة المحتوى العربي — مقالات تتصدر جوجل وعملاء جدد لنشاطك التجاري",
    address: {
      "@type": "PostalAddress",
      addressCountry: "SA",
      addressRegion: "الرياض",
    },
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: "Arabic",
      contactOption: "TollFree",
    },
  };

  const webSiteDescription =
    seo.description?.trim() ||
    "منصة المحتوى العربي للشركات السعودية والمصرية — مقالات تجلب عملاء بدون إعلانات.";

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "مدونتي | JBRSEO",
    description: webSiteDescription,
    url: siteOrigin,
    inLanguage: "ar",
    publisher: { "@id": orgId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteOrigin}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumbHome = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${siteOrigin}/${countrySlug}`,
      },
    ],
  };

  const faqMainEntity = landing.faq
    .map((item) => {
      const name = item.question.trim();
      const text = item.answer.trim();
      if (!name || !text) return null;
      return {
        "@type": "Question" as const,
        name,
        acceptedAnswer: { "@type": "Answer" as const, text },
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const faqPage =
    faqMainEntity.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqMainEntity,
        }
      : null;

  const testimonialList =
    landing.socialProof.testimonials && landing.socialProof.testimonials.length > 0
      ? landing.socialProof.testimonials
      : [landing.socialProof.testimonial];
  const reviewsList = testimonialList
    .filter((t) => t.quote || t.name || t.role || t.metric)
    .slice(0, 3)
    .map((t) => ({
      "@type": "Review" as const,
      author: {
        "@type": "Person" as const,
        name: t.name || "Anonymous",
        ...(t.image && { image: t.image }),
      },
      reviewBody: t.quote || "",
      itemReviewed: {
        "@type": "Organization" as const,
        name: "مدونتي | JBRSEO",
        url: pageUrl,
      },
    }));

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteOrigin}#localbusiness`,
    name: "مدونتي | JBRSEO",
    url: siteOrigin,
    description: "منصة المحتوى العربي — مقالات تتصدر جوجل وعملاء جدد لنشاطك التجاري",
    address: {
      "@type": "PostalAddress",
      addressCountry: countrySlug === "eg" ? "EG" : "SA",
      addressRegion: countrySlug === "eg" ? "القاهرة" : "الرياض",
    },
    sameAs,
  };

  const scripts: object[] = [organization, webSite, breadcrumbHome, localBusiness];
  if (faqPage) scripts.push(faqPage);
  if (reviewsList.length > 0) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "آراء العملاء",
      numberOfItems: reviewsList.length,
      itemListElement: reviewsList.map((review, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: review,
      })),
    });
  }
  return scripts;
}

export default function LandingJsonLd({
  content,
  countrySlug,
}: {
  content: LandingContent;
  countrySlug: "sa" | "eg";
}) {
  const scripts = buildJsonLd(content, countrySlug);
  return (
    <>
      {scripts.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
