import type { LandingContent } from "@/lib/landing-content.types";

export default function WhyNow({ content }: { content: LandingContent }) {
  const { whyNow } = content.landing;
  const sh = content.sectionHeadings.whyNow ?? { eyebrow: "لماذا الآن", title: "كل شهر تأخير له ثمن" };
  return (
    <section
      id="why-now"
      data-reveal-section
      className="relative overflow-hidden border-t border-border/50 bg-muted/40 px-4 pt-24 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8 lg:pt-32 lg:pb-20"
      aria-labelledby="why-now-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"
      />
      <div className="relative mx-auto max-w-3xl border-s-4 border-accent/50 ps-6">
        <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
          {sh.eyebrow}
        </p>
        <h2
          id="why-now-title"
          className="landing-reveal-title mb-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
        >
          {sh.title}
        </h2>
        <div className="landing-reveal-content space-y-4">
          {whyNow.lines.map((line, i) => (
            <div
              key={i}
              className="relative rounded-xl border border-border/60 bg-card px-5 py-4 transition-all duration-200 hover:border-accent/40 hover:shadow-sm"
            >
              <span
                className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-5xl font-black leading-none text-accent/10 select-none"
                aria-hidden
              >
                {i + 1}
              </span>
              <p className="relative text-base leading-relaxed text-muted-foreground sm:text-lg">
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
