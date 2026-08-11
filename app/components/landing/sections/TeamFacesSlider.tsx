"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import type { StaticLanding } from "@/app/content/landing/types";

type TeamMember = NonNullable<StaticLanding["team"]>["coreTeam"][number];

/**
 * The team, as faces the reader can move through.
 *
 * A client island rather than the page-wide `Carousel`: this sits inside a trust card on
 * a statically generated landing, so it carries only Embla and its own two buttons
 * instead of the full component and its context.
 *
 * Names and roles ride with each portrait — a face with no name is the anonymity the card
 * exists to disprove.
 */
export function TeamFacesSlider({ members }: { members: TeamMember[] }) {
  const [emblaRef, embla] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    loop: true,
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!embla) return;
    setCanPrev(embla.canScrollPrev());
    setCanNext(embla.canScrollNext());
  }, [embla]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect);
  }, [embla, onSelect]);

  if (members.length === 0) return null;

  return (
    <div className="relative">
      {/* Arrows on the flanks, overlaying the strip's edges.
          In a row beneath, they added ~36px that the registration card next door has no
          equivalent for, so the pair stopped matching in height. Riding on the strip they
          cost nothing vertically, and they sit at the vertical centre of the portraits
          where the thing they move is. */}
      <button
        type="button"
        onClick={() => embla?.scrollPrev()}
        disabled={!canPrev}
        aria-label="الموظفون السابقون"
        // A 44px target around a 32px disc. Grown from 28 to 44 to meet the tap-size
        // floor, the button itself became the visible control and bit 10px into the
        // nearest portrait — measured. The hit area stays 44; the circle a reader sees is
        // the inner span, so the control clears the faces and the finger target does not
        // shrink.
        className="absolute end-0 top-7 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card/90 shadow-sm backdrop-blur-sm">
          <ChevronRight className="size-4" aria-hidden />
        </span>
      </button>
      <button
        type="button"
        onClick={() => embla?.scrollNext()}
        disabled={!canNext}
        aria-label="الموظفون التاليون"
        className="absolute start-0 top-7 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-0"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full border border-border bg-card/90 shadow-sm backdrop-blur-sm">
          <ChevronLeft className="size-4" aria-hidden />
        </span>
      </button>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-3">
          {members.map((m) => (
            // Two to a view, not three.
            // At a third of a ~330px half each column was ~100px, which cut every name
            // mid-word — "المهندس محمد حـ" — and a clipped name is worse than no name on
            // the one card whose argument is that these people are nameable.
            <div key={m.name} className="min-w-0 shrink-0 basis-1/2 text-center">
              <span className="relative mx-auto block size-14 overflow-hidden rounded-full bg-muted ring-2 ring-success/25">
                {m.avatarUrl ? (
                  <Image
                    src={m.avatarUrl}
                    alt={m.name}
                    width={112}
                    height={112}
                    className="size-full object-cover"
                    sizes="56px"
                  />
                ) : (
                  // No portrait on file — the initial keeps the circle filled instead of
                  // leaving a hole, and `avatarColor` is what /team already uses for the
                  // same person.
                  <span
                    className="flex size-full items-center justify-center text-[18px] font-semibold text-white"
                    style={{ backgroundColor: m.avatarColor }}
                  >
                    {m.name.trim().charAt(0)}
                  </span>
                )}
              </span>
              {/* Wraps rather than truncates: if a name still overruns, a second line
                  costs a few pixels and an ellipsis costs the name. */}
              {/* 12px, and a fixed two-line box.
                  Measured at 390px: each slide is 149px wide, where «المهندس محمد حسني جبر»
                  wrapped to two lines and «المهندس خالد علي» fitted on one — so the two
                  cards stood at different heights and the shorter one left a gap under its
                  name. Shrinking alone would not fix it; the next long name brings the gap
                  back. `min-h` reserves both lines for every name, so the row is level
                  whatever the database holds. */}
              <div className="mt-1.5 min-h-[35px] text-[12px] font-semibold leading-[1.45] text-foreground text-balance">
                {m.name}
              </div>
              <div className="text-[11.5px] leading-[1.5] text-muted-foreground text-balance">
                {m.role}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
