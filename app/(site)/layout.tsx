import { headers } from "next/headers";
import type { ReactNode } from "react";
import { LandingHeader } from "@/app/components/layout/LandingHeader";
import { Footer } from "@/app/components/layout/Footer";
import { getCountryFromHeaders } from "@/lib/getCountryFromHeaders";
import { getLandingContent } from "@/lib/getLandingContent";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const h = await headers();
  const country = getCountryFromHeaders(h);
  const content = await getLandingContent(country);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground" lang="ar">
      <LandingHeader content={content} />
      <main>{children}</main>
      <Footer content={content} />
    </div>
  );
}

