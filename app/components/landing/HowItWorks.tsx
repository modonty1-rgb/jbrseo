import type { LandingContent } from "@/lib/landing-content.types";

export default function HowItWorks({ content }: { content: LandingContent }) {
  const { howItWorks } = content.landing;
  const sh = content.sectionHeadings.howItWorks ?? { eyebrow: "الطريقة", title: "كيف نعمل" };
  return (
    <section
      id="how-it-works"
      data-reveal-section
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="how-it-works-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            {sh.eyebrow}
          </p>
          <h2
            id="how-it-works-title"
            className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {sh.title}
          </h2>
        </div>
        <div className="landing-reveal-content relative grid gap-6 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-8 start-[calc(16.67%+1rem)] end-[calc(16.67%+1rem)] hidden h-px border-t border-dashed border-accent/20 sm:block"
          />
          {howItWorks.steps.map((step, i) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center transition-all duration-200 hover:border-accent/40 hover:shadow-md"
            >
              <div className="relative mb-4 flex h-16 w-16 items-center justify-center">
                <span
                  className="absolute inset-0 flex items-center justify-center text-6xl font-black text-primary/5 select-none"
                  aria-hidden
                >
                  {i + 1}
                </span>
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground ring-2 ring-accent/30 ring-offset-2 ring-offset-card">
                  {i + 1}
                </span>
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
