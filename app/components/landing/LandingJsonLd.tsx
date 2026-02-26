import { landing, seo } from "@/app/content/landing";

const LOGO_URL =
  "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg";

function buildJsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "مدونتي",
    url: seo.canonical,
    logo: LOGO_URL,
    sameAs: ["#"],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "مدونتي",
    description: seo.description,
    url: seo.canonical,
    inLanguage: "ar",
    publisher: { "@type": "Organization", name: "مدونتي" },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return [organization, webSite, faqPage];
}

export default function LandingJsonLd() {
  const scripts = buildJsonLd();
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
