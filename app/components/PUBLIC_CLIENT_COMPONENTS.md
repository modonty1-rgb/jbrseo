# Public site – client components

Only components that currently have `"use client"` and are used on the public site (admin excluded). Server components that appear on the public site are listed under **Not client** for reference.

## Shared / root

- **Link** — `app/components/link/index.tsx` — global · prefetch on hover
- **ThemeProvider** — `app/helpers/useTheme.tsx` — root layout; useThemeOptional in ThemeToggle
- **ThemeToggle** — `app/components/layout/header/ThemeToggle.tsx` — used in `LandingHeader`

## Landing `/[country]` (sa, eg)

- **Landing** — `app/components/landing/Landing.tsx` — full landing experience (hero · math · features · pricing · voices · team · FAQ · CTA · calculator)
- **AnnouncementBar** — `app/components/landing/AnnouncementBar.tsx` — top dismissible bar
- **Footer** — `app/components/landing/Footer.tsx` — dark footer (links · socials · WA · country switch)
- **StickyMobileCTA** — `app/components/layout/StickyMobileCTA.tsx` — server component (fixed mobile CTA, no `"use client"`)
- **Navbar** — `app/components/landing/Navbar.tsx` — server component (no `"use client"`)
- **LandingJsonLd** — `app/components/landing/LandingJsonLd.tsx` — server component (JSON-LD only)

## Pricing `/[country]/pricing` + admin pricing preview

- **PlanCard** — `app/components/landing/price-section/PlanCard.tsx` — interactive plan card (used in pricing + admin preview)
- **PricingBillingSection** — `app/components/pricing/PricingBillingSection.tsx` — `PricingPageShell` · main interactive pricing section
- **BillingToggle** — `app/components/pricing/BillingToggle.tsx` — monthly/yearly billing toggle inside `PricingBillingSection`
- **TierCard** — `app/components/pricing/TierCard.tsx` — interactive pricing tier cards inside `PricingBillingSection`
- **CurrencyIcon** — `app/components/shared/PricingBillingToggle.tsx` — currency icon used by signup/pricing forms
