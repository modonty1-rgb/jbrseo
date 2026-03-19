# jbrseo.com/sa — Audit Report

Generated from command runs. No fixes applied.

---

## 1. BABEL CONFIG

```
NO BABEL FILES FOUND
```

No `babel.config.js`, `.babelrc`, `.babelrc.js`, or `babel.config.json` exist in the project.

---

## 2. NEXT CONFIG

**File:** `next.config.ts`

```ts
import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withBundleAnalyzer(nextConfig);
```

---

## 3. PACKAGE.JSON (relevant parts)

- **Package manager:** pnpm@9.15.0  
- **Next:** ^16.1.1  
- **React:** ^19.2.3  
- No `babel.config.js` or `babel-plugin-react-compiler` in repo  
- **browserslist** present

```json
{
  "name": "jbrseo.com",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "analyze": "ANALYZE=true next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:setup": "prisma generate && prisma db push && prisma db seed",
    "postinstall": "prisma generate"
  },
  "prisma": { "seed": "pnpm exec tsx prisma/seed.ts" },
  "dependencies": {
    "@heyo.so/js": "^1.1.3",
    "@prisma/client": "^6.9.0",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-slot": "^1.2.4",
    "@radix-ui/react-tabs": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "next": "^16.1.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3",
    "server-only": "^0.0.1",
    "tailwind-merge": "^3.4.0"
  },
  "browserslist": [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Safari versions",
    "last 2 Edge versions",
    "not dead",
    "not IE 11"
  ],
  "devDependencies": {
    "@next/bundle-analyzer": "^16.1.1",
    "@tailwindcss/postcss": "^4.1.18",
    "@types/node": "^25.0.3",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.2",
    "eslint-config-next": "^16.1.1",
    "postcss": "^8.5.6",
    "prisma": "^6.9.0",
    "tailwindcss": "^4.1.18",
    "tsx": "^4.19.2",
    "typescript": "^5.9.3"
  }
}
```

---

## 4. BUILD OUTPUT

**Command:** `pnpm build 2>&1`  
**Exit code:** 0

```
> jbrseo.com@0.1.0 build C:\Users\w2nad\Desktop\dreamToApp\JBRSEO\jbrseo.com
> next build

▲ Next.js 16.1.1 (Turbopack)
- Environments: .env

  Creating an optimized production build ...
✓ Compiled successfully in 26.6s
  Running TypeScript ...
  Collecting page data using 7 workers ...
  Generating static pages using 7 workers (0/26) ...
  Generating static pages using 7 workers (6/26) 
  Generating static pages using 7 workers (12/26) 
  Generating static pages using 7 workers (19/26) 
✓ Generating static pages using 7 workers (26/26) in 3.5s
  Finalizing page optimization ...

Route (app)                       Revalidate  Expire
┌ ƒ /
├ ○ /_not-found
├ ● /[country]                            1m      1y
│ ├ /sa                                   1m      1y
│ └ /eg                                   1m      1y
├ ƒ /[country]/pricing
├ ● /[country]/signup                     1m      1y
│ ├ /sa/signup                            1m      1y
│ └ /eg/signup                            1m      1y
├ ƒ /[country]/signup/thank-you
├ ƒ /about
├ ƒ /admin
├ ƒ /admin/content/[section]
├ ƒ /admin/content/emojis
├ ƒ /admin/content/header-footer
├ ○ /admin/login
├ ƒ /admin/settings
├ ƒ /admin/settings/images
├ ƒ /admin/settings/seo
├ ƒ /admin/subscribers
├ ƒ /privacy
├ ○ /robots.txt
├ ○ /sitemap.xml
├ ƒ /team
└ ƒ /terms


ƒ Proxy (Middleware)

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

---

## 5. /sa PAGE FILE

**Note:** There is no file at path `*/sa/page.tsx`. The `/sa` route is served by the dynamic segment **`app/[country]/page.tsx`** (with `country=sa`).

**File:** `app/[country]/page.tsx` (full content)

```tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import type { StaticLanding } from "@/app/content/landing/types";
import Hero from "@/app/components/landing/hero/Hero";
import WhyNow from "@/app/components/landing/WhyNow/WhyNow";
import HowItWorks from "@/app/components/landing/HowItWorks/HowItWorks";
import Outcomes from "@/app/components/landing/Outcomes/Outcomes";
import LandingJsonLd from "@/app/components/shared/LandingJsonLd";
import { SectionReveal } from "@/app/components/shared/SectionReveal";
import { getStaticLandingWithOverrides } from "@/app/content/landing/get-static-landing";
import {
  getCountryCodeFromSlug,
  isSupportedCountrySlug,
} from "@/lib/country-config";
import { getLandingContent } from "@/lib/getLandingContent";

const sectionFallback = () => <section className="min-h-[200px]" aria-hidden />;

const SocialProof = dynamic(
  () => import("@/app/components/landing/SocialProof/SocialProof"),
  { loading: sectionFallback }
);
const ModontyPricing = dynamic(
  () => import("@/app/components/landing/price-section/price-section"),
  { loading: sectionFallback }
);
const FAQ = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string }>(
  () => import("@/app/components/landing/FAQ/FAQ"),
  { loading: sectionFallback }
);
const FinalCTA = dynamic<{ staticLanding: StaticLanding; country: import("@/lib/landing-content.types").SupportedCountry; ctaLabel?: string; ctaLink?: string }>(
  () => import("@/app/components/landing/FinalCTA/FinalCTA"),
  { loading: sectionFallback }
);

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jbrseo.com";
  return pathOrUrl.startsWith("/") ? `${base}${pathOrUrl}` : `${base}/${pathOrUrl}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string }>;
}): Promise<Metadata> {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return { title: "JBRSEO" };
  }
  const countryCode = getCountryCodeFromSlug(slug as "sa" | "eg");
  const content = await getLandingContent(countryCode);
  const { seo: s } = content;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jbrseo.com";
  const canonical = `${siteUrl.replace(/\/$/, "")}/${slug}`;
  const ogImageUrl = s.ogImage ? toAbsoluteUrl(s.ogImage) : "";
  const twitterImageUrl = s.twitterImage ? toAbsoluteUrl(s.twitterImage) : ogImageUrl;
  const ogImages = ogImageUrl
    ? [{ url: ogImageUrl, width: parseInt(s.ogImageWidth, 10) || 1200, height: parseInt(s.ogImageHeight, 10) || 630, alt: s.ogTitle || s.title }]
    : undefined;
  const twitterImages = twitterImageUrl ? [twitterImageUrl] : undefined;
  return {
    title: s.title,
    description: s.description,
    alternates: {
      canonical,
      languages: { ar: canonical },
    },
    openGraph: {
      title: s.ogTitle || s.title,
      description: s.ogDescription || s.description,
      url: canonical,
      locale: s.ogLocale || "ar_SA",
      type: (s.ogType as "website") || "website",
      siteName: s.ogSiteName || "JBRSEO",
      images: ogImages,
    },
    twitter: {
      card: (s.twitterCard as "summary_large_image") || "summary_large_image",
      title: s.twitterTitle || s.title,
      description: s.twitterDescription || s.description,
      images: twitterImages,
    },
  };
}

export const revalidate = 60;

export default async function CountryHome({
  params,
}: {
  params: Promise<{ country: string }>;
}) {
  const { country: raw } = await params;
  const slug = raw?.toLowerCase();
  if (!isSupportedCountrySlug(slug)) {
    return null;
  }
  const countrySlug = slug as "sa" | "eg";
  const countryCode = getCountryCodeFromSlug(countrySlug);
  const basePath = `/${countrySlug}`;
  const ctaLink = `${basePath}/signup`;
  const pricingHrefBase = `${basePath}/pricing`;
  const signupHrefBase = ctaLink;
  const outcomesCtaLink = `${basePath}#pricing`;

  const [content, pricingSALanding, pricingEGLanding] = await Promise.all([
    getLandingContent(countryCode),
    getStaticLandingWithOverrides("SA"),
    getStaticLandingWithOverrides("EG"),
  ]);
  const baseLanding = content.staticLanding ?? (await getStaticLandingWithOverrides(countryCode));
  const si = content.sectionImages;
  const mergedStaticLanding: StaticLanding = {
    ...baseLanding,
    hero: { ...baseLanding.hero, sectionImage: si?.hero ?? "" },
    whyNow: { ...baseLanding.whyNow, sectionImage: si?.whyNow ?? baseLanding.whyNow.sectionImage ?? "" },
    howItWorks: { ...baseLanding.howItWorks, sectionImage: si?.howItWorks ?? baseLanding.howItWorks.sectionImage ?? "" },
    outcomes: { ...baseLanding.outcomes, sectionImage: si?.outcomes ?? baseLanding.outcomes.sectionImage ?? "" },
    socialProof: { ...baseLanding.socialProof, sectionImage: si?.socialProof ?? baseLanding.socialProof.sectionImage ?? "" },
    faq: { ...baseLanding.faq, sectionImage: si?.faq ?? baseLanding.faq.sectionImage ?? "" },
    finalCta: { ...baseLanding.finalCta, sectionImage: si?.finalCta ?? baseLanding.finalCta.sectionImage ?? "" },
    pricing: baseLanding.pricing,
    pricingPage: baseLanding.pricingPage,
  };
  const showSectionCounter = content.siteSettings.showSectionCounter;
  const ctaLabel = content.siteSettings.ctaLabel || "ابدأ مجاناً — بدون بطاقة";
  const pricingSA = pricingSALanding.pricing;
  const pricingEG = pricingEGLanding.pricing;
  const initialLocale = countryCode === "EG" ? "eg" : "sa";

  return (
    <>
      <LandingJsonLd content={content} />
      <SectionReveal variant="none" sectionNumber={1} showSectionCounter={showSectionCounter}>
        <Hero content={content} staticLanding={mergedStaticLanding} country={countryCode} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={2} showSectionCounter={showSectionCounter}>
        <WhyNow staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={3} showSectionCounter={showSectionCounter}>
        <HowItWorks staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={4} showSectionCounter={showSectionCounter}>
        <Outcomes staticLanding={mergedStaticLanding} ctaLabel={ctaLabel} ctaLink={outcomesCtaLink} />
      </SectionReveal>
      <SectionReveal variant="fade-up" sectionNumber={5} showSectionCounter={showSectionCounter}>
        <SocialProof staticLanding={mergedStaticLanding} />
      </SectionReveal>
      <SectionReveal variant="fade-up" delay={80} sectionNumber={6} showSectionCounter={showSectionCounter}>
        <div id="pricing">
          <ModontyPricing
            pricingSA={pricingSA}
            pricingEG={pricingEG}
            initialLocale={initialLocale}
            variant="homepage"
            pricingHrefBase={pricingHrefBase}
            signupHrefBase={signupHrefBase}
          />
        </div>
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={7} showSectionCounter={showSectionCounter}>
        <FAQ staticLanding={mergedStaticLanding} country={countryCode} ctaLabel="تحدث معنا على واتساب" />
      </SectionReveal>
      <SectionReveal variant="blur-in" sectionNumber={8} showSectionCounter={showSectionCounter}>
        <FinalCTA staticLanding={mergedStaticLanding} country={countryCode} ctaLabel={ctaLabel} ctaLink={ctaLink} />
      </SectionReveal>
    </>
  );
}
```

---

## 6. ROUTE BUILD STATUS

**Command:** `pnpm build 2>&1 | grep -E "λ|○|◐|/sa"` (PowerShell equivalent used)

```
│ ├ /sa                                   1m      1y
│ ├ /sa/signup                            1m      1y
```

**Legend (from build output):**

| Symbol | Meaning |
|--------|--------|
| ○ | Static — prerendered as static content |
| ● | SSG — prerendered as static HTML (uses generateStaticParams) |
| ƒ | Dynamic — server-rendered on demand |
| λ | (not present) Server-rendered on demand |

**Summary:**

- **`/[country]`** (includes **`/sa`**) is **● SSG**, revalidate 1m.
- **`/sa/signup`** is **● SSG**, revalidate 1m.
- No **λ** (server-rendered on demand) for these routes.

---

## Summary

| Item | Result |
|------|--------|
| Babel config files | None found |
| Next config | `reactCompiler: true`, Cloudinary images, AVIF/WebP |
| Build | Passes (exit 0) |
| /sa page | Served by `app/[country]/page.tsx` |
| /sa route type | ● SSG (not λ) |
