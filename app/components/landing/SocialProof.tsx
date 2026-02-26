import { landing } from "@/app/content/landing";

export default function SocialProof() {
  const { socialProof } = landing;
  const { testimonial, stats } = socialProof;
  return (
    <section
      id="social-proof"
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="social-proof-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            الشهادات
          </p>
          <h2
            id="social-proof-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            شركاء يثقون بنا
          </h2>
        </div>

        {/* stats row */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-0">
          {stats.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="px-8 text-center sm:px-12">
                <span className="block text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{s.label}</span>
              </div>
              {i < stats.length - 1 && (
                <div aria-hidden className="h-10 w-px bg-border" />
              )}
            </div>
          ))}
        </div>

        {/* testimonial card */}
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div
            aria-hidden
            className="mb-2 text-7xl font-black leading-none text-primary/10 select-none"
          >
            &ldquo;
          </div>
          <p className="mb-6 text-base leading-relaxed text-foreground/90 sm:text-lg">
            {testimonial.quote}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">
              {testimonial.metric}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
