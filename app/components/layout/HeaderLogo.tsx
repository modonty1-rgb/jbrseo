import HeaderLogoClient from "./HeaderLogoClient";
import { PreviewLink } from "./PreviewLink";
import type { LandingContent } from "@/lib/landing-content.types";

type HeaderLogoProps = { landingImages: LandingContent["landingImages"]; logoHref?: string };
export function HeaderLogo({ landingImages, logoHref = "/#hero" }: HeaderLogoProps) {
  return (
    <PreviewLink
      href={logoHref}
      className="flex shrink-0 items-center gap-2"
      aria-label="مدونتي — الرئيسية"
    >
      <HeaderLogoClient logoLight={landingImages.logoLight} logoWhite={landingImages.logoWhite} />
    </PreviewLink>
  );
}
