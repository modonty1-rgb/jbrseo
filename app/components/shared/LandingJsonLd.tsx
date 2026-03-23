import type { LandingContent } from "@/lib/landing-content.types";

function buildJsonLd(content: LandingContent) {
  const { seo, landing } = content;
  const fallbackOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://www.jbrseo.com";
  const pageUrl = seo.canonical?.trim() || fallbackOrigin;
  const orgId = `${pageUrl.replace(/\/$/, "")}#organization`;

  const organizationLogoUrl =
    "https://res.cloudinary.com/dfegnpgwx/image/upload/f_auto,q_auto,fl_immutable_cache/v1771971820/jbrSeo_coverPage_du6vsm.png";
  const socialUrls = [
    process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL,
    process.env.NEXT_PUBLIC_SOCIAL_TWITTER_X_URL,
    process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL,
    process.env.NEXT_PUBLIC_SOCIAL_TIKTOK_URL,
    process.env.NEXT_PUBLIC_SOCIAL_SNAPCHAT_URL,
  ].filter(Boolean) as string[];

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: "مدونتي — JBRSEO",
    url: pageUrl,
    logo: { "@type": "ImageObject", url: organizationLogoUrl },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: "Arabic",
    },
    ...(socialUrls.length > 0 && { sameAs: socialUrls }),
  };
  const webSiteDescription =
    seo.description?.trim() ||
    "منصة المحتوى العربي للشركات السعودية والمصرية — مقالات تجلب عملاء بدون إعلانات.";
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JBRSEO",
    description: webSiteDescription,
    url: pageUrl,
    inLanguage: "ar",
    publisher: { "@id": orgId },
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
        name: "JBRSEO",
        url: pageUrl,
      },
    }));

  const scripts: object[] = [organization, webSite];
  if (faqPage) scripts.push(faqPage);
  if (reviewsList.length > 0) {
    scripts.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: reviewsList.map((review, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: review,
      })),
    });
  }
  return scripts;
}

export default function LandingJsonLd({ content }: { content: LandingContent }) {
  const scripts = buildJsonLd(content);
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
