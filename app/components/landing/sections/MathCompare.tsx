import { ChevronDown, PiggyBank, Sparkles } from "lucide-react";
import type { Plan as DBPlan } from "@prisma/client";
import { CALC_ROLES } from "../calc-roles";
import { formatNum } from "../landing-helpers";

type Props = {
  visiblePlans: DBPlan[];
  currency: string;
};

/**
 * In-house-team vs Modonty cost comparison — a Server Component. Every number is
 * derived purely from visiblePlans + CALC_ROLES defaults, so it renders on the
 * server and ships no client JS at all. It used to hand its one interactive leaf
 * to a CalcSavingsButton island; that island and its modal were deleted after the
 * landing stopped rendering them, and nothing here needed replacing.
 */
export function MathCompare({ visiblePlans, currency }: Props) {
  const mathTeamMonthly = CALC_ROLES.reduce((sum, r) => sum + r.def, 0);
  const mathTeamAnnual = mathTeamMonthly * 12;
  const featuredPlan = visiblePlans.find(
    (p) => !!p.featuredBadge && p.featuredBadge.trim() !== "" && p.priceMonthly > 0,
  );
  const fallbackPaidPlan = visiblePlans.find((p) => p.priceMonthly > 0);
  const mathPlan = featuredPlan ?? fallbackPaidPlan;
  // priceYearly stores the monthly-equivalent on annual billing; annual total = × 12.
  const mathPlanMonthlyOnAnnual = mathPlan
    ? mathPlan.priceYearly > 0 ? mathPlan.priceYearly : mathPlan.priceMonthly
    : 0;
  const mathPlanAnnual = mathPlanMonthlyOnAnnual * 12;
  const mathPlanName = mathPlan?.name ?? "مدونتي";
  const mathSavePct = mathTeamAnnual > 0 && mathPlanAnnual > 0
    ? Math.round((1 - mathPlanAnnual / mathTeamAnnual) * 100)
    : 0;

  return (
    <section className="bg-background">
        <div className="max-w-270 mx-auto px-5 md:px-7 py-6 md:py-10">
          {/* Header */}
          <div className="text-center mb-5 md:mb-8">
            <div className="inline-flex flex-wrap justify-center text-center items-center gap-2 text-[11px] text-success mb-3 bg-success/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              قارن بنفسك
            </div>
            <h2 className="text-balance text-[clamp(20px,5.6vw,36px)] font-semibold mb-3">
              محتوى جوجل يحتاج <span className="text-success">فريق كامل</span>
            </h2>
            <p className="text-[14.5px] text-muted-foreground leading-[1.7] max-w-140 mx-auto truncate md:whitespace-normal">
              <span className="md:hidden">٦ وظائف — أو اشتراك واحد</span>
              <span className="hidden md:inline">ست وظائف مختلفة — أو اشتراك واحد يعمل نفس شغلهم.</span>
            </p>
            <p className="hidden md:block text-[11.5px] text-muted-foreground/70 mt-2">
              الأرقام بعملتك المحلية · تُطبَّق على السوق السعودي والمصري
            </p>
          </div>

          {/* MOBILE — one compact verdict card. Team row is a native collapse:
              closed = annual+monthly verdict; open = the 6-role breakdown
              inline (Khalid 2026-07-15). */}
          <div className="md:hidden rounded-2xl border border-border bg-card p-5">
            <details className="group pb-3.5 border-b border-b-border/60">
              <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                {/* Line 1 — one short line only */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-medium text-foreground truncate">توظّف الفريق بنفسك</span>
                  <ChevronDown className="w-4 h-4 text-success shrink-0 animate-bounce group-open:animate-none group-open:rotate-180" strokeWidth={2.5} aria-hidden />
                </div>
                {/* Line 2 — numbers */}
                <div className="mt-2 flex items-baseline gap-2">
                  <bdi className="text-[clamp(18px,5vw,23px)] font-bold text-destructive leading-none">{formatNum(mathTeamAnnual)}</bdi>
                  <span className="text-[10px] text-muted-foreground">سنوياً</span>
                  <span className="text-muted-foreground/40 text-[10px]">·</span>
                  <bdi className="text-[13px] font-semibold text-foreground">{formatNum(mathTeamMonthly)}</bdi>
                  <span className="text-[10px] text-muted-foreground">شهرياً</span>
                </div>
              </summary>
              <ul className="mt-3 space-y-1.5 rounded-xl bg-background/50 border border-border/50 p-3">
                {CALC_ROLES.map((r) => (
                  <li key={r.key} className="flex items-center justify-between gap-2 pb-1.5 border-b border-b-border/40 last:border-b-0 last:pb-0">
                    <span className="flex items-center gap-2 min-w-0">
                      <r.icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="text-[12px] text-foreground truncate">{r.label}</span>
                    </span>
                    {/* `tabular-nums`, not `font-mono`. Six salary figures stacked in a
                        column want equal digit widths — that is all the mono face was
                        actually buying, and it cost the Arabic labels beside them. */}
                    <span className="text-[12px] text-muted-foreground shrink-0 tabular-nums"><bdi>{formatNum(r.def)}</bdi></span>
                  </li>
                ))}
              </ul>
            </details>
            <div className="pt-3.5">
              {/* Line 1 — one short line only */}
              <div className="text-[13.5px] font-semibold text-foreground truncate">اشتراك مدونتي — {mathPlanName}</div>
              {/* Line 2 — numbers */}
              <div className="mt-2 flex items-baseline gap-2">
                <bdi className="text-[clamp(20px,5.6vw,26px)] font-bold text-success leading-none">{formatNum(mathPlanAnnual)}</bdi>
                <span className="text-[10px] text-muted-foreground">سنوياً</span>
                <span className="text-muted-foreground/40 text-[10px]">·</span>
                <bdi className="text-[13px] font-semibold text-foreground">{formatNum(mathPlanMonthlyOnAnnual)}</bdi>
                <span className="text-[10px] text-muted-foreground">شهرياً</span>
              </div>
            </div>
          </div>

          {/* DESKTOP — two detailed cards side-by-side */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-4 items-stretch">
            {/* Card 1 — Internal team */}
            <div className="rounded-2xl border border-border bg-card p-5 flex flex-col">
              <div className="mb-4 flex items-start gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-foreground font-semibold text-[13px] shrink-0">١</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-semibold text-foreground leading-tight">توظّف الفريق بنفسك</div>
                  <div className="mt-1.5 inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-[11px] font-bold px-2 py-0.5 rounded-md">
                    <span className="w-1 h-1 rounded-full bg-destructive" aria-hidden />
                    الحد الأدنى للرواتب
                  </div>
                </div>
              </div>

              <ul className="space-y-2 mb-4 flex-1">
                {CALC_ROLES.map((r) => (
                  <li key={r.key} className="flex items-center justify-between gap-2 pb-1.5 border-b border-b-border/50 last:border-b-0 last:pb-0">
                    <span className="flex items-center gap-2 min-w-0">
                      <r.icon className="w-4 h-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="text-[12.5px] text-foreground truncate">{r.label}</span>
                    </span>
                    <span className="text-[12.5px] text-muted-foreground shrink-0 tabular-nums">
                      <bdi>{formatNum(r.def)}</bdi>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t-2 border-t-border mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Yearly (primary — right in RTL) */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" aria-hidden />
                      <span className="text-[11px] text-destructive font-bold">سنوياً</span>
                    </div>
                    <div className="text-[clamp(17px,4.6vw,24px)] md:text-[26px] font-bold text-destructive leading-none">
                      <bdi>{formatNum(mathTeamAnnual)}</bdi>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1.5">بعملتك المحلية</div>
                  </div>
                  {/* Monthly (secondary — left in RTL) */}
                  <div className="border-r border-r-border/60 pr-4">
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden />
                      <span className="text-[11px] text-muted-foreground">شهرياً</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-semibold text-foreground leading-none">
                      <bdi>{formatNum(mathTeamMonthly)}</bdi>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider "أو" — vertical, between the two desktop cards.
                It used to carry a full mobile-first variant set (`flex md:flex-col`,
                `h-px w-full` before `md:h-full md:w-px`, `py-1 md:py-0`) describing a
                horizontal rule for phones. It is a direct child of the `hidden md:grid`
                row above, so none of those base values ever applied — the mobile card
                has its own divider. Written for the one viewport it renders at. */}
            <div className="flex flex-col items-center justify-center gap-2 px-1">
              <div className="h-full w-px flex-1 bg-border" />
              <span className="bg-background px-3 py-1 text-[13px] font-bold text-muted-foreground shrink-0">أو</span>
              <div className="h-full w-px flex-1 bg-border" />
            </div>

            {/* Card 2 — Modonty subscription */}
            <div className="rounded-2xl border-2 border-success bg-gradient-to-br from-success/[0.10] to-success/[0.02] p-5 md:shadow-[0_24px_50px_-22px_color-mix(in_oklch,var(--success)_40%,transparent)] relative flex flex-col">
              <span className="absolute -top-3 right-5 bg-success text-success-foreground text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" strokeWidth={2.5} aria-hidden />
                الأذكى
              </span>

              <div className="mb-4 flex items-center gap-2.5">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-success text-success-foreground font-semibold text-[13px] shrink-0">٢</span>
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold text-foreground leading-tight truncate">اشتراك مدونتي — {mathPlanName}</div>
                  <div className="text-[11.5px] text-muted-foreground">كل شغل الفريق · بلا صداع توظيف</div>
                </div>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                {[
                  "مقالات سيو محسّنة لجوجل",
                  "تصميم صور ومحتوى بصري",
                  "متابعة الترتيب لايف",
                  "لوحة تحكم · تقارير · اعتماد بضغطة",
                ].map((line, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] text-foreground leading-[1.55]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 mt-0.5">
                      <path d="M5 12.5l5 5L20 7" />
                    </svg>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3 border-t-2 border-t-success/30 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                  {/* Yearly (primary — right in RTL) */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden />
                      <span className="text-[11px] text-success font-bold">سنوياً</span>
                    </div>
                    <div className="text-[clamp(17px,5.4vw,28px)] md:text-[32px] font-bold text-success leading-none">
                      <bdi>{formatNum(mathPlanAnnual)}</bdi>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1.5">بعملتك المحلية</div>
                  </div>
                  {/* Monthly (secondary — left in RTL) */}
                  <div className="border-r border-r-success/30 pr-4">
                    <div className="inline-flex items-center gap-1.5 mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" aria-hidden />
                      <span className="text-[11px] text-muted-foreground">شهرياً</span>
                    </div>
                    <div className="text-[18px] md:text-[20px] font-semibold text-foreground leading-none">
                      <bdi>{formatNum(mathPlanMonthlyOnAnnual)}</bdi>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings pill + CTA — single row on desktop */}
          {mathTeamAnnual > mathPlanAnnual && mathPlanAnnual > 0 && (
            <div className="mt-5 md:mt-8 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4">
              <div className="inline-flex items-center gap-2 bg-success/15 border border-success/40 text-success text-[14px] font-semibold px-4 py-2.5 rounded-full">
                <PiggyBank className="w-4 h-4" strokeWidth={2} aria-hidden />
                <span>
                  توفير <bdi className="font-bold">{formatNum(mathTeamAnnual - mathPlanAnnual)}</bdi>
                  <span className="text-success/80 mx-1.5">·</span>
                  {mathSavePct}٪
                </span>
              </div>

              {/* The "calculate it yourself" button is gone: this component now renders
                  only on /cost-comparison, where the calculator sits open on the page
                  directly below. A button that opens a dialog to reveal something already
                  visible two screens down is a step that costs a click and gives nothing. */}
            </div>
          )}

          <p className="mt-4 text-center text-[12px] text-muted-foreground max-w-130 mx-auto leading-[1.7] truncate md:whitespace-normal">
            <span className="md:hidden">المقالات ملكك للأبد — حتى بعد الإلغاء</span>
            <span className="hidden md:inline">المقالات ملكك للأبد — حتى لو ألغيت الاشتراك، تظل في موقعك تجيب لك زوّار.</span>
          </p>
        </div>
      </section>
  );
}