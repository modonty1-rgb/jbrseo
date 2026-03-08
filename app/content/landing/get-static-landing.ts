import type { SupportedCountry } from "@/lib/landing-content.types";
import { landingEG } from "./landing-eg";
import { landingSA } from "./landing-sa";
import type { StaticLanding } from "./types";

export function getStaticLanding(country: SupportedCountry): StaticLanding {
  return country === "EG" ? landingEG : landingSA;
}
