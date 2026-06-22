import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getPlan } from "@/app/actions/pricing";
import { AdminCountryPill } from "../../_components/AdminCountryPill";
import { PlanEditForm } from "./PlanEditForm";
import type { SupportedCountry } from "@/lib/landing-content.types";

const ALLOWED_SLUGS = ["presence", "starter", "growth", "scale"] as const;
type PlanSlug = (typeof ALLOWED_SLUGS)[number];

function isAllowedSlug(s: string): s is PlanSlug {
  return ALLOWED_SLUGS.includes(s as PlanSlug);
}

async function resolveCountry(searchParams: Promise<{ country?: string }>): Promise<SupportedCountry> {
  const params = await searchParams;
  return params.country === "EG" ? "EG" : "SA";
}

export default async function AdminPlanEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ country?: string }>;
}) {
  const { slug: rawSlug } = await params;
  if (!isAllowedSlug(rawSlug)) notFound();
  const country = await resolveCountry(searchParams);
  const plan = await getPlan(country, rawSlug);
  if (!plan) notFound();

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={`/admin/pricing?country=${country}`} className="hover:text-foreground">
              قسم التسعير
            </Link>
            <span>›</span>
            <span className="text-foreground">{plan.name}</span>
          </nav>
          <h1 className="text-xl font-bold text-foreground">
            تعديل خطة: {plan.name} <code className="ml-2 rounded bg-muted/40 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">{plan.slug}</code>
          </h1>
        </div>
        <Suspense fallback={null}>
          <AdminCountryPill />
        </Suspense>
      </div>

      <PlanEditForm
        country={country}
        slug={rawSlug}
        initial={{
          name: plan.name,
          tagline: plan.tagline,
          priceMonthly: plan.priceMonthly,
          priceYearly: plan.priceYearly,
          articlesLabel: plan.articlesLabel,
          ctaText: plan.ctaText,
          highlights: plan.highlights,
          badge: plan.badge,
          featuredBadge: plan.featuredBadge,
          visible: plan.visible,
        }}
      />
    </div>
  );
}
