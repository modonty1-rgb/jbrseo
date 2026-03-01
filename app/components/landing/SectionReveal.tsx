"use client";

import type { ReactNode } from "react";
import { useInView } from "@/app/helpers/useInView";

type SectionRevealProps = {
  children: ReactNode;
  sectionNumber?: number;
  showSectionCounter?: boolean;
};

export function SectionReveal({ children, sectionNumber, showSectionCounter }: SectionRevealProps) {
  const { ref, inView } = useInView({ once: true });
  const showCounter = showSectionCounter && sectionNumber != null;
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={`relative overflow-hidden ${inView ? "section-reveal-in" : ""}`}>
      {showCounter && (
        <span
          aria-hidden
          className="pointer-events-none select-none absolute -top-6 end-4 z-0 font-black leading-none tabular-nums text-[8rem] text-foreground/[0.04] sm:text-[11rem] lg:text-[14rem]"
        >
          {String(sectionNumber).padStart(2, "0")}
        </span>
      )}
      {children}
    </div>
  );
}
