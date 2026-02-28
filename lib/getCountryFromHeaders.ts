import type { SupportedCountry } from "./landing-content.types";

export function getCountryFromHeaders(headers: Headers): SupportedCountry {
  const geo =
    headers.get("x-vercel-ip-country") ??
    headers.get("cf-ipcountry") ??
    headers.get("x-country-code") ??
    "";
  const code = geo.toUpperCase().slice(0, 2);
  if (code === "SA") return "SA";
  if (code === "EG") return "EG";
  return "SA";
}
