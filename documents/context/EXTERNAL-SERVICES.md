# External Services — Master Registry

> **مرجع شامل لكل خدمة خارجية يعتمد عليها المشروع.** روابط · حسابات · مفاتيح · حالة · fallbacks.
> آخر فحص شامل: **2026-07-12 · ٦/٦ passed · صفر blockers.**
> فحص سريع بأي وقت: `node scripts/external-services-health-check.mjs`

---

## 🟢 نظرة عامة سريعة

| الخدمة | الغرض | الحالة | الحساب |
|---|---|---|---|
| **Cloudflare Turnstile** | حماية الفورم من bots | ✅ | Modonty1@gmail.com |
| **Upstash Redis** | Rate limiting (dev + prod) | ✅ | Google SSO — Modonty1@gmail.com |
| **MongoDB Atlas (dev)** | `modonty_dev` DB | ✅ | modonty-cluster |
| **MongoDB Atlas (prod)** | `modonty` DB (shared with Modonty app) | ✅ | نفس الـ cluster |
| **N-Genius Sandbox** | بوابة الدفع (اختبار) | ✅ | khalid@jbrseo.com |
| **N-Genius LIVE** | بوابة الدفع (إنتاج) | ⏳ pending Readiness Checklist | نفس الحساب |
| **GA4 Data API** | تحليلات Modonty في الـ Impact Bar | ✅ | jbrseo-analytics service account |
| **Google Search Console** | SEO monitoring | 🟡 مستقل — يستخدمه Khalid | — |
| **Vercel** | Hosting + deployments | ✅ | Modonty team |
| **Resend** | Email (يُستدعى من Modonty، مو من JBRSEO) | 🟡 (Modonty side) | Modonty team |
| **Cloudinary** | Image CDN + optimization | ✅ | dfegnpgwx |

---

## 1️⃣ Cloudflare Turnstile

**الغرض:** CAPTCHA على `/checkout` — يمنع bots من استنزاف صفحة الدفع.

**Portal:** https://dash.cloudflare.com/?to=/:account/turnstile
**Docs:** https://developers.cloudflare.com/turnstile/
**Widget name:** `JBRSEO Checkout`
**Hostnames configured:** `jbrseo.com` · `www.jbrseo.com`
**Widget mode:** Managed

**Env vars:**
| Key | القيمة (dev) | القيمة (prod — Vercel only) |
|---|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `1x00000000000000000000AA` (test — always-pass) | `0x4AAAAAAD0WBTf374FbWMKg` |
| `TURNSTILE_SECRET_KEY` | `1x0000000000000000000000000000000AA` (test) | `0x4AAAAAAD0WBawxZ3TuumVOW4z16npiEZc` |

**كود Integration:**
- `lib/turnstile.ts` — server verify function
- `app/[country]/checkout/_components/CheckoutForm.tsx` — widget + fallback polling

**Fallbacks لو Cloudflare عندهم outage:**
- Test keys on dev ما تُلامس Cloudflare أصلاً (always-pass محلياً)
- على prod: `lib/turnstile.ts` fails-closed في production، fails-open في dev

**Free tier limits:** 1M widget requests/شهر — نحن لن نصل قريباً.

---

## 2️⃣ Upstash Redis

**الغرض:** Rate limiting مشترك عبر Vercel serverless instances (٣ tiers: landing/checkout/order).

**Portal:** https://console.upstash.com
**Docs:** https://upstash.com/docs/redis/overall/getstarted
**Database name:** `jbrseo-ratelimit`
**Region:** Ireland (eu-west-1)
**Type:** Regional · Free tier · TLS enabled
**Endpoint:** `https://suited-lacewing-117645.upstash.io`

**Env vars:**
| Key | القيمة |
|---|---|
| `UPSTASH_REDIS_REST_URL` | `https://suited-lacewing-117645.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | (في `.env.local`) — يبدأ بـ `gQAAAAAAAcuN...` |

**كود Integration:**
- `lib/rate-limit.ts` — ٣ limiters (landing · checkout · order)
- `proxy.ts` — يستدعي `landingLimiter.limit(ip)` لكل route (باستثناء static)

**Free tier limits:** 500K commands/شهر · 256MB storage · 50GB bandwidth/شهر. نحن نتوقع أقل من 50K/شهر.

**Fallbacks لو Upstash down:**
- `lib/rate-limit.ts` عنده NOOP fallback (يسمح بالطلب لو الـ env vars مفقودة)
- على prod: لو الاستدعاء يفشل → يجب أن نفشل مغلقاً (لكن حالياً `Ratelimit.limit()` يرمي exception → يوقف الطلب. مُقبل: catch + allow)

**Live verified:** 2026-07-12 — طلب #31 من نفس IP رجع 429 (متوقّع بعد 30).

---

## 3️⃣ MongoDB Atlas — `modonty_dev` (Dev)

**الغرض:** كل قراءة/كتابة أثناء التطوير المحلي (Subscriber · LandingSection · Plan · WebhookEvent · SiteSettings · ExitReason · PriceSectionMeta).

**Portal:** https://cloud.mongodb.com
**Cluster:** `modonty-cluster.tgixa8h.mongodb.net`
**DB name:** `modonty_dev`
**User:** `modonty-admin`
**Env var:** `DATABASE_URL` (في `.env.local`)

**Prisma:**
- Schema: `prisma/schema.prisma`
- Generate: `pnpm exec prisma generate`
- Push: `pnpm db:push`

**Health:** 15 Subscriber rows · 0 WebhookEvent · جميع models سليمة.

---

## 4️⃣ MongoDB Atlas — `modonty` (Prod)

**الغرض:**
- كتابة: عبر Vercel Production (JBRSEO)
- **قراءة فقط من JBRSEO محلياً**: للـ Trust section (شعارات عملاء Modonty الحقيقيين)

**Env vars:**
| Key | مكان استخدامها |
|---|---|
| `DATABASE_URL` | Vercel Production فقط (يشير إلى `modonty`) |
| `MODONTY_PROD_DATABASE_URL` | `.env.local` — للـ modonty-client-logos.ts read-only |

**⚠️ خطر حرج:** لا تكتب أبداً من JBRSEO المحلي إلى `modonty` DB. كل الـ writes من admin JBRSEO تذهب إلى `modonty_dev` أو `modonty` عبر Vercel فقط.

**Health:** 27 client rows (Modonty's paying clients) — يظهرون في Trust section.

---

## 5️⃣ N-Genius (Network International) — Sandbox

**الغرض:** بوابة دفع (اختبار — لا مال حقيقي).

**Portal (Sandbox):** https://portal.sandbox.ksa.ngenius-payments.com/
**Docs:** https://docs.ksa.ngenius-payments.com/
**Docs (LLMs.txt index):** https://docs.ksa.ngenius-payments.com/llms.txt
**Account holder:** khalid@jbrseo.com
**Received keys date:** 2026-07-09

**Env vars (`.env.local`):**
| Key | القيمة |
|---|---|
| `NGENIUS_ENV` | `"sandbox"` |
| `NGENIUS_API_KEY` | Base64 · `YmJmY2JkNzUt...` |
| `NGENIUS_TOKEN_URL` | `https://api-gateway.sandbox.ksa.ngenius-payments.com/identity/auth/access-token` |
| `NGENIUS_API_BASE` | `https://api-gateway.sandbox.ksa.ngenius-payments.com` |
| `NGENIUS_OUTLET_ID` | `a1d0ebbb-13e0-4b42-ad3c-bdbda9efec94` |
| `NGENIUS_OUTLET_NAME` | `instant_signup_outlet` (Active) |
| `NGENIUS_TOKEN_GROUP` | `imdZD4cjLXZA3fc0vwwKtHaQfvFVjNg5setv` |
| `NGENIUS_WEBHOOK_SECRET` | ⏳ pending — يُنشأ عند ضبط webhook في البورتال |

**Live verified:** 2026-07-12 — access-token endpoint returns 200 + token · expires_in=300s.

**Test cards (من الدوكس):**
| Type | Number | Expiry | OTP |
|---|---|---|---|
| Mada | `4548 8713 2783 5760` | 06/27 | 8888 |
| STCPay | `4201 3220 3021 7878` | 08/26 | 1234 |
| Al Rajhi | `4847 8320 4007 8607` | 09/24 | 1111 |
| Visa | `4012 0010 3714 1112` | 12/27 | 555 |
| Mastercard | `5204 7400 0000 0004` | 12/25 | 555 |

**Fail scenarios:**
- Expired card: `4544 9091 2472 7139`
- Auth failed: `2303 7799 9900 0291`

---

## 6️⃣ N-Genius LIVE — ⏳ Pending

**الغرض:** بوابة دفع (إنتاج — مال حقيقي).

**Status:** Readiness Checklist لسه ما اكتمل. Portal URL + LIVE keys تُستلم بعد الموافقة.

**Contact for go-live:** `ecom-integration-ksa@network.global`
**Merchant portal (LIVE):** ⏳ pending
**Developer portal (LIVE):** ⏳ pending

**Blocker لـ Stage 3 cutover:** بدون LIVE keys، /checkout يبقى على Sandbox = ما يقبل مال حقيقي.

**How to unblock:**
1. إتمام كل بنود Readiness Checklist في Sandbox portal
2. إرسال إيميل لـ `ecom-integration-ksa@network.global` تأكيد الاختبار
3. انتظار الموافقة (1-3 أيام)
4. استلام LIVE keys → إضافتها إلى Vercel Production env vars

---

## 7️⃣ Google Analytics 4 (GA4) Data API

**الغرض:** أرقام حية للـ Impact Bar على `/sa` (Modonty analytics — عدد المرضى، الحجوزات، إلخ).

**Portal:** https://analytics.google.com
**Service account:** `jbrseo-analytics@modonty.iam.gserviceaccount.com`
**Property IDs:**
| Property | Where | Purpose |
|---|---|---|
| `538167732` | Modonty | يستخدمه `lib/analytics/ga4.ts` للـ Impact Bar |
| `529892585` | JBRSEO's own | يستخدمه `lib/analytics.ts` للـ admin dashboard |

**Env vars (`.env.local` + Vercel):**
| Key | القيمة |
|---|---|
| `GA4_PROPERTY_ID` | `538167732` (Modonty — for Impact Bar in local) |
| `MODONTY_GA4_PROPERTY_ID` | `538167732` (يُستخدم في lib/analytics/ga4.ts عبر Vercel prod) |
| `GA4_CLIENT_EMAIL` | `jbrseo-analytics@modonty.iam.gserviceaccount.com` |
| `GA4_PRIVATE_KEY_BASE64` | Base64-encoded RSA private key |

**⚠️ CRITICAL على Vercel:**
- `GA4_PROPERTY_ID=529892585` (JBRSEO's own — for admin dashboard `lib/analytics.ts`)
- `MODONTY_GA4_PROPERTY_ID=538167732` (Modonty — for Impact Bar `lib/analytics/ga4.ts`)
- **لا تدمجهما أبداً** — كل واحد يقيس شيء مختلف.

**Live verified:** 2026-07-12 — JWT + oauth2 token endpoint = 200 + access_token.

**Cache:** `unstable_cache` مع revalidate=300s (5 دقايق). أي تحديث في GA4 يحتاج دقيقتين ليظهر على `/sa`.

**Looker Studio report:** https://datastudio.google.com/s/nBnyGkiUdGw — SINCE=2025-01-01 (يطابق الـ Impact Bar).

---

## 8️⃣ Vercel

**الغرض:** Production hosting + preview deployments + env vars vault.

**Portal:** https://vercel.com/modonty-team
**Project:** `jbrseo`
**Framework:** Next.js 16.1.1 with Turbopack
**Git integration:** GitHub → auto-deploy on push to `main`

**Environment scopes:** Production · Preview · Development (كل env var يجب إضافته للثلاثة).

**Team billing:** Pro plan.

**Related refs:** راجع memory `vc>audit` command + `documents/` files لتفاصيل الفواتير.

---

## 9️⃣ Resend (Email — Modonty side)

**الغرض:** إرسال الإيميلات (welcome · invoice · receipt) من `modonty@modonty.com`.

**⚠️ ملاحظة:** JBRSEO لا يرسل إيميلات مباشرة. كل الإيميلات تصدر من Modonty بعد استقبال webhook من JBRSEO.

**Portal:** https://resend.com
**Domain:** `modonty.com` verified
**From address:** `modonty@modonty.com` (موحّد لكل الإيميلات)
**API key:** في env vars الخاصة بمشروع Modonty (ليس JBRSEO)

---

## 🔟 Cloudinary

**الغرض:** استضافة الصور + CDN + تحسين تلقائي (`f_auto,q_auto`).

**Cloud name:** `dfegnpgwx`
**Portal:** https://console.cloudinary.com
**Free tier:** 25 credits/شهر (نحن أقل بكثير).

**استخدامات نشطة:**
- Logos: `MODONTY_LOGO_URL`, `SITE_LOGO_URL`, `DEFAULT_OG_IMAGE_URL` في `lib/constants.ts`
- Favicon: `FAVICON_URLS` في `lib/constants.ts`
- Client logos: URLs في MongoDB (Modonty's `media` collection)

---

## 🔟➕ خدمات مستقبلية (متوقّعة)

| الخدمة | الغرض | متى نضيفها |
|---|---|---|
| **Sentry / Better Stack** | Error monitoring في prod | بعد Stage 3 go-live |
| **PostHog / Plausible** | Product analytics (ما يغطيه GA4) | لما نبدأ نتتبّع funnel /checkout |
| **Zapier / n8n** | Automations (مثل: نجاح دفع → notification في Slack) | حين نمتلك فريق مبيعات |
| **HubSpot / Pipedrive** | CRM (leads من /checkout المهجورة) | حين حجم leads يبرّر |

---

## 🚨 Fallback strategy الكامل

**عند outage لأي خدمة، الأولوية:**

1. **N-Genius down:** رسالة inline على `/checkout` — "الدفع مؤقتاً غير متاح، تواصل واتساب"
2. **Upstash down:** allow all traffic (fail-open) — Cloudflare + N-Genius يبقى حماية ثانوية
3. **Turnstile down:** allow submit (fail-open في dev، fail-closed في prod حسب `lib/turnstile.ts`)
4. **MongoDB down:** الصفحات الديناميكية ترجع 500 — نحتاج status page ثابت
5. **GA4 down:** Impact Bar يعرض قيم default من DB fallback (لا يكسر الـ landing)
6. **Cloudinary down:** الصور تفشل بالتحميل — نحتاج `<Image loading="eager">` + placeholder

---

## أدوات فحص سريع

```bash
# فحص كل الخدمات دفعة واحدة (يستغرق ~10 ثواني)
node scripts/external-services-health-check.mjs

# فحص service محدد
node -e "process.env.DATABASE_URL='...'; import('@prisma/client').then(m => new m.PrismaClient().subscriber.count()).then(console.log)"
```

---

**آخر تحديث:** 2026-07-12
**Owner:** khalid@jbrseo.com
**On-call:** خالد أول، Claude ثاني للدعم التقني.
