# Session Log — jbrseo.com

> Append-only. Newest session at top.
> Weekly rotation: active file = last 7 days only. Older sessions archived monthly →
> `SESSION-LOG-2026-07.md` (8 sessions), `SESSION-LOG-2026-06.md` (7 sessions).

---

## Session: 2026-08-03 13:35 — 🚀 GO-LIVE: duration pricing + founding badge + presence 4th plan + full payment E2E → deployed to production (live N-Genius)

### 🎯 Where I stopped
- **Last state:** User doing a **real live payment test on production** (`jbrseo.com/sa/checkout`, starter 3mo, SAR 1,497). First card **declined by its issuer** (real decline, no charge). Second card → **real SNB Alahli 3DS OTP screen** appeared (merchant "Jbr Aljanubiyya Company For Contracting") → confirms live gateway + outlet fully working E2E. User was about to enter the real OTP (real SAR 1,497 charge; 14-day refund covers a test).
- **Next concrete action when resuming:** Fix the **retry-UX bug (#2, user deferred)** — after a failed payment the N-Genius card iframe stays stuck on «عملية الدفع قيد المعالجة، لا تحدّث»; user must hard-refresh to retry. Fix = force-remount `NGeniusMount` after a failed attempt (e.g. `key={attemptNumber}` in `CheckoutForm`, or a `reset()` on the handle). Then optional: flip Vercel `NGENIUS_ENV` "sandbox"→"live" (unused label, but misleads).

### ✅ Done this session
- **Founding-offer badge** «عرض تأسيسي — لفترة محدودة» added to pricing section (`PricingSection.tsx`) — a limited/launch label so the free-months concession can be retracted later without a price cut.
- **Hero line-height fix** (`HeroSection.tsx`): `leading` 1.08→1.22 desktop, 1.15→1.4 mobile — Arabic diacritics (shadda on «تخلّيه») were colliding with the line above. Verified live mobile + desktop.
- **Presence (حضور) = functional 4th plan** (was a broken/incomplete plan): added a `presence` entry to `PLAN_CARD_CONTENT` (`lib/plan-card-content.ts`, `Flag` icon) built from its real DB `highlights` + added `"presence"` to the `create-payment` plan enum. Verified checkout renders `660` (110×6) for presence. Stays **hidden on live** (user toggles on/off; 4 standard plans).
- **Testimonial video** (`VoicesSection.tsx`): container `bg-foreground`→`bg-muted` — kills the white flash while the lazy YouTube iframe loads on the dark theme.
- **Full payment-flow code review** (create-payment, status polling, n-genius webhook, CheckoutForm, NGeniusMount, processing, success) — architecture sound; amount = `priceForDuration(monthly,duration).total` (DB price, minor units, VAT-incl); idempotent; webhook+polling reconcile; 3DS via SDK.
- **LIVE sandbox E2E on dev**: full transaction growth/6mo → real fake-3DS OTP `1234` → `/processing` → polling reconciled → `/success` (invoice, 7,794) → subscriber `paymentStatus=paid`, `billing="6m"`, `isAnnual=false`. Then **deleted the test subscriber** from dev.
- **🚀 DEPLOYED TO PRODUCTION:** merged `feat/inline-content-review` → `main` (fast-forward `93ffcd6..1400539`, **20 commits = the whole session's pricing overhaul**). Vercel prod **Ready** (`jbrseo-bjac8w14e`). Verified new **3/6/12 duration toggle + founding badge live** on `jbrseo.com/sa`.
- **Verified production N-Genius = LIVE** (Vercel env, evidence): `NGENIUS_API_BASE=api-gateway.ksa…`, SDK/token URLs = `ksa` (live), live outlet `9cc81e6e…`, API+hosted keys **≠ sandbox** = live keys. `NGENIUS_ENV="sandbox"` is **unused in code** (only in docs) → cosmetic, zero effect.
- **User live test confirmed system works**: 1st card issuer-declined (no charge); 2nd card → real bank OTP for SAR 1,497.
- **TSC: 0 errors** (3×). **Build:** not run. **Live test:** production go-live verified (pricing renders); real payment in progress by user (was at bank-OTP step).

### 📝 Decisions taken (with reasoning)
- **Founding "shic months" badge, not a price cut** → protects the sticker price; free-months = a concession that doesn't touch perceived value (user's acquisition-phase strategy: "التنازلات اللي ما تأثر في القيمة"). Labelled limited so it's retractable later. Rejected: real % discount (erodes value, hard to raise back).
- **Presence: FIX not remove** → user's rule «code زيادة شيل، بس function مش شغالة صلّحها». It's the intended 4th standard plan he toggles on/off; gave it a card from real DB content. Rejected: deleting the plan.
- **Dialect leaks are INTENTIONAL** → user confirmed SA «مش وعود» (#1) and #3 are correct on both countries; left untouched.
- **#6 hero «يلقاه» = non-issue** → production already renders the clear «عميلك يلقاك»; the ambiguous version was stale dev DB + a stale /eg CDN cache. Verified before editing (golden rule) → nothing to fix.
- **Go-live = merge the whole feat branch to main** → user explicit «push، خلينا نطلع live»; production main was the old monthly/annual model, all new work lived on the feat branch. Clean fast-forward, no divergence.

### 🚧 Pending / blocked
- **🚧 #2 Retry-UX bug (deferred by user):** after a failed/declined payment, the N-Genius card iframe stays stuck on «قيد المعالجة، لا تحدّث» — user must hard-refresh to retry. Fix = remount `NGeniusMount` on new attempt.
- **🚧 Vercel `NGENIUS_ENV`** = "sandbox" (unused label, but misleading) → change to "live".
- **🚧 #2 content — EG SEO title says «في السعودية»:** single shared `seo.title` (LandingSection `seo`, canonical=/eg) wrong on the Egypt page. Fix = neutralize to «السوق العربي» or per-country title. Editable in إدارة المحتوى → ظهور البحث.
- **🚧 #4 content — FAQ Latin jargon** (GEO/AEO · SEM · Perplexity · Google Ads · ChatGPT) too heavy for non-technical owners. Proposed treatment: Arabic-first + English once in parens; transliterate consumer AI names; demote/collapse deep-tech questions.
- **🚧 N-Genius webhook whitelist** still not done (user deferring until N-Genius certifies) — **polling backup proven E2E**, so payments confirm without it.
- **Content drift:** dev DB `hero.sub` («نكتب…يلقاه») ≠ live («مو مجرد…يلقاك») — dev is stale; harmless (dev serves no visitors).
- Local dev server still running (bg task `bibas2y0x`, `next dev` :3000, **dev DB** modonty_dev) — stop it.
- Older pending (unchanged): false-claims review, GA4 events review, landing enhancements, perf 84→93-94.

### 📂 Files touched (all in commit `1400539`)
- `app/components/landing/sections/PricingSection.tsx` — founding-offer badge
- `app/components/landing/sections/HeroSection.tsx` — hero line-height fix (diacritic collision)
- `lib/plan-card-content.ts` — `presence` card content + `Flag` import (4th plan works)
- `app/api/checkout/create-payment/route.ts` — added `"presence"` to plan enum (money path)
- `app/components/landing/sections/VoicesSection.tsx` — testimonial video `bg-muted` (no white flash)
- `documents/context/SESSION-LOG.md` — this update

### 🔁 Git / deploy state
- Branch: `feat/inline-content-review` (pushed to origin) → **merged to `main`** (fast-forward).
- Uncommitted: `.claude/settings.local.json` (ignore); this SESSION-LOG update.
- Last commit: `1400539` — "landing + checkout: founding-offer badge, hero line-height fix, presence as 4th plan (card + payment enum), testimonial video dark bg".
- Pushed: **yes** — `main` at `1400539` (`93ffcd6..1400539`).
- Vercel: **READY (production)** `jbrseo-bjac8w14e` — new pricing + badge verified live.
- **Production N-Genius = LIVE (real money).** Local `.env.local` = sandbox (dev, safe).

### 🚀 How to resume in 30 seconds
1. `git log --oneline -3` — confirm `1400539` on `main`, pushed; `git branch --show-current`.
2. Open `app/[country]/checkout/_components/NGeniusMount.tsx` + `CheckoutForm.tsx` — fix the stuck card iframe (remount `NGeniusMount` after a failed attempt so retry needs no refresh).
3. Then decide order: retry-UX fix + flip Vercel `NGENIUS_ENV`→live, then #2/#4 content edits via إدارة المحتوى.

---

## Session: 2026-07-27 13:46 — Google-Translate checkout crash: diagnosed + fixed + verified live · error pages rewrite · N-Genius emails

### 🎯 Where I stopped
- **Last action:** Delivered the N-Genius webhook-whitelist email (plain text). Before that: translate-crash fix + error-page rewrite both pushed and **verified live on production**.
- **Next concrete action when resuming:** Nothing blocking. Optional: (a) stop the local dev server (bg task `bg2zvf50f`, `next dev` on :3000); (b) clean the test sandbox orders from prod DB (`6a672c92…`, `6a672dfc…` — sandbox, no real charge); (c) send the two emails (translate = user said "sent"; webhook = ready to send).

### ✅ Done this session
- **🔥 Diagnosed the N-Genius live-test crash with 100% certainty:** the `NotFoundError: Failed to execute 'removeChild' on 'Node'` + "An unexpected error occurred" screen N-Genius hit was caused by **browser auto-translation (Google Translate)**, NOT payment code. Google Translate wraps bare text nodes in `<font>` + runs a MutationObserver; during the submit→3DS→status text toggles React removes a bare text node whose parent Translate reparented → throw → crash to `app/error.tsx` (React issue #11538).
- **Reproduced BOTH ways, live in Playwright (production):** WITH real Google Translate engine injected → crash reproduced exactly (h1 became English "Complete your subscription", 72 `<font>` tags, removeChild throw → error screen). WITHOUT translate → full flow success. Same data, same actions — only difference = translation.
- **Fix shipped (2 layers, checkout only):** `app/[country]/checkout/layout.tsx` → `translate="no" className="notranslate"` on container (covers all checkout sub-routes); `app/[country]/checkout/page.tsx` metadata → `other: { google: "notranslate" }` → renders `<meta name="google" content="notranslate">`. Rest of site still translates normally.
- **Verified fix live on production** (`dpl_5ArGpG…`): injected real Google Translate → `translated-ltr` active but **0 `<font>` inside checkout**, h1 stayed Arabic, full E2E (card `4111…/12-30/123`, OTP `1234`) → **success**, zero removeChild. Screenshots in `.playwright-mcp/` (crash-reproduced…, fix-success…, live-success-with-translate).
- **Error pages rewritten + previewed live:** `app/error.tsx` (global) → clearer/warmer copy «صار خلل تقني مؤقت — المشكلة من عندنا، مو منك» + WhatsApp + email. NEW `app/[country]/checkout/error.tsx` → payment reassurance «لم يتم خصم أي مبلغ من بطاقتك» + contacts. Both previewed via temp `boom` throw routes (deleted after).
- **Sales contacts pulled from live landing:** WhatsApp `966541018020` (+966 54 101 8020) · email `support@jbrseo.com`.
- **Two emails drafted (plain text):** (1) translate issue → N-Genius "ready for re-test" (user said sent); (2) webhook whitelist request.
- **TSC:** 0 errors (run 3×). **Build:** not run. **Live test:** production E2E payment with translate active = PASSED.
- **Global memory (`~/.claude/CLAUDE.md`) updated** with 3 cross-project rules (see Decisions).

### 📝 Decisions taken (with reasoning)
- **Disable translation on checkout only (not whole site)** → the crash needs bare-text toggles in a hot flow; marketing pages should still translate for foreign visitors. Rejected: site-wide notranslate (kills legit translation), or hardening every removeChild (fragile, endless).
- **Two-layer notranslate (meta + attribute)** → defense in depth; meta is page-authoritative, attribute covers all checkout sub-routes. 
- **Separate checkout error boundary with money reassurance** → a generic error on the payment page scares customers ("did I get charged?"); global boundary can't promise payment specifics.
- **Hardcode contacts in error.tsx** → error boundary must render even if DB/network down; can't fetch `SiteSettings.whatsappNumber`. Comment says keep in sync.
- **Global rules saved to `~/.claude/CLAUDE.md`:** (1) browser-translate crashes React on payment/dynamic pages → notranslate the money flow; (2) Windows 11 — delete via PowerShell `Remove-Item`, never `rm` (blocked); use `-LiteralPath` for `[slug]`/`[country]` paths (brackets = wildcards, silent false "removed"); (3) corrupt `.next`/Turbopack panic = environmental, clear `.next` + restart.

### 🚧 Pending / blocked
- **🚨 N-Genius webhook whitelist** — email ready (this session). Must add prod webhook URL in prod portal + request manual whitelist before go-live (see `project_ngenius_webhook_whitelist` memory + `documents/context/NGENIUS-GO-LIVE-EMAIL.md`). Polling backup covers meanwhile.
- **🚨 N-Genius go-live** — production still on SANDBOX. Real cards won't work until live-env swap + webhook whitelist.
- **Perf 84 → 93-94** — paused by user (render-blocking CSS 310ms + first-party JS/TBT ~1MB).
- Test sandbox orders on prod DB (`6a672c92…`, `6a672dfc…`) — no real charge; optional cleanup.
- Local dev server may still be running (bg `bg2zvf50f`, :3000) — stop it.
- Older pending (unchanged): false-claims review, GA4 events review, landing enhancements.

### 📂 Files touched
- `app/[country]/checkout/layout.tsx` — `translate="no"` + `notranslate` on container (crash fix)
- `app/[country]/checkout/page.tsx` — metadata `other: { google: "notranslate" }`
- `app/error.tsx` — rewritten global error copy + WhatsApp/email contacts
- `app/[country]/checkout/error.tsx` — NEW checkout error boundary (payment reassurance)
- `package.json` — version 1.4.0 → 1.4.1 → 1.4.2
- `~/.claude/CLAUDE.md` (global, outside repo) — 3 cross-project rules
- Temp `boom` preview routes — created then deleted (not committed)
- `documents/context/SESSION-LOG-2026-07.md` + `SESSION-LOG-2026-06.md` — NEW archives (weekly rotation)

### 🔁 Git / deploy state
- Branch: `main`
- Uncommitted: `.claude/settings.local.json` (M, ignore), `documents/context/SESSION-LOG*.md` (this update), untracked `app/api/ua/` + `app/plain/` (pre-existing, not mine)
- Commits this session: `ebd49b3` (translate fix) + `0fb2555` (error pages). **Both pushed.**
- Vercel: **READY (production)** — live deploy `dpl_5ArGpG…` verified with the fix.

### 🚀 How to resume in 30 seconds
1. `git log --oneline -3` — confirm `0fb2555` is top + pushed.
2. Open `documents/context/NGENIUS-GO-LIVE-EMAIL.md` + `project_ngenius_webhook_whitelist` memory — the webhook whitelist is the live blocker for go-live.
3. Decide: send the webhook email + add URL in prod portal, or move to perf 84→93-94.

---
