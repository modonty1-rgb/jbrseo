import { ChevronDown } from "lucide-react";
import { landing } from "@/app/content/landing";

export default function FAQ() {
  const { faq } = landing;
  return (
    <section
      id="faq"
      className="border-t border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
      aria-labelledby="faq-title"
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
            الأسئلة
          </p>
          <h2
            id="faq-title"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            أسئلة شائعة
          </h2>
        </div>

        <div className="space-y-2">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-border bg-card transition-colors open:border-accent/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <p className="border-t border-border/50 px-5 pb-4 pt-3 text-sm leading-relaxed text-muted-foreground">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
