import type { Plan } from "@/app/content/landing/price-section-types";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

type PricingPageJsonLdProps = {
  countrySlug: "sa" | "eg";
  countryCode: SupportedCountry;
  plans: Plan[];
  pricingPageTitle: string;
};

export function PricingPageJsonLd({
  countrySlug,
  countryCode,
  plans,
  pricingPageTitle,
}: PricingPageJsonLdProps): React.JSX.Element {
  const base = DEFAULT_PUBLIC_SITE_ORIGIN;
  const url = `${base}/${countrySlug}/pricing`;
  const homeUrl = `${base}/${countrySlug}`;
  const pageName =
    countrySlug === "sa" ? "أسعار خدمة السيو العربي — مدونتي" : pricingPageTitle;

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageName,
    url,
    inLanguage: "ar",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "الرئيسية", item: homeUrl },
        { "@type": "ListItem", position: 2, name: "الأسعار", item: url },
      ],
    },
  };

  const currency = countryCode === "EG" ? "EGP" : "SAR";
  const regionCountry = countryCode === "EG" ? "EG" : "SA";

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "خطط أسعار مدونتي",
    numberOfItems: plans.length,
    itemListElement: plans.map((plan, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: plan.name,
        priceCurrency: currency,
        eligibleRegion: { "@type": "Country", name: regionCountry },
      },
    })),
  };

  const scripts: object[] = [webPage, itemList];

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
