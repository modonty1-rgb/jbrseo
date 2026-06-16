import { DEFAULT_PUBLIC_SITE_ORIGIN } from "@/lib/seo-meta";

export function AboutPageJsonLd(): React.JSX.Element {
  const base = DEFAULT_PUBLIC_SITE_ORIGIN;
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "من نحن — مدونتي",
    url: `${base}/about`,
    inLanguage: "ar",
    description: "تعرف على مدونتي — منصة المحتوى العربي لجذب العملاء عبر محركات البحث",
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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
