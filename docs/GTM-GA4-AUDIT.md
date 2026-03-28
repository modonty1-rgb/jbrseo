# GTM & GA4 Implementation Audit — jbrseo.com

**Stack note:** This codebase uses **Next.js `^16.1.1`** (not 15) and **`app/[country]`** — there is **no** `app/[locale]` tree.

**Audit goals:** GTM tracking events, admin dashboard showing zeros, `/eg` route behavior.

---

## 1. GTM Snippet Location (`GTM-TT25M3GX`)

### Search hits for `GTM-TT25M3GX`

| File | Role |
|------|------|
| `app/admin/(dashboard)/components/TrackingForm.tsx` | UI copy only (hardcoded hint text) |
| `public/html/modonty-marketing-plan-v1.html` | Static HTML doc |
| `public/html/jbrseo-marketing-plan-v2.html` | Static HTML doc |

### Runtime implementation

The app **does not hardcode** `GTM-TT25M3GX`. The live container ID comes from the database via `getSiteGtmId()` and is passed to `GoogleTagManager` in `app/layout.tsx`.

### `@next/third-parties` behavior (`node_modules/@next/third-parties/dist/google/gtm.js`)

- Injects **two** `next/script` entries: (1) inline init defining `dataLayer`, pushing `gtm.start` + `gtm.js`; (2) external `https://www.googletagmanager.com/gtm.js?id=...`
- `sendGTMEvent` ensures `window[dataLayer] = window[dataLayer] || []` then `push(data)` — events can queue before GTM loads.

### Checklist

| Question | Finding |
|----------|---------|
| Is `<script>` in `<head>`? | **No.** `GoogleTagManager` is rendered as a **sibling before `<head>`** under `<html>`. Uses `next/script`, not a raw `<head>` tag. |
| Next.js `Script` strategy? | No explicit `strategy` in the bundled component → Next default **`afterInteractive`**. |
| `<noscript><iframe>` after `<body>` open? | **No.** This implementation **only** has the two scripts — **no noscript iframe**. |
| `dataLayer` before GTM `.js`? | **Yes** — inline init runs first. |

### Issues

1. **HTML structure:** `<html>` should normally only contain `<head>` and `<body>`. GTM sits before `<head>`. Often tolerated but not ideal.
2. **No noscript GTM** — differs from Google’s default full snippet.
3. If `gtmId` is **empty in DB**, GTM does not load — no code fallback to `GTM-TT25M3GX`.

---

## 2. GTM / Analytics Files

### `lib/gtm.ts` (full)

```tsx
"use client";

import { sendGTMEvent } from "@next/third-parties/google";

export function trackEvent(event: string, payload?: Record<string, unknown>): void {
  sendGTMEvent({ event, ...payload });
}

export const GTMEvents = {
  signupStart: () => trackEvent("signup_start"),
  signupComplete: (plan: string) => trackEvent("signup_complete", { plan }),
  pricingView: () => trackEvent("pricing_view"),
  whatsappClick: () => trackEvent("whatsapp_click"),
};
```

- **`G-1H4CC4BJBM`** appears only in static `public/html/*.html`, not in app TS/TSX.
- **No** `components/GoogleTagManager.tsx` — GTM is `GoogleTagManager` from `@next/third-parties/google` in `app/layout.tsx`.
- **No** raw `dataLayer.push` in source — only via `sendGTMEvent`.

---

## 3. Layout Files

### `app/[locale]/layout.tsx`

**Does not exist.** Country routing uses **`app/[country]/layout.tsx`**.

### `app/layout.tsx` (focus)

- Imports `GoogleTagManager` from `@next/third-parties/google`.
- `const gtmId = await getSiteGtmId()` — DB-backed.
- Renders `{gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}` immediately inside `<html>`, then `<head>` (preconnect to Cloudinary, dns-prefetch GTM/Hotjar, theme script), then `<body>` with skip link + `ThemeProvider`.

### `app/[country]/layout.tsx`

- Hotjar via `next/script` (`lazyOnload`) when `hotjarId` is set.
- Invalid country slug → `redirect("/sa")`.
- **No GTM** here (global in root layout).

### `app/(site)/layout.tsx`

- Hotjar only; **no GTM**.

---

## 4. `dataLayer.push` Usage

- **No** `dataLayer.push` string matches in project source.
- Intended path: `sendGTMEvent` / `trackEvent` / `GTMEvents` in `lib/gtm.ts`.
- **Types:** `Record<string, unknown>` for payload — no dedicated event union types.

### Issue

**Nothing imports `GTMEvents` or `trackEvent`** from `lib/gtm.ts` elsewhere — client events are **not wired**.

---

## 5. Environment Variables

| Variable | Usage in code |
|----------|-----------------|
| `GA4_PROPERTY_ID` | `lib/analytics.ts` — `property` for Data API |
| `GA4_CLIENT_EMAIL` | `lib/analytics.ts` — service account email |
| `GA4_PRIVATE_KEY` | `lib/analytics.ts` — private key (`\n` unescape) |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | **Not referenced** |
| `GOOGLE_APPLICATION_CREDENTIALS` | **Not referenced** |
| `GTM_ID` / `GTM_CONTAINER_ID` / `NEXT_PUBLIC_GTM*` | **Not referenced** — GTM ID is **`SiteSettings.gtmId`** (DB) via `getSiteGtmId()` |

### `.env.example`

Does **not** document `GA4_*` or GTM env vars (only DB, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`, whitelist, social URLs, avatar).

### Issues

1. Missing/wrong `GA4_*` in production → `getAnalyticsData` catch → **all zeros**.
2. **`.env.example` incomplete** for analytics deploys.

---

## 6. GA4 Data API (`lib/analytics.ts`) & Admin Dashboard

### Package

- **`@google-analytics/data`**: **^5.2.1** — installed.
- **`BetaAnalyticsDataClient`**: used with **`credentials: { client_email, private_key }`** — not file-based `GOOGLE_APPLICATION_CREDENTIALS`.

### API usage

- **`runReport`**: yes — three parallel reports (totals + events + top pages).
- **`runRealtimeReport`**: **not** used.

### `getAnalyticsData(_country?: string)`

- **`_country` is ignored** — no dimension filter for SA vs EG.
- **`getAllAnalyticsData()`** calls `getAnalyticsData()`, `getAnalyticsData('SA')`, `getAnalyticsData('EG')` — **all three return identical data** (bug vs UI labels).

### Event filter

`inListFilter`: `signup_start`, `pricing_view`, `whatsapp_click` only — **`signup_complete` is not queried**.

### Metrics vs labels

- Field **`activeUsersToday`**: query uses date range **`7daysAgo`–`today`** and metric **`activeUsers`** — semantically **7‑day active users**, not “today only”.

### Silent failure

```ts
} catch {
  return { pageviews7d: 0, ... topPages: [] }
}
```

Any API/auth/property error → **zeros with no logging**.

---

## 7. `/eg` Route

| Check | Result |
|--------|--------|
| `app/[locale]/eg/page.tsx` | **N/A** (no `[locale]`) |
| `app/eg/page.tsx` | **Does not exist** as a static folder |
| Dynamic route | `app/[country]/(marketingShell)/page.tsx` serves **`/eg`** when `country === "eg"` |
| `next.config.ts` | **No** redirects for `/eg` |
| `middleware.ts` | **Not present** — no middleware redirect `/eg` → `/sa` |

**Note:** Invalid `[country]` slug in `app/[country]/layout.tsx` → **`redirect("/sa")`**.

---

## 8. Signup Complete Event

- **Form:** `app/[country]/signup/component/SignupForm.tsx` — on success: `router.push` to thank-you; **no** `GTMEvents` / `trackEvent` / `signup_complete`.
- **Thank-you:** `app/[country]/signup/thank-you/page.tsx` — **no** GTM calls.

`GTMEvents.signupComplete` exists in `lib/gtm.ts` but is **never called**. Admin GA4 cards also **do not** include `signup_complete` in the event filter.

---

## 9. `next.config.ts`

- Redirects: only `/admin/settings/general` and `/admin/settings/tracking` → `/admin/settings`.
- **No** `/sa` / `/eg` redirects or rewrites.
- **No** CSP headers in config (host-level CSP could still affect GTM).

---

## 10. `package.json` Check

| Package | Version / present |
|---------|-------------------|
| `next` | **^16.1.1** |
| `react` / `react-dom` | **^19.2.3** |
| `@google-analytics/data` | **^5.2.1** |
| `@next/third-parties` | **^16.2.1** |
| `next-gtm` | **Not installed** |

---

## Summary: Root Causes (your three focus areas)

1. **GTM events** — Helpers exist in `lib/gtm.ts` but are **unused**; no events fired from signup, pricing, WhatsApp in components.
2. **Admin zeros** — Likely **missing `GA4_*` env**, **silent `catch`**, and/or **no events in GA4**; **SA/EG rows are duplicates**; **`signup_complete` not in API filter**; possible **metric/label mismatch** for “active today”.
3. **`/eg`** — Implemented as **`/[country]`** with `eg`; **no** `next.config`/`middleware` redirect from `/eg` to `/sa`. Invalid slug → **`/sa`**.

---

## Suggested fix order (implementation — not done in this doc)

1. Wire `GTMEvents` (or `trackEvent`) on signup start/complete, pricing view, WhatsApp click.
2. Fix `getAnalyticsData` with a real **country dimension** (custom or `pagePath`/`host` filter) + document `GA4_*` in `.env.example`; optional logging in `catch`.
3. Add **`signup_complete`** to GTM usage and to **`lib/analytics.ts`** event filter if the dashboard should show it.
4. Align **active users** label with the actual date range/metric or switch to **`runRealtimeReport`** for “today”.

---

*Generated from repository audit. Paths relative to project root.*
