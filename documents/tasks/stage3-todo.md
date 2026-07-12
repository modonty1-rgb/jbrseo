# المرحلة ٣ — TODO List

> **المرجع الرسمي بيني وبين Khalid لتنفيذ رحلة الدفع الفعلية.**
> رتّبت المهام من **الأسهل → الأصعب**. كل خانة `[ ]` نغيّرها إلى `[x]` عند الإنجاز.
> آخر تحديث: 2026-07-12

---

## 📋 الحالة العامة

- [ ] **٦ قرارات مقفولة** (راجع `payment-pending-decisions.md`) ✅ done
- [ ] Stage 3 مبدوءة
- [ ] Stage 3 مكتملة + على Live

---

# 🟢 المستوى ١ — مهام إعدادية (بدون كود · تحتاج Khalid)

هذي مهام إدارية سريعة — كل واحدة ٥-١٥ دقيقة، لكن **بدونها ما نقدر نبدأ**.

## 1️⃣ حسابات خارجية

- [ ] **Cloudflare Turnstile:** إنشاء حساب Cloudflare (لو مو موجود) → إضافة site → الحصول على `SITE_KEY` + `SECRET_KEY`
  - ⏱️ ٥ دقائق
  - المخرَج: مفتاحين للـ .env
  - الرابط: https://developers.cloudflare.com/turnstile/get-started/

- [ ] **Upstash Redis:** إنشاء حساب Upstash → إنشاء Redis database (region أقرب: `me-south-1` البحرين) → الحصول على `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`
  - ⏱️ ٥ دقائق
  - المخرَج: URL + token للـ .env
  - الرابط: https://console.upstash.com/

- [ ] **N-Genius LIVE keys:** إتمام Readiness Checklist عند N-Genius + الحصول على:
  - LIVE Merchant Portal login
  - LIVE Developer Portal login
  - LIVE API Key
  - LIVE Outlet Reference
  - ⏱️ ١-٣ أيام (يعتمد عليهم)
  - **حالياً Sandbox جاهز — نقدر نبني ونختبر بدون Live**

- [ ] **N-Genius Risk Rules في البورتال:** فعّل الآتي:
  - GCC Region Restriction: **On** (نقبل GCC فقط)
  - Country BIN Blacklist: إضافة الدول عالية المخاطر
  - Corporate Card Payments: قرار Khalid (نقبل/نرفض؟)
  - ⏱️ ١٠ دقائق

## 2️⃣ Env vars في Vercel

- [ ] إضافة على مشروع jbrseo في Vercel (لكل من Production + Preview + Development):
  ```
  TURNSTILE_SITE_KEY
  TURNSTILE_SECRET_KEY
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  NGENIUS_API_KEY               (Sandbox أول، LIVE بعدين)
  NGENIUS_OUTLET_ID             (Sandbox)
  NGENIUS_API_BASE_URL          (Sandbox أو LIVE)
  NGENIUS_WEBHOOK_SECRET        (يُنشأ لاحقاً عند ضبط الـ webhook)
  MODONTY_WEBHOOK_URL           (endpoint في Modonty لاستقبال HMAC)
  MODONTY_HMAC_SECRET           (نُنشئه — يُشارك بين jbrseo و Modonty)
  ```
  - ⏱️ ١٠ دقائق

---

# 🟢 المستوى ٢ — تغييرات نصّية بسيطة

استبدال نصوص "استرداد ١٤ يوم" بـ "التزام بالتسليم ٧٢ ساعة" في كل الأماكن.

- [ ] **DB: Landing hero.trust** (dev + prod) — تحديث السطر الرابع:
  - من: `استرداد ١٤ يوم مضمون`
  - إلى: `⏱️ التزام بالتسليم ٧٢ ساعة`
  - عبر: `scripts/stage1-hero-trust-update.mjs` بتعديل بسيط
  - ⏱️ ٥ دقائق

- [ ] **`CheckoutSummary.tsx`** — تحديث Refund Badge:
  - من: "استرداد ١٤ يوم مضمون · إذا لم نلتزم بإعداد حسابك خلال ١٤ يوم..."
  - إلى: "التزام بالتسليم ٧٢ ساعة — نُنشئ حسابك أو نمدّد اشتراكك مجاناً"
  - ⏱️ ٥ دقائق

- [ ] **`CheckoutForm.tsx`** — تحديث Badge أسفل زر الدفع + Checkbox terms link:
  - Badge: "⏱️ التزام بالتسليم ٧٢ ساعة"
  - Checkbox: "أوافق على الشروط والأحكام وسياسة الفوترة" (بدل "سياسة الاسترداد ١٤ يوم")
  - Link: `/billing-policy` (نبنيه في مهمة تالية)
  - ⏱️ ٥ دقائق

- [ ] **`Landing.tsx`** — البحث عن أي ذكر لـ "استرداد" + تحديث للـ commitment version
  - ⏱️ ١٠ دقائق

---

# 🟢 المستوى ٣ — صفحات جديدة بسيطة

- [ ] **صفحة `/billing-policy`** — إنشاء `app/(site)/billing-policy/page.tsx`:
  - عنوان: "سياسة الفوترة والتسليم"
  - النص الكامل من `project_refund_policy.md` (قسم "صفحة /billing-policy")
  - CTA أسفل: زر "طلب تمديد عبر واتساب" (deep-link مع نص معبأ مسبقاً)
  - Metadata: index + follow (صفحة عامة)
  - ⏱️ ٣٠ دقيقة

- [ ] **صفحة `/[country]/checkout/success/page.tsx`** — الشكل جاهز في mockup:
  - Server component يقرأ `?order=X`
  - يستدعي DB للتحقق (Subscriber.paymentStatus=paid)
  - يعرض: رقم الفاتورة + الإجمالي + CTA لـ `console.modonty.com` + email notice
  - Fallback لو order غير مؤكّد بعد → يحوّل لـ processing
  - ⏱️ ٤٥ دقيقة

- [ ] **صفحة `/[country]/checkout/failed/page.tsx`** — الشكل جاهز في mockup:
  - Server component يقرأ `?order=X&reason=Y`
  - يعرض: سبب الفشل بالعربي + زر "أعد المحاولة" (يرجع لـ `/checkout` بنفس الـ params) + زر واتساب
  - ⏱️ ٣٠ دقيقة

- [ ] **صفحة `/[country]/checkout/processing/page.tsx`** — الشكل جاهز في mockup:
  - Client component: spinner + طمأنة + auto-redirect لـ success بعد ٣-٥ ثواني (نتأكد Subscriber.paymentStatus=paid)
  - Polling كل ٢ ثانية لمدة ٣٠ ثانية max
  - ⏱️ ٣٠ دقيقة

---

# 🟡 المستوى ٤ — Schema + قواعد بيانات

- [ ] **Prisma schema — Subscriber updates:**
  - إضافة الحقول:
    ```prisma
    paymentStatus PaymentStatus @default(pending)
    paymentRef    String?       // N-Genius transaction ID
    paidAt        DateTime?
    failReason    String?
    ```
  - إضافة enum: `enum PaymentStatus { pending paid failed abandoned refunded }`
  - إضافة `@@unique([email, plan, billing])`
  - ⚠️ **قبل `prisma generate` — اقفل كل dev servers** (kill node.exe)
  - ⏱️ ١٥ دقيقة

- [ ] **Prisma schema — WebhookEvent جديد:**
  ```prisma
  model WebhookEvent {
    id                String   @id @default(auto()) @map("_id") @db.ObjectId
    provider          String   // "n-genius"
    providerEventId   String   @unique
    eventType         String   // "captured" · "failed" · "refunded"
    payload           Json
    signature         String   // للتحقق لاحقاً
    processed         Boolean  @default(false)
    receivedAt        DateTime @default(now())
    processedAt       DateTime?
  }
  ```
  - ⏱️ ١٠ دقيقة

- [ ] **`pnpm prisma:generate`** — بعد قفل dev servers
  - ⏱️ ٣٠ ثانية

- [ ] **`prisma db push`** — تطبيق Schema على MongoDB (dev فقط، prod عند LIVE)
  - ⏱️ دقيقة

---

# 🟡 المستوى ٥ — Integrations خارجية (SDKs)

- [ ] **Upstash Redis Rate Limit:**
  - `pnpm add @upstash/ratelimit @upstash/redis`
  - إنشاء `lib/rate-limit.ts` مع ٣ instances:
    - `landingLimiter` — 30/دقيقة/IP
    - `checkoutLimiter` — 5/١٠ دقايق/IP
    - `orderLimiter` — 3/دقيقة/IP
  - تطبيقها في `proxy.ts` (استبدال in-memory)
  - ⏱️ ٤٥ دقيقة

- [ ] **Cloudflare Turnstile widget:**
  - `pnpm add @marsidev/react-turnstile` (أو استخدام الـ script الرسمي)
  - إضافة widget في `CheckoutForm.tsx` قبل زر الدفع
  - Server-side verification عند submit (استدعاء API Turnstile للتحقق من الـ token)
  - ⏱️ ٣٠ دقيقة

---

# 🟠 المستوى ٦ — N-Genius Integration (اللب التقني)

- [ ] **`lib/ngenius/auth.ts`:** الحصول على access-token
  - POST إلى `/identity/auth/access-token`
  - Caching للـ token في memory (صلاحيته ~١ ساعة)
  - ⏱️ ٣٠ دقيقة

- [ ] **`lib/ngenius/orders.ts`:** إنشاء طلب دفع
  - POST إلى `/transactions/outlets/{OUTLET_ID}/orders`
  - Body: amount + currency + merchantOrderReference (كـ idempotency) + merchantDefinedData (subscriberId, plan, etc.)
  - Return: session data للـ iframe
  - ⏱️ ١ ساعة

- [ ] **`lib/ngenius/find-order.ts`:** استعلام حالة الطلب
  - GET إلى `/transactions/outlets/{OUTLET_ID}/orders/{ref}`
  - يُستخدم للـ polling + lazy check للـ pending الطويلة (قرار #٤)
  - ⏱️ ٢٠ دقيقة

- [ ] **API route: `app/api/checkout/create-order/route.ts`:**
  - POST endpoint يستقبل form data من `CheckoutForm`
  - Steps:
    1. Verify Turnstile token
    2. Rate limit check
    3. Validate form data (Zod)
    4. Check Modonty for active client (قرار #٥)
    5. Upsert Subscriber (pending) — with `@@unique(email, plan, billing)`
    6. Create N-Genius order
    7. Return session data للـ frontend
  - ⏱️ ١.٥ ساعة

- [ ] **N-Genius Hosted Session SDK integration في `CheckoutForm.tsx`:**
  - استبدال `PaymentPlaceholder.tsx` بـ iframe حقيقي
  - Client-side: تحميل SDK · تمرير session data · معالجة callbacks (success/failure)
  - عند النجاح → redirect لـ `/checkout/processing?order=X`
  - عند الفشل → redirect لـ `/checkout/failed?order=X&reason=Y`
  - ⏱️ ٢ ساعة

---

# 🟠 المستوى ٧ — Webhook + Polling Backup

- [ ] **`app/api/webhooks/n-genius/route.ts`:**
  - POST endpoint لاستقبال webhooks من N-Genius
  - Steps:
    1. قراءة الـ header signature
    2. التحقق من التوقيع
    3. البحث عن `WebhookEvent.providerEventId` — لو موجود = تجاهل (idempotent)
    4. حفظ الحدث في WebhookEvent
    5. تحديث Subscriber.paymentStatus حسب النوع (captured → paid, failed → failed)
    6. لو paid → استدعاء Modonty webhook (بعد ذلك)
    7. عودة 200 OK
  - ⏱️ ١.٥ ساعة

- [ ] **Polling backup في `/checkout/processing`:**
  - عند وصول المستخدم لـ processing page → استدعاء endpoint داخلي `/api/checkout/status?order=X`
  - Endpoint يستدعي N-Genius findorder لو Subscriber لسه pending
  - يحدّث DB لو N-Genius يقول captured
  - يرجع status للـ client → client يحوّل إلى success/failed
  - **يحل مشكلة webhooks اللي ما تعيد المحاولة عند N-Genius**
  - ⏱️ ١.٥ ساعة

- [ ] **HMAC signing utility (`lib/hmac.ts`):**
  - `signPayload(payload, secret)` — يستخدم SHA-256
  - `verifySignature(payload, signature, secret)` — للتحقق
  - يُستخدم للتواصل مع Modonty + التحقق من N-Genius webhooks
  - ⏱️ ٣٠ دقيقة

---

# 🔴 المستوى ٨ — Modonty Integration (الأصعب)

هذي المهام في مشروع Modonty (مو jbrseo). كل مهمة تحتاج dev server منفصل.

## في Modonty:

- [ ] **Prisma schema: `Client.email @unique`**
  - ⚠️ Migration + check لو فيه إيميلات مكررة قبل التطبيق
  - ⏱️ ٣٠ دقيقة

- [ ] **استبدال `admin123` بمولّد كلمات سر عشوائية**
  - `pnpm add nanoid` (لو مو موجود)
  - Helper: `generateRandomPassword()` — ١٦ حرف alphanumeric
  - كل مكان يُستخدم فيه `admin123` — يُستبدل
  - ⏱️ ٤٥ دقيقة

- [ ] **`app/api/admin/checkout-webhook/route.ts` — endpoint استقبال HMAC:**
  - POST من jbrseo عند نجاح الدفع
  - يتحقق من HMAC signature
  - يستخرج: email, name, phone, plan, billing, subscriberId, invoiceNumber
  - ينشئ Client مع كلمة سر عشوائية
  - ينشئ Invoice + Counter (للترقيم)
  - يرسل welcome email عبر Resend
  - يعيد 200 مع Client ID
  - ⏱️ ٢ ساعة

- [ ] **`app/api/clients/lookup/route.ts` — endpoint للفحص:**
  - GET مع `?email=X`
  - Auth: HMAC signature (jbrseo يستدعيه)
  - يعيد: `{ active: boolean, subscription: { plan, expiresAt } | null }`
  - يُستخدم من jbrseo `/checkout` قبل قبول الـ submit (قرار #٥)
  - ⏱️ ١ ساعة

- [ ] **قالب Welcome Email في Resend:**
  - HTML بالعربي RTL
  - يحتوي: اسم العميل + بيانات الدخول (email + password) + رابط `console.modonty.com` + رقم الفاتورة + التزام التسليم ٧٢ ساعة
  - إرسال من `modonty@modonty.com`
  - ⏱️ ١ ساعة

- [ ] **زر "استرداد/تمديد" في Modonty admin:**
  - في صفحة تفاصيل Client
  - يستدعي N-Genius refund/void API (للاسترداد النقدي بأمر Khalid فقط، أو تمديد subscription للحالات العادية)
  - يحدّث Client status + يرسل إيميل تأكيد
  - ⏱️ ١.٥ ساعة

---

# 🔴 المستوى ٩ — Testing & Go-Live

- [ ] **اختبار في Sandbox:**
  - استخدام test cards من N-Genius docs (Mada · Visa · STCPay · Apple Pay)
  - سيناريوهات: نجاح · فشل · timeout · duplicate · refund
  - التحقق من Subscriber updates + Modonty Client creation + welcome email
  - ⏱️ يوم كامل

- [ ] **Playwright E2E test suite:**
  - `/checkout` → submit → mock N-Genius → verify success page + Modonty client + email sent
  - Rate limit test · Turnstile test · duplicate email test · refund flow
  - ⏱️ نصف يوم

- [ ] **Security audit:**
  - HMAC verification tight
  - Env vars في Vercel (ليس في code)
  - Rate limits معقولة
  - CSP headers محدّثة (`next.config.ts`)
  - Turnstile في كل submit
  - ⏱️ ساعتان

- [ ] **N-Genius Readiness Checklist رسمي:**
  - إتمام كل بنود N-Genius قبل الطلب من LIVE keys
  - إرسال إيميل لـ `ecom-integration-ksa@network.global`
  - انتظار الموافقة
  - ⏱️ ١-٣ أيام (يعتمد عليهم)

- [ ] **Cutover إلى LIVE:**
  - استبدال Sandbox keys بـ LIVE في Vercel
  - إعداد webhook URL في N-Genius LIVE portal
  - **اختبار حقيقي بمبلغ صغير** (Khalid يشتري بنفسه ب ١ ريال)
  - ⏱️ ساعة

- [ ] **مراقبة أول ٤٨ ساعة:**
  - عدد ناجح/فاشل
  - تحقّق يومي من Modonty client creation
  - تحقّق من الإيميلات الواصلة
  - جاهزية للتدخّل السريع
  - ⏱️ يومان (خفيف)

---

# 📊 ملخّص الوقت التقديري

| المستوى | المهام | الوقت التقديري |
|---|---|---|
| ١ — إعدادية (Khalid) | ٥ | ٣٠ دقيقة (+ انتظار N-Genius LIVE ١-٣ أيام) |
| ٢ — نصوص | ٤ | ٢٥ دقيقة |
| ٣ — صفحات جديدة | ٤ | ٢.٥ ساعة |
| ٤ — Schema | ٤ | ٣٠ دقيقة |
| ٥ — Integrations (SDKs) | ٢ | ١.٢٥ ساعة |
| ٦ — N-Genius | ٥ | ٥.٥ ساعة |
| ٧ — Webhook + Polling | ٣ | ٣.٥ ساعة |
| ٨ — Modonty | ٦ | ٦.٧٥ ساعة |
| ٩ — Testing + Go-Live | ٦ | ٢-٣ أيام |
| **الإجمالي** | **٣٩** | **٣-٥ أيام عمل + ١-٣ أيام انتظار N-Genius** |

---

## 🎯 كيف نستخدم هذا الملف

- بعد كل مهمة نُنجزها → نغيّر `[ ]` إلى `[x]` مع تاريخ في التعليق (اختياري)
- لو حصل blocker على مهمة → نضيف تحتها ملاحظة بالمشكلة + السبب
- كل جلسة نبدأها بمراجعة هذا الملف: "أين وقفنا؟"
- لا ننتقل من مستوى لمستوى إلا بعد إغلاق ٩٠٪ من السابق (استثناءات مسموحة)

---

## 🚦 نقاط توقّف للمراجعة مع Khalid

- بعد المستوى ٤ (Schema locked) — راجعنا الحقول قبل ما نبني API عليها
- بعد المستوى ٦ (N-Genius يشتغل في sandbox) — عرض demo قبل الانتقال للـ webhook
- بعد المستوى ٧ (Webhook + Polling) — sanity check للأمان
- بعد المستوى ٨ (Modonty done) — E2E test كامل قبل go-live
- **قبل cutover إلى LIVE — إذن Khalid صريح** 🚨

---

## 📎 مرفقات

- تفاصيل القرارات الست: `documents/tasks/payment-pending-decisions.md`
- سياسة الفوترة الكاملة: `memory/project_refund_policy.md`
- Mockup تصميم رحلة الدفع: `documents/tasks/payment-journey-mockup-v2.html`
- خطة N-Genius التقنية: `documents/context/payment-integration-plan.md`
- مراجعة الكود قبل الدفع: `documents/context/code-review-payment-readiness.md`
