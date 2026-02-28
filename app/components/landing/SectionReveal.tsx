"use client";

import type { ReactNode } from "react";
import { useInView } from "@/app/helpers/useInView";

export function SectionReveal({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView({ once: true });
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={inView ? "section-reveal-in" : ""}>
      {children}
    </div>
  );
}
