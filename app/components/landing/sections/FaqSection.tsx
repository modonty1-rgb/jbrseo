import { MessageCircle } from "lucide-react";
import type { FaqItem } from "@/app/content/landing/types";
import { toArabicDigits } from "../landing-helpers";

type Props = {
  faqs: FaqItem[];
  whatsappLink: string;
};

/**
 * FAQ — a Server Component. Uses the native <details>/<summary> element instead
 * of a JS accordion: zero client JS, and every answer ships inside the server
 * HTML (the browser hides closed panels but keeps them in the DOM) so the copy
 * stays crawlable for SEO. `name="faq"` links all panels into one exclusive
 * group → one-open-at-a-time (Baseline 2024; older browsers just allow multiple
 * open — a graceful degradation, not a break). No open/close animation by design.
 */
export function FaqSection({ faqs, whatsappLink }: Props) {
  if (faqs.length === 0) return null;

  // Group by tag, preserving first-appearance order.
  const grouped = new Map<string, FaqItem[]>();
  for (const item of faqs) {
    const tag = (item.tag || "").trim() || "عام";
    if (!grouped.has(tag)) grouped.set(tag, []);
    grouped.get(tag)!.push(item);
  }
  const groups = Array.from(grouped.entries());

  return (
    <section id="faq" className="border-t border-t-[var(--border)] bg-card overflow-x-clip">
      <div className="max-w-190 mx-auto px-7 py-8 md:py-14">
        <div className="text-center mb-5 md:mb-8">
          {/* Trust badge — matches structure of other sections */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
            <span>إجابات مباشرة · بلا لف</span>
            <span className="text-success/60" aria-hidden>·</span>
            <span className="text-success/80 font-mono text-[10.5px]">{toArabicDigits(faqs.length)} سؤال</span>
          </div>
          <h2 className="text-balance text-[clamp(20px,5.6vw,34px)] font-semibold tracking-[-1px] mb-3">
            اقتنع <span className="text-success">قبل</span> ما تبدأ
          </h2>
          <p className="text-[14.5px] text-muted-foreground max-w-130 mx-auto leading-[1.7]">
            كل سؤال يجيك في بالك — مقسّم حسب الموضوع للوصول السريع.
          </p>
        </div>

        {/* Category filter chips — horizontal scroll on mobile, wrap on desktop */}
        {groups.length > 1 && (
          <div className="mb-6 -mx-7 md:mx-0">
            <div className="flex md:flex-wrap items-center md:justify-center gap-2 overflow-x-auto md:overflow-visible px-7 md:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {groups.map(([tag, items]) => (
                <a
                  key={tag}
                  href={`#faq-group-${encodeURIComponent(tag)}`}
                  className="inline-flex shrink-0 items-center gap-1.5 bg-background border border-border hover:border-success/50 hover:bg-success/5 transition-colors text-[12px] font-medium text-foreground px-3 py-1.5 rounded-full snap-start"
                >
                  <span className="whitespace-nowrap">{tag}</span>
                  <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
                    {toArabicDigits(items.length)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Grouped accordion */}
        <div className="space-y-6">
          {groups.map(([tag, items]) => (
            <div key={tag} id={`faq-group-${encodeURIComponent(tag)}`} className="scroll-mt-24">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="w-1 h-4 rounded-full bg-success" aria-hidden />
                <span className="font-mono text-[11px] text-success font-bold tracking-[1.5px]">{tag}</span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  · {toArabicDigits(items.length)} سؤال
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-background overflow-hidden divide-y divide-border">
                {items.map((item, i) => (
                  <details key={`${tag}-${i}`} name="faq" className="group px-5">
                    <summary className="flex w-full items-center justify-between gap-2.5 py-4 sm:py-[22px] text-start text-[clamp(13.5px,4vw,16px)] font-medium text-foreground text-balance cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="shrink-0 inline-block text-[22px] font-light leading-none text-muted-foreground group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <div className="text-[14.5px] text-muted-foreground leading-[1.85] font-light whitespace-pre-line pb-[22px]">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-[13px] text-muted-foreground">
          ما لقيت إجابتك؟{" "}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-success font-semibold no-underline border-b border-b-success/30 pb-px"
          >
            تواصل معنا على واتساب ←
          </a>
        </div>
      </div>
    </section>
  );
}
