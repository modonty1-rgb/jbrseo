# Public site – client components

Only components that currently have `"use client"` and are used on the public site (admin excluded). Server components that appear on the public site are listed under **Not client** for reference.

## Layout

- **ThemeToggle** — `app/components/layout/header/ThemeToggle.tsx` — used in `LandingHeader`
- **ChatWidgetLazy** — `app/components/layout/ChatWidgetLazy.tsx` — lazy entrypoint loaded by country/public layouts
- **ChatWidget** — `app/components/layout/ChatWidget.tsx` — actual chat widget mounted by `ChatWidgetLazy`

## Shared / root

- **Link** — `app/components/link/index.tsx` — global · prefetch on hover
- **ThemeProvider** — `app/helpers/useTheme.tsx` — root layout; useThemeOptional in ThemeToggle

## Landing `/[country]`

- **WhyNowInteractive** — `app/components/landing/WhyNow/WhyNowInteractive.tsx` — WhyNow.tsx (dynamic)
- **useCountUp** — `app/components/landing/WhyNow/useCountUp.ts` — WhyNowInteractive
- **SocialProofTabs** — `app/components/landing/SocialProof/SocialProofTabs.tsx` — SocialProofCarousel
- **SocialProofCard** — `app/components/landing/SocialProof/SocialProofCard.tsx` — SocialProofCarousel
- **SocialProofDots** — `app/components/landing/SocialProof/SocialProofDots.tsx` — SocialProofCarousel
- **SocialProofVideo** — `app/components/landing/SocialProof/SocialProofVideo.tsx` — SocialProofCard
- **SocialProofCarousel** — `app/components/landing/SocialProof/SocialProofCarousel.tsx` — SocialProof
- **FAQAccordion** — `app/components/landing/FAQ/FAQAccordion.tsx` — FAQ · expand/collapse

## Pricing `/[country]/pricing`

- **PricingBillingSection** — `app/components/pricing/PricingBillingSection.tsx` — `PricingPageShell` · main interactive pricing section
- **BillingToggle** — `app/components/pricing/BillingToggle.tsx` — monthly/yearly billing toggle inside `PricingBillingSection`
- **TierCard** — `app/components/pricing/TierCard.tsx` — interactive pricing tier cards inside `PricingBillingSection`
- **CurrencyIcon** — `app/components/shared/PricingBillingToggle.tsx` — currency icon used by signup/pricing forms
