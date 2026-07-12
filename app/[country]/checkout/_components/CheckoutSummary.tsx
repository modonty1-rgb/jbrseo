type Props = {
  planName: string;
  planTagline?: string | null;   // kept for API stability; not shown in compact mode
  totalDisplay: string;          // formatted with currency, e.g. "1,725 ر.س"
  billingLabel: string;          // "سنوي" | "شهري"
};

/**
 * Compact top-of-page summary — plan name on the right, price on the left.
 * The delivery-commitment badge lives below the pay button (single source of
 * truth), so we don't repeat it here. Kept intentionally slim to give the
 * payment "trust panel" below all the visual weight.
 */
export function CheckoutSummary({ planName, totalDisplay, billingLabel }: Props) {
  return (
    <section
      aria-label="ملخص الاشتراك"
      className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 px-5 py-4"
    >
      <div className="min-w-0">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[2px] text-muted-foreground">
          باقتك
        </p>
        <h2 className="mt-0.5 truncate text-lg font-black tracking-tight text-foreground sm:text-xl">
          {planName}
        </h2>
      </div>

      <div className="shrink-0 text-end">
        <p dir="ltr" className="font-mono text-xl font-black leading-none text-success sm:text-2xl">
          {totalDisplay}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {billingLabel} · شامل ض.ق.م ١٥٪
        </p>
      </div>
    </section>
  );
}
