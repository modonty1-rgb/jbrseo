# app/content — Agent Reference

Reference for AI agents working in `app/content`. Do not change runtime behavior; use this to locate types, entry points, and consumers.

---

## 1. Folder layout

```
app/content/
├── AGENT.md              ← this file
├── landing.ts            # Barrel: landing copy + seo (fallback for getLandingContent)
├── landing-images.ts     # Default logo/avatar URLs (fallback + seed)
└── landing/
    ├── types.ts          # StaticLanding + shared section types (single source for section props)
    ├── price-section-types.ts  # Plan, Section, PricingContent, TrustItem, PricingHero, etc.
    ├── get-static-landing.ts   # getStaticLanding(country) → landingSA | landingEG
    ├── landing-sa.ts     # landingSA: StaticLanding (Saudi dialect)
    └── landing-eg.ts     # landingEG: StaticLanding (Egyptian dialect)
```

---

## 2. Entry points and roles

| File | Role | Exports |
|------|------|--------|
| `landing.ts` | Fallback copy when DB/cache fails; Arabic-first generic copy | `landing`, `seo` |
| `landing-images.ts` | Default Cloudinary logo/avatar | `landingImages` |
| `landing/get-static-landing.ts` | Resolve static landing by country | `getStaticLanding(country)` |
| `landing/landing-sa.ts` | Saudi (SA) full static content | `landingSA: StaticLanding` |
| `landing/landing-eg.ts` | Egypt (EG) full static content | `landingEG: StaticLanding` |
| `landing/types.ts` | Section and page types | `StaticLanding`, `OutcomeItem`, `FaqItem`, `Testimonial`, `NavLink`, `FooterLink`, `TAG_TOKENS` |
| `landing/price-section-types.ts` | Pricing block types | `Plan`, `Section`, `PricingContent`, `TrustItem`, `PricingHero`, `PricingBottomCta`, `PricingUI` |

---

## 3. Type flow (high level)

- **StaticLanding** (`landing/types.ts`): Full static page content. Sections: `hero`, `whyNow`, `howItWorks`, `outcomes`, `socialProof`, `faq`, `finalCta`, plus `header`, `footer`, `pricing`, `pricingPage`. Each section may have `sectionImage?: string` (overridden by DB in `lib/getLandingContent.ts`).
- **LandingContent** lives in `lib/landing-content.types.ts` (not under `app/content`). It is the merged result of DB + static fallback; `getLandingContent(country)` in `lib/getLandingContent.ts` builds it and uses `getStaticLanding(country)` and optionally `@/app/content/landing` + `@/app/content/landing-images` for fallback.
- **SupportedCountry**: `"SA" | "EG"` — defined in `lib/landing-content.types.ts`. Used by `getStaticLanding` and `getCountryFromHeaders`.

---

## 4. Who consumes app/content

- **`getStaticLanding(country)`**: `app/(site)/layout.tsx`, `app/(site)/page.tsx`, `app/(site)/pricing/page.tsx`, `lib/getLandingContent.ts`.
- **`StaticLanding` type**: Hero, WhyNow, HowItWorks, Outcomes, SocialProof, FAQ, FinalCTA, LandingHeader, Footer (they receive `staticLanding` from layout/page).
- **Section/item types**: OutcomeCard → `OutcomeItem`; FAQAccordion → `FaqItem` + `TAG_TOKENS`; SocialProof* → `Testimonial`; TrustBar → `TrustItem`; PlanCard/PriceSectionHeader → `Plan`, `Section`, `PricingContent`, `PricingUI`, `PricingHero`.
- **Fallback**: `lib/getLandingContent.ts` dynamic-imports `@/app/content/landing` and `@/app/content/landing-images` inside `getStaticFallback()`.
- **Seed**: `prisma/seed.ts` imports `seo` from `app/content/landing` and `landingImages` from `app/content/landing-images`.
- **Logos**: Hardcoded in `app/content/landing-images.ts`; not editable in admin. Public site and JSON-LD use them via `getLandingContent` → `base.landingImages`.

---

## 5. Pricing: static vs teaser

- **Full pricing** (plans, copy, UI strings): In `landing-sa.ts` / `landing-eg.ts` as `pricing: PricingContent` (ANNOUNCEMENT, HERO, PLANS, TRUST_ITEMS, BOTTOM_CTA, UI). Consumed by price-section components and `app/(site)/pricing/page.tsx` via `getStaticLanding(country).pricing`.
- **Teaser plans on homepage**: Built in `lib/getLandingContent.ts` via `staticPlansToPricingPlans(staticLanding.pricing.PLANS, sectionCta, country)` from `lib/static-plans-to-content.ts`; result is `LandingContent.landing.pricingTeaser.plans` (type `PricingPlan` in `lib/landing-content.types.ts`). Do not confuse `Plan[]` (content) with `PricingPlan[]` (API for hero teaser).

---

## 6. Agent rules

- **Adding a section**: Extend `StaticLanding` in `landing/types.ts`, then add the same shape to `landing-sa.ts` and `landing-eg.ts`, then pass `staticLanding.newSection` to the new component. Keep `sectionImage?: string` if the section has a background image (filled by DB in getLandingContent).
- **Changing copy only**: Edit only `landing-sa.ts` or `landing-eg.ts` (or both). Do not change `landing.ts` unless you intend to change the generic fallback used when DB is unavailable.
- **Changing pricing structure**: Update `landing/price-section-types.ts` and both `landing-sa.ts` and `landing-eg.ts` so PLANS/UI/TRUST_ITEMS stay in sync. If teaser mapping changes, update `lib/static-plans-to-content.ts` and `LandingContent.landing.pricingTeaser` usage.
- **New shared type for a section**: Prefer defining it in `landing/types.ts` (or `price-section-types.ts` for pricing-only). Re-export or import in components from `@/app/content/landing/types` (or `.../price-section-types`).
- **Images**: Default URLs live in `landing-images.ts`. Per-country section images come from DB (SiteSettings.images) and are merged in `lib/getLandingContent.ts` into `sectionImages`; do not put section image URLs in `landing-sa`/`landing-eg` except empty string if you want “use DB only”.

---

## 7. Quick import map (for agents)

- Need **country-based static landing** → `getStaticLanding` from `@/app/content/landing/get-static-landing`.
- Need **StaticLanding type or section types** (OutcomeItem, FaqItem, Testimonial, etc.) → `@/app/content/landing/types`.
- Need **pricing types or Plan/PricingContent** → `@/app/content/landing/price-section-types`.
- Need **fallback SEO/copy or default images** → `@/app/content/landing`, `@/app/content/landing-images`.
- Need **SupportedCountry** or **LandingContent** → `lib/landing-content.types`, `lib/getLandingContent`.
