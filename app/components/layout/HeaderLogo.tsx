import Link from "next/link";
import HeaderLogoClient from "./HeaderLogoClient";
import type { LandingContent } from "@/lib/landing-content.types";

export function HeaderLogo({ landingImages }: { landingImages: LandingContent["landingImages"] }) {
  return (
    <Link
      href="/#hero"
      className="flex shrink-0 items-center gap-2"
      aria-label="مدونتي — الرئيسية"
    >
      <HeaderLogoClient logoLight={landingImages.logoLight} logoWhite={landingImages.logoWhite} />
    </Link>
  );
}
