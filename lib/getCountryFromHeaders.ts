import type { SupportedCountry } from "./landing-content.types";

export function getCountryFromHeaders(headers: Headers): SupportedCountry {
  const override = headers.get("x-country-code")?.toUpperCase()?.slice(0, 2);
  if (override === "SA" || override === "EG") return override;
  const geo =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    "";
  const code = geo.toUpperCase().slice(0, 2);
  if (code === "SA") return "SA";
  if (code === "EG") return "EG";
  return "SA";
}
