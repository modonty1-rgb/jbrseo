---
name: Country-aware landing routing
overview: Serve SA/EG country-specific landing, pricing, and signup under app/[country]/ with proxy geo-redirect for /, URL-based country, and no headers() in [country] routes. Aligned with Next.js 16 and Vercel docs.
todos: []
isProject: false
---

# Country-aware routing (verified vs official docs)

## Official docs compliance (Next 16 + Vercel)

- **Proxy (not middleware):** Next.js 16 uses `proxy.ts` and a named/default export `proxy(request: NextRequest)`. Use [nextjs.org/docs/app/getting-started/proxy](https://nextjs.org/docs/app/getting-started/proxy). Do not create `middleware.ts`.
- **Params are Promise:** In Next 16, `params` and `searchParams` are `Promise<...>` in layout, page, and `generateMetadata`. Always `const { country } = await params` (and `await searchParams` where used). See [Next 16 upgrading](https://nextjs.org/docs/app/guides/upgrading/version-16).
- **Geo in proxy:** `request.geo` was removed from NextRequest in Next 15+. On Vercel, use `request.headers.get("x-vercel-ip-country")` for country (2-letter code). Do not use `request.geo`. Locally the header may be missing; default to `"sa"`. [Vercel geo](https://vercel.com/kb/guide/geo-ip-headers-geolocation-vercel-functions).
- **Redirect:** `return NextResponse.redirect(new URL(\`/${slug}\`, request.url))`. Matcher must include `"/"`; existing matcher in [proxy.ts](proxy.ts) already covers it.
- **Invalid country prefix:** Do not 404. Redirect to the correct country based on user IP (geo). Layout fallback: if an invalid slug ever reaches the layout, redirect to `/${geoSlug}` using `headers().get("x-vercel-ip-country")` and `redirect()` from `next/navigation`.
- **URL prefix must match visitor country (UX):** If a visitor opens a path whose country prefix does not match their IP (e.g. Egyptian user opens `/sa` or `/sa/pricing`), redirect them to their country so they always see their own content and prices. So in proxy: when first segment is a valid country slug but different from `geoSlug`, redirect to `/${geoSlug}${rest}`. Only allow the request through when the prefix matches their geo.
- **Preview override (you and your team):** To check the other country from anywhere, use query param `?country=sa` or `?country=eg`. In proxy, **effective geo** = that param (if valid slug) else IP geo. Use effective geo for all redirect logic. So from Egypt you open `https://jbrseo.com/sa?country=sa` → effective geo = sa, prefix = sa → allow (you see Saudi). Bookmark `/sa?country=sa` and `/eg?country=eg` for preview. Keep the param on internal [country] links when present so navigation stays in preview (e.g. `/sa/pricing?country=sa`).
- **Canonical URLs:** Use lowercase slugs in URLs (`/sa`, `/eg`) so redirect and links are consistent. Normalize `params.country` with `.toLowerCase()` before config lookup so `/SA` and `/sa` both resolve.

---

## Implementation: small steps (do in order, verify each)

**Step 1.** Add [lib/country-config.ts](lib/country-config.ts): `COUNTRY_CONFIG`, `CountrySlug`, `SUPPORTED_COUNTRY_SLUGS`, `RESERVED_FIRST_SEGMENTS`, `getCountrySlugFromParam`, `getCountryCodeFromSlug`, `isSupportedCountrySlug` (return false for undefined/empty). See Section 1. Run `pnpm build` — no errors.

**Step 2.** Update [lib/site-links.ts](lib/site-links.ts): add optional `basePath` to `getNavLinks(country, basePath?)` and `getFooterLinks(country, basePath?)`; when basePath set, rewrite hrefs that start with `"/#"` to `basePath + href.slice(1)`. See Section 3.5. Build again.

**Step 3.** Update components to accept optional country-prefix props (defaults keep current behavior): [PlanCard.tsx](app/components/landing/price-section/PlanCard.tsx) `pricingHrefBase`, [PriceSectionBottomCta.tsx](app/components/landing/price-section/PriceSectionBottomCta.tsx) `signupHref`, [price-section.tsx](app/components/landing/price-section/price-section.tsx) `pricingHrefBase` + `signupHrefBase`, [PricingPageShell.tsx](app/components/pricing/PricingPageShell.tsx) `signupHrefBase`, [LandingHeader.tsx](app/components/layout/LandingHeader.tsx) `logoHref` + `pricingHref` (pass latter to HeaderActions), [Footer.tsx](app/components/layout/Footer.tsx) `basePath`. See Section 3.5. Build again.

**Step 4.** Add [app/[country]/layout.tsx](app/[country]/layout.tsx): await params; validate slug (invalid → redirect via headers geo); fetch content by countryCode; render Header, main, Footer with countrySlug-based hrefs and basePath. See Section 3.1. Build. Note: `/sa` and `/eg` will 404 until Step 5 adds the page — expected.

**Step 5.** Add [app/[country]/page.tsx](app/[country]/page.tsx): copy home logic from (site)/page.tsx; use params for country; pass ctaLink and pricing/signup bases to sections; generateMetadata from params; `revalidate = 300`. See Section 3.2. Build; open `/sa` and `/eg` — full landing.

**Step 6.** Add [app/[country]/pricing/page.tsx](app/[country]/pricing/page.tsx): params → countryCode; getStaticLandingWithOverrides; PricingPageShell with signupHrefBase; generateMetadata; revalidate. See Section 3.3. Build; open `/sa/pricing` and `/eg/pricing`.

**Step 7.** Add [app/[country]/signup/page.tsx](app/[country]/signup/page.tsx): params → countryCode, countrySlug; getLandingContent, serverPlans; pass country + countrySlug to SignupForm. Update [SignupForm.tsx](app/(site)/signup/SignupForm.tsx): optional `countrySlug`, on success `router.push(countrySlug ? \`/${countrySlug}/signup/thank-you\` : "/signup/thank-you")`. See Section 3.4. Build; test submit from `/sa/signup` and `/eg/signup`.

**Step 8.** Add [app/[country]/signup/thank-you/page.tsx](app/[country]/signup/thank-you/page.tsx): copy from (site); "العودة للرئيسية" link = `/${countrySlug}` from params. See Section 3.4. Build; test full signup → thank-you → home.

**Step 9.** Update [proxy.ts](proxy.ts): add geo block before admin check — pathname; effective geo (IP + ?country= override); root redirect (copy searchParams); firstSegment + rest; reserved → continue; supported and ≠ effective → redirect (copy searchParams); invalid → redirect (copy searchParams). See Section 2. Build; test `/` → redirect, `/xy` → redirect, `/sa` and `/eg` unchanged, `/about` unchanged.

**Step 10.** Delete the four (site) route files: [app/(site)/page.tsx](app/(site)/page.tsx), [app/(site)/pricing/page.tsx](app/(site)/pricing/page.tsx), [app/(site)/signup/page.tsx](app/(site)/signup/page.tsx), [app/(site)/signup/thank-you/page.tsx](app/(site)/signup/thank-you/page.tsx). See Section 4. Build; confirm no broken imports or links.

**Step 11.** Update [app/sitemap.ts](app/sitemap.ts): add for each slug in SUPPORTED_COUNTRY_SLUGS the URLs `/${slug}`, `/${slug}/pricing`, `/${slug}/signup`; keep about, team, privacy, terms. See Section 5. Build.

**Step 12.** Run full Section 9 pre-launch verification (build, root, valid/wrong/invalid prefix, preview, reserved, admin, signup flow, sitemap). Fix any issue before launch.

---

## Step recheck (ready to implement)

| Step | Dependency | Verified |
|------|------------|----------|
| **1** | None. New file only. | `lib/landing-content.types.ts` has `SupportedCountry`; country-config can import for `getCountryCodeFromSlug`. |
| **2** | None. | `getNavLinks(country)` and `getFooterLinks(_country?)` exist; add optional `basePath`, rewrite `/#` hrefs. |
| **3** | None. | [LandingHeader](app/components/layout/LandingHeader.tsx) gets nav from `getNavLinks(country)`; hardcoded `/signup` in HeaderActions and HeaderLogo `/#hero`. Add optional `logoHref`, thread `pricingHref` (layout already passes country). [Footer](app/components/layout/Footer.tsx) uses `getFooterLinks(country)`; add optional `basePath`. [PlanCard](app/components/landing/price-section/PlanCard.tsx) has `/pricing?plan=...`; add `pricingHrefBase`. [PriceSectionBottomCta](app/components/landing/price-section/PriceSectionBottomCta.tsx), [price-section.tsx](app/components/landing/price-section/price-section.tsx), [PricingPageShell](app/components/pricing/PricingPageShell.tsx) — add optional bases with defaults. |
| **4** | 1, 2, 3. | Layout uses country-config, getLandingContent(countryCode), getStaticLandingWithOverrides(countryCode); passes basePath/navLinks/logoHref to Header and Footer. Build succeeds; `/sa` and `/eg` 404 until Step 5. |
| **5** | 4, 3. | Copy (site)/page.tsx; params → countrySlug/countryCode; pass ctaLink and pricing/signup bases to ModontyPricing and sections. |
| **6** | 4, 3. | Same params pattern; PricingPageShell with signupHrefBase. |
| **7** | 4. | SignupForm stays in (site); add optional `countrySlug`, push to `/${countrySlug}/signup/thank-you` on success. |
| **8** | 4. | Copy thank-you page; home link from params. |
| **9** | 1. | [proxy.ts](proxy.ts) exists at project root; has admin + `?country=` → x-country-code. Add geo block before admin; use SUPPORTED_COUNTRY_SLUGS and RESERVED_FIRST_SEGMENTS from country-config; copy searchParams on redirect. |
| **10** | 5–8. | Only four route files deleted; (site)/layout remains for about, privacy, terms, team. No other imports of deleted pages. |
| **11** | 1. | [sitemap.ts](app/sitemap.ts) has siteUrl and static entries; add country URLs from SUPPORTED_COUNTRY_SLUGS. |
| **12** | 1–11. | Section 9 checklist (11 items) — run after all steps. |

**LandingHeader:** Plan also requires layout to pass `pricingHref` (e.g. `/${countrySlug}/signup`) into the header; currently `HeaderActions` has hardcoded `pricingHref="/signup"`. In Step 3, add optional `pricingHref` to `LandingHeader` (default `"/signup"`) and pass it into `HeaderActions`; [country] layout then passes `\`/${countrySlug}/signup\``.

**Ready to go:** Dependencies are in order; no dead code; redirects preserve search params; `isSupportedCountrySlug(undefined)` → false. Execute Steps 1–12 in order, then run Section 9 before launch.

---

## 1. Country config (single source of truth)

**Add** [lib/country-config.ts](lib/country-config.ts):

- `COUNTRY_CONFIG`: `{ sa: { code: "SA" }, eg: { code: "EG" } }` (slug → ISO code).
- `CountrySlug` = keyof typeof COUNTRY_CONFIG (`"sa" | "eg"`).
- `SUPPORTED_COUNTRY_SLUGS`: `Object.keys(COUNTRY_CONFIG)` (for proxy and validation).
- `getCountrySlugFromParam(param: string | undefined): CountrySlug`: normalize `param?.toLowerCase()`, return slug if in config, else `"sa"`.
- `getCountryCodeFromSlug(slug: CountrySlug): SupportedCountry`: return `"SA"` or `"EG"`.
- **Validation helper:** `isSupportedCountrySlug(param: string): param is CountrySlug` — use in layout to decide redirect when false (see Section 2 and 3.1).
- **Reserved first segments:** `RESERVED_FIRST_SEGMENTS = ["about", "team", "privacy", "terms", "admin"]` (or in proxy only) so proxy does not redirect `/about`, `/admin`, etc. to a country.

---

## 2. Proxy: geo-redirect for `/` and invalid country prefix (auto-correction)

**Update** [proxy.ts](proxy.ts). Keep existing logic: optional `?country=` → `x-country-code` header; admin auth for `/admin` (and return redirect to login when unauthenticated).

**Add before admin auth** (so geo redirects run first):

1. `const pathname = request.nextUrl.pathname`.
2. **Effective geo (for redirect logic):** `const geoCode = request.headers.get("x-vercel-ip-country")?.toUpperCase()?.slice(0, 2) ?? ""`; map to slug from IP (SA→sa, EG→eg; unknown → `"sa"`). Do not use `request.geo` (removed in Next 15+). **Preview override:** `const previewSlug = request.nextUrl.searchParams.get("country")?.toLowerCase()`. If `previewSlug` is in `SUPPORTED_COUNTRY_SLUGS`, use `effectiveGeoSlug = previewSlug`; else `effectiveGeoSlug = geoSlug`. Use `effectiveGeoSlug` (not geoSlug) for all redirect decisions below so `?country=sa` or `?country=eg` lets you/your team view that country from anywhere.
3. **Root:** If `pathname === "/"`: redirect to `/${effectiveGeoSlug}` (preserve `?country=` if present so `/?country=eg` → `/eg?country=eg`).
4. **Country-prefix routes:** Use `effectiveGeoSlug` in the comparison below (so when `firstSegment !== effectiveGeoSlug` redirect to `/${effectiveGeoSlug}${rest}`). `const firstSegment = pathname.split("/")[1]?.toLowerCase() ?? ""`; `const rest = pathname.slice(1 + firstSegment.length)` (skip leading slash + segment; `/sa/pricing` → rest = `/pricing`; `/sa` → rest = ``). If `firstSegment` is in `RESERVED_FIRST_SEGMENTS` (about, team, privacy, terms, admin) → continue (no redirect). If `firstSegment` is in `SUPPORTED_COUNTRY_SLUGS`: **if `firstSegment !== effectiveGeoSlug`** (visitor is on the “wrong” country for their IP), **redirect:** `return NextResponse.redirect(new URL(\`/${effectiveGeoSlug}\${rest}\`, request.url))` (preserve search params for preview). Egyptian on `/sa` → `/eg`; with `?country=sa` they stay on `/sa`. Only when `firstSegment === effectiveGeoSlug` → continue. If `firstSegment` is not in supported and not reserved (invalid prefix): redirect to `/${effectiveGeoSlug}${rest}` (auto-correct, no 404).
5. Then run existing admin check and `NextResponse.next({ request: { headers } })` as today.

**Redirect URL must preserve search params:** `new URL(path, request.url)` does not copy query string from the request. Per [Next.js redirect docs](https://nextjs.org/docs/app/api-reference/functions/next-response#redirect), build the URL then copy params: e.g. `const dest = new URL(\`/${effectiveGeoSlug}\${rest}\`, request.url); request.nextUrl.searchParams.forEach((v, k) => dest.searchParams.set(k, v)); return NextResponse.redirect(dest);` so `?country=sa` is kept for preview.

**Rest of path:** `const rest = pathname.slice(1 + firstSegment.length)` so `/sa/pricing` → rest = `/pricing`, `/sa` → rest = ``.

**Matcher:** Leave as-is so `/` and other paths are included (current matcher excludes only `_next/static`, `_next/image`, `favicon.ico`, `api`).

---

## 3. Dynamic route `app/[country]/`

### 3.1 Layout

**Add** [app/[country]/layout.tsx](app/[country]/layout.tsx):

- Props: `{ children, params }: { children: React.ReactNode; params: Promise<{ country: string }> }`.
- `const { country: raw } = await params`. `const slug = raw?.toLowerCase()`. If `!isSupportedCountrySlug(slug)` (invalid prefix): **auto-correct** — read `headers().get("x-vercel-ip-country")`, map to geoSlug, call `redirect(\`/${geoSlug}\`)` from `next/navigation` (fallback when request reaches layout without proxy redirect). Otherwise derive `countrySlug` and `countryCode = getCountryCodeFromSlug(countrySlug)`.
- Fetch `getLandingContent(countryCode)` and `getStaticLandingWithOverrides(countryCode)` (no `headers()`).
- Render same shell as [app/(site)/layout.tsx](app/(site)/layout.tsx): GTM/Hotjar/FB, `LandingHeader`, main, `Footer`, `ChatWidgetLazy`.
- Pass to `LandingHeader`: `content`, `staticLanding`, `country`, `pricingHref: \`/${countrySlug}/signup\``, `navLinks: getNavLinks(countryCode, \`/${countrySlug}\`)`, logo href `\`/${countrySlug}\`` (via new optional prop if needed).
- Pass to `Footer`: `content`, `staticLanding`, `country`, `basePath: \`/${countrySlug}\`` for link building.

Do not use `headers()` or `getCountryFromHeaders` so the segment can be cached/ISR.

### 3.2 Home page

**Add** [app/[country]/page.tsx](app/[country]/page.tsx):

- `params: Promise<{ country: string }>`. `const { country: raw } = await params`; validate slug (same as layout); get `countryCode`, `countrySlug`.
- Move logic from [app/(site)/page.tsx](app/(site)/page.tsx): same sections and data (getLandingContent, getStaticLandingWithOverrides for SA/EG, mergedStaticLanding). Pass `ctaLink: \`/${countrySlug}/signup\`` and pricing/signup bases to components (see 3.5).
- **generateMetadata:** `({ params }: { params: Promise<{ country: string }> })`. `const { country: raw } = await params`; validate; get content; return title/description/canonical/OG/twitter. Canonical: `\`${siteUrl}/${countrySlug}\``.
- `export const revalidate = 300`.

### 3.3 Pricing page

**Add** [app/[country]/pricing/page.tsx](app/[country]/pricing/page.tsx):

- Same params pattern (await, validate, countrySlug/countryCode). No `headers()`.
- `getStaticLandingWithOverrides(countryCode)` for pricing, pricingPage, faq. Pass to `PricingPageShell` with `signupHrefBase: \`/${countrySlug}/signup\``.
- generateMetadata from params; canonical `\`/${countrySlug}/pricing\``.
- `revalidate = 300`.

### 3.4 Signup and thank-you

**Add** [app/[country]/signup/page.tsx](app/[country]/signup/page.tsx):

- Params (await, validate). `getLandingContent(countryCode)`, `serverPlans`, pass `country` and `countrySlug` to `SignupForm`.

**Add** [app/[country]/signup/thank-you/page.tsx](app/[country]/signup/thank-you/page.tsx):

- Copy [app/(site)/signup/thank-you/page.tsx](app/(site)/signup/thank-you/page.tsx). "العودة للرئيسية" link: `href={\`/${countrySlug}\`}` (from `await params` + validate).

**Update** [app/(site)/signup/SignupForm.tsx](app/(site)/signup/SignupForm.tsx):

- Add optional `countrySlug?: string`. On submit success: `router.push(countrySlug ? \`/${countrySlug}/signup/thank-you\` : "/signup/thank-you")`.

### 3.5 Site links and component hrefs

**Update** [lib/site-links.ts](lib/site-links.ts):

- `getNavLinks(country, basePath?: string)`: if `basePath` is set, for each link with `href` starting with `"/#"`, set `href = basePath + href.slice(1)` (e.g. `"/#pricing"` → `"/sa#pricing"`). Leave `/about` etc. unchanged.
- `getFooterLinks(country, basePath?: string)`: same for hash links; leave `/privacy`, `/terms` as-is.

**Components (all under [country] must get country-prefixed hrefs from props, no hardcoded `/pricing` or `/signup`):**

- [app/components/layout/LandingHeader.tsx](app/components/layout/LandingHeader.tsx): already receives `pricingHref`; ensure layout passes `\`/${countrySlug}/signup\``. Add optional `logoHref` (default `"/"`); layout passes `\`/${countrySlug}\``.
- [app/components/layout/Footer.tsx](app/components/layout/Footer.tsx): accept optional `basePath`; use `getFooterLinks(country, basePath)`; for logo "الرئيسية" use `basePath ? \`${basePath}#hero\` : "/#hero"` or equivalent.
- [app/components/landing/price-section/PlanCard.tsx](app/components/landing/price-section/PlanCard.tsx): optional `pricingHrefBase` (default `"/pricing"`); `href={\`${pricingHrefBase}?plan=${plan.id}\`}`.
- [app/components/landing/price-section/PriceSectionBottomCta.tsx](app/components/landing/price-section/PriceSectionBottomCta.tsx): optional `signupHref` (default `"/signup"`).
- [app/components/landing/price-section/price-section.tsx](app/components/landing/price-section/price-section.tsx): accept optional `pricingHrefBase`, `signupHrefBase`; pass to PlanCard and PriceSectionBottomCta.
- [app/components/pricing/PricingPageShell.tsx](app/components/pricing/PricingPageShell.tsx): optional `signupHrefBase`; use for primary/secondary CTA (e.g. `\`${signupHrefBase}?plan=...\``).
- Hero, WhyNow, HowItWorks, Outcomes, FinalCTA: receive `ctaLink` from page; page passes `\`/${countrySlug}/signup\``.
- **Preview param on links:** When layout or page has access to `searchParams` and `searchParams.country` is `sa` or `eg`, append `?country=${countrySlug}` to internal [country] hrefs (nav, footer, pricing, signup) so that when you/your team use `?country=sa` to preview Saudi, clicking links keeps you in preview (e.g. `/sa/pricing?country=sa`). Optional helper or prop like `previewQuery` = `countrySlug ? \`?country=${countrySlug}\` : ""` to suffix hrefs.

---

## 4. Remove old routes (no dead code)

- **Delete only these four files:** [app/(site)/page.tsx](app/(site)/page.tsx), [app/(site)/pricing/page.tsx](app/(site)/pricing/page.tsx), [app/(site)/signup/page.tsx](app/(site)/signup/page.tsx), [app/(site)/signup/thank-you/page.tsx](app/(site)/signup/thank-you/page.tsx). Do not leave duplicate or orphaned route files.
- **Keep** [app/(site)/layout.tsx](app/(site)/layout.tsx) for about, privacy, terms, team — it still uses `getCountryFromHeaders`; that is not dead code.
- **Do not** use `getCountryFromHeaders` or `headers()` in [country] layout/page for normal rendering (only in the invalid-slug fallback in layout). All [country] data comes from `params` + [lib/country-config.ts](lib/country-config.ts).
- **country-config:** Export only what is used: `COUNTRY_CONFIG`, `SUPPORTED_COUNTRY_SLUGS`, `RESERVED_FIRST_SEGMENTS`, `getCountrySlugFromParam`, `getCountryCodeFromSlug`, `isSupportedCountrySlug`. No unused helpers or exports.
- **Component props:** New optional props (e.g. `pricingHrefBase`, `signupHref`, `logoHref`, `basePath`) have defaults; [country] always passes them. No branches or exports that are never used.
- **SignupForm:** The fallback `router.push("/signup/thank-you")` when `!countrySlug` is kept for type safety; the only caller is [country]/signup which passes `countrySlug`. No dead callers.
- **Links:** After implementation, no remaining hrefs point to `/pricing` or `/signup` without a country prefix from [country] routes; update or remove any such references so there is no dead navigation path.

---

## 5. Sitemap

**Update** [app/sitemap.ts](app/sitemap.ts):

- For each slug in `SUPPORTED_COUNTRY_SLUGS`, add: `\`${siteUrl}/${slug}\``, `\`${siteUrl}/${slug}/pricing\``, `\`${siteUrl}/${slug}/signup\``.
- Keep existing entries for `/about`, `/team`, `/privacy`, `/terms`. Remove or lower priority for bare `siteUrl` if desired.

---

## 6. Admin and other pages

- **Admin:** No changes. Uses `?country=SA|EG` and same data layer.
- **About, privacy, terms, team:** Remain under (site); layout can keep `getCountryFromHeaders` for header/footer.

---

## 7. Zero-surprise checklist

- Proxy uses **headers only** for geo (`x-vercel-ip-country`), not `request.geo` (removed in Next 15+).
- **params** and **searchParams** are **Promise** and awaited in layout, page, and generateMetadata (Next 16).
- **Redirect URLs** preserve query string by copying `request.nextUrl.searchParams` onto the new URL (per Next.js redirect docs).
- **Rest path** uses `pathname.slice(1 + firstSegment.length)` so `/sa/pricing` → rest = `/pricing`.
- **Visitor always sees their country:** Wrong or invalid prefix → proxy redirects to effective geo; no 404. Lowercase normalization for `/SA` and `/sa`.
- All links from [country] use `countrySlug` (no hardcoded `/pricing`, `/signup`, `/` for home).
- SignupForm redirect uses `countrySlug` when provided.
- Existing [proxy.ts](proxy.ts) admin auth and optional `x-country-code` header preserved; geo/redirect logic runs before admin check.
- **Valid [country] requests** do not call `headers()` or `cookies()` so ISR/static caching works; only the invalid-slug fallback in layout uses `headers()` for redirect.
- **Section 9** must be run before launch and paid advertising.
- **No dead code:** Only the four files in Section 4 are deleted. `getCountryFromHeaders` stays (used by (site) layout). [country] uses only params + country-config. No unused exports in country-config; no links to removed routes.

---

## 8. File change summary

- **Add:** [lib/country-config.ts](lib/country-config.ts), [app/[country]/layout.tsx](app/[country]/layout.tsx), [app/[country]/page.tsx](app/[country]/page.tsx), [app/[country]/pricing/page.tsx](app/[country]/pricing/page.tsx), [app/[country]/signup/page.tsx](app/[country]/signup/page.tsx), [app/[country]/signup/thank-you/page.tsx](app/[country]/signup/thank-you/page.tsx).
- **Update:** [proxy.ts](proxy.ts) (geo redirect for `/` via `x-vercel-ip-country` only), [lib/site-links.ts](lib/site-links.ts), [LandingHeader.tsx](app/components/layout/LandingHeader.tsx), [Footer.tsx](app/components/layout/Footer.tsx), [PlanCard.tsx](app/components/landing/price-section/PlanCard.tsx), [PriceSectionBottomCta.tsx](app/components/landing/price-section/PriceSectionBottomCta.tsx), [price-section.tsx](app/components/landing/price-section/price-section.tsx), [PricingPageShell.tsx](app/components/pricing/PricingPageShell.tsx), [SignupForm.tsx](app/(site)/signup/SignupForm.tsx), [sitemap.ts](app/sitemap.ts).
- **Delete:** [app/(site)/page.tsx](app/(site)/page.tsx), [app/(site)/pricing/page.tsx](app/(site)/pricing/page.tsx), [app/(site)/signup/page.tsx](app/(site)/signup/page.tsx), [app/(site)/signup/thank-you/page.tsx](app/(site)/signup/thank-you/page.tsx).

---

## 9. Pre-launch verification (no surprises before paid traffic)

**Official-doc alignment (already in plan):** Proxy = `proxy.ts` + named export; params/searchParams = Promise (await in layout, page, generateMetadata); geo = `x-vercel-ip-country` only (no `request.geo`); redirect = build URL then copy `request.nextUrl.searchParams` into it; revalidate = 300 on [country] pages; invalid slug = redirect by geo in proxy + layout fallback with `redirect()`.

**Must do before launch:**

1. **Build:** `pnpm build` — no errors; [country] routes build and revalidate is applied.
2. **Root:** Open `/` — redirects to `/sa` or `/eg` (locally often `sa` if no geo header). No infinite redirect, no 404.
3. **Valid country:** Open `/sa`, `/eg`, `/sa/pricing`, `/eg/signup` — correct content and prices; no extra redirect.
4. **Wrong country:** From a Saudi IP (or simulate), open `/eg` — redirect to `/sa`. From Egypt IP, open `/sa` — redirect to `/eg`. (On Vercel use preview or geo; locally test with `?country=eg` to simulate.)
5. **Preview:** Open `/sa?country=sa` from anywhere — stay on `/sa`, see Saudi content. Open `/eg?country=eg` — stay on `/eg`. Root `/?country=eg` → redirect to `/eg?country=eg` (param preserved).
6. **Invalid prefix:** Open `/xy` or `/en` — redirect to `/sa` or `/eg` by geo; no 404.
7. **Reserved:** Open `/about`, `/admin`, `/privacy` — no redirect to country; pages load as today.
8. **Admin:** `/admin` still requires login; content sections with `?country=SA` / `?country=EG` work; no regression.
9. **Signup flow:** From `/eg/signup` submit form — redirect to `/eg/signup/thank-you`; "العودة للرئيسية" goes to `/eg`. Same for `/sa`.
10. **Sitemap:** `/sitemap.xml` (or app sitemap) includes `/sa`, `/eg`, `/sa/pricing`, `/eg/pricing`, `/sa/signup` and existing about/privacy/terms.
11. **Deploy on Vercel:** Geo header `x-vercel-ip-country` is set in production; test from real device or use preview URLs with `?country=` to confirm both countries.

**Optional:** If you see client-side navigation issues in production (e.g. after proxy redirect), try `prefetch={false}` on critical `Link` components as a fallback ([known Next.js 16 note](https://github.com/vercel/next.js/issues/87245)).
