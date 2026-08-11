import Link from "next/link";
import { ArrowLeft, Calculator, Check, ChevronDown, Store, TrendingDown, Users } from "lucide-react";
import type { Plan as DBPlan } from "@prisma/client";
import { CALC_ROLES } from "../calc-roles";
import { formatPrice, toArabicDigits } from "../landing-helpers";

type Props = {
  visiblePlans: DBPlan[];
  currency: string;
};

/**
 * What is left on the landing of the full cost comparison.
 *
 * The comparison itself ran 810px directly above the prices — six salary rows, a plan
 * card and a calculator, all arguing a point before the reader had seen a number. The
 * argument still needs making, but it needs one line to make it: the annual cost of
 * hiring, next to the annual cost of not.
 *
 * The figures are computed exactly as the full page computes them, from the same roles
 * and the same plan, so the hook can never quote a number the page then contradicts.
 * Anyone who wants the breakdown follows the link; the reader who only needed the
 * headline has it in a second instead of a screen.
 */
export function CostHook({ visiblePlans, currency }: Props) {
  const teamAnnual = CALC_ROLES.reduce((sum, r) => sum + r.def, 0) * 12;

  const featured = visiblePlans.find(
    (p) => !!p.featuredBadge && p.featuredBadge.trim() !== "" && p.priceMonthly > 0,
  );
  const plan = featured ?? visiblePlans.find((p) => p.priceMonthly > 0);
  // `priceYearly` holds the monthly-equivalent on annual billing.
  const planAnnual = plan ? (plan.priceYearly > 0 ? plan.priceYearly : plan.priceMonthly) * 12 : 0;

  // Without a priced plan there is no comparison to promise — render nothing rather
  // than a half-sentence with a missing side.
  if (!plan || planAnnual <= 0 || teamAnnual <= 0) return null;

  const savePct = Math.round(((teamAnnual - planAnnual) / teamAnnual) * 100);

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-230 px-5 md:px-7 py-5 md:py-6">
        {/* The whole comparison folds behind its own conclusion.
            The section's job is a single number — how much the subscription saves against
            six salaries — and it spent 734px on a phone getting there. The saving is the
            headline now, and the working is one tap away for anyone who doubts it, which
            is exactly who the six role pills and the two totals were written for.

            `savePct`, not a literal 95: the figure is computed from `CALC_ROLES` and the
            plan's price, so a price change in the database has to move the headline with
            it. Printing "٩٥٪" here would be true today and quietly false later. */}
        {/* The collapsed bar needs to look like something. Folded, this section was a line
            of text on the page's own background with no border and no fill — Khalid
            scrolled straight past the one number the section exists to deliver. A green
            tinted card with a border reads as a block worth stopping at, and it matches
            the answer card inside, which is dressed the same way.
            `TrendingDown`, not `PiggyBank`: the savings-jar was already rejected once in
            this file — see the note on the Users icon below — because it pictures neither
            the team nor the cost. A falling line pictures the cost. */}
        <details className="md-always-open group rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[.10] to-success/[.02] px-4 py-3 md:border-0 md:bg-none md:p-0">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2.5 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
              <TrendingDown className="size-5" strokeWidth={2.4} aria-hidden />
            </span>
            {/* «عليك» dropped so the percentage stays on the heading's line. On a narrow
                phone the extra word pushed «٩٥٪» to a second line, which separates the
                number from the claim it belongs to — and the number IS the claim.
                `whitespace-nowrap` on the figure guarantees it never breaks off on its own
                even if the wording grows again. */}
            <h2 className="min-w-0 text-[clamp(15px,4.4vw,22px)] font-bold leading-[1.35] text-foreground">
              مدونتي توفّر <span dir="ltr" className="whitespace-nowrap text-success">{toArabicDigits(savePct)}٪</span>
            </h2>
            {/* «تعال نحسبها», not «التفاصيل».
                The generic label says a panel opens; it does not say why anyone would open
                it. This section's claim is a number a reader has every reason to doubt, so
                the invitation is to check the arithmetic — which is exactly what is inside:
                six salaries, two totals, and a link to recompute them. A label that names
                the payoff is the difference between a disclosure and a hook. */}
            <span className="fold-caret ms-auto inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-success">
              <span className="group-open:hidden">تعال نحسبها</span>
              <span className="hidden group-open:inline">إخفاء الحساب</span>
              <ChevronDown className="size-3.5 animate-bounce motion-reduce:animate-none" strokeWidth={3} aria-hidden />
            </span>
          </summary>

        <div className="mt-4">
        {/* Two cards, not one row.
            One card held both halves of a comparison, so the six salaries and the
            subscription ran together in a single sentence and the reader had to separate
            them. Two cards let the eye do the comparing — the shape says "this against
            that" before a word is read. The problem takes the right, the entry side in
            RTL; the answer takes the left, where the sweep ends. */}
        {/* The two cards being compared, full width between them. */}
        <div className="grid gap-3 md:grid-cols-2 md:items-stretch">
          {/* Right — the cost of doing it in-house, split the same way as its neighbour.
              Both cards now read as [what it is | what it costs], so the two halves line
              up across the pair and the eye compares like with like instead of hunting a
              number in a different place on each card. */}
          {/* Red at exactly the weight the other card is green — same border width, same
              tint stops. The two sides of a comparison have to be dressed identically or
              the styling itself argues one of them, and a neutral grey card beside a
              bordered green one reads as the loser before a number is read. Here the
              colour carries the meaning instead: red is the cost, green is the answer. */}
          <div className="grid h-full overflow-hidden rounded-2xl border-2 border-destructive/40 bg-gradient-to-br from-destructive/[.10] to-destructive/[.02] sm:grid-cols-[1fr_auto]">
            {/* Half one — the six posts. */}
            <div className="flex flex-col px-5 py-4">
              <div className="flex items-center gap-3">
                {/* `Users`, not a piggy bank. The card is about six people on a payroll;
                    a savings-jar icon illustrated neither the team nor the cost, and read
                    as decoration in a place that had to carry meaning. */}
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                  <Users className="size-5" strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0">
                  {/* «توظّفهم عندك» named nobody. The pronoun's antecedent — the six roles
                      — sits in the pill grid BELOW this line, so on first reading «هم» has
                      nothing to point at, and the green card opposite compounds it by
                      answering «إحنا نسوّي شغلهم». Naming the team resolves both, and it is
                      the same phrase the comparison page uses for the same choice. */}
                  <div className="text-[14px] font-bold leading-[1.4] text-foreground">
                    توظّف فريق كامل عندك
                  </div>
                  <div className="text-[12.5px] leading-[1.65] text-muted-foreground">
                    {toArabicDigits(CALC_ROLES.length)} رواتب شهرية
                  </div>
                </div>
              </div>

              {/* The six roles the 240,000 is built from, so the number is checkable
                  rather than asserted. Two to a row: wrapped by width they landed 3-2-1,
                  which reads as a list that ran out rather than six posts on a payroll. */}
              <div className="mt-3 grid grid-cols-2 gap-1.5">
                {CALC_ROLES.map((r) => (
                  <span
                    key={r.key}
                    // 1.6: these role labels wrap to two lines at 11.5px, and Arabic body
                    // copy below 1.6 stacks diacritics onto the line above.
                    className="rounded-md border border-destructive/20 bg-background/50 px-2 py-1.5 text-center text-[11.5px] leading-[1.6] text-muted-foreground"
                  >
                    {r.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Half two — the calculator where the other card puts its saving, and the
                total under it. The link belongs on this side: the 240,000 is the figure
                a reader doubts, so the invitation to recompute it sits on the figure
                itself rather than on a bar under both cards. */}
            <Link
              href="/cost-comparison"
              className="group flex flex-col items-center justify-center gap-0.5 border-t border-t-destructive/25 bg-destructive/[.07] px-5 py-4 text-center no-underline transition-colors hover:bg-destructive/[.12] sm:border-t-0 sm:border-s sm:border-s-destructive/25 sm:px-6"
            >
              {/* Red, like everything else in this card. Green here was the one element
                  wearing the other side's colour — inside the card that argues the cost,
                  it read as an endorsement of it. The colour is the argument; it has to
                  hold across the whole card. */}
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-destructive/15 text-destructive transition-colors group-hover:bg-destructive/25">
                <Calculator className="size-5.5" strokeWidth={2.2} aria-hidden />
              </span>
              <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-bold text-destructive">
                احسب بنفسك
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              </span>
              <span className="mt-2 border-t border-t-destructive/20 pt-2 text-[12px] leading-[1.65] text-muted-foreground">
                {/* `formatPrice`, not `formatNum` — this card sat between an Eastern-numeral
                    role count above it and Eastern-numeral plan prices below it, and printed
                    its own total in Western digits. One page, one numeral system. */}
                <span dir="ltr" className="text-[16px] font-bold text-destructive">
                  {formatPrice(teamAnnual)}
                </span>
                <br />
                {currency} سنوياً
              </span>
            </Link>
          </div>

          {/* Left — the same work, done by us. This is the half the old row never
              stated: it priced the alternative without ever saying the alternative
              does the job. */}
          {/* Split in two: what the subscription is, and what it saves.
              The saving used to be a clause in a caption under the price — the strongest
              number in the section set smaller than everything it was arguing against.
              Given its own half it becomes the thing the eye lands on, and the price sits
              under it as the supporting figure rather than the headline. */}
          <div className="grid h-full overflow-hidden rounded-2xl border-2 border-success/40 bg-gradient-to-br from-success/[.10] to-success/[.02] sm:grid-cols-[1fr_auto]">
            {/* Half one — the subscription. */}
            <div className="flex flex-col px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                  <Store className="size-5" strokeWidth={2.2} aria-hidden />
                </span>
                <div className="min-w-0">
                  {/* «أو تشترك في مدونتي» named the action and not the size of it, while
                      the card opposite named both — «فريق كامل». The comparison this whole
                      section makes is many against one, so the line says «اشتراك واحد»:
                      the reader weighs six salaries against one payment, which is the
                      actual choice, instead of weighing hiring against subscribing.
                      Still «في مدونتي», not JBRSEO — the subscription is to the platform;
                      this site only takes the payment. */}
                  <div className="text-[14px] font-bold leading-[1.4] text-foreground">
                    أو اشتراك واحد في مدونتي
                  </div>
                  {/* «شغل الفريق» rather than «شغلهم» — the pronoun leaned on a phrase in
                      the other card that no longer carries it, and naming the team costs
                      two characters. */}
                  <div className="text-[12.5px] leading-[1.65] text-muted-foreground">
                    إحنا نسوّي شغل الفريق كله
                  </div>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5">
                {[
                  "كتابة وتصميم وفيديو شهرياً",
                  "تحسين لجوجل + نشر على قنواتنا",
                  "لوحة تحكم وتقارير بأرقام جوجل",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2 text-[12.5px] leading-[1.6] text-foreground">
                    <Check className="mt-1 size-3.5 shrink-0 text-success" strokeWidth={2.5} aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Half two — the saving, then the price under it.
                A rule on the start edge from `sm` up, a horizontal one when stacked. */}
            <div className="flex flex-col items-center justify-center gap-0.5 border-t border-t-success/25 bg-success/[.07] px-5 py-4 text-center sm:border-t-0 sm:border-s sm:border-s-success/25 sm:px-6">
              {savePct > 0 && (
                <>
                  <span dir="ltr" className="text-[40px] font-bold leading-none text-success">
                    {toArabicDigits(savePct)}٪
                  </span>
                  <span className="text-[12px] font-semibold text-success">توفير سنوي</span>
                </>
              )}
              <span className="mt-2 border-t border-t-success/20 pt-2 text-[12px] leading-[1.65] text-muted-foreground">
                <span dir="ltr" className="text-[16px] font-bold text-foreground">
                  {formatPrice(planAnnual)}
                </span>
                <br />
                {currency} سنوياً
              </span>
            </div>
          </div>

        </div>
        </div>
        </details>
      </div>
    </section>
  );
}
