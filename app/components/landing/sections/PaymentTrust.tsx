import Image from "next/image";

/** Payment trust bar (Network International). Static. No state, server-ready. */
export function PaymentTrust() {
  return (
    <section
        className="border-t border-t-[var(--border)] border-b border-b-[var(--border)] bg-card"
      >
        <div className="max-w-270 mx-auto px-7 py-8 md:py-14">
          <div className="rounded-2xl border border-border overflow-hidden md:shadow-[0_20px_50px_-30px_color-mix(in_oklch,var(--foreground)_25%,transparent)]">
            {/* Tier 1 — Gateway anchor: compact centered stack on mobile, side-by-side on desktop */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 px-5 py-5 md:py-6 bg-success/[0.08] border-b border-b-success/20">
              <div className="inline-flex items-center justify-center bg-white rounded-lg ring-1 ring-black/10 shadow-sm w-35 h-11 px-3 shrink-0">
                <Image
                  src="/logos/network-international.svg"
                  alt="Network International"
                  width={556}
                  height={126}
                  className="w-29.5 h-6.5 object-contain"
                />
              </div>
              <div className="text-center md:text-right">
                <div className="font-mono text-[10.5px] text-success tracking-[2px] mb-1 font-bold">دفع آمن</div>
                <div className="text-[14px] md:text-[15px] font-semibold text-foreground leading-tight">
                  عبر بوّابة <span className="text-success whitespace-nowrap">Network International</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1 font-mono">
                  أكبر معالج دفع في الشرق الأوسط · LSE:NETW
                </div>
              </div>
            </div>

            {/* Payment-method icons moved to the pricing section (decision
                moment, per Baymard) — this section tells the GATEWAY story only. */}

            {/* Tier 3 — Trust badges (stronger contrast) */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-6 py-3.5 border-t border-t-border bg-card">
              <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                <span className="font-semibold">PCI DSS Level 1</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                <span className="font-semibold">3D Secure</span>
              </span>
              <span className="text-muted-foreground/50" aria-hidden>·</span>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12.5l5 5L20 7" />
                </svg>
                <span>بيانات كارتك لا تلمس خوادمنا</span>
              </span>
            </div>
          </div>
        </div>
      </section>
  );
}
