import { Suspense } from "react";
import { getAllPlansIncludingHidden } from "@/app/actions/pricing";
import { getMeta } from "@/app/actions/pricing-meta";
import { AdminCountryPill } from "../_components/AdminCountryPill";
import { AdminBillingToggle } from "./AdminBillingToggle";
import { AdminPlanCardWrapper } from "./AdminPlanCardWrapper";
import { PricingMetaInline } from "./PricingMetaInline";
import { dbMetaToPricingUi } from "@/lib/admin-pricing-adapter";
import type { SupportedCountry } from "@/lib/landing-content.types";

type Slug = "presence" | "starter" | "growth" | "scale";

async function resolveParams(searchParams: Promise<{ country?: string; billing?: string }>) {
  const p = await searchParams;
  return {
    country: (p.country === "EG" ? "EG" : "SA") as SupportedCountry,
    annual: p.billing === "annual",
  };
}

const updatedAtFormatter = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function AdminPricingPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string; billing?: string }>;
}) {
  const { country, annual } = await resolveParams(searchParams);
  const [plans, meta] = await Promise.all([getAllPlansIncludingHidden(country), getMeta(country)]);
  const ui = dbMetaToPricingUi(meta);
  const slugs = plans.map((p) => p.slug as Slug);
  // Tier ladder: each paid plan inherits the one below it. Maps slug → name of previous paid tier.
  const paidByOrder = plans.filter((p) => p.priceMonthly > 0).sort((a, b) => a.displayOrder - b.displayOrder);
  const previousTierNameBySlug = new Map<string, string>();
  paidByOrder.forEach((p, i) => {
    if (i > 0) previousTierNameBySlug.set(p.slug, paidByOrder[i - 1].name);
  });

  return (
    <div className="p-6">
      <header className="animate-fade-in-up mb-8 flex flex-row flex-wrap items-end justify-between gap-4 border-r-2 border-primary/70 pr-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.25em] text-primary">
            إدارة
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
            قسم التسعير — الخطط
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground max-w-xl">
            معاينة الكروت كما يراها الزائر — مع أدوات الأدمن فوق كل كرت.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-card/40 p-1.5 backdrop-blur-sm">
          <AdminBillingToggle annual={annual} />
          <Suspense fallback={null}>
            <AdminCountryPill />
          </Suspense>
        </div>
      </header>

      <PricingMetaInline
        country={country}
        initial={{
          announcement: meta.announcement,
          ctaHeadline: meta.ctaHeadline,
          ctaSubheadline: meta.ctaSubheadline,
          trustItems: Array.isArray(meta.trustItems)
            ? (meta.trustItems as Array<{ icon?: string; label?: string }>).map((t) => ({
                icon: t.icon ?? "",
                label: t.label ?? "",
              }))
            : [],
        }}
      />

      <div className="grid grid-cols-4 items-start gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1" dir="rtl">
        {plans.map((p, i) => (
          <AdminPlanCardWrapper
            key={p.id}
            country={country}
            dbPlan={{
              slug: p.slug,
              name: p.name,
              hook: p.hook,
              tagline: p.tagline,
              priceMonthly: p.priceMonthly,
              priceYearly: p.priceYearly,
              articlesLabel: p.articlesLabel,
              ctaText: p.ctaText,
              highlights: p.highlights,
              badge: p.badge,
              featuredBadge: p.featuredBadge,
              visible: p.visible,
              displayOrder: p.displayOrder,
              updatedAtLabel: updatedAtFormatter.format(p.updatedAt),
            }}
            ui={ui}
            annual={annual}
            index={i}
            totalCount={plans.length}
            allSlugs={slugs}
            previousTierName={previousTierNameBySlug.get(p.slug) ?? null}
          />
        ))}
      </div>

      <div className="mt-6 rounded-md border border-border/40 bg-muted/20 p-3 text-xs text-muted-foreground">
        <p>
          • <strong>👁 ظاهرة</strong>: لو أُغلقت، الكرت يطلع رمادي مع لافتة "مخفية" — والزائر ما يشوف الخطة.
        </p>
        <p>• <strong>▲▼</strong>: إعادة ترتيب الخطط — يحفظ مباشرة في DB.</p>
        <p>
          • <strong>شهري/سنوي</strong>: معاينة فقط — يبدّل عرض الكروت زي ما يشوفها الزائر بدون أي حفظ.
        </p>
      </div>
    </div>
  );
}
