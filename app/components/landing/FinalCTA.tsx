import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { landing } from "@/app/content/landing";

export default function FinalCTA() {
  const { finalCta } = landing;
  return (
    <section
      className="relative overflow-hidden border-t border-border/50 bg-gradient-to-br from-primary via-primary to-accent/80 px-4 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-labelledby="final-cta-title"
    >
      {/* soft radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl text-center">
        <h2
          id="final-cta-title"
          className="mb-6 text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
        >
          {finalCta.headline}
        </h2>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-white px-8 font-semibold text-primary shadow-lg hover:bg-white/90 hover:text-primary"
        >
          <Link href="/pricing">{finalCta.cta}</Link>
        </Button>
      </div>
    </section>
  );
}
