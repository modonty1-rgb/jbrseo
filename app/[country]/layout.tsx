import { redirect } from "next/navigation";
import { Suspense, type ReactElement, type ReactNode } from "react";
import { MarketingPageSkeleton } from "@/app/[country]/_components/MarketingPageSkeleton";
import {
  isSupportedCountrySlug,
  SUPPORTED_COUNTRY_SLUGS,
} from "@/lib/country-config";

export function generateStaticParams() {
  return SUPPORTED_COUNTRY_SLUGS.map((country) => ({ country }));
}

async function CountryLayoutContent({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    redirect("/sa");
  }
  return <>{children}</>;
}

function CountryLayoutSuspenseFallback(): ReactElement {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header skeleton */}
      <div className="sticky top-0 z-50 w-full border-b border-border backdrop-blur-sm">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-2 sm:px-8 lg:px-10">
            <div className="h-7 w-28 rounded-md bg-muted/60 animate-pulse" />
            <div className="hidden items-center gap-3 lg:flex">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 w-16 rounded-md bg-muted/50 animate-pulse" />
              ))}
            </div>
            <div className="h-8 w-36 rounded-full bg-muted/60 animate-pulse" />
          </div>
          <div className="grid grid-cols-4 gap-1 border-t border-border/80 px-3 pb-3 pt-2 lg:hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 rounded-lg bg-muted/40 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      {/* Page skeleton — identical to loading.tsx */}
      <MarketingPageSkeleton />
    </div>
  );
}

export default function CountryLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ country: string }>;
}) {
  return (
    <div dir="rtl" className="min-h-screen" lang="ar">
      <Suspense fallback={<CountryLayoutSuspenseFallback />}>
        <CountryLayoutContent params={params}>{children}</CountryLayoutContent>
      </Suspense>
    </div>
  );
}
