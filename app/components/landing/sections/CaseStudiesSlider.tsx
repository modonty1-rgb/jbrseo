import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ClientCaseStudyStats } from "@/lib/analytics/ga4";
import { GAMark } from "@/app/components/icons/GAMark";
import { toArabicDigits, buildCaseStudies } from "../landing-helpers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/app/components/ui/carousel";
import type { ModontyImpactStats } from "@/lib/analytics/ga4";
import { ModontyImpactBar } from "./ModontyImpactBar";

type Props = {
  caseStats: Record<string, ClientCaseStudyStats> | null;
  clientsCount: number;
  /** Platform-wide totals, rendered bare at the foot of this section. */
  impact?: ModontyImpactStats | null;
};

export function CaseStudiesSlider({ caseStats, clientsCount, impact }: Props) {
  const studies = buildCaseStudies(caseStats);

  return (
    <section id="case-study" className="bg-background">
      <div className="max-w-270 mx-auto px-5 md:px-7 py-6 md:py-10">
        {/* Not a centred marketing header — a claim on the right and its provenance on
            the left.
            This section's whole job is that the numbers are audited rather than written,
            so the header is shaped like an attestation instead of a headline: the reader
            arrives at the entry point (top-right in RTL) on the claim, sweeps left, and
            lands on the source that backs it. Centred, the claim sat above its own
            evidence buried mid-sentence in a caption — the heatmap reference's exact
            warning against burying a number inside prose. */}
        <div className="mb-6 grid items-end gap-5 md:mb-10 md:grid-cols-[1fr_auto]">
          <div>
            {/* The old heading was "نتائج تشوفها — مش وعود", two problems in five words.
                "مش" is Egyptian; every visitor of every country reads one Saudi copy, so
                it was the wrong dialect for all of them. And "وعود" already carries the
                Features heading two sections up — "نبني حضورك — لا نبيع وعود" — so a
                reader scanning headings met the same sentence twice and stopped scanning.
                This says the thing no competitor's landing can: we did not write these. */}
            <h2 className="text-balance text-[clamp(22px,6vw,38px)] font-semibold leading-[1.3]">
              ما كتبنا الأرقام — <span className="text-success">جوجل قاسها</span>
            </h2>
            <p className="mt-3 max-w-140 text-[14.5px] leading-[1.75] text-muted-foreground">
              ثلاث قصص من ثلاثة قطاعات، مسحوبة من حساب التحليلات لكل عميل — بإذنه، وبأرقامه هو.
            </p>
          </div>

          {/* The provenance, stripped of its chrome.
              Boxed, it was the only bordered object in the header — 252px of card beside
              an unbordered 752px heading — so the eye landed on the footnote before the
              claim. A rule on the start edge marks it as an aside without giving it the
              weight of a card, and the heading takes the header back.
              The "٩٠ يوم" row is gone too: the window is already stated on the client
              chip, under the hero number, and on the after-card badge. It was said
              fourteen times in one screen, and this was the fourth place a reader met it
              before seeing a single result. */}
          <div className="border-s-2 border-s-success/40 ps-4 md:w-60">
            <div className="flex items-center gap-2">
              <GAMark className="size-4 shrink-0" />
              <span className="text-[12px] font-bold text-foreground">مصدر الأرقام</span>
            </div>
            <dl className="mt-2.5 space-y-2">
              {[
                clientsCount > 0
                  ? { v: `${toArabicDigits(clientsCount)}+`, k: "نشاط يستخدم المنصة" }
                  : null,
                { v: null, k: "بإذن كل عميل · رقم خاصية موثّق" },
              ]
                .filter((r): r is { v: string | null; k: string } => r !== null)
                .map((r) => (
                  <div key={r.k} className="flex items-baseline gap-2.5">
                    <dt className="flex w-8 shrink-0 justify-end">
                      {r.v ? (
                        // LTR on the figure: a count never mirrors, whatever the page
                        // direction.
                        <span dir="ltr" className="text-[17px] font-bold leading-none text-success">
                          {r.v}
                        </span>
                      ) : (
                        <Check className="size-4 text-success" strokeWidth={3} aria-hidden />
                      )}
                    </dt>
                    <dd className="text-[12px] leading-[1.6] text-muted-foreground">{r.k}</dd>
                  </div>
                ))}
            </dl>
            {/* The product name in Latin, on its own line at the foot — never inside an
                Arabic sentence, where a mid-line script switch breaks the reading. */}
            <p className="mt-2.5 text-[11.5px] leading-[1.6] text-muted-foreground">
              تحليلات جوجل — Google Analytics 4
            </p>
          </div>
        </div>

        <Carousel opts={{ direction: "rtl", align: "start", loop: true }}>
          <CarouselContent>
            {studies.map((c, ci) => (
              <CarouselItem key={ci}>
                {/* Client header */}
                <div className="flex items-center justify-between max-w-220 mx-auto mb-4 md:mb-6 flex-wrap gap-3">
                  <div>
                    <div className="text-[20px] font-semibold text-foreground">{c.name}</div>
                    <div className="text-[13px] text-muted-foreground mt-0.5">{c.industry}</div>
                  </div>
                  {/* No `font-mono` on the label, and Eastern numerals on the day count.
                      It read "طب الأسنان · 90 يوماً" — Western digits beside the Eastern
                      ones used everywhere else in the same card — and the monospace face
                      pulled the joined Arabic letters apart. */}
                  <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 text-[11.5px] text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span>{c.tag} · {toArabicDigits(c.daysActive)} يوماً فقط</span>
                  </div>
                </div>

                {/* Mobile-only position counter. The arrows are `hidden md:inline-flex`
                    because a phone swipes — but nothing on the phone said there was
                    anything to swipe to, so two of three client stories sat behind a
                    gesture no one had a reason to make. Static text, so it costs the
                    server component nothing and needs no carousel API. */}
                {studies.length > 1 && (
                  <div className="md:hidden max-w-220 mx-auto -mt-2 mb-3 text-[12px] text-muted-foreground">
                    قصة {toArabicDigits(ci + 1)} من {toArabicDigits(studies.length)} — اسحب لبقية القصص
                  </div>
                )}

                {/* Before → After → result, three cards in one row.
                    Stacked, the headline number sat a full card-height above the two it
                    was the conclusion of, so a reader met the answer, then the working,
                    then had to climb back. Side by side the row reads as the sequence it
                    is — right to left in Arabic: what it was, what it became, what that
                    came to — and the section loses the ~220px the stacked hero cost.
                    Desktop only for the two detail cards (Khalid 2026-07-15: mobile
                    client sees the ONE big number, zero technical rows — details confuse
                    and create liability), so on a phone the hero is simply the whole row. */}
                <div className="max-w-220 mx-auto mb-4 md:mb-8 grid gap-3 md:grid-cols-3 md:gap-5 md:items-stretch">
                  {/* BEFORE — desktop only, per the decision above.
                      A `md:hidden` mobile summary used to live here — "قبل الاشتراك · لا
                      ظهور · لا زوّار · لا مبيعات" — nested inside this `hidden md:block`
                      parent, so it rendered at no viewport at all: hidden below md by the
                      parent, hidden above md by itself. Deleted rather than lifted out,
                      because the same decision that hides this card is what it contradicts.
                      The inner desktop wrapper went with it: everything in here is already
                      desktop-only. */}
                  <div className="hidden md:block bg-card border border-border rounded-xl md:rounded-2xl md:p-6">
                    <div>
                      {/* One label, not two.
                          `c.startDate` holds the string "قبل الاشتراك" — it is a label,
                          not a date — so this row printed the same three words twice,
                          once at each end of the same line. */}
                      <div className="mb-3 text-[11.5px] text-muted-foreground md:mb-5">قبل الاشتراك</div>
                      <div className="space-y-3">
                        {[
                          // Spelled out, not "٠".
                          // Digitising this column to escape the monospace face cost the
                          // card its argument: a lone ٠ rendered 9px wide in muted grey,
                          // so "everything was zero" became four specks nobody sees. The
                          // word is legible at a glance, and four of them stacked are the
                          // point of the card. The face is the text face, not mono —
                          // which is why the digit was reached for in the first place.
                          { label: "ظهور في جوجل", value: "صفر" },
                          { label: "مقالات منشورة", value: "صفر" },
                          { label: "زوّار عضوي", value: "صفر" },
                          { label: "إعلانات مدفوعة", value: "صفر" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between pb-2.5 border-b border-b-border last:border-b-0 last:pb-0">
                            <span className="text-[13px] text-muted-foreground">{row.label}</span>
                            <span className="text-[15px] font-bold text-foreground/80">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RESULT — the one big proof number, in the middle of the row.
                      Between the two states rather than after them: the green card is the
                      only saturated block in the row, so at the centre it is what the eye
                      fixes on first and the two neutral cards read as its supporting
                      evidence on either side. It is also the only card on a phone, where
                      the two detail cards are hidden. */}
                  <div className="order-first flex flex-col items-center justify-center rounded-2xl border-2 border-success/30 bg-gradient-to-br from-success/10 to-transparent p-5 text-center md:order-none md:p-6">
                    {/* Smaller than the 96px it was: at a third of the width that size
                        wrapped, and a number that wraps stops being one number. */}
                    {/* Every figure in this card comes back from `toArabicDigits` /
                        `formatPct` — Eastern numerals, and «٪», and «٠ ر.س». A monospace
                        stack carries none of those, so the browser was substituting a
                        different face inside the page's largest numbers. */}
                    <div className="text-[clamp(45px,13.8vw,72px)] font-semibold leading-none text-success md:text-[64px]">
                      {c.heroStat.big}
                    </div>
                    <div className="mt-3 text-[17px] font-semibold leading-[1.4] text-foreground text-balance">
                      {c.heroStat.label}
                    </div>
                    <div className="mt-1.5 text-[12.5px] leading-[1.6] text-muted-foreground">
                      {c.heroStat.sub}
                    </div>
                  </div>

                  {/* AFTER */}
                  <div className="hidden md:block bg-foreground text-background border border-foreground rounded-2xl p-4 md:p-6 md:shadow-[0_24px_50px_-22px_color-mix(in oklch, var(--foreground) 50%, transparent)] relative">
                    {/* `-top-2.75` and `end-5`: the badge hangs off the card's top edge on
                        the start side, which is the right in Arabic — `right-*` pinned it
                        physically and would land on the wrong corner in LTR. */}
                    <span className="absolute -top-2.75 start-5 md:start-6 bg-success text-success-foreground text-[10.5px] font-semibold px-2.5 py-1 rounded-full">
                      بعد {toArabicDigits(c.daysActive)} يوم
                    </span>
                    <div className="flex items-center justify-between mb-3 md:mb-5">
                      {/* `c.endDate` dropped, not restyled. It holds "آخر ٩٠ يوم" — the
                          same window the green badge pinned to the top of this very card
                          already states as "بعد ٩٠ يوم". Two labels for one fact, a
                          hand's width apart. */}
                      <div className="text-[11.5px] text-background/70">بعد الاشتراك</div>
                    </div>
                    <div className="space-y-3">
                      {/* Rows 3 and 4 used to carry `i > 1 ? "hidden md:flex" : "flex"` to
                          trim this list on a phone, and `row.sub` a `hidden md:block` for
                          the same reason. Both are inside a card that is itself
                          `hidden md:block`, so neither ever decided anything — plain `flex`
                          and plain visibility say the same thing without implying a mobile
                          layout that does not exist. */}
                      {c.after.map((row, i) => (
                        <div key={i} className="flex items-center justify-between pb-2.5 border-b border-b-background/10 last:border-b-0 last:pb-0">
                          <div>
                            <div className="text-[13px] text-background/70">{row.label}</div>
                            {row.sub && <div className="text-[11px] leading-[1.6] text-success mt-0.5">{row.sub}</div>}
                          </div>
                          <span className="text-[20px] font-semibold text-background">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Engagement quality strip — one unified stat bar (bank-app style):
                    single border, hairline column dividers, value over label. */}
                {/* Two columns on a phone, four from md.
                    Four columns of a 304px screen left 67px of text room per cell, and the
                    label was dropped to 9px to survive it — Arabic at 9px loses its dots
                    and its joins, which is most of how the script is read. Two columns buy
                    back double the width, which pays for a 12px label and lets the
                    benchmark line («متوسط الصناعة ٥٠٪») come back: without it «٧٩٪» is a
                    number with nothing to be better than.

                    `divide-x` drew no rule between the two rows the 2-column layout creates.
                    Every cell carries its own start and bottom rule instead, pulled 1px
                    outward so the grid's outer edges land under `overflow-hidden` and only
                    the internal lines survive — one rule that works at both column counts,
                    in either text direction, with no nth-child arithmetic. */}
                <div className="max-w-220 mx-auto bg-card border border-border rounded-xl md:rounded-2xl grid grid-cols-2 md:grid-cols-4 overflow-hidden">
                  {c.quality.map((s, i) => (
                    <div key={i} className="-ms-px -mb-px border-s border-b border-border/60 px-2 py-3 md:p-4 text-center flex flex-col items-center justify-center gap-1 min-w-0">
                      <div className="text-[17px] md:text-[26px] font-semibold text-success leading-none whitespace-nowrap">{s.v}</div>
                      <div className="text-[12px] text-foreground font-medium leading-[1.4] text-balance">{s.k}</div>
                      {/* 1.6, not `leading-tight`. This caption wraps, and at 1.25 the
                          diacritics of one Arabic line sit on the ascenders of the next. */}
                      {/* 11.5px, not 10.5. At two columns each cell now has ~145px, so the
                          size that was forced by a four-column strip is no longer the
                          constraint — and «متوسط الصناعة ٥٠٪» is the line that gives the
                          number above it a meaning. */}
                      <div className="text-[11.5px] text-muted-foreground mt-0.5 leading-[1.6]">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation — flanking the cards, not stacked in a row beneath them.
              Under the slide the pair cost a 68px band and sat after the content it
              moves, so a reader finished the story before learning there were two more.
              Beside it, the control is where the thing it controls is.
              Placed inside the carousel's own box rather than outside it: the slide is
              1024px wide and the card row 880, which leaves a 72px gutter each side — the
              44px button fits with room to spare, while the container itself has only
              28px outside, so the default `-start-12` would have hung off the page.
              Hidden below `md`, where a phone swipes instead. */}
          <CarouselPrevious className="hidden md:inline-flex h-11 w-11 start-1 bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
          <CarouselNext className="hidden md:inline-flex h-11 w-11 end-1 bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
        </Carousel>

        {/* The attribution line that used to sit here — "الأرقام من Google Analytics 4 ·
            Property ID موثّق · بإذن كل عميل" — is gone: every word of it is now in the
            source panel at the head of the section, where a sceptic reads it before the
            numbers instead of after. It also carried two Latin runs inside an Arabic
            sentence, which is the mid-line script switch the reading breaks on. */}

        {/* The platform-wide totals, inside this section instead of below it as their own.
            Three client stories then the sum of all clients is one argument in two
            resolutions — and it reads as one now, under one heading, saving the second
            heading and a second set of section padding. */}
        {impact && (
          <div className="mt-10 border-t border-t-border pt-8">
            <ModontyImpactBar impact={impact} bare />
          </div>
        )}
      </div>
    </section>
  );
}
