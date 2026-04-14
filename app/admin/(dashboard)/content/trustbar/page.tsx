import { Suspense } from "react";
import { getStaticLanding } from "@/app/content/landing/get-static-landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { TrustBarSectionForm } from "../TrustBarSectionForm";

async function getCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminTrustBarPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const staticLanding = getStaticLanding(country) as StaticLanding;
  const override = await getLandingSectionOverride(country, "hero");
  const heroData =
    override && typeof override === "object" && !Array.isArray(override)
      ? ({ ...staticLanding.hero, ...(override as Partial<StaticLanding["hero"]>) } as StaticLanding["hero"])
      : staticLanding.hero;

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">شريط العملاء</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
          شريط العملاء
        </div>
        <div className="p-4">
          <TrustBarSectionForm
            key={country}
            country={country}
            headline={heroData.trustBarHeadline ?? ""}
            clients={heroData.trustBarClients ?? []}
          />
        </div>
      </div>
    </div>
  );
}

