import type { LandingContent } from "@/lib/landing-content.types";

export default function Outcomes({ content }: { content: LandingContent }) {
  const { outcomes } = content.landing;
  const sh = content.sectionHeadings.outcomes ?? { eyebrow: "النتائج", title: "ما الذي تحصل عليه" };
  return (
    <section
      id="outcomes"
      data-reveal-section
      className="border-t border-border/50 bg-muted/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="outcomes-title"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            {sh.eyebrow}
          </p>
          <h2
            id="outcomes-title"
            className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {sh.title}
          </h2>
        </div>
        <div className="landing-reveal-content grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-border border-t-2 border-t-accent bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
            >
              <span className="mb-3 block text-xs font-bold text-accent">←</span>
              <h3 className="mb-2 font-semibold leading-snug text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.line}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
