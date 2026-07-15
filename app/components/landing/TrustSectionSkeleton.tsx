import { cn } from "@/lib/utils";

/**
 * Loading placeholder for the lazy-loaded {@link TrustSection}. Mirrors its
 * exact outer chrome (bordered card band → 1080px container → py-8/14 rhythm)
 * and teaser grid so the skeleton → real-content swap causes ZERO layout shift
 * (CLS). Pure markup — no hooks, no client JS — so it ships as part of the
 * eager shell while TrustSection's own framer-motion + Radix Select bundle
 * loads on the client.
 */
export function TrustSectionSkeleton() {
  return (
    <section className="relative border-y border-border/60 bg-card" aria-hidden>
      <div className="relative max-w-[1080px] mx-auto px-7 py-8 md:py-14">
        {/* header — title (wraps to 2 lines on narrow screens) + subtitle */}
        <div className="text-center mb-5 md:mb-12">
          <div className="mx-auto h-6 md:h-9 w-11/12 max-w-[560px] rounded-lg bg-muted/60 animate-pulse" />
          <div className="mx-auto mt-2 md:mt-3 h-4 w-1/2 max-w-[280px] rounded bg-muted/50 animate-pulse" />
        </div>

        {/* filter — desktop tab pill only (collapsed mobile shows no controls) */}
        <div className="mb-5 md:mb-10 hidden md:flex justify-center">
          <div className="h-10 w-[380px] rounded-full bg-muted/50 animate-pulse" />
        </div>

        {/* grid — 4 square tiles on mobile, up to 6 on desktop (matches the
            grid-cols-4 → xl:grid-cols-6 progression of the real section) */}
        <div className="grid grid-cols-4 gap-x-2 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 md:gap-x-4 md:gap-y-7">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "aspect-square w-full rounded-xl border border-border/40 bg-muted/40 animate-pulse",
                i >= 4 && "hidden md:block",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
