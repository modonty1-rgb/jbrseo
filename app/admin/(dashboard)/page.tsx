import Link from "next/link";
import { getAdminLandingData } from "@/app/actions/landing";
import type { SupportedCountry } from "@/lib/landing-content.types";
import { Button } from "@/app/components/ui/button";
import { AdminDashboardTabs } from "./AdminDashboardTabs";

const COUNTRIES: { value: SupportedCountry; label: string }[] = [
  { value: "SA", label: "Saudi Arabia" },
  { value: "EG", label: "Egypt" },
];

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const params = await searchParams;
  const country = (params.country === "EG" ? "EG" : "SA") as SupportedCountry;
  const { texts, images, pricingPlans } = await getAdminLandingData(country);

  const bySection = texts.reduce<Record<string, { key: string; value: string }[]>>(
    (acc, { section, key, value }) => {
      if (section === "finalCta" && key === "cta") return acc;
      if (!acc[section]) acc[section] = [];
      acc[section].push({ key, value });
      return acc;
    },
    {}
  );

  if (texts.length === 0 && images.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Content editor</h1>
        <p className="rounded-lg border border-border bg-muted/50 p-4 text-muted-foreground">
          No data for this country. Run{" "}
          <code className="rounded bg-muted px-1">pnpm db:seed</code> to populate the database first.
        </p>
        <div className="mt-4 flex gap-2">
          {COUNTRIES.map((c) => (
            <Button key={c.value} variant="outline" size="sm" asChild>
              <Link href={`/admin?country=${c.value}`}>{c.label}</Link>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-[900px] px-4 py-4">
      <p className="mb-1.5 text-xs text-muted-foreground">For the best experience, use a desktop browser.</p>
      <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-foreground">Content editor</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/subscribers">Subscribers</Link>
          </Button>
          {COUNTRIES.map((c) => (
            <Button
              key={c.value}
              variant={country === c.value ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/admin?country=${c.value}`}>{c.label}</Link>
            </Button>
          ))}
        </div>
      </header>

      <AdminDashboardTabs country={country} bySection={bySection} images={images} pricingPlans={pricingPlans} />
    </div>
  );
}
