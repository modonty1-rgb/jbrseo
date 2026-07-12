/**
 * Landing skeleton — mirrors the real Landing.tsx section rhythm
 * (hero → case studies → guarantee → identity → payment → pricing → team → FAQ → final CTA).
 * Mobile-first heights that approximate the actual page so LCP shift is minimal.
 *
 * Rule: loading.tsx MUST match page.tsx 100% — this skeleton reflects the mobile
 * viewport structure users see first (per feedback_skeleton_matches_page).
 */
export function MarketingPageSkeleton() {
  return (
    <div aria-busy aria-label="جاري التحميل" className="w-full">
      {/* HERO */}
      <section className="max-w-[760px] mx-auto pt-[88px] px-7 pb-7 text-center">
        {/* Proof chip */}
        <div className="mx-auto h-6 w-56 rounded-full bg-muted/60 animate-pulse mb-6" />
        {/* H1 — 2 lines balanced */}
        <div className="mx-auto h-9 md:h-14 w-full max-w-[560px] rounded-lg bg-muted/70 animate-pulse mb-2" />
        <div className="mx-auto h-9 md:h-14 w-4/5 max-w-[460px] rounded-lg bg-muted/60 animate-pulse mb-6" />
        {/* Sub */}
        <div className="mx-auto h-4 w-11/12 max-w-[440px] rounded bg-muted/40 animate-pulse mb-1.5" />
        <div className="mx-auto h-4 w-2/3 max-w-[320px] rounded bg-muted/40 animate-pulse mb-8" />
        {/* CTA + WhatsApp link */}
        <div className="flex gap-4 justify-center items-center mb-6">
          <div className="h-12 w-40 rounded-xl bg-muted/70 animate-pulse" />
          <div className="h-6 w-24 rounded bg-muted/50 animate-pulse" />
        </div>
        {/* Trust chips ×3 */}
        <div className="flex flex-wrap justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-5 w-24 rounded-full bg-muted/40 animate-pulse" />
          ))}
        </div>
      </section>

      {/* CASE STUDY */}
      <section className="max-w-[880px] mx-auto px-7 py-10">
        <div className="text-center mb-6">
          <div className="mx-auto h-4 w-32 rounded bg-muted/50 animate-pulse mb-3" />
          <div className="mx-auto h-7 w-3/4 max-w-[400px] rounded-lg bg-muted/60 animate-pulse" />
        </div>
        {/* Hero stat */}
        <div className="rounded-2xl border border-border p-6 md:p-8 mb-4">
          <div className="mx-auto h-16 md:h-24 w-32 rounded-lg bg-muted/70 animate-pulse mb-3" />
          <div className="mx-auto h-5 w-52 rounded bg-muted/50 animate-pulse mb-1" />
          <div className="mx-auto h-3 w-40 rounded bg-muted/40 animate-pulse" />
        </div>
        {/* BEFORE strip (mobile) + AFTER card */}
        <div className="rounded-xl border border-border h-11 mb-3 animate-pulse bg-muted/30" />
        <div className="rounded-2xl border border-border p-5 mb-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
              <div className="h-4 w-24 rounded bg-muted/40 animate-pulse" />
              <div className="h-5 w-14 rounded bg-muted/60 animate-pulse" />
            </div>
          ))}
        </div>
        {/* Quality strip 4-col */}
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-border p-2.5 text-center">
              <div className="mx-auto h-5 w-10 rounded bg-muted/60 animate-pulse mb-1.5" />
              <div className="mx-auto h-3 w-12 rounded bg-muted/40 animate-pulse" />
            </div>
          ))}
        </div>
      </section>

      {/* GUARANTEE */}
      <section className="border-t border-b border-border bg-card">
        <div className="max-w-[920px] mx-auto px-7 py-14">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 animate-pulse shrink-0" />
            <div className="flex-1 w-full">
              <div className="h-3 w-20 rounded bg-muted/40 animate-pulse mb-2" />
              <div className="h-6 w-full max-w-[400px] rounded-lg bg-muted/60 animate-pulse mb-4" />
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-full rounded bg-muted/30 animate-pulse mb-2" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IDENTITY CARD */}
      <section className="max-w-[920px] mx-auto px-7 py-14">
        <div className="text-center mb-8">
          <div className="mx-auto h-5 w-40 rounded-full bg-muted/50 animate-pulse mb-3" />
          <div className="mx-auto h-9 w-3/4 max-w-[420px] rounded-lg bg-muted/60 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-border">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
            <div className="h-4 w-40 rounded bg-muted/50 animate-pulse" />
            <div className="h-5 w-16 rounded-full bg-muted/60 animate-pulse" />
          </div>
          <div className="p-5">
            <div className="h-3 w-32 rounded bg-muted/40 animate-pulse mb-2" />
            <div className="h-6 w-11/12 rounded-lg bg-muted/60 animate-pulse mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-border p-2 text-center">
                  <div className="mx-auto h-2.5 w-16 rounded bg-muted/40 animate-pulse mb-2" />
                  <div className="mx-auto h-3.5 w-20 rounded bg-muted/60 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PAYMENT TRUST */}
      <section className="border-t border-b border-border bg-card">
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          <div className="rounded-2xl border border-border p-5">
            <div className="mx-auto h-11 w-32 rounded-lg bg-muted/50 animate-pulse mb-3" />
            <div className="mx-auto h-4 w-52 rounded bg-muted/40 animate-pulse mb-6" />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-11 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — 4 cards stacked on mobile */}
      <section className="max-w-[1080px] mx-auto px-7 pt-10 pb-20">
        <div className="text-center mb-5">
          <div className="mx-auto h-8 w-52 rounded-lg bg-muted/60 animate-pulse mb-4" />
          <div className="mx-auto h-10 w-60 rounded-[11px] bg-muted/40 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`rounded-[18px] border-2 p-[22px] ${i === 0 ? "border-success/40 ring-2 ring-success/20" : "border-border"}`}
            >
              <div className="h-3 w-32 rounded bg-muted/40 animate-pulse mb-2" />
              <div className="h-7 w-24 rounded-lg bg-muted/60 animate-pulse mb-5" />
              <div className="rounded-xl border border-border p-3 mb-5">
                <div className="h-5 w-full rounded bg-muted/60 animate-pulse mb-1.5" />
                <div className="h-3 w-3/4 rounded bg-muted/40 animate-pulse" />
              </div>
              <div className="h-9 w-32 rounded bg-muted/60 animate-pulse mb-1.5" />
              <div className="h-4 w-40 rounded bg-muted/40 animate-pulse mb-4" />
              <div className="h-12 w-full rounded-[11px] bg-muted/70 animate-pulse mb-3" />
              <div className="pb-3 border-b border-border mb-3">
                <div className="h-3 w-24 rounded bg-muted/40 animate-pulse" />
              </div>
              {[0, 1, 2, 3, 4].map((j) => (
                <div key={j} className="flex gap-2.5 items-start mb-3">
                  <div className="w-[22px] h-[22px] rounded-md bg-muted/50 animate-pulse shrink-0" />
                  <div className="h-4 flex-1 rounded bg-muted/30 animate-pulse" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-t border-border">
        <div className="max-w-[1080px] mx-auto px-7 py-14">
          <div className="text-center mb-10">
            <div className="mx-auto h-6 w-48 rounded-full bg-muted/50 animate-pulse mb-3" />
            <div className="mx-auto h-8 w-3/4 max-w-[380px] rounded-lg bg-muted/60 animate-pulse" />
          </div>
          <div className="max-w-[860px] mx-auto rounded-2xl border border-border">
            <div className="aspect-video bg-muted/60 animate-pulse rounded-t-2xl" />
            <div className="p-6">
              <div className="h-4 w-full rounded bg-muted/30 animate-pulse mb-2" />
              <div className="h-4 w-full rounded bg-muted/30 animate-pulse mb-2" />
              <div className="h-4 w-3/4 rounded bg-muted/30 animate-pulse mb-5" />
              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-muted/50 animate-pulse shrink-0" />
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-muted/60 animate-pulse mb-1.5" />
                  <div className="h-3 w-40 rounded bg-muted/40 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border bg-card">
        <div className="max-w-[760px] mx-auto px-7 py-14">
          <div className="text-center mb-8">
            <div className="mx-auto h-6 w-40 rounded-full bg-muted/50 animate-pulse mb-3" />
            <div className="mx-auto h-8 w-3/4 max-w-[320px] rounded-lg bg-muted/60 animate-pulse" />
          </div>
          {/* Chip filter row */}
          <div className="flex gap-2 overflow-hidden mb-6">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-7 w-24 rounded-full bg-muted/40 animate-pulse shrink-0" />
            ))}
          </div>
          {/* Accordion items */}
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-b border-border py-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-3/4 rounded bg-muted/40 animate-pulse" />
                <div className="h-5 w-5 rounded bg-muted/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-[1080px] mx-auto pt-[60px] px-7 pb-[90px]">
        <div className="bg-muted/40 rounded-[26px] px-5 md:px-10 py-10 md:py-[72px] text-center">
          <div className="mx-auto h-8 md:h-14 w-11/12 max-w-[440px] rounded-lg bg-muted/50 animate-pulse mb-3" />
          <div className="mx-auto h-8 md:h-14 w-3/4 max-w-[280px] rounded-lg bg-muted/40 animate-pulse mb-6" />
          <div className="mx-auto h-4 w-11/12 max-w-[380px] rounded bg-muted/30 animate-pulse mb-8" />
          <div className="flex gap-3 justify-center flex-wrap">
            <div className="h-14 w-40 rounded-[13px] bg-muted/50 animate-pulse" />
            <div className="h-14 w-36 rounded-[13px] bg-muted/30 animate-pulse" />
          </div>
        </div>
      </section>
    </div>
  );
}
