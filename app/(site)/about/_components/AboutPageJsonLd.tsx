import { DEFAULT_PUBLIC_SITE_ORIGIN, safeJsonLd } from "@/lib/seo-meta";
import { COMPANY } from "@/lib/company";

/**
 * The page carries the company's legal registration in prose; this states the same facts
 * in the form a search engine can read.
 *
 * `mainEntity` is an Organization rather than a second top-level node, because this page
 * IS about that organization — nesting says so explicitly instead of leaving two
 * unrelated blocks on the page. The commercial-registration number goes in `identifier`
 * as a PropertyValue naming its issuing authority, which is what makes it a verifiable
 * claim rather than a number we typed.
 */
export function AboutPageJsonLd(): React.JSX.Element {
  const base = DEFAULT_PUBLIC_SITE_ORIGIN;
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "من نحن — جبر سيو",
    url: `${base}/about`,
    inLanguage: "ar",
    description: "تعرف على جبر سيو — صناعة المحتوى العربي وجذب العملاء عبر محركات البحث",
    mainEntity: {
      "@type": "Organization",
      // Same `@id` AND same `name` as the landing's Organization node. It carried
      // `COMPANY.marketingName` («شركة جبر الجنوبية») while the landing said «جبر سيو»,
      // so the two nodes sharing this id described one entity with two names — which is
      // how Google ends up unsure what the company is called. The legal name stays, in
      // the field built for it, alongside the CR number this page exists to publish.
      "@id": `${base}/#organization`,
      name: "جبر سيو",
      alternateName: ["JBRSEO", COMPANY.marketingName],
      legalName: COMPANY.legalName,
      url: base,
      foundingDate: "2023",
      identifier: {
        "@type": "PropertyValue",
        name: "السجل التجاري — وزارة التجارة السعودية",
        value: COMPANY.unifiedNumber,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: COMPANY.city,
        addressCountry: "SA",
        streetAddress: COMPANY.address,
      },
      email: COMPANY.email,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${base}/sa` },
        { "@type": "ListItem", position: 2, name: "من نحن", item: `${base}/about` },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
