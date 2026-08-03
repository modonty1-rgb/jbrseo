/** Mirrors the UX-Insights page layout so the shell doesn't shift on load:
 *  header + range switcher, 4 metric cards, trend card, table. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted/70" />
        </div>
        <div className="h-8 w-52 rounded-lg bg-muted" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-card" />
        ))}
      </div>

      <div className="h-[300px] rounded-xl border border-border bg-card" />
      <div className="h-64 rounded-xl border border-border bg-card" />
    </div>
  );
}
