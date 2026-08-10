# Session Log — jbrseo.com

> Append-only. Newest session at top.
> Weekly rotation: active file = last 7 days only. Older sessions archived monthly →
> `SESSION-LOG-2026-07.md` (9 sessions), `SESSION-LOG-2026-06.md` (7 sessions).

---
## Session: 2026-08-09 → 08-10 — 🔍 مراجعة السيو الكاملة + رحلة مقالات العملاء E2E (٢٨ بنداً · ١٩ هدفاً مثبَتاً)

### 🎯 أين وقفت
- **آخر حالة:** مودونتي **دُمجت ونُشرت على الإنتاج** (`1a1262e..42b450b`) والمسارات حيّة ومتحقَّقة. جبر سيو **٣٤ ملفاً غير مثبَّتة** على فرع `feat/inline-content-review` (مطابق لـ`origin/main`، آخر كوميت `a54dd8c`).
- **الخطوة التالية بالضبط:** تبديل معرّف العميل في `lib/modonty-articles.ts:65` من معرّف التطوير `69d5ec61e2087dee91fe99a1` إلى **معرّف الإنتاج** — وكان يجب التحقّق منه من قاعدة الإنتاج قبل الكتابة (المرشّح `69d78a637307a53e597efb33` باسم «شركة جبر الجنوبية للمقاولات»، **لم يُؤكَّد أنه سجلّ جبر سيو الصحيح**).
- **العائق الذي كان يمنع الدفع زال:** `app/robots.ts` يشير إلى `api.modonty.com/v1/sites/<id>/sitemap.xml`، وهذا المسار **صار حيّاً على الإنتاج** بعد نشر مودونتي.

### ✅ ما أُنجز — السيو
لوحة `documents/tasks/JBRSEO-SEO-TASK.html` (٢٨ بنداً، الفتح على `jbrseo-seo-task-done-v24`):
- **T1** عنوان ووصف مستقلّان للسعودية ومصر (`seoByCountry` في `app/content/landing.ts`).
- **T2** خريطة المقالات تُستضاف عند مودونتي + سطر `Sitemap:` ثانٍ في `robots.ts` · رُفع حجب `/_next/*`.
- **T3–T9** تكرار اسم الموقع · «مدونتي» في الوسوم · وسم robots · بطاقات مهيكلة لستّ صفحات · صورة المشاركة · عنقود اللغات · `og:url`.
- **T10** دعم زواحف الذكاء (٩ رموز رسمية ٢٠٠ بمتن وبطاقة).
- **T11** صورة المشاركة كانت **١٤٣×٤٦** (لا مشكلة صيغة) → `f_png,w_1200,h_630,c_pad,b_white`.
- **T12** `/features` كانت تعلن نفسها نسخة لغوية من الرئيسية.
- **T13** بطاقة تويتر `summary` في `/privacy` و`/terms`.
- **T14** `lastModified` كان `new Date()` → تواريخ حقيقية من `LandingSection.updatedAt` + `revalidate = 3600`.
- **T15** «مدونتي» في وصف `/terms` وبطاقة `/about` والنصّ الاحتياطي.
- **T16** حذف `app/components/shared/LandingJsonLd.tsx` (ميت، ١٨٩ سطراً).
- **T19** `/sa` كانت تعلن `og:locale = ar_EG` → `COUNTRY_OG_LOCALE`.
- **T20** `SHARED_OPEN_GRAPH` — ستّ صفحات كانت بلا `og:site_name`/`type`/`locale`.
- **T21** زرّا «من نحن» (`/signup` ميت و`/#pricing` يفقد المرساة) → واتساب + `/{country}#pricing`.
- **T22** «مدونتي» في المتن: **قرار خالد — تبقى** (جبر سيو بوّابة بيع مودونتي).
- **T23** المقال المفقود يردّ ٢٠٠ لا ٤٠٤: **مقبول** — قوقل توثّق `noindex` كحلّ، والسبب `layout.tsx:71` (Suspense).
- **T24** بطاقة الشركة كانت باسم «مدونتي» وشعارها → جبر سيو + `contactPoint`.
- **T25** عقدة `WebSite` على صفحتَي الهبوط (اسم الموقع في نتائج قوقل كان مُخمَّناً).
- **T26** 🔴 **قائمة التنقّل مكسورة في ست صفحات** — `basePath` كان يصل الشريط السفلي فقط.
- **T27** الضغط لا ينزل للمرساة (`loading.tsx` يبثّ أولاً) → `app/components/landing/ScrollToHash.tsx`.
- **T42** 🔴 **السلَق العربي = صفحة ٤٠٤ عند العميل** — ترميز مزدوج → `encodeSlugOnce()` في `lib/modonty-articles.ts`.

### ✅ ما أُنجز — رحلة مقالات العملاء (على قاعدة التطوير)
- مقال جديد من الصفر مرّ الرحلة كاملة: `WRITING → DRAFT → AWAITING_APPROVAL → (موافقة العميل في الكونسول) → SCHEDULED → PUBLISHED_ON_CLIENT_SITE` — المعرّف `6a78d5c7bbfdd41f23035688`.
- **١٩ هدفاً من ٢١ مثبَتاً بدليل خام.** الباقيان (١٩ و٢٠) يخصّان تهيئة الإنتاج والنشر.
- بوّابة الجودة ٢١/٢١ · العزل ٤٠٣/٤٠٤/ETag · الخريطة · لوحة العميل · حارس الروابط الداخلية · تتبّع آخر سحب · زرّ الطوارئ (`canPublishToOwnSite` → ٤٠٣ فوراً).

### 📝 قرارات مأخوذة
- **`isPartOf` تبقى تشير لمودونتي** — خالد: «العميل بالفعل جزء من مدونتي»، وschema.org تقول «(in some sense)»، وقوقل لا تستعملها لأي نتيجة ثرية.
- **`BreadcrumbList` تُحذف من مقال العميل** — قوقل: «Don't add structured data about information that is not visible to the user, even if the information is accurate»، ولا نضمن قالب العميل.
- **لا حذف في مودونتي، أرشفة فقط** — وزرّ سحب المقال من موقع العميل **مرحلة ثانية**.
- **«مدونتي» تبقى في المتن** لا في الوسوم.

### 🚧 معلّق / محجوب
- **تبديل معرّف العميل** في `lib/modonty-articles.ts:65` — يحتاج تأكيد معرّف الإنتاج من القاعدة.
- **تهيئة الإنتاج (T35):** `canPublishToOwnSite` = `false` و`articlesBaseUrl` = `null` على الإنتاج ⇒ لو دُفع جبر سيو الآن، صفحة المقالات تطلع **فاضية** بلا رسالة خطأ.
- **T41 لم يُصلح:** نجوم الإلزام في نموذج المقال لا تطابق التحقّق (`Slug` و`Content` إلزاميان بلا نجمة) والحفظ يفشل صامتاً — يخصّ مودونتي.
- **أثر غير محسوب (T39):** لو سقط `articlesBaseUrl`، تُعاد بطاقات مقالات **منشورة** على مودونتي بينما `canonicalUrl` يبقى عند العميل.
- **لا مسار تحديث فوري:** وسوم الجلب موجودة ولا شيء يطلقها ⇒ أي تصحيح ينتظر ساعة.

### 📂 ملفات لُمست (جبر سيو)
`app/(site)/{about,team,privacy,terms,billing-policy,articles}/page.tsx` · `app/(site)/articles/[slug]/page.tsx` · `app/(site)/about/_components/AboutPageJsonLd.tsx` · `app/(site)/layout.tsx` · `app/[country]/(marketingShell)/page.tsx` · `app/components/landing/LandingJsonLd.tsx` · `app/components/landing/ScrollToHash.tsx` (جديد) · `app/components/layout/header/LandingHeader.tsx` · `app/components/shared/LandingJsonLd.tsx` (محذوف) · `app/content/landing.ts` · `app/features/page.tsx` · `app/robots.ts` · `app/sitemap.ts` · `lib/{constants,getGlobalSeo,getLandingContent,landing-open-graph,modonty-articles,seo-meta}.ts` · `documents/tasks/JBRSEO-SEO-TASK.html`

### 🔁 حالة git والنشر
- **جبر سيو:** فرع `feat/inline-content-review` · آخر كوميت `a54dd8c` · **٣٤ ملفاً غير مثبَّتة** · لم يُدفع · `tsc` صفر أخطاء.
- **مودونتي:** `main` = `42b450b` · **مدفوع ومنشور** · بناء ثلاثة تطبيقات نجح · تست ٩/٩ على البناء الإنتاجي · نسخة احتياطية للإنتاج (٩٥ مجموعة · ٥٠ ميغا) · الإصدارات `admin 1.14.0` و`console 0.26.0`.
- **الإنتاج متحقَّق:** `api.modonty.com/v1/sites/<id>/articles` → ٤٠٣ لعميل مقفول · ٤٠٤ لمعرّف مشوّه · `www.modonty.com` ٢٠٠.

### 🚀 كيف تكمل في ٣٠ ثانية
1. أكّد معرّف جبر سيو في **قاعدة الإنتاج** (قراءة فقط) قبل أي تبديل.
2. بدّله في `lib/modonty-articles.ts:65`، ثم `pnpm tsc --noEmit` و`pnpm build`.
3. في أدمن الإنتاج: فعّل «النشر على موقعه» + `articlesBaseUrl = https://www.jbrseo.com/articles`، وانشر مقالاً واحداً — وإلا القائمة فاضية.
4. ثبّت الـ٣٤ ملفاً وادفع جبر سيو، ثم تحقّق حيّاً: `/articles` · صفحة المقال · `robots.txt` · خريطة العميل.
5. اللوحة المرجعية: `documents/tasks/JBRSEO-SEO-TASK.html` — مفتوح فيها `T35` و`T36` و`T41`.

---

## Session: 2026-08-04 10:30 — 💳 Fix payment retry-loop (N-Genius stuck "قيد المعالجة" on failed payment) — root-caused, fixed, happy-path E2E verified, deployed

### 🎯 Where I stopped
- **Last state:** Payment retry-loop bug **fixed + pushed** (`cbe03c2`, v1.5.1). Happy-path **E2E verified live on sandbox** (localhost:3006 → /success with invoice). Waiting on Khalid to test on production with his own card («push, I will test with mine») + on N-Genius engineer **Jakeem Barkley** to re-run his failed scenario.
- **Next concrete action:** After Vercel deploys `cbe03c2`, hard-refresh prod checkout + test. To close the decline-path proof, get the exact sandbox **decline card** Jakeem used and run before/after on 3006.

### ✅ Done this session
- **Fixed the payment retry-loop bug** (N-Genius support engineer Jakeem reported via email: "failed scenario loops on «قيد المعالجة», never shows the retry box"). **Root cause (evidence):** `create-payment` detected an immediate decline (`isPaymentFailed`) but still returned the dead N-Genius response; `CheckoutForm` then called the SDK's `handlePaymentResponse` on it with **NO timeout** (unlike `generateSessionId`) → the SDK's card iframe stuck on «قيد المعالجة» and the promise **never resolved** → eternal hang, no retry. The stuck text is the SDK's own iframe (confirmed not in our code).
- **Consulted official N-Genius docs** (web-sdk-integration-guide): `handlePaymentResponse` SHOULD resolve `FAILED` on decline + recommends unmount/remount to retry — so we must NOT hand it a server-known-dead order.
- **Fix (2 files):** `create-payment` returns `{ declined:true, reason:"card_declined", subscriberId }` on immediate decline instead of the dead response; `CheckoutForm` detects the flag → **skips the SDK** → redirects to `/checkout?error` (retry box); PLUS wraps `handlePaymentResponse` in a **5-min safety `withTimeout`** → on any hang, routes to `/processing` for server reconciliation.
- **Happy-path E2E verified LIVE on sandbox (localhost:3006):** filled form → card `4111…/12-30/123` → fake-3DS OTP `1234` → `/processing` → **`/success`** with invoice (الزخم ٦ شهور، ٧٬٧٩٤ شامل VAT). Proves the fix does NOT break successful payments (declined-branch skipped, timeout transparent). Screenshot `.playwright-mcp/success-e2e-after-fix.png`. Deleted the test subscriber from `modonty_dev`.
- **Safe-by-construction:** the new code runs ONLY on the failure branch — the successful-payment path is byte-for-byte unchanged.
- **TSC: 0 errors** (2×). **Build:** not run. **Live test:** happy-path E2E on sandbox PASSED; decline-path pending Jakeem's card.

### 📝 Decisions taken (with reasoning)
- **Server is the source of truth for decline detection** → `create-payment` already knows it's declined, so return an explicit flag rather than let the client SDK re-derive a dead order's fate. Rejected: client-side inspection of the raw paymentResponse (fragile).
- **5-min timeout on `handlePaymentResponse`** (not shorter) → must exceed real 3DS OTP entry (bank OTPs expire first) so it never interrupts a legit challenge; it's a hang backstop, not a decline detector.
- **Pushed on happy-path-verified + safe-by-construction** (Khalid: «push, I will test with mine») → unblocks N-Genius certification fastest; the decline reproduction (needs Jakeem's card) is the final confirmation on the deployed build.

### 🚧 Pending / blocked
- **🚧 Decline-path E2E (before/after)** — needs the exact sandbox DECLINE card Jakeem used (N-Genius test-cards docs 404'd; won't guess a PAN). Ask Jakeem.
- **🚧 Clarity prod-readiness (from the 22:34 block, unchanged):** set 3 Vercel Production env vars (`NEXT_PUBLIC_CLARITY_ID=xwgijh5i7f`, `CLARITY_API_TOKEN` [value in local `.env.local`], `CRON_SECRET`) + `prisma db push` against prod (confirm target) + clean dev seed (84 rows in `modonty_dev`) + run the «مريم» Clarity-Funnels prompt.
- **Carryover:** `NGENIUS_ENV` "sandbox" label, FAQ Latin jargon, N-Genius webhook whitelist.
  - ~~EG SEO title «في السعودية»~~ → **أُنجز ٩ أغسطس** (T1): `seoByCountry` في `app/content/landing.ts` — عنوان ووصف مستقلّان لكل دولة، والسعر يتفرّع (٣٩٩ ريالاً / ١١٩٩ جنيهاً). قِيس بستّة عشر فحصاً صفر فشل.
- **Local dev server on 3006** (bg task `bnxt5465v`, `modonty_dev`) — may still run; stop if not needed.

### 📂 Files touched
- `app/api/checkout/create-payment/route.ts` — return explicit decline flag on immediate decline (skip the dead-order SDK handoff)
- `app/[country]/checkout/_components/CheckoutForm.tsx` — skip SDK on the declined flag + 5-min safety timeout on `handlePaymentResponse` → `/processing` fallback
- `package.json` — 1.5.0 → 1.5.1
- `~/.claude/projects/…/memory/project_local_dev_port.md` — NEW memory: local dev = port **3006** (3000 reserved)
- `documents/context/SESSION-LOG.md` + `SESSION-LOG-2026-07.md` — this update + weekly rotation (moved the 2026-07-27 block to July archive)

### 🔁 Git / deploy state
- Branch: `feat/inline-content-review`
- Uncommitted (INTENTIONAL): `.claude/settings.local.json`, landing `.jpeg`s, this SESSION-LOG update, `.env.local` (holds `CLARITY_API_TOKEN` — gitignored, never pushed).
- Commits pushed to `main` across this session: `d626b20` (Clarity), `cbe03c2` (payment fix). **HEAD = origin/main = `cbe03c2` (in sync, ls-remote verified).**
- Pushed: **yes.** Vercel: building from `cbe03c2`.

### 🚀 How to resume in 30 seconds
1. Confirm Vercel deployed `cbe03c2` (Ready) → hard-refresh prod checkout → test: a successful card still works; a **declined** card now shows the retry box, NOT the stuck «قيد المعالجة».
2. Ask Jakeem for his failed-scenario card → run before/after on `localhost:3006` to close the decline-path proof.
3. Clarity go-live: set the 3 Vercel env vars + `prisma db push` (confirm prod target) + clean dev seed.

---

## Session: 2026-08-03 22:34 — 📈 UX-Insights: Microsoft Clarity tracking + Data Export pipeline + admin friction dashboard → built, verified live-read, deployed to main

### 🎯 Where I stopped
- **Last state:** Clarity UX-Insights feature **fully built + pushed to `main`** (commit `d626b20`, v1.5.0). **Verified real read from Clarity** (curl to project `xwgijh5i7f` → HTTP 200, real metric names match our parser 100%). Dashboard **renders fully** on local with dev seed data (Playwright-verified). Gave Khalid a browser-agent («مريم» = Claude-in-Chrome) prompt to build Clarity **Funnels** manually in the UI. Also pushed a landing tweak earlier (commit `b36447b`).
- **Next concrete action when resuming:** Set the **3 Clarity env vars on Vercel Production** — `NEXT_PUBLIC_CLARITY_ID=xwgijh5i7f`, `CLARITY_API_TOKEN=<value in local .env.local>`, `CRON_SECRET=<random>`. Then run **`prisma db push` against PROD** (⚠️ Prisma CLI reads `.env` = modonty **prod** — confirm target first) to create the `clarity_daily` / `clarity_sync_log` indexes. Then real data flows in ~1 day once the script is live.

### ✅ Done this session
- **Landing polish (commit `b36447b`, v1.4.4):** gift-months badge moved **next to the plan name** (amber + `animate-gift-glow`), founding-offer badge, **removed the PaymentTrust (Network International) section** (deleted `PaymentTrust.tsx`).
- **Clarity UX-Insights feature (commit `d626b20`, v1.5.0, 28 files)** — mapped to the REAL stack (no tRPC, no `[locale]`, no cacheComponents; the BRD assumed a different stack):
  - **Phase 0 — tracking:** `app/components/ClarityAnalytics.tsx` — deferred like `DeferredGTM` (mounts on first interaction/idle), **excluded from `/admin`** via `usePathname`, loads only when `NEXT_PUBLIC_CLARITY_ID` set.
  - **Phase 1 — models:** `ClarityDaily` + `ClaritySyncLog` in `schema.prisma`; Prisma client regenerated (killed node first — Golden Rule). `db push` DEFERRED.
  - **Phase 2 — pipeline:** `lib/clarity/` (fetch with 3× backoff + 401/403/400/429 mapping, Zod schema, structure-driven normalizer, friction score, Riyadh-date helper, syncDaily) + `app/api/cron/clarity/route.ts` (CRON_SECRET-guarded) + `vercel.json` (daily `0 0 * * *` = 03:00 Riyadh).
  - **Phase 3 — data layer:** `lib/clarity/queries.ts` — **direct DB reads** (dropped unstable_cache/revalidateTag).
  - **Phase 4 — dashboard:** `app/admin/(dashboard)/ux-insights/` — metric cards, recharts trend, worst-pages friction table, device/browser breakdown, sync banner, loading/error + nav link 📈.
- **Verified REAL Clarity Data Export API** (curl, project `xwgijh5i7f`, numOfDays=3): **HTTP 200**; real metricNames = `Traffic, EngagementTime, ScrollDepth, RageClickCount, DeadClickCount, QuickbackClick, ExcessiveScroll, ScriptErrorCount, ErrorClickCount` — **all match our normalizer** (guessed names were correct). `information: []` (no traffic yet — script not live). Auth + shape proven.
- **Dev-only seed:** 84 rows into `modonty_dev` (guarded script refuses non-dev URL) → dashboard renders fully; Playwright screenshot confirms cards/trend/table/breakdown. Trend lines render after client mount (not a bug).
- **«مريم» funnel prompt** delivered (in chat) — instructs a browser agent to build Clarity Funnels in the UI: `SA — Client Journey` (landing `/sa` → `/sa/checkout` → `/checkout/processing` → `/checkout/success`), clone `EG`, plus `SA — Payment Failed`. (API **cannot** create funnels — verified: `Data.Export` scope is read-only, funnels are a no-code dashboard feature; real conversion funnel is better in GA4.)
- **Verified Hotjar 100% gone + zero bundle impact** (exhaustive grep): **zero** Hotjar in code/env/scripts (only stale docs mention it — `docs/GTM-GA4-AUDIT.md`, `TODO.md`, etc.). New Clarity tracking = ~1KB client component (deferred, prod-only, lib loads from external CDN); recharts is **admin-route-only** (`ux-insights` + `DashboardCharts`) → **zero weight added to public landing/checkout**. ⚠️ Unverifiable from code: whether a Hotjar tag still lives in the **GTM container** (`GTM-TT25M3GX`, managed in GTM dashboard) — Khalid to check GTM → Tags.
- **TSC: 0 errors** (multiple runs, incl. final pre-push). **Build:** not run. **Live test:** dashboard verified populated on local (Playwright); real Clarity read verified via curl.

### 📝 Decisions taken (with reasoning)
- **Map BRD to real stack, not build it literally** → the BRD (`BRD-ux-dashboard-jbrseo.md`) assumed tRPC + next-intl `[locale]` + `cacheComponents`/`'use cache'`; the repo has NONE (verified). Built with Server Components + direct Prisma + `app/admin/(dashboard)/ux-insights/` + Arabic-only. Rejected building against a phantom stack.
- **Dropped caching (unstable_cache + revalidateTag)** → Next 16.1 made `revalidateTag(tag, profile)` require 2 args (tied to the `'use cache'` system, which needs cacheComponents = OFF here); `unstable_cache` is deprecated. Direct DB reads for an internal, daily-updated, low-traffic admin page = simpler + always fresh. Rejected fighting a deprecated API.
- **Friction metric names verified against a REAL response, not guessed** → curled the live API; the substring-matching normalizer handles every real name; `ErrorClickCount` is preserved in `raw` (unmapped, not in the friction weights).
- **Clarity script deferred + `/admin`-excluded; ID only on Vercel Production** → protects TBT (matches DeferredGTM discipline), keeps staff sessions out of friction data, and keeps localhost/preview traffic out of the live Clarity project.
- **`prisma db push` DEFERRED** → Prisma CLI loads `.env` (= modonty **prod**), not `.env.local`; must run only with a confirmed target. Safe to defer — no writes happen without the token.
- **Funnels via browser agent, not API** → verified the only API is read-only Data Export with no funnel-creation endpoint; funnels are a dashboard no-code feature. GA4 (already wired) is the better tool for a true session-level conversion funnel.

### 🚧 Pending / blocked
- **🚧 Vercel env (3 vars)** — needs Khalid: `NEXT_PUBLIC_CLARITY_ID`, `CLARITY_API_TOKEN`, `CRON_SECRET` on **Production**. Without `NEXT_PUBLIC_CLARITY_ID` the script never loads → no data collected.
- **🚧 `prisma db push` on PROD** — run jointly, confirm `DATABASE_URL` = modonty prod first (creates `clarity_daily`/`clarity_sync_log` indexes).
- **🚧 Dev seed still in `modonty_dev`** — 84 fake `ClarityDaily` rows + 1 `ClaritySyncLog`; offer to clean (collections are Clarity-only, safe to wipe).
- **🚧 Clarity Funnels** — Khalid to run the «مريم» prompt against the Clarity UI.
- **🚧 Real data** — needs the script live in prod + ~1 day of traffic before the dashboard/cron shows real numbers.
- **Carryover (prior session, unchanged):** retry-UX bug #2 (N-Genius iframe stuck after failed payment), `NGENIUS_ENV` "sandbox" label, EG SEO title «في السعودية», FAQ Latin jargon, N-Genius webhook whitelist.
- **Local dev server** bg task `bma7lqpxl` (`next dev` :3000, **modonty_dev**) — may still be running; stop if not needed.

### 📂 Files touched
**Landing (commit `b36447b`):**
- `app/components/landing/sections/PricingSection.tsx` — gift badge next to plan name + founding badge
- `app/globals.css` — `gift-glow` keyframe + `--animate-gift-glow`
- `app/components/landing/Landing.tsx` — removed `<PaymentTrust />` + import
- `app/components/landing/sections/PaymentTrust.tsx` — **deleted**
- `package.json` — 1.4.3 → 1.4.4

**Clarity (commit `d626b20`):**
- `app/components/ClarityAnalytics.tsx` — deferred Clarity tag, `/admin`-excluded (new)
- `app/layout.tsx` — mount `<ClarityAnalytics />`
- `.env.example` — Clarity vars documented
- `prisma/schema.prisma` — `ClarityDaily` + `ClaritySyncLog` models
- `lib/clarity/{constants,schema,types,fetchClarityData,frictionScore,normalizeResponse,date,syncDaily,queries}.ts` — pipeline + reads (new)
- `app/api/cron/clarity/route.ts` — daily cron handler (new)
- `vercel.json` — cron schedule (new)
- `docs/clarity-sample-response.json` — placeholder sample (new)
- `app/admin/(dashboard)/ux-insights/{page,loading,error}.tsx` + `_components/{RangeSwitcher,TrendChart,UxMetricCards,SyncStatusBanner,WorstPagesTable,DeviceBreakdown}.tsx` + `_helpers/format.ts` — dashboard (new)
- `app/admin/(dashboard)/_config.ts` + `_components/AdminTopNavbar.tsx` — nav link 📈
- `package.json` — 1.4.4 → 1.5.0

### 🔁 Git / deploy state
- Branch: `feat/inline-content-review`
- Uncommitted (INTENTIONAL, not pushed): `.claude/settings.local.json`; landing screenshot `.jpeg`s (untracked); **`.env.local`** (now holds `CLARITY_API_TOKEN` — **gitignored, never pushed**).
- Commits pushed to `main` this session: `b36447b` (landing gift badge + founding + remove Network International), `d626b20` (Clarity UX-Insights feature).
- Last commit: `d626b20`. **HEAD = origin/main = `d626b20` (in sync, verified via ls-remote).**
- Pushed: **yes.**
- Vercel: building from `d626b20`. **Clarity env vars NOT set yet → feature dormant** (script off, cron will fail "CLARITY_API_TOKEN not set" until configured).
- **Secret:** `CLARITY_API_TOKEN` (Data.Export JWT, ~non-expiring) lives ONLY in local `.env.local` + scratchpad token file — **not on Vercel yet**. Project ID `xwgijh5i7f` is public.

### 🚀 How to resume in 30 seconds
1. **Vercel → jbrseo → Settings → Environment Variables (Production):** add `NEXT_PUBLIC_CLARITY_ID=xwgijh5i7f`, `CLARITY_API_TOKEN=<copy from local .env.local>`, `CRON_SECRET=<generate random>`. Redeploy.
2. **`prisma db push`** — FIRST confirm target: `grep DATABASE_URL .env` (must be modonty **prod**); then run to create the Clarity indexes on prod.
3. **Optional cleanup:** wipe the dev seed — `modonty_dev` → `clarityDaily.deleteMany({})` + `claritySyncLog.deleteMany({})`. And give Khalid's «مريم» agent the Clarity-Funnels prompt.

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

