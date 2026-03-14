import type { LandingContent } from "@/lib/landing-content.types";
import { cl } from "@/helpers/cloudinary";

function buildJsonLd(content: LandingContent) {
  const { seo, landing } = content;
  const logoUrl = content.landingImages.logoWhite || cl(
    "https://res.cloudinary.com/dfegnpgwx/image/upload/v1771973886/jbrser_svg_ikxmnn.svg"
  );
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
    name: "JBRSEO",
    url: seo.canonical,
    logo: logoUrl,
    ...(socialUrls.length > 0 && { sameAs: socialUrls }),
  };
  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "JBRSEO",
    description: seo.description,
    url: seo.canonical,
    inLanguage: "ar",
    publisher: { "@type": "Organization", name: "JBRSEO" },
  };
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: landing.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

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
        url: seo.canonical,
      },
    }));

  const scripts: object[] = [organization, webSite, faqPage];
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
