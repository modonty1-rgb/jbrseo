import { Loader2 } from "lucide-react";

/**
 * Fallback while page.tsx does its server-side DB check + short-circuit.
 * Uses the SAME spinner + circular badge as ProcessingClient so the visual
 * doesn't jump when the client component mounts — feels like one smooth wait.
 * No text yet (we don't know status until DB check completes).
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl" lang="ar">
      <main className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-info/12 border-2 border-info/40 shadow-lg shadow-info/20">
            <Loader2
              className="h-11 w-11 text-info animate-spin"
              strokeWidth={2.5}
              aria-hidden
            />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            لحظات...
          </p>
        </div>
      </main>
    </div>
  );
}
