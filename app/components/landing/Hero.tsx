import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { landing } from "@/app/content/landing";
import { landingImages } from "@/app/content/landing-images";

const HERO_IMAGE_ALT = "مدونتي — شريكك في النمو";

export default function Hero() {
  const { hero } = landing;
  return (
    <section
      className="relative overflow-hidden bg-background px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pb-28 lg:pt-20"
      aria-labelledby="hero-title"
    >
      {/* subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 end-0 h-[500px] w-[500px] rounded-full bg-primary/6 blur-3xl"
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* copy column */}
        <div className="order-2 lg:order-1">
          {/* eyebrow */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" aria-hidden />
            <span className="text-xs font-medium text-muted-foreground">
              {hero.proof}
            </span>
          </div>

          <h1
            id="hero-title"
            className="mb-4 text-4xl font-bold tracking-tight leading-[1.1] text-foreground sm:text-5xl lg:text-6xl"
          >
            {hero.h1}
          </h1>

          <p className="mb-8 text-lg leading-relaxed text-muted-foreground sm:text-xl">
            {hero.subheadline}
          </p>

          <ul className="mb-8 space-y-3" role="list">
            {hero.benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 text-success font-semibold leading-none" aria-hidden>✓</span>
                <span className="text-foreground/90">{b}</span>
              </li>
            ))}
          </ul>

          <Button
            asChild
            size="lg"
            className="rounded-full px-8 shadow-md shadow-primary/20"
          >
            <Link href="/pricing">{hero.cta}</Link>
          </Button>
        </div>

        {/* image column */}
        <div className="relative order-1 flex justify-center lg:order-2">
          <div className="relative flex items-center justify-center rounded-3xl bg-primary/5 p-6 sm:p-8 lg:p-10">
            <Image
              src={landingImages.contactAvatar}
              alt={HERO_IMAGE_ALT}
              width={420}
              height={420}
              priority
              sizes="(max-width: 1024px) 80vw, 42vw"
              className="relative z-10 h-auto w-full max-w-[320px] object-contain sm:max-w-[380px] lg:max-w-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
