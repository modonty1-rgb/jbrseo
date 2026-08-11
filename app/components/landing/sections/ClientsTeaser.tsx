import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ClientLogoTile } from "@/app/components/clients/ClientLogoTile";
import { toArabicDigits } from "../landing-helpers";
import type { ModontyLogoItem } from "@/app/actions/modonty-client-logos";

type Props = {
  /** Only the logos actually rendered — the rest never reach the page. */
  logos: ModontyLogoItem[];
  /** Full client count, for the line under the heading and the link. */
  total: number;
  ctaLabel: string;
};

/**
 * Social proof on the landing, cut to what the landing needs.
 *
 * This was a client section carrying the whole roster: framer-motion, a Radix Select, a
 * category filter and an expand/collapse — and every one of the thirty clients' names,
 * industries and URLs serialised into the page payload, to render four tiles. The rest
 * only appeared behind a click most readers never make.
 *
 * The argument here is "recognisable businesses chose this, and there are more of them",
 * which four logos and a number make. Anyone who wants the roster follows the link to
 * `/clients`, where the full wall lives on a page that can also be indexed on its own.
 *
 * A Server Component: no state, no motion library, no filter.
 */
export function ClientsTeaser({ logos, total, ctaLabel }: Props) {
  if (logos.length === 0) return null;

  return (
    <section
      aria-labelledby="clients-teaser-title"
      className="border-t border-t-border bg-card"
    >
      <div className="mx-auto max-w-270 px-5 md:px-7 py-6 md:py-10">
        <div className="mb-5 text-center md:mb-8">
          {/* "عملاء", one noun for this group across the whole page — the heading used
              to say شركاء, the line under it علامة تجارية and the case-study panel نشاط.
              Weight 600 like every other heading here: Arabic is a connected script and
              its strokes thicken fast at 900. */}
          <h2
            id="clients-teaser-title"
            // 4.8vw with a 17px floor, down from 5.8vw/20px. At 390px the old ramp put
            // this heading at 22.6px across two lines — larger than the section it
            // introduces needs, and it is the longest heading on the page.
            className="text-balance text-[clamp(17px,4.8vw,34px)] font-semibold leading-[1.3] text-foreground"
          >
            عملاء نبني حضورهم في البحث والذكاء الاصطناعي
          </h2>
          <p className="mt-2 text-[14.5px] leading-[1.7] text-muted-foreground">
            {toArabicDigits(total)} نشاطاً اختارنا لبناء حضوره
          </p>
        </div>

        {/* A centred wrapping row rather than a fixed-column grid: four tiles in a
            six-column grid left two empty tracks and pulled the row off-centre. */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-6 md:gap-x-4">
          {logos.map((logo) => (
            <ClientLogoTile
              key={logo.slug}
              logo={logo}
              showFeaturedBadge={false}
              // `w-36` on desktop: six tiles at 160px overrun the 1024px row by 16px and
              // wrap one onto a line of its own; at 144 the six sit on one row with room.
              // Three across on a phone, not two. At two columns each tile rendered
              // 148×148px — a logo the size of an app icon, six of them, on the section
              // that is meant to be scanned rather than studied. Three brings them to
              // ~96px, which is still legible and shows all six in two rows instead of
              // three. `w-36` on desktop: six tiles at 160px overrun the 1024px row by
              // 16px and wrap one onto a line of its own; at 144 the six sit on one row.
              className="w-[calc(33.333%-0.5rem)] md:w-36"
            />
          ))}
        </div>

        {/* Both exits on one line: the secondary link on the start edge, the primary
            action on the end.
            Stacked and centred they read as a queue — the reader met "شوف كل العملاء"
            first and the price CTA second, which puts the detour ahead of the decision.
            Side by side they read as what they are: one way on, one way deeper. The
            primary sits at the end of the sweep, where an action belongs in RTL.
            Wraps to a column below `sm`, where two buttons on a line would be cramped. */}
        <div className="mt-6 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row md:mt-8">
          <Link
            href="/clients"
            className="group inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-[14px] font-bold text-foreground no-underline transition-colors hover:border-success/40 hover:bg-success/5"
          >
            شوف كل العملاء — {toArabicDigits(total)} نشاط
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
          </Link>

          {/* The section's own exit into the decision, kept from the old version:
              social proof works hardest immediately before the price. */}
          <a
            href="#pricing"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-[14px] font-bold text-primary-foreground no-underline shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/35 motion-reduce:transform-none md:text-base"
          >
            {ctaLabel}
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1 motion-reduce:transform-none" strokeWidth={2.5} aria-hidden />
          </a>
        </div>
      </div>
    </section>
  );
}
