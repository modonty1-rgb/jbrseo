"use client";

import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import type { FaqItem } from "@/app/content/landing/types";
import { TAG_TOKENS } from "@/app/content/landing/types";

type FAQAccordionProps = {
  faqs: readonly FaqItem[];
};

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  return (
    <div className="landing-reveal-content mb-10 space-y-2.5" role="list">
      {faqs.map((item, i) => {
        const token = TAG_TOKENS[item.tag] ?? "accent";
        const answerId = `faq-answer-${i}`;
        return (
          <div
            key={i}
            role="listitem"
          >
            <Collapsible className="group overflow-hidden rounded-[18px] border border-border bg-card shadow-sm transition-all duration-200 data-[state=open]:border-[color-mix(in_oklch,var(--accent)_35%,transparent)] data-[state=open]:shadow-[0_6px_28px_color-mix(in_oklch,var(--accent)_8%,transparent)]">
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  aria-controls={answerId}
                  className="h-auto w-full cursor-pointer justify-start gap-3.5 rounded-none bg-transparent px-5 py-[18px] text-right font-[Tajawal,sans-serif] shadow-none hover:bg-transparent sm:gap-4"
                >
                <span
                  className="hidden shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-black sm:inline-flex"
                  style={{
                    background: `color-mix(in oklch, var(--${token}) 8%, transparent)`,
                    borderColor: `color-mix(in oklch, var(--${token}) 20%, transparent)`,
                    color: `var(--${token})`,
                  }}
                >
                  {item.tag}
                </span>
                <span className="flex-1 text-[15px] font-black leading-snug transition-colors duration-200 text-foreground group-data-[state=open]:text-accent">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm transition-all duration-250 bg-border text-muted-foreground group-data-[state=open]:bg-accent/10 group-data-[state=open]:text-accent group-data-[state=open]:rotate-180"
                >
                  ▼
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
              id={answerId}
              role="region"
              className="overflow-hidden transition-all duration-350 ease-in-out data-[state=closed]:max-h-0 data-[state=closed]:opacity-0 data-[state=open]:max-h-[400px] data-[state=open]:opacity-100"
            >
              <div className="flex gap-3.5 border-t border-border px-5 pb-5 pt-4">
                <div
                  className="w-[3px] shrink-0 self-stretch rounded-full opacity-50"
                  style={{ background: `var(--${token})` }}
                  aria-hidden
                />
                <p className="text-[14px] leading-[1.82] text-muted-foreground">
                  {item.a}
                </p>
              </div>
            </CollapsibleContent>
          </Collapsible>
          </div>
        );
      })}
    </div>
  );
}
