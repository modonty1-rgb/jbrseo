import type { SupportedCountry } from "@/lib/landing-content.types";
import type { StaticLanding } from "@/app/content/landing/types";
import { getLandingSectionOverride } from "@/lib/landing-sections";
import { HeaderFooterForm } from "../HeaderFooterForm";

async function getCountry(
  searchParams: Promise<{ country?: string }>,
): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminHeaderFooterContentPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const country = await getCountry(searchParams);
  const headerOverride = await getLandingSectionOverride("header");
  const footerOverride = await getLandingSectionOverride("footer");

  const headerData =
    headerOverride && typeof headerOverride === "object" && !Array.isArray(headerOverride)
      ? (headerOverride as StaticLanding["header"])
      : ({} as StaticLanding["header"]);
  const footerData =
    footerOverride && typeof footerOverride === "object" && !Array.isArray(footerOverride)
      ? (footerOverride as StaticLanding["footer"])
      : ({} as StaticLanding["footer"]);

  const title = "الهيدر + الشعار";

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
          {title}
        </div>
        <div className="p-4">
          <HeaderFooterForm
            key={country}
            header={headerData}
            footer={footerData}
            country={country}
          />
        </div>
      </div>
    </div>
  );
}
