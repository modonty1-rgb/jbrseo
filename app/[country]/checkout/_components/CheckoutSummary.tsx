import { Gift } from "lucide-react";
import { toArabicDigits } from "@/app/components/landing/landing-helpers";

type Props = {
  planName: string;
  planTagline?: string | null;   // kept for API stability; not shown in compact mode
  totalDisplay: string;          // formatted with currency, e.g. "1,725 ر.س"
  billingLabel: string;          // "سنوي" | "شهري"
  /**
   * Free service months granted on the chosen term, if any.
   *
   * Optional so the Tamara route and any future caller can omit it without inventing a
   * gift; absent means the line is not rendered rather than rendered as zero.
   */
  freeMonths?: number;
};

/**
 * Compact top-of-page summary — plan name on the right, price on the left.
 * The delivery-commitment badge lives below the pay button (single source of
 * truth), so we don't repeat it here. Kept intentionally slim to give the
 * payment "trust panel" below all the visual weight.
 */
export function CheckoutSummary({ planName, totalDisplay, billingLabel, freeMonths = 0 }: Props) {
  return (
    <section
      aria-label="ملخص الاشتراك"
      className="rounded-2xl border border-border bg-card/60 px-5 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          {/* No `font-mono`, no `uppercase`. Both were doing nothing for an Arabic word:
              a monospace face pulls the joined letters of "باقتك" apart, and Arabic has
              no capitals for `uppercase` to change. */}
          <p className="text-[11.5px] font-semibold text-muted-foreground">
            باقتك
          </p>
          <h2 className="mt-0.5 truncate text-lg font-black text-foreground sm:text-xl">
            {planName}
          </h2>
        </div>

        <div className="shrink-0 text-end">
          <p dir="ltr" className="text-xl font-black leading-none text-success sm:text-2xl">
            {totalDisplay}
          </p>
          <p className="mt-1 text-[11.5px] leading-[1.6] text-muted-foreground">
            {billingLabel} · شامل ض.ق.م ١٥٪
          </p>
        </div>
      </div>

      {/* The gift, carried through to the page where the money is actually handed over.
          The plan card promises free months and this summary did not mention them, so a
          buyer who chose the six-month term because of a free month arrived at the form
          and saw only "٦ شهور" — the thing that persuaded them, missing at the moment
          they were asked to trust the page. */}
      {freeMonths > 0 && (
        <p className="mt-3 flex items-center gap-1.5 border-t border-t-border pt-3 text-[12px] font-bold leading-[1.6] text-amber-600 dark:text-amber-400">
          <Gift className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
          {/* "منها", not "ومعها": the term above now counts service months, so the free
              month is part of that number rather than something added to it. Worded as an
              addition it would read as an eighth month.
              Eastern numerals, like the term beside it and the plan card this buyer came
              from — it printed "6 شهور" next to "١٢ شهر" on the same line. */}
          {freeMonths === 1
            ? "منها شهر خدمة مجاني"
            : `منها ${toArabicDigits(freeMonths)} شهور خدمة مجانية`}
        </p>
      )}
    </section>
  );
}
