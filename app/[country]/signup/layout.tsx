import type { ReactNode } from "react";
import { AuthNav } from "@/app/components/auth/AuthNav";
import { getLandingContent } from "@/lib/getLandingContent";
import { getWhatsAppLink } from "@/lib/site-links";
import { getCountryCodeFromSlug, isSupportedCountrySlug } from "@/lib/country-config";

export default async function CountrySignupLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase() ?? "";
  const countrySlug = isSupportedCountrySlug(slug) ? slug : "sa";
  const countryCode = isSupportedCountrySlug(slug)
    ? getCountryCodeFromSlug(slug as "sa" | "eg")
    : "SA";
  const content = await getLandingContent(countryCode);
  const helpHref = getWhatsAppLink(countryCode, content.siteSettings?.whatsappNumber);
  const homeHref = `/${countrySlug}`;

  return (
    <div className="flex min-h-screen flex-col">
      <AuthNav homeHref={homeHref} helpHref={helpHref} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
    </div>
  );
}
