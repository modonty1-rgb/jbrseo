import { ChevronDown } from "lucide-react";
import type { LandingContent } from "@/lib/landing-content.types";

export default function FAQ({ content }: { content: LandingContent }) {
  const { faq } = content.landing;
  const sh = content.sectionHeadings.faq ?? { eyebrow: "الأسئلة", title: "أسئلة شائعة" };
  return (
    <section
      id="faq"
      data-reveal-section
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="landing-reveal-eyebrow mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            {sh.eyebrow}
          </p>
          <h2
            id="faq-title"
            className="landing-reveal-title text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl"
          >
            {sh.title}
          </h2>
        </div>
        <div className="landing-reveal-content space-y-2">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-card transition-all duration-200 open:border-accent/40 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-semibold text-foreground transition-colors duration-150 hover:bg-muted/30 [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-180 group-open:text-accent"
                  aria-hidden
                />
              </summary>
              <div className="border-s-4 border-accent/20 ms-5">
                <p className="border-t border-border/50 px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
