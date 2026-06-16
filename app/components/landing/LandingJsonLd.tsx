import type { FaqItem } from "@/app/content/landing/types";

type Props = {
  countrySlug: "sa" | "eg";
  siteOrigin: string;
  faqs: FaqItem[];
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitterX?: string;
    youtube?: string;
    tiktok?: string;
  };
};

export function LandingJsonLd({ countrySlug, siteOrigin, faqs, socialLinks }: Props) {
  const pageUrl = `${siteOrigin}/preview/${countrySlug}`;
  const countryLabel = countrySlug === "eg" ? "مصر" : "السعودية";

  const sameAs = [
    socialLinks?.facebook,
    socialLinks?.instagram,
    socialLinks?.linkedin,
    socialLinks?.twitterX,
    socialLinks?.youtube,
    socialLinks?.tiktok,
  ].filter((u): u is string => typeof u === "string" && u.length > 0);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "مدونتي",
    alternateName: "JBRSEO · Modonty",
    url: siteOrigin,
    logo: `${siteOrigin}/logo.png`,
    description: "منصة المحتوى العربي — مقالات SEO جاهزة، تنشر تلقائياً، وتجيب لك عملاء من جوجل.",
    areaServed: countryLabel,
    sameAs,
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
