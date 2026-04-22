"use client";

import dynamic from "next/dynamic";
import type { Testimonial } from "@/app/content/landing/types";

const SocialProofCarousel = dynamic(
  () => import("./SocialProofCarousel").then((m) => ({ default: m.SocialProofCarousel })),
  { ssr: false }
);

export function SocialProofCarouselClient({ testimonials }: { testimonials: readonly Testimonial[] }) {
  return <SocialProofCarousel testimonials={testimonials} />;
}
