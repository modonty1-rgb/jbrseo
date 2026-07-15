"use client";

import dynamic from "next/dynamic";
import type { ModontyTrustBundle } from "@/app/actions/modonty-client-logos";
import { TrustSectionSkeleton } from "./TrustSectionSkeleton";

// Client-only wrapper so the Landing Server Component can lazy-load TrustSection
// with ssr:false — `dynamic({ ssr: false })` is not allowed in a Server Component,
// so the deferral lives here in a Client boundary. Its framer-motion + Radix
// Select JS stays off the initial bundle; the skeleton reserves the exact height.
const TrustSection = dynamic(
  () => import("./TrustSection").then((mod) => mod.TrustSection),
  { ssr: false, loading: () => <TrustSectionSkeleton /> },
);

type Props = { bundle: ModontyTrustBundle; ctaLabel: string };

export function TrustSectionLazy({ bundle, ctaLabel }: Props) {
  return <TrustSection bundle={bundle} ctaLabel={ctaLabel} />;
}
