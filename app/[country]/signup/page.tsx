import { permanentRedirect } from "next/navigation";
import { isSupportedCountrySlug } from "@/lib/country-config";

// /signup is retired. Preserve any ?plan= / ?billing= / ?total= from old links
// (ads, emails, external referrals) and forward them to /checkout.
export default async function LegacySignupRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ country: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) permanentRedirect("/");
  const search = await searchParams;
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(search)) {
    if (typeof value === "string") qs.set(key, value);
    else if (Array.isArray(value) && value[0]) qs.set(key, value[0]);
  }
  const suffix = qs.toString() ? `?${qs.toString()}` : "";
  permanentRedirect(`/${slug}/checkout${suffix}`);
}
