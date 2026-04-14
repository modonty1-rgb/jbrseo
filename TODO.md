# TODO — Pre-Launch Audit (Campaign Day)

> **Last updated:** 2026-04-14
> **Status legend:** `[ ]` pending · `[~]` in progress · `[x]` done

---

## 🔴 CRITICAL — Fix Before Campaign Goes Live

- [x] **Fix WhatsApp number — currently pointing to fake placeholder**
  - WhatsApp number is saved in DB via admin settings (`SiteSettings.whatsappNumber`)
  - Unused env vars `NEXT_PUBLIC_WHATSAPP_NUMBER` + `NEXT_PUBLIC_PHONE_NUMBER` removed from `.env`
  - Action needed: enter the real WhatsApp number in admin → الإعدادات → رقم واتساب

- [x] **Decide: Egypt subscribers see Saudi bank IBAN — is this correct?**
  - Decision: حساب واحد (السعودي) لكل البلدان — مقصود ومؤقت حتى يُضاف payment gateway

---

## 🟡 IMPORTANT — Fix This Week

- [x] **Add admin notification when new subscriber signs up**
  - Implemented: Telegram Bot (`@Jbrseo_bot`) sends Arabic message to group on every signup
  - Group includes owner + sales team (عليان)
  - File: [`app/actions/subscribers.ts`](app/actions/subscribers.ts#L43), [`lib/telegram.ts`](lib/telegram.ts)

- [x] **Add `/features` page to sitemap** — added with priority 0.8

- [x] **Verify WhyNowCalculator shows correct currency per country**
  - Fixed: `country` prop now passed from landing page; SA uses 1,299 / EG uses 3,999
  - File: [`app/[country]/(marketingShell)/page.tsx`](app/[country]/(marketingShell)/page.tsx#L163)

- [x] **Add middleware.ts to protect /admin at edge level**
  - Already handled in `proxy.ts` — full HMAC verification via `verifyPayload`, redirects to `/admin/login?from=<path>` if invalid
  - File: [`proxy.ts`](proxy.ts#L96)

---

## 🟠 ARCHITECTURE — Refactor (After Campaign)

- [x] **Fix WhatsApp number: global vs per-country confusion**
  - Decision: نفس الرقم للسعودية ومصر — global save مقصود ✅
  - No code change needed

- [x] **Move TrackingForm to a dedicated "Global Settings" page**
  - Decision: Hotjar stays global (one site, filter by country inside Hotjar dashboard)
  - Fix: added "🌍 ينطبق على كل البلدان" badge to TrackingForm header — no architectural change needed
  - Files: [`app/admin/(dashboard)/components/TrackingForm.tsx`](app/admin/(dashboard)/components/TrackingForm.tsx)

- [x] **Delete temp scripts from project root**
  - Deleted: `check_gtm.ts`, `check_gtm.mjs`, `test_gtm_events.py`, `test_traffic_sources.py`, `test_debug.py`

---

## 🧹 CLEANUP — Low Priority

- [x] **Remove unused env vars from `.env`** — `NEXT_PUBLIC_WHATSAPP_NUMBER` + `NEXT_PUBLIC_PHONE_NUMBER` removed

- [x] **`signup/thank-you` — remove TODO comment after payment gateway is integrated**
  - Comment removed from [`app/[country]/signup/thank-you/page.tsx`](app/[country]/signup/thank-you/page.tsx)

---

## ✅ CONFIRMED WORKING — No Action Needed

- [x] GTM loads from DB (`SiteSettings.gtmId`) via root `layout.tsx`
- [x] Geo-IP detection: Vercel `x-vercel-ip-country` → redirects SA/EG
- [x] Per-country content: `LandingSection` table, cached 60s, invalidated on save
- [x] Static fallback if DB is down (no blank page crash)
- [x] Admin auth: HMAC-signed cookie, constant-time compare, 7-day expiry
- [x] Signup validation: SA phone `5XXXXXXXX`, EG phone `01XXXXXXXXX`
- [x] GTM events wired: `signup_start`, `signup_complete`, `pricing_view`, `whatsapp_click`
- [x] robots.txt: `/admin`, `/api/`, thank-you pages all disallowed
- [x] Sitemap: SA/EG home + pricing + signup + about/team/privacy/terms
- [x] hreflang `ar-SA` / `ar-EG` on all per-country pages
- [x] `signup/thank-you` protected by `sessionStorage` guard (no direct URL access)
- [x] Prisma schema: email unique, country indexed, `LandingSection` unique on (country, section)
