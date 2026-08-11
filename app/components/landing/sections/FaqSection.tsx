import { MessageCircle } from "lucide-react";
import type { FaqItem } from "@/app/content/landing/types";
import { toArabicDigits } from "../landing-helpers";

type Props = {
  faqs: FaqItem[];
  whatsappLink: string;
  /**
   * How many questions to show, when this is a teaser rather than the whole set.
   *
   * The landing renders three; the rest live on `/faq`. Eighteen questions were 2,077px
   * — the longest block on the page — spent on a reader who has usually already decided.
   * Three answers the common objection and the link carries anyone still weighing it.
   */
  limit?: number;
  /** Where "all the questions" goes. Its presence is what makes this a teaser. */
  moreHref?: string;
};

/**
 * «سؤال» counted correctly. Arabic does not pluralise by appending a number to the
 * singular the way English does: 3–10 take the broken plural, 11 and up take an
 * accusative singular. «٣ سؤال» is not a style choice, it is a grammatical error, and it
 * sat in the badge above a section whose whole claim is that we are precise.
 */
function questionCount(n: number): string {
  if (n === 1) return "سؤال واحد";
  if (n === 2) return "سؤالان";
  if (n <= 10) return `${toArabicDigits(n)} أسئلة`;
  return `${toArabicDigits(n)} سؤالاً`;
}

/**
 * FAQ — a Server Component. Uses the native <details>/<summary> element instead
 * of a JS accordion: zero client JS, and every answer ships inside the server
 * HTML (the browser hides closed panels but keeps them in the DOM) so the copy
 * stays crawlable for SEO. `name="faq"` links all panels into one exclusive
 * group → one-open-at-a-time (Baseline 2024; older browsers just allow multiple
 * open — a graceful degradation, not a break). No open/close animation by design.
 */
export function FaqSection({ faqs, whatsappLink, limit, moreHref }: Props) {
  if (faqs.length === 0) return null;

  const isTeaser = Boolean(limit && moreHref && faqs.length > limit);
  const shown = limit ? faqs.slice(0, limit) : faqs;

  // Group by tag, preserving first-appearance order.
  const grouped = new Map<string, FaqItem[]>();
  for (const item of shown) {
    const tag = (item.tag || "").trim() || "عام";
    if (!grouped.has(tag)) grouped.set(tag, []);
    grouped.get(tag)!.push(item);
  }
  const groups = Array.from(grouped.entries());

  return (
    <section id="faq" className="border-t border-t-[var(--border)] bg-card overflow-x-clip">
      <div className="max-w-190 mx-auto px-5 md:px-7 py-6 md:py-10">
        <div className="text-center mb-5 md:mb-8">
          {/* Trust badge — matches structure of other sections */}
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 text-success text-[12px] font-bold px-3.5 py-1.5 rounded-full mb-4">
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden />
            <span>إجابات مباشرة · بلا لف</span>
            <span className="text-success/60" aria-hidden>·</span>
            {/* The count names what is on THIS page, not the archive. Saying "18 سؤال"
                above three of them is the kind of small lie a reader notices. */}
            <span className="text-success/80 text-[11px]">{questionCount(shown.length)}</span>
          </div>
          <h2 className="text-balance text-[clamp(20px,5.6vw,34px)] font-semibold mb-3">
            اقتنع <span className="text-success">قبل</span> ما تبدأ
          </h2>
          {/* The intro describes a filtered archive — "sorted by topic for quick access"
              — which is true of /faq and false of three questions with no filter above
              them. Dropped in teaser mode rather than reworded: at three items the
              heading already says everything a subtitle would. */}
          {!isTeaser && (
            <p className="text-[14.5px] text-muted-foreground max-w-130 mx-auto leading-[1.7]">
              كل سؤال يجيك في بالك — مقسّم حسب الموضوع للوصول السريع.
            </p>
          )}
        </div>

        {/* Category filter chips — horizontal scroll on mobile, wrap on desktop.
            Hidden in teaser mode: three questions do not need a filter, and chips that
            jump within a three-item list are noise. */}
        {/* The negative margin and the inner padding have to stay equal to the section
            gutter, which is now 20px on mobile and 28px from md — otherwise the strip
            bleeds past the section edge on one side. */}
        {!isTeaser && groups.length > 1 && (
          <div className="mb-6 -mx-5 md:mx-0">
            <div className="flex md:flex-wrap items-center md:justify-center gap-2 overflow-x-auto md:overflow-visible px-5 md:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {groups.map(([tag, items]) => (
                <a
                  key={tag}
                  href={`#faq-group-${encodeURIComponent(tag)}`}
                  className="inline-flex shrink-0 items-center gap-1.5 bg-background border border-border hover:border-success/50 hover:bg-success/5 transition-colors text-[12px] font-medium text-foreground px-3 py-1.5 rounded-full snap-start"
                >
                  <span className="whitespace-nowrap">{tag}</span>
                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded-full">
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
              {/* The heading names a group so the chips above have somewhere to land. In
                  teaser mode there are no chips and usually one group, so it was labelling
                  a set of three with a category and a count the reader can see — furniture
                  for a room with one chair in it. No mono either: the tag is Arabic, and a
                  monospace face has no Arabic glyphs, so the letters stop joining. */}
              {!isTeaser && (
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="w-1 h-4 rounded-full bg-success" aria-hidden />
                  <span className="text-[12px] text-success font-bold">{tag}</span>
                  <span className="text-[11px] text-muted-foreground">
                    · {questionCount(items.length)}
                  </span>
                </div>
              )}
              <div className="rounded-2xl border border-border bg-background overflow-hidden divide-y divide-border">
                {items.map((item, i) => (
                  <details key={`${tag}-${i}`} name="faq" className="group px-5">
                    <summary className="flex w-full items-center justify-between gap-2.5 py-4 sm:py-5.5 text-start text-[clamp(13.5px,4vw,16px)] font-medium text-foreground text-balance cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span className="shrink-0 inline-block text-[22px] font-light leading-none text-muted-foreground group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    {/* font-normal, not font-light. Arabic carries more stroke detail per
                        character than Latin at the same size, so a light weight that reads
                        as elegant in Latin reads as faded here — and this is the body copy
                        the whole section exists to deliver. */}
                    <div className="text-[14.5px] text-muted-foreground leading-[1.85] whitespace-pre-line pb-5.5">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {isTeaser && (
          <div className="mt-6 text-center">
            <a
              href={moreHref}
              className="inline-flex items-center gap-2 rounded-xl border border-success/40 bg-success/8 px-5 py-3 text-[14px] font-bold text-success no-underline transition-colors hover:bg-success/15"
            >
              {/* The number is the pull: a reader weighing a subscription wants to know
                  the objections have been answered, and how many there are says that
                  faster than an adjective. */}
              شوف كل الأسئلة — {questionCount(faqs.length)} بإجابات صريحة
              <span aria-hidden>←</span>
            </a>
          </div>
        )}

        <div className="mt-8 text-center text-[13px] text-muted-foreground">
          ما لقيت إجابتك؟{" "}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            // Was a 20px inline link. `inline-flex` + `min-h-11` gives it a real target
            // without breaking the sentence it sits inside.
            className="inline-flex min-h-11 items-center px-1 text-success font-semibold no-underline border-b border-b-success/30"
          >
            تواصل معنا على واتساب ←
          </a>
        </div>
      </div>
    </section>
  );
}
