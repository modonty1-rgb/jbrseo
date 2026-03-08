"use client";

import { useState, useCallback } from "react";
import type { Testimonial } from "@/app/content/landing/types";
import { SocialProofTabs } from "./SocialProofTabs";
import { SocialProofCard } from "./SocialProofCard";
import { SocialProofDots } from "./SocialProofDots";

type SocialProofCarouselProps = {
  testimonials: readonly Testimonial[];
};

export function SocialProofCarousel({ testimonials }: SocialProofCarouselProps) {
  const [active, setActive] = useState(0);
  const cur = testimonials[active];
  const onSelect = useCallback((i: number) => setActive(i), []);

  return (
    <>
      <div className="mb-5 grid items-start gap-5 grid-cols-1 lg:grid-cols-[220px_1fr]">
        <SocialProofTabs testimonials={testimonials} active={active} onSelect={onSelect} />
        <SocialProofCard key={active} testimonial={cur} />
      </div>
      <SocialProofDots count={testimonials.length} active={active} onSelect={onSelect} />
    </>
  );
}
