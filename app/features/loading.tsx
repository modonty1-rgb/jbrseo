import { Skeleton } from "@/app/components/ui/skeleton";

/**
 * Mirrors app/features/page.tsx structure — hero + 6 sections (with screenshot
 * + card grid pattern repeated 3 times), YMYL card, alerts grid, pricing table,
 * comparison, final CTA. Same container widths, same section gutters — zero CLS.
 */
export default function Loading() {
  return (
    <div className="bg-background text-foreground" dir="rtl" lang="ar">
      {/* HERO */}
      <section className="border-b border-border py-14 sm:py-20 text-center">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="mx-auto mb-4 h-10 w-80 rounded-md sm:h-12 sm:w-[28rem] md:h-14 md:w-[36rem]" />
          <Skeleton className="mx-auto mb-8 h-4 w-full max-w-2xl rounded-md" />
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card px-5 py-4"
              >
                <Skeleton className="mb-1 h-7 w-16 rounded-md" />
                <Skeleton className="h-3 w-20 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTIONS 1-3: sections with screenshot + 6-card grid */}
      {Array.from({ length: 3 }).map((_, i) => (
        <SectionShellWithScreenshot key={i} />
      ))}

      {/* SECTION 4: YMYL — big card + 3 sector cards */}
      <SectionShell>
        <div className="rounded-2xl border border-success/30 bg-success/[0.04] p-6 sm:p-8">
          <Skeleton className="mb-2 h-7 w-72 rounded-md" />
          <div className="mb-6 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-success/20 bg-background/60 p-4 text-center"
              >
                <Skeleton className="mx-auto mb-2 h-10 w-10 rounded-lg" />
                <Skeleton className="mx-auto mb-1 h-4 w-24 rounded-md" />
                <Skeleton className="mx-auto h-3 w-full rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* SECTION 5: Telegram alerts — 5-card grid */}
      <SectionShell>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-info/25 bg-info/[0.06] p-4 text-center"
            >
              <Skeleton className="mx-auto mb-2 h-9 w-9 rounded-lg" />
              <Skeleton className="mx-auto mb-1 h-4 w-16 rounded-md" />
              <Skeleton className="mx-auto h-3 w-full rounded-md" />
            </div>
          ))}
        </div>
      </SectionShell>

      {/* SECTION 6: Pricing table + compare + final CTA */}
      <SectionShell>
        <div className="rounded-2xl border border-border bg-card p-4">
          <Skeleton className="h-64 w-full rounded-md" />
        </div>
        <Skeleton className="mt-2 h-3 w-64 rounded-md" />

        <div className="mt-11 space-y-3 text-center">
          <Skeleton className="mx-auto h-8 w-56 rounded-md" />
          <Skeleton className="mx-auto h-4 w-72 rounded-md" />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {["destructive", "success"].map((tone) => (
            <div
              key={tone}
              className={`rounded-2xl border p-6 ${
                tone === "destructive"
                  ? "border-destructive/25 bg-destructive/[0.05]"
                  : "border-success/35 bg-success/10"
              }`}
            >
              <Skeleton className="mb-4 h-5 w-56 rounded-md" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full rounded-md" />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-gradient-to-br from-success/25 to-success/70 p-8 text-center sm:p-14">
          <Skeleton className="mx-auto mb-3 h-8 w-72 rounded-md" />
          <Skeleton className="mx-auto mb-6 h-4 w-96 rounded-md" />
          <div className="flex flex-wrap justify-center gap-3">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-44 rounded-xl" />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

function SectionShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-2 h-3 w-32 rounded-md" />
        <Skeleton className="mb-3 h-8 w-72 rounded-md sm:h-10 sm:w-96" />
        <Skeleton className="mb-6 h-4 w-full max-w-2xl rounded-md" />
        {children}
      </div>
    </section>
  );
}

function SectionShellWithScreenshot() {
  return (
    <SectionShell>
      {/* Screenshot frame */}
      <div className="rounded-2xl border border-success/20 bg-success/[0.04] p-4 sm:p-5">
        <div className="mb-3 space-y-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-5 w-full max-w-md rounded-md" />
        </div>
        <Skeleton className="aspect-[1920/950] w-full rounded-lg" />
      </div>
      {/* 6-card grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <Skeleton className="mb-3 h-10 w-10 rounded-lg" />
            <Skeleton className="mb-1.5 h-5 w-32 rounded-md" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
