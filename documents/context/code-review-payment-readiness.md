# تقرير مراجعة الكود — جاهزية الموقع لبوابة الدفع (N-Genius)

> تاريخ التقرير: 2026-07-09
> النطاق: مسح شامل للكود، read-only فقط.

---

## ملخص تنفيذي (٧ نقاط للقرار)

1. **نظام حسابات المستخدم غير موجود عملياً** — فقط ملف تعريف hmac للأدمن (`lib/admin-auth.ts`). لا يوجد User/Account/Session، ولا NextAuth. قبل ما نقدر ندخل عميل مدفوع في بوابته، لازم نختار ونركّب استراتيجية مصادقة.

2. **نموذج البيانات = التقاط عملاء محتملين فقط** — نموذج `Subscriber` يخزن نية العميل، مش دفعة. لا يوجد Order أو Invoice أو Subscription أو Payment أو WebhookEvent أو AuditLog. كلها لازم تُضاف قبل أي لمس لـ N-Genius.

3. **لا يوجد ويبهوك ولا endpoint دفع** — فقط `/api/admin/analytics/route.ts`. N-Genius يتطلب نقطة استقبال موقّعة مع منع تكرار (`WebhookEvent.providerEventId @unique`).

4. **Rate limiting داخلي في الذاكرة فقط** (`proxy.ts:8-20`) — يُعاد ضبطه مع كل serverless instance. للدفع لازم مخزن حقيقي (Upstash) + captcha على النموذج العام.

5. **لا يوجد نظام إيميلات معاملات** — Resend/SES مش مركب. تأكيد الدفع، الفاتورة PDF، تذكيرات التجديد — كلها تُبنى من الصفر.

6. **واجهة التسجيل قوية لكن ناقصة للدفع** — inline errors، shadcn/ui، RTL، Tailwind v4 كلها موجودة. الناقص: خطوة ملخص الطلب، عرض ضريبة القيمة المضافة، شاشة دفع، مؤشر خطوات حقيقي، شاشات النجاح/الفشل بعد الدفع. صفحة `thank-you` الحالية تعرض تحويل بنكي يدوي — تحتاج تُقسم لصفحة قبل الدفع + إيصال بعده.

7. **دَين ثبات في server actions** — فشل الصلاحية يُعامل بثلاث طرق مختلفة عبر `subscribers.ts`، `pricing.ts`، `landing.ts`. Zod يُستخدم في التسجيل فقط. توحيدها ضروري قبل ما نضيف server actions تلمس أموال.

---

## ما هو موجود ✅

### قاعدة البيانات (MongoDB + Prisma)
- `SiteSettings`, `Subscriber` (lead capture), `LandingSection`, `ExitReason`, `Plan`, `PriceSectionMeta`.

### نظام الأدمن
- HMAC cookie-based auth: `lib/admin-auth.ts`, `app/actions/auth.ts:16-42`.
- Middleware يحمي `/admin/*`: `proxy.ts:93-111`.
- صفحة تسجيل دخول الأدمن: `app/admin/login/page.tsx`.

### التسجيل الحالي `/[country]/signup`
- Server component يحمّل الباقات، يمرر للـ client component.
- Client: `useState` بدلاً من `react-hook-form`.
- Validation: regex في العميل + Zod في الخادم (`app/actions/subscriber-signup-schema.ts`).
- Server action: `createSubscriber` → `prisma.subscriber.create` → `sendTelegramMessage` (fire-and-forget).
- بعد النجاح: `sessionStorage` flag → redirect لـ `thank-you`.

### إشعارات
- Telegram bot: `lib/telegram.ts` — يُشعر كل تسجيل جديد.
- WhatsApp deep-link: `lib/site-links.ts`.

### الواجهة والتصميم
- shadcn/ui كامل في `app/components/ui/` (17 مكون).
- Tailwind v4 مع `@theme inline` في `app/globals.css:224`.
- RTL في `<html lang="ar" dir="rtl">`.
- Dark mode يدوي بـ `lib/useTheme.tsx` (لا `next-themes`).
- Theme tokens: `--foreground/background/card/muted/primary/accent/success/destructive`.
- Toast: `sonner` مركب (يُستخدم في الأدمن فقط).

### Middleware (`proxy.ts`)
- Country detection من `?country=` أو geo.
- Rate limit 30 req/min per IP (in-memory).
- Method allow-list على `/signup`.
- Admin cookie verification لـ `/admin/*`.

### حزم مثبتة
- Next.js 16.1.1، React 19.2.3، Prisma 6.9، Tailwind 4.1.18، Zod 4.3.6، sonner، motion، lucide-react، recharts، dnd-kit.

---

## ما هو ناقص (لازم نبنيه) ❌

### نماذج قاعدة البيانات
- **Customer** أو **Subscriber موسّع**: status، activePlanSlug، billingCycle، renewsAt، paymentProvider، providerCustomerId، country.
- **Order**: id، subscriberId، planSlug، billing، amount، currency، providerOrderRef، providerRef، status(pending|authorised|captured|failed|refunded)، rawWebhookIds[]، createdAt، capturedAt.
- **Invoice**: number (JBR-2026-0001)، orderId، pdfUrl، vatAmount، total.
- **Payment**: method، amount، status، providerReference.
- **WebhookEvent**: provider، providerEventId @unique، receivedAt، payload — لمنع التكرار.
- **AuditLog**: كل تحوّل حالة في Order/Subscription.
- **IdempotencyKey**: unique on `{subscriberId, planSlug, billing, hash}`.

### API Endpoints
- `app/api/webhooks/n-genius/route.ts`: استقبال + تحقق توقيع + منع تكرار.
- `app/api/checkout/route.ts`: إنشاء طلب N-Genius.
- `app/api/orders/[id]/route.ts`: استعلام حالة.

### مصادقة المستخدم النهائي
- خيار: NextAuth مع email provider (magic link) + email provider.
- أو: OTP على الجوال.
- بدون هذا، ما نقدر ندخل العميل على حسابه بعد الدفع.

### إيميلات المعاملات
- مزود: Resend / SES / Mailgun (لسه مو مركّب).
- قوالب: welcome + activation، payment succeeded + invoice، payment failed، renewal reminder.

### الفواتير PDF
- مكتبة: `@react-pdf/renderer` أو `pdfkit` أو HTML-to-PDF.
- قالب عربي RTL.
- ترقيم متسلسل.
- حساب ضريبة القيمة المضافة 15%.

### الأمان الإضافي
- CAPTCHA/Turnstile على `/signup`.
- Rate limit حقيقي (Upstash Redis).
- CSP headers مفصّلة في `next.config.ts`.

---

## الفجوات الحرجة (best-practice gaps)

| # | الفجوة | الموقع | الأثر |
|---|---|---|---|
| 1 | لا Auth للمستخدم النهائي | كل المشروع | ما فيه login للعميل بعد الدفع |
| 2 | Subscriber = lead، مش عميل مدفوع | `schema.prisma:17-32` | ما فيه حالة اشتراك أو تاريخ انتهاء |
| 3 | لا Order/Invoice/Payment models | schema | ما فيه سجل مالي |
| 4 | لا webhook receiver | `app/api/` | N-Genius ما تقدر تأكد الدفع |
| 5 | لا idempotency | server actions | ضغطتين = صفّين |
| 6 | لا CAPTCHA | `/signup` | البوت يقدر يملأ النموذج |
| 7 | Rate limit في الذاكرة فقط | `proxy.ts:8-20` | يُعاد ضبطه لكل instance |
| 8 | لا email transactional | كل المشروع | ما فيه تأكيد دفع أو فاتورة |
| 9 | لا PDF invoice | كل المشروع | ما فيه فاتورة قابلة للتحميل |
| 10 | thank-you يعرض تحويل بنكي يدوي | `thank-you/page.tsx:121-146` | ينسخ فوق منطق N-Genius |
| 11 | server actions مختلفة في التعامل مع فشل الصلاحية | `subscribers.ts` `pricing.ts` `landing.ts` | inconsistency خطر |
| 12 | Zod في التسجيل فقط | باقي server actions | validation surface غير متجانس |
| 13 | لا AuditLog | كل المشروع | لا traceability لخلافات chargeback |

---

## ملاحظات UI/UX عملية للتسجيل الحالي

1. **loading state جزئي فقط** — الزر يتغير نصه وdisabled، لكن لا spinner كامل ولا aria-live announcement.
2. **الأخطاء ثنائية**: banner فوق + inline تحت كل حقل. لا focus management عند حدوث خطأ (على الموبايل ما يسحب لأعلى).
3. **لا success page للدفع** — الحالي يعرض تحويل بنكي، سيُستبدل بشاشات: processing → paid + invoice → failed + retry.
4. **لا checkout summary قبل الدفع** — plan card تعرض السعر + 4 مميزات، لكن بلا خط ضريبة القيمة المضافة، بلا إجمالي مع الضريبة، بلا "أنت على وشك دفع X ر.س" — لازم إضافة خطوة "مراجعة الطلب".
5. **مؤشر الخطوات وهمي** — "خطوة ١ … خطوة ٢" نص فقط، مش tracker حقيقي. نحوله لـ 3-step: تفاصيل → مراجعة → تأكيد.
6. **الوصول من hero بدون plan** — الكبسة العلوية في Landing.tsx تودّي `/sa/signup` بدون `?plan=`، فالمستخدم يقع على أول خطة افتراضياً. حل: نرجعه لـ #pricing أول، أو نجعل اختيار الباقة خطوة أولى في النموذج.
7. **billing غير قابل للتعديل داخل النموذج** — يقرأ من URL فقط. لو غيّر رأيه لازم يرجع للأسعار.
8. **`sessionStorage` للتحقق من الوصول لـ thank-you** — يُتخطى بسهولة، ويكسر الـ refresh.
9. **Suspense fallback فارغ** في `signup/page.tsx:70` — لا loading UI مرئي أثناء hydration.
10. **hard-coded IBAN** في `thank-you/page.tsx:121-146` — لازم يُستبدل عند إطلاق N-Genius.

---

## قرارات مطلوبة (قبل أي كود)

راجع [payment-integration-plan.md](payment-integration-plan.md) للاتفاقات الحالية.

### قرارات جديدة مطلوبة الآن:

**قرار ٤ — مصادقة العميل النهائي:**
- (أ) Magic link عبر الإيميل — بسيط، بدون كلمات سر.
- (ب) OTP على الجوال — بسيط للمستخدم العربي، يحتاج مزود SMS (Twilio أو محلي).
- (ج) كلمة سر تقليدية — مألوف بس أضعف أمنياً.

**قرار ٥ — مزود الإيميل:**
- Resend — عصري، DX ممتاز، له مجاني معقول.
- SES — أرخص للحجم الكبير، أعقد إعداد.
- Mailgun — متوسط.

**قرار ٦ — CAPTCHA:**
- Cloudflare Turnstile — مجاني، بدون تتبع.
- hCaptcha — مجاني للحجم الصغير.
- reCAPTCHA — يحتاج Google account.

**قرار ٧ — Rate limit:**
- Upstash Redis (مجاني حتى 10K/يوم) — الأنصح.
- Vercel KV — مدفوع.

**قرار ٨ — PDF Invoice:**
- `@react-pdf/renderer` — يبني الفاتورة بـ React components. RTL محدود.
- `pdfkit` — أسفل مستوى، تحكم كامل.
- HTML → PDF عبر Puppeteer — يشتغل مع أي HTML عربي RTL بسهولة.

---

## المصطلحات الإنجليزية

- N-Genius · Network International (بوابة الدفع)
- NextAuth · Magic link · OTP (خيارات مصادقة المستخدم)
- Resend · SES · Mailgun (مزودو إيميل)
- Upstash Redis · Vercel KV (تخزين rate limit)
- Turnstile · hCaptcha · reCAPTCHA (حماية النماذج)
- `@react-pdf/renderer` · `pdfkit` · Puppeteer (توليد PDF)
- Webhook · Idempotency · CAPTCHA · CSP · CSRF (مصطلحات أمنية)
- VAT (ضريبة القيمة المضافة)
- shadcn/ui · Tailwind v4 · sonner · Zod (مكتبات موجودة في المشروع)
