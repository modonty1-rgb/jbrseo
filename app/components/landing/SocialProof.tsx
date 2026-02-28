import Link from "next/link";
import type { LandingContent } from "@/lib/landing-content.types";
import { TestimonialCard } from "@/app/components/landing/TestimonialCard";

const HOME_TESTIMONIALS_LIMIT = 3;

export default function SocialProof({ content }: { content: LandingContent }) {
  const { socialProof } = content.landing;
  const { testimonial, testimonials, stats } = socialProof;
  const testimonialList =
    (testimonials && testimonials.length > 0 ? testimonials : [testimonial]).filter(
      (t) => t.quote || t.name || t.role || t.metric
    );
  const displayList = testimonialList.slice(0, HOME_TESTIMONIALS_LIMIT);
  const hasMore = testimonialList.length > HOME_TESTIMONIALS_LIMIT;
  const sh = content.sectionHeadings.socialProof ?? { eyebrow: "الشهادات", title: "شركاء يثقون بنا" };
  return (
    <section
      id="social-proof"
      data-reveal-section
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="social-proof-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            {sh.eyebrow}
          </p>
          <h2
            id="social-proof-title"
            className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {sh.title}
          </h2>
        </div>
        <div className="landing-reveal-content mb-12 flex flex-wrap items-center justify-center gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center rounded-2xl border border-border bg-card px-8 py-5 shadow-sm"
            >
              <span className="block text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                {s.value}
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {displayList.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-muted/20 px-6 py-12 text-center text-muted-foreground">
              لا توجد شهادات بعد.
            </p>
          ) : (
            displayList.map((t, idx) => (
              <TestimonialCard
                key={`${t.name}-${idx}`}
                name={t.name}
                role={t.role}
                quote={t.quote}
                metric={t.metric}
                image={t.image}
                imageLoading={idx > 0 ? "lazy" : "eager"}
              />
            ))
          )}
        </div>
        {hasMore && (
          <p className="mt-8 text-center">
            <Link
              href="/testimonials"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            >
              عرض كل الشهادات
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
