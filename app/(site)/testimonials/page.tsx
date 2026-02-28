import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/app/components/ui/button";
import { TestimonialCard } from "@/app/components/landing/TestimonialCard";
import { SectionReveal } from "@/app/components/landing/SectionReveal";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const sh = content.sectionHeadings.socialProof;
  const title = sh?.title ? `${sh.title} — مدونتي` : "شهادات العملاء — مدونتي";
  return { title, description: "شهادات وتجارب عملاء مدونتي." };
}

function testimonialListFromContent(content: Awaited<ReturnType<typeof getLandingContent>>) {
  const { socialProof } = content.landing;
  const { testimonial, testimonials } = socialProof;
  const list = testimonials && testimonials.length > 0 ? testimonials : [testimonial];
  return list.filter((t) => t.quote || t.name || t.role || t.metric);
}

export default async function TestimonialsPage() {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);
  const list = testimonialListFromContent(content);
  const sh = content.sectionHeadings.socialProof ?? {
    eyebrow: "الشهادات",
    title: "شركاء يثقون بنا",
  };
  const { stats } = content.landing.socialProof;
  const canonical = content.seo.canonical?.replace(/\/$/, "") ?? "";
  const pageUrl = canonical ? `${canonical}/testimonials` : "/testimonials";
  const reviewsJsonLd =
    list.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          url: pageUrl,
          name: sh.title,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: list.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Review",
                author: {
                  "@type": "Person",
                  name: t.name || "Anonymous",
                  ...(t.image && { image: t.image }),
                },
                reviewBody: t.quote || "",
                itemReviewed: {
                  "@type": "Organization",
                  name: "مدونتي",
                  url: canonical || undefined,
                },
              },
            })),
          },
        }
      : null;

  return (
    <>
      {reviewsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
        />
      )}

      <SectionReveal>
        <section
          className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28 lg:px-8 landing-grain"
          data-reveal-section
        >
          {/* Glow orbs */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-16 end-1/4 h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
            <div className="absolute bottom-24 start-1/3 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="relative z-10 mx-auto max-w-6xl">
            <div className="mb-14 text-center">
              <p className="landing-reveal-eyebrow mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                {sh.eyebrow}
              </p>
              <h1 className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {sh.title}
              </h1>
            </div>

            {stats.length > 0 && (
              <div className="landing-reveal-content mb-14 flex flex-wrap items-center justify-center gap-0">
                {stats.map((s, i) => (
                  <div key={`${s.label}-${i}`} className="flex items-center">
                    <div className="px-6 py-3 text-center sm:px-10 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm mx-1">
                      <span className="block text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                        {s.value}
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="landing-reveal-content mx-auto flex max-w-2xl flex-col gap-6">
              {list.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center text-muted-foreground">
                  لا توجد شهادات حتى الآن.
                </p>
              ) : (
                list.map((t, idx) => (
                  <div
                    key={`${t.name}-${idx}`}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <TestimonialCard
                      name={t.name}
                      role={t.role}
                      quote={t.quote}
                      metric={t.metric}
                      image={t.image}
                      imageLoading="lazy"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="mt-14 text-center">
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 transition-all duration-200 hover:scale-[1.03] hover:shadow-md"
              >
                <Link href="/">{content.landing.hero.cta}</Link>
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal>
    </>
  );
}
