import Image from "next/image";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ModontyLogoItem } from "@/app/actions/modonty-client-logos";

/**
 * One client, framed like a print photograph.
 *
 * The tile went through two wrong shapes before this one. First a dark card holding a
 * white panel holding the image — a box inside a box, two rounded outlines a few pixels
 * apart with a dead gutter between them. Then a bare white plate with the name below it
 * on the dark background, which left a slab of white behind every image with no job: it
 * was there because logos need white, and it read as padding nobody chose.
 *
 * A photo frame gives that white a reason. Thin even margins on three sides, a deep one
 * at the foot, and the name printed in the deep part — the proportions of a physical
 * print, which is a shape every reader already knows how to look at. It also absorbs the
 * roster's real problem: several clients uploaded a portrait rather than a logo, and a
 * portrait in a photo frame is not a mistake.
 *
 * A Server Component. The landing's old version was a `motion` element inside a client
 * section, so showing four logos pulled framer-motion and a Radix Select into the page;
 * nothing here needs state, and the hover survives as CSS.
 *
 * Shared by the landing teaser and `/clients` so a client looks the same in both.
 */
export function ClientLogoTile({
  logo,
  /** Off in the landing teaser, where every tile is featured and the star marks nothing. */
  showFeaturedBadge = true,
  className,
}: {
  logo: ModontyLogoItem;
  showFeaturedBadge?: boolean;
  className?: string;
}) {
  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noopener noreferrer"
      title={logo.name}
      aria-label={`زيارة صفحة ${logo.name} على مدونتي`}
      className={cn("group block no-underline", className)}
    >
      {/* The print itself. A small radius, not a card's: photographs have nearly square
          corners, and 12px here would read as a UI tile again. */}
      {/* Warm off-white for the frame, pure white for the window below it.
          A white frame around a logo that is itself on white left no edge at all — the
          image bled into its own mount and the tile looked like a caption floating on a
          blank card. Photo paper was never pure white either, so the shade is the honest
          one for the object being imitated. */}
      <div
        className={cn(
          "relative rounded-[3px] bg-[#efece6] p-2 pb-1.5",
          "shadow-[0_2px_6px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-300 ease-out",
          "group-hover:-translate-y-1 group-hover:shadow-[0_18px_36px_-14px_rgba(0,0,0,0.55)]",
          "group-focus-visible:-translate-y-1",
          "motion-reduce:transform-none motion-reduce:transition-none",
        )}
      >
        {showFeaturedBadge && logo.isFeatured && (
          <div
            className="absolute end-3 top-3 z-20 flex size-6 items-center justify-center rounded-full bg-linear-to-br from-amber-300 via-amber-400 to-amber-500 shadow-[0_3px_10px_-2px_rgba(217,119,6,0.55)] ring-2 ring-white transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none"
            aria-label="عميل مميّز"
            title="عميل مميّز"
          >
            <Star className="size-3 fill-white text-white" strokeWidth={0} aria-hidden />
          </div>
        )}

        {/* The window. `object-contain` on a white ground, not `cover`: the roster mixes
            portraits with wide wordmarks, and cropping to fill would cut the wordmarks in
            half. Nothing is cropped; the frame carries the composition instead. */}
        <div className="relative aspect-square w-full overflow-hidden bg-white ring-1 ring-black/8">
          {logo.logoUrl ? (
            <Image
              src={logo.logoUrl}
              alt={logo.altText}
              width={240}
              height={240}
              className="size-full object-contain transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
              sizes="(max-width: 768px) 40vw, 160px"
            />
          ) : (
            // No image on file — a coloured plate keeps the row even instead of leaving a
            // hole, and the hue is derived from the name so the same client always looks
            // the same.
            <div
              aria-label={logo.altText}
              className="flex size-full items-center justify-center text-3xl font-black md:text-4xl"
              style={{
                background: `linear-gradient(135deg, hsl(${logo.initialsHue} 65% 92%) 0%, hsl(${logo.initialsHue} 60% 82%) 100%)`,
                color: `hsl(${logo.initialsHue} 55% 32%)`,
              }}
            >
              {logo.initials}
            </div>
          )}
        </div>

        {/* The deep margin, with the caption printed in it — the reason the white is
            there at all. Dark ink on paper: past AA several times over at this size.
            A fixed height, not a minimum: `min-h` let a two-line name push its frame
            taller than its neighbours, so a row of prints came out ragged. Two lines is
            the budget, and every frame is the same height whether a name uses it or not. */}
        {/* 44px on a phone, 56 from md. The fixed 56 was set for a 148px tile; at the
            96px tile the phone now uses, it was more caption than logo. Two lines of
            11.5px still fit — the clamp below is unchanged. */}
        <div className="flex h-11 md:h-14 flex-col justify-center px-1 pt-1.5 md:pt-2 text-center">
          <div className="line-clamp-2 text-[11.5px] font-bold leading-[1.45] text-neutral-800">
            {logo.name}
          </div>
          {/* 11px. At 10px «السياحة العلاجية» was the smallest text on the page and the
              Arabic dots stopped resolving; the tile has the room. */}
          {logo.industryLabel && (
            <div className="mt-0.5 truncate text-[11px] leading-[1.5] text-neutral-500">
              {logo.industryLabel}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
