import { Suspense } from "react";
import { getStaticLanding } from "@/app/content/landing/get-static-landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { AdminCountryPill } from "../../components/AdminCountryPill";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { HeaderFooterCombinedForm } from "../HeaderFooterCombinedForm";

async function getCountry(
  searchParams: Promise<{ country?: string }>,
): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminHeaderFooterContentPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; useDefault?: string }>;
}) {
  const country = await getCountry(searchParams);
  const { useDefault } = await searchParams;
  const data = getStaticLanding(country) as StaticLanding;

  const staticHeader = data.header;
  let headerData: StaticLanding["header"];

  if (useDefault === "1") {
    headerData = staticHeader;
  } else {
    const override = await getLandingSectionOverride(
      country as SupportedCountry,
      "header",
    );
    if (override !== null && override !== undefined && typeof override === "object") {
      headerData = { ...staticHeader, ...override } as StaticLanding["header"];
    } else {
      headerData = staticHeader;
    }
  }

  const staticFooter = data.footer;
  let footerData: StaticLanding["footer"];

  if (useDefault === "1") {
    footerData = staticFooter;
  } else {
    const override = await getLandingSectionOverride(
      country as SupportedCountry,
      "footer",
    );
    if (override !== null && override !== undefined) {
      footerData = override as StaticLanding["footer"];
    } else {
      footerData = staticFooter;
    }
  }

  const label = "Header & footer sections";

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">{label}</h1>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
          {label}
        </div>
        <div className="p-4">
          <HeaderFooterCombinedForm
            header={headerData}
            footer={footerData}
            country={country}
          />
        </div>
      </div>
    </div>
  );
}

