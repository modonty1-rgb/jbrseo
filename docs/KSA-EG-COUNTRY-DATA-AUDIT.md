# KSA & Egypt Country Data — Full Audit Report

## 1. How country is determined

| Layer | Implementation | File(s) |
|-------|----------------|--------|
| **Detection** | `getCountryFromHeaders(headers)` reads `x-vercel-ip-country` → `cf-ipcountry` → `x-country-code`. Returns `"SA"` or `"EG"`; default **SA** if missing/unrecognized. | [`lib/getCountryFromHeaders.ts`](lib/getCountryFromHeaders.ts) |
| **Type** | `SupportedCountry = "SA" | "EG"` | [`lib/landing-content.types.ts`](lib/landing-content.types.ts) |
| **Usage** | Used in: (site) layout, landing page, signup page, pricing page — all call `getCountryFromHeaders(await headers())` then `getLandingContent(country)`. | [`app/(site)/layout.tsx`](app/(site)/layout.tsx), [`app/(site)/page.tsx`](app/(site)/page.tsx), [`app/(site)/signup/page.tsx`](app/(site)/signup/page.tsx), [`app/(site)/pricing/page.tsx`](app/(site)/pricing/page.tsx) |

**Gap:** No URL/query override (e.g. `?country=EG`). Country is **only** from request headers (Vercel/Cloudflare geo). Local dev has no geo → always SA.

---

## 2. Schema (Prisma) — country-aware data

| Model | Key fields | Country role |
|-------|------------|--------------|
| **LandingText** | `country`, `section`, `key`, `value` | Unique per `(country, section, key)`. All CMS-style copy stored per country. |
| **LandingImage** | `country`, `key`, `url` | Unique per `(country, key)`. Logos, contact avatar per country. |
| **PricingPlan** | `country`, `sortOrder`, `name`, `forWho`, `price`, `annualPrice`, `badge`, `highlight`, `features` | Unique per `(country, sortOrder)`. Plans are per country. |
| **Subscriber** | `email`, `phone`, `country`, `planName`, `planIndex`, `isAnnual`, … | `country` stored on signup; used for filtering/reports. |

**Conclusion:** Schema is correctly set up for per-country content and subscribers.

---

## 3. Admin page — country-specific editing

| Aspect | Implementation |
|--------|----------------|
| **Entry** | `/admin` with optional `?country=SA` or `?country=EG`. Default SA. |
| **Data** | `getAdminLandingData(country)` loads `LandingText`, `LandingImage`, `PricingPlan` for that country only. |
| **UI** | Tabs: Hero, Why Now, How It Works, Outcomes, Social Proof, Pricing (4 plans), FAQ, Final CTA, Footer, SEO, Settings (images + tracking + section counter). Every form posts with `country` and server actions upsert by `(country, section, key)` or `(country, key)` or pricing by `(country, sortOrder)`. |
| **Subscribers** | `/admin/subscribers` — list/create/edit subscribers; `country` is a field (SA/EG). |

**Conclusion:** Admin is fully country-aware. Editing SA does not change EG and vice versa.

---

## 4. Content flow: DB vs static `app/content`

### 4.1 What **is** loaded from DB (per country)

- **SEO:** title, description, canonical, OG/Twitter — used in `generateMetadata()` and `LandingJsonLd`.
- **Landing images:** contactAvatar, logoWhite, logoLight — used in Hero (avatar), Footer (logos), JsonLd.
- **Hero CTA:** `content.landing.hero.cta` — used in Header and passed through.
- **Footer:** `content.footer` (brandName, copyright) — used in Footer (alongside some hardcoded links/tagline).
- **Pricing plans:** `content.landing.pricingTeaser.plans` — used on **signup** page (serverPlans + country) and in `getLandingContent` for landing. **Not** used by the pricing **section** component (see below).
- **Section headings:** stored in DB and built in `getLandingContent` as `sectionHeadings` — but see 4.2.

### 4.2 What is **not** used from DB (static `app/content` wins)

These components **receive** `content` but **ignore** most of it and use static imports:

| Component | Uses from `content` | Uses from static `app/content` |
|-----------|---------------------|----------------------------------|
| **Hero** | `content.landingImages.contactAvatar` | Headlines, benefits, proof, CTA copy, stats, etc. from [`hero-content.ts`](app/content/landing/hero-content.ts) (HC) |
| **WhyNow** | — | [`why-now-content`](app/content/landing/why-now-content) (HC) |
| **HowItWorks** | — | [`how-it-works-content`](app/content/landing/how-it-works-content) (HC) |
| **Outcomes** | — | [`outcomes-content`](app/content/landing/outcomes-content) (OUTCOMES_CONTENT) |
| **SocialProof** | — | [`social-proof-content`](app/content/landing/social-proof-content) |
| **FAQ** | — | [`faq-content`](app/content/landing/faq-content) (FAQ_CONTENT) |
| **FinalCTA** | — | [`final-cta-content`](app/content/landing/final-cta-content) |

So: **admin-edited copy for Hero (except avatar), Why Now, How It Works, Outcomes, Social Proof, FAQ, and Final CTA is never shown on the site.** Only SEO, images, hero.cta, footer, and pricing plans (and signup flow) are effectively driven by DB/admin.

### 4.3 Pricing section — not synced with country

- **Landing pricing block:** [`app/components/landing/price-section/price-section.tsx`](app/components/landing/price-section/price-section.tsx) is a **client** component.
- It uses **static** [`price-section-sa`](app/content/landing/price-section-sa.ts) and [`price-section-egy`](app/content/landing/price-section-egy.ts) and a **local state** `locale: "sa" | "eg"` (toggle in UI).
- It does **not** receive `country` from headers or `content.landing.pricingTeaser.plans` from the DB.
- So: **Landing pricing section** = static SA/EG files + user toggle. **Signup page** = DB plans + country from headers (correct).

---

## 5. Seed and fallback

- **Seed** ([`prisma/seed.ts`](prisma/seed.ts)): Inserts the **same** content from `app/content/landing` (and landing-images, texts) for **both** SA and EG. So after seed, both countries have identical copy; differentiation is only after editing in admin.
- **Fallback:** If DB has no rows for a country, `getLandingContent(country)` uses `getStaticFallback()` which imports the same static `app/content/landing` (and related) — so again one set of copy for both.

---

## 6. Summary table

| Area | KSA/EG aware? | Notes |
|------|----------------|--------|
| Country detection | Yes | Headers only; no query override |
| Prisma schema | Yes | LandingText, LandingImage, PricingPlan, Subscriber all have country |
| Admin content editor | Yes | Per-country tabs; all writes scoped by country |
| Admin subscribers | Yes | Country field and filtering |
| Signup page | Yes | Uses `getLandingContent(country)` and passes country + serverPlans |
| Metadata + JsonLd | Yes | From `content` (DB per country) |
| Header CTA | Yes | `content.landing.hero.cta` |
| Footer | Partial | Uses content.footer + content.landingImages; rest hardcoded |
| Hero | Partial | Only avatar from content; rest from static HC |
| WhyNow, HowItWorks, Outcomes, SocialProof, FAQ, FinalCTA | **No** | All use static `app/content`; DB content for these sections **not rendered** |
| Landing pricing section | **No** | Static SA/EG files + client locale toggle; not DB or header country |

---

## 7. Recommended enhancements (priority order)

### P0 — Make landing sections use DB content (real KSA/EG differentiation)

- **Goal:** What editors change in admin for a country is what visitors from that country see.
- **Change:** For Hero, WhyNow, HowItWorks, Outcomes, SocialProof, FAQ, FinalCTA:
  - Prefer `content.landing.*` and `content.sectionHeadings` from `getLandingContent(country)`.
  - Use static `app/content` only as **fallback** when a field is missing or for development.
- **Mapping:** Align component props with `LandingContent` (and sectionHeadings). Some static content has extra shape (e.g. outcomes with `icon`, `token`); either extend `LandingContent`/DB or map DB → component shape.
- **Outcome:** Admin edits per country will drive the live site for that country.

### P1 — Sync pricing section with detected country

- **Current:** Pricing section uses client `locale` and static price-section-sa/egy.
- **Options:**
  - **A)** Pass `country` from layout/page (from headers) into the pricing section and use it as initial `locale` and hide (or lock) the SA/EG toggle for consistency with rest of site; **or**
  - **B)** Drive pricing section from `content.landing.pricingTeaser.plans` (same as signup) so admin pricing plans are the single source of truth, and only use static files as fallback.
- **Recommendation:** B for one source of truth; then pricing section can show “SAR” vs “EGP” (or labels) from content/country.

### P2 — Country override for testing and SEO

- **Add:** Optional `?country=EG` (or `country=sa`) on landing/signup so:
  - Testers can force country without geo.
  - You can use it for hreflang/canonical (e.g. same page with different country param) if you later want country in URL.
- **Implementation:** In pages that use `getCountryFromHeaders(h)`, prefer `searchParams.country` when present and valid (`SA`/`EG`), else headers. Pass through to `getLandingContent` and metadata.

### P3 — Footer and header fully from content

- **Footer:** Replace hardcoded HC (tagline, desc, wa, links, legal) with fields from `content.footer` or new keys in LandingText (e.g. footer_tagline, footer_links JSON). Admin already has footer brandName/copyright.
- **Header:** SEATS and NAV_LINKS are hardcoded; consider sectionHeadings or a “header” section in DB so nav labels and seat counts can be per country.

### P4 — Seed and fallback per country

- **Seed:** Optionally seed SA and EG with **different** default copy (e.g. different hero line or pricing labels) so it’s obvious that two markets are supported.
- **Fallback:** `getStaticFallback()` could accept `country` and return different static defaults for SA vs EG if you add country-specific static files.

### P5 — Subscribers list filter by country

- **Current:** Subscribers page has search; country is stored.
- **Enhancement:** Add a country filter (SA / EG / All) so admins can quickly see per-market signups.

---

## 8. Files to touch (for P0 + P1)

- **Use DB content on landing:**  
  [`Hero`](app/components/landing/hero/Hero.tsx), [`WhyNow`](app/components/landing/WhyNow/WhyNow.tsx), [`HowItWorks`](app/components/landing/HowItWorks/HowItWorks.tsx), [`Outcomes`](app/components/landing/Outcomes/Outcomes.tsx), [`SocialProof`](app/components/landing/SocialProof/SocialProof.tsx), [`FAQ`](app/components/landing/FAQ/FAQ.tsx), [`FinalCTA`](app/components/landing/FinalCTA/FinalCTA.tsx).  
  Map `content.landing.*` and `content.sectionHeadings` into existing props; keep static imports as fallback where structure differs.

- **Pricing section:**  
  [`price-section.tsx`](app/components/landing/price-section/price-section.tsx): Accept `country` and optionally `plans` from server; initial locale = country; optionally drive plans from `content.landing.pricingTeaser.plans` instead of static files.

- **Optional country override:**  
  [`app/(site)/layout.tsx`](app/(site)/layout.tsx), [`app/(site)/page.tsx`](app/(site)/page.tsx), [`app/(site)/signup/page.tsx`](app/(site)/signup/page.tsx): Read `searchParams.country`, validate SA/EG, use when provided else `getCountryFromHeaders`.

This report and the enhancement list can be used as a single reference for making the app fully country-aware end-to-end (KSA vs Egypt).
