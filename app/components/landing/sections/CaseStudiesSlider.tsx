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

type Props = {
  caseStats: Record<string, ClientCaseStudyStats> | null;
  clientsCount: number;
};

export function CaseStudiesSlider({ caseStats, clientsCount }: Props) {
  const studies = buildCaseStudies(caseStats);

  return (
    <section id="case-study" className="bg-background">
      <div className="max-w-270 mx-auto px-7 py-8 md:py-14">
        <div className="text-center mb-5 md:mb-10">
          <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 font-mono text-[11px] text-success tracking-[1px] mb-3 bg-success/10 px-3 py-1.5 rounded-full">
            <GAMark className="w-3.5 h-3.5 shrink-0" />
            أرقام حقيقية من Google Analytics<span className="hidden md:inline"> · آخر ٩٠ يوم</span>
          </div>
          <h2 className="text-balance text-[clamp(20px,6vw,38px)] font-semibold tracking-[-1px] mb-3">
            نتائج تشوفها — <span className="text-success">مش وعود</span>
          </h2>
          {/* Mobile brevity (NN/g): the eyebrow + H2 carry the message — the
              longer intro reads on desktop only. */}
          <p className="hidden md:block text-base text-muted-foreground max-w-160 mx-auto leading-[1.75]">
            {clientsCount > 0 ? (
              <>
                من أصل <span className="font-semibold text-foreground">{toArabicDigits(clientsCount)}+ نشاط سعودي وعربي</span> يستخدم منصتنا — هذي ٣ قصص بأرقام مقاسة من GA4 مباشرة، بإذن كل عميل.
              </>
            ) : (
              <>ثلاث قصص من ثلاثة قطاعات — كل رقم مقاس من GA4 مباشرة، بإذن كل عميل.</>
            )}
          </p>
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
                  <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 font-mono text-[11px] text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span>{c.tag} · {c.daysActive} يوماً فقط</span>
                  </div>
                </div>

                {/* HERO STAT — the one big proof number for this client */}
                <div className="max-w-220 mx-auto mb-3 md:mb-6 bg-gradient-to-br from-success/10 to-transparent border-2 border-success/30 rounded-2xl p-5 md:p-8 text-center">
                  <div className="font-mono text-[clamp(45px,13.8vw,72px)] md:text-[96px] font-semibold text-success leading-none tracking-[-3px]">
                    {c.heroStat.big}
                  </div>
                  <div className="text-[18px] md:text-[20px] font-semibold text-foreground mt-3">
                    {c.heroStat.label}
                  </div>
                  <div className="text-[13px] text-muted-foreground mt-1.5">
                    {c.heroStat.sub}
                  </div>
                </div>

                {/* Before ← → After — desktop only (Khalid 2026-07-15: mobile client
                    sees the ARTICLES + the ONE big impact number, zero technical
                    detail rows — details confuse and create liability). */}
                <div className="max-w-220 mx-auto mb-4 md:mb-8 hidden md:grid md:grid-cols-2 md:gap-6 space-y-3 md:space-y-0">
                  {/* BEFORE — compact horizontal strip on mobile, full card on desktop */}
                  <div className="bg-card border border-border rounded-xl md:rounded-2xl md:p-7">
                    {/* Mobile: single-row clear summary */}
                    <div className="md:hidden px-4 py-3 flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-muted-foreground tracking-[.5px] shrink-0">
                        <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                        قبل الاشتراك
                      </span>
                      <span className="text-[12.5px] text-muted-foreground leading-snug">
                        لا ظهور · لا زوّار · لا مبيعات
                      </span>
                    </div>
                    {/* Desktop: full detailed card */}
                    <div className="hidden md:block">
                      <div className="flex items-center justify-between mb-3 md:mb-5">
                        <div className="font-mono text-[11px] text-muted-foreground tracking-[1px]">قبل الاشتراك</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{c.startDate}</div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "ظهور في جوجل", value: "صفر" },
                          { label: "مقالات منشورة", value: "٠" },
                          { label: "زوّار عضوي", value: "٠" },
                          { label: "إعلانات مدفوعة", value: "٠ ر.س" },
                        ].map((row, i) => (
                          <div key={i} className="flex items-center justify-between pb-2.5 border-b border-b-border last:border-b-0 last:pb-0">
                            <span className="text-[13px] text-muted-foreground">{row.label}</span>
                            <span className="font-mono text-[15px] font-semibold text-muted-foreground">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AFTER */}
                  <div className="bg-foreground text-background border border-foreground rounded-2xl p-4 md:p-7 md:shadow-[0_24px_50px_-22px_color-mix(in oklch, var(--foreground) 50%, transparent)] relative">
                    <span className="absolute -top-[11px] right-5 md:right-7 bg-success text-success-foreground text-[10.5px] font-semibold px-2.5 py-1 rounded-full tracking-[.3px]">
                      بعد {toArabicDigits(c.daysActive)} يوم
                    </span>
                    <div className="flex items-center justify-between mb-3 md:mb-5">
                      <div className="font-mono text-[11px] text-background/70 tracking-[1px]">بعد الاشتراك</div>
                      <div className="font-mono text-[11px] text-background/70">{c.endDate}</div>
                    </div>
                    <div className="space-y-3">
                      {/* Mobile shows the top 2 rows only (hero stat already carries
                          the headline number) — full detail on desktop. */}
                      {c.after.map((row, i) => (
                        <div key={i} className={cn(
                          "items-center justify-between pb-2.5 border-b border-b-background/10 last:border-b-0 last:pb-0",
                          i > 1 ? "hidden md:flex" : "flex",
                        )}>
                          <div>
                            <div className="text-[13px] text-background/70">{row.label}</div>
                            {row.sub && <div className="hidden md:block text-[10.5px] text-success font-mono mt-0.5">{row.sub}</div>}
                          </div>
                          <span className="font-mono text-[20px] font-semibold text-background">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Engagement quality strip — one unified stat bar (bank-app style):
                    single border, hairline column dividers, value over label. */}
                <div className="max-w-220 mx-auto bg-card border border-border rounded-xl md:rounded-2xl grid grid-cols-4 divide-x divide-x-reverse divide-border/60">
                  {c.quality.map((s, i) => (
                    <div key={i} className="px-1 py-3 md:p-4 text-center flex flex-col items-center justify-center gap-1 min-w-0">
                      <div className="font-mono text-[15px] md:text-[26px] font-semibold text-success tracking-[-.5px] leading-none whitespace-nowrap">{s.v}</div>
                      <div className="text-[9px] md:text-[12px] text-muted-foreground md:text-foreground font-medium leading-[1.3] text-balance">{s.k}</div>
                      <div className="hidden md:block text-[10.5px] text-muted-foreground mt-0.5 leading-tight">{s.sub}</div>
                    </div>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation — built-in shadcn buttons; they self-manage their
              disabled state via the carousel context. Overridden from the default
              absolute placement to sit in a centered row under the cards. */}
          <div className="flex items-center justify-center gap-4 mt-6 md:mt-10">
            <CarouselPrevious className="static h-11 w-11 translate-y-0 start-auto end-auto bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
            <CarouselNext className="static h-11 w-11 translate-y-0 start-auto end-auto bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground" />
          </div>
        </Carousel>

        <div className="text-center mt-4 md:mt-6 flex flex-col items-center gap-2">
          <div className="inline-flex items-center gap-2 text-[12px] text-muted-foreground">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12.5l5 5L20 7" />
            </svg>
            <span>الأرقام من Google Analytics 4 · Property ID موثّق · بإذن كل عميل</span>
          </div>
        </div>
      </div>
    </section>
  );
}
