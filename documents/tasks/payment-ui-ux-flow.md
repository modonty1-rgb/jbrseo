# Flow كامل — مراحل تنفيذ رحلة الدفع (UI/UX)

> ٣ مراحل متتابعة. **كل مرحلة تُغلَق ١٠٠٪ قبل بداية التي بعدها.**
> بعد المرحلة ٣ نرجع للقرارات المعلّقة (schema + logic).
> آخر تحديث: 2026-07-11

---

## نظرة عامة

```
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│  المرحلة ١        │ →  │  المرحلة ٢       │ →  │  المرحلة ٣       │
│  Landing Page    │    │  Signup / Form   │    │  Checkout / Pay  │
│                  │    │  (بيانات العميل)   │    │  + Post-Payment  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
     CTAs + Trust           form + validation        iframe + states
```

**قرار سابق نُذكّر به:** الـ Signup و الـ Checkout يعيشان في **صفحة واحدة** (`/checkout`)، لكننا نقسّم شغل الـ UI/UX بينهما لأنهما اهتمامان مختلفان:
- **Signup portion** = العمود الأيسر (الحقول + التحقق).
- **Checkout portion** = تحت الحقول (iframe + الشروط + زر الدفع + الحالات).

---

## 🥇 المرحلة ١ — Landing Page

### الهدف
تحويل CTAs من صفحة `/signup` القديمة إلى `#pricing`، وإضافة عناصر ثقة الاسترداد.

### التغييرات (٦ نقاط)

| # | الملف | ما يتغيّر |
|---|---|---|
| 1 | `app/components/landing/Landing.tsx:622` | Hero CTA: `href={signupHref}` → `href="#pricing"` + نص "اختر باقتك" |
| 2 | `app/components/landing/Landing.tsx:1923` | Footer CTA: نفس التغيير |
| 3 | `app/components/landing/Landing.tsx:1497` | Pricing card CTA: `/signup?plan=X` → `/checkout?plan=X&billing=Y` |
| 4 | `app/components/landing/Landing.tsx` (Hero trust bar) | إضافة عنصر ثقة: **"🛡️ استرداد ١٤ يوم مضمون"** |
| 5 | `app/components/pricing/PricingPageShell.tsx:107-110` | "عقد مرن — لا عقود طويلة الأجل" → "**استرداد ١٤ يوم إذا لم نلتزم بإعداد حسابك**، وترقية مرنة في أي وقت" |
| 6 | `TrustSection` / `app/components/landing/TrustSection.tsx` | مراجعة: هل يذكر ضمانات؟ إذا نعم، حدّثها لتتّسق مع الاسترداد ١٤ يوم |

### القرارات المطلوبة
✅ **كلها مقفولة.** لا شيء ينتظر إقرارك.

### المخرجات
- Landing.tsx معدّل (٤ مواضع)
- PricingPageShell.tsx معدّل (سطر واحد)
- TrustSection.tsx مراجَع
- Screenshot قبل/بعد على desktop + mobile

### شرط الإغلاق
- CTAs الثلاث تودّي `#pricing` بنص "اختر باقتك".
- بطاقات الباقات تودّي `/checkout?plan=X&billing=Y` (route غير موجود بعد — يعطي 404 مؤقتاً؛ نبنيه في المرحلة ٢).
- Badge استرداد ظاهر في hero trust bar.
- "عقد مرن" في PricingPageShell صار "استرداد ١٤ يوم".

---

## 🥈 المرحلة ٢ — Signup / Form Portion في `/checkout`

### الهدف
بناء العمود الأيسر من صفحة `/checkout` — الحقول + التحقق + عرض الملخص.

### التغييرات

| # | العنصر | التصميم |
|---|---|---|
| 1 | إنشاء route جديد `app/[country]/checkout/page.tsx` | Server component يحمّل الباقة من DB بناءً على `?plan=` |
| 2 | Layout عمودين (desktop) / عمود واحد (mobile) | Grid — الملخص يمين على desktop، فوق على mobile |
| 3 | Summary card (يمين) | اسم الباقة · شعار · السعر الإجمالي (شامل الضريبة ١٥٪) · trust items ٣ |
| 4 | Form fields (يسار) | ٣ حقول: الاسم · الإيميل · الجوال (مع مفتاح +٩٦٦) |
| 5 | Field validation | Inline errors تحت كل حقل + focus management (scroll to first error على mobile) |
| 6 | Loading state | Skeleton أثناء تحميل بيانات الباقة من DB |
| 7 | Header (breadcrumb) | "← رجوع للأسعار" + شعار JBRSEO فقط. **بدون nav bar كامل** — تركيز مطلق |
| 8 | Delete old files | `app/[country]/signup/*` → redirect إلى `/checkout` (للتوافق مع الروابط القديمة) |

### القرارات المطلوبة الآن
❓ **قرار واحد فقط:** ما يحصل عند فتح `/checkout` بدون `?plan=`؟

- (أ) Redirect تلقائي إلى `/sa/#pricing`.
- (ب) عرض قائمة الباقات مباشرة في الصفحة.
- (ج) اختيار الباقة الافتراضية (الأكثر شعبية).

**توصيتي:** (أ) — أنظف، يمنع الوصول العشوائي.

### المخرجات
- Route جديد `/checkout` يعمل بدون iframe الدفع (المرحلة ٣ تضيفه)
- تصميم responsive للحقول
- Redirect من `/signup` القديم

### شرط الإغلاق
- الضغط على كارت باقة في Landing يفتح `/checkout` بشكل صحيح
- الحقول تعمل + validation فوري + errors واضحة
- الملخص يعرض السعر الشامل + سطر "شامل الضريبة ١٥٪"
- Mobile responsive سليم

---

## 🥉 المرحلة ٣ — Checkout / Payment + Post-Payment

### الهدف
دمج N-Genius Hosted Session في `/checkout`، وبناء صفحات الحالات الثلاث (processing / success / failed) + صفحة `/billing-policy`.

### التغييرات

| # | العنصر | التصميم |
|---|---|---|
| 1 | إضافة N-Genius iframe placeholder في `/checkout` | Panel تحت الحقول — البطاقة تُعبَّأ داخل iframe |
| 2 | Cloudflare Turnstile widget | Widget قبل زر الدفع |
| 3 | Terms checkbox | "أوافق على الشروط والأحكام وسياسة الاسترداد ١٤ يوم" |
| 4 | Pay button | "ادفع الآن · X ر.س" — كبير، بلون الـ foreground |
| 5 | Refund badge | تحت الزر — "🛡️ استرداد ١٤ يوم مضمون — إذا لم نلتزم بإعداد حسابك" |
| 6 | Card logos row | Mada · Visa · Mastercard · Apple Pay |
| 7 | Processing page | `/checkout/processing?order=X` — spinner + طمأنة |
| 8 | Success page | `/checkout/success?order=X` — تفاصيل + CTA لمدونتي + email notice |
| 9 | Failed page | `/checkout/failed?order=X&reason=Y` — سبب + إعادة + واتساب |
| 10 | Billing policy page | `/billing-policy` جديدة — تفاصيل سياسة الاسترداد |
| 11 | Loading state في iframe | Skeleton داخل الـ iframe panel قبل ما يجهز |
| 12 | Error states | inline + toast للأخطاء غير المتوقعة |

### القرارات المطلوبة الآن
❓ **قراران:**

**Q3.1:** ما مدة عرض شاشة "قيد المعالجة" قبل التحويل التلقائي؟
- (أ) ٥ ثواني ثابتة.
- (ب) polling كل ٢ ثانية حتى يصل webhook (max ٣٠ ثانية).
- (ج) تحويل فوري (بدون شاشة "قيد المعالجة").

**توصيتي:** (ب) polling — أذكى + يحمي من webhook delays.

**Q3.2:** ماذا يحصل لو أغلق العميل التبويب أثناء الدفع؟
- (أ) Order pending في DB → cron job يُنظّفه بعد ٣٠ دقيقة.
- (ب) يتم إلغاء الجلسة فور خروجه (`beforeunload` handler).
- (ج) نتركه — عند رجوعه ندعمه من الحالة السابقة.

**توصيتي:** (أ) — هذا يتقاطع مع القرار المعلّق #٤ (مهلة انتهاء Order pending). نؤجّله للنقاش لاحقاً.

### المخرجات
- صفحة `/checkout` كاملة مع iframe + terms + badge + pay button
- ٣ صفحات حالات (processing / success / failed)
- صفحة `/billing-policy` تفصيلية
- Design tokens متّسقة عبر كل الصفحات

### شرط الإغلاق
- كل الشاشات الأربع (checkout + ٣ حالات) جاهزة بصرياً
- `/billing-policy` تعرض السياسة كاملة بلغة B2B ناضجة
- Mockup Playwright screenshots لكل شاشة على desktop + mobile

---

## Handoff بين المراحل

**قاعدة صارمة:** لا نبدأ مرحلة قبل ما نصادق على مخرجات السابقة معاً.

| نقطة الانتقال | ماذا نراجع معاً |
|---|---|
| ١ → ٢ | Screenshots للـ Landing قبل/بعد على desktop + mobile |
| ٢ → ٣ | `/checkout` بدون الدفع — الحقول والملخص |
| ٣ → القرارات المعلّقة | كل شي بصرياً جاهز — نناقش الـ ٦ قرارات schema + logic |

---

## بعد إغلاق المرحلة ٣

نرجع إلى [`payment-pending-decisions.md`](./payment-pending-decisions.md) ونناقش القرارات الستة:
1. مكان بيانات النموذج قبل الدفع
2. Idempotency
3. Rate limit
4. مهلة Order pending
5. إيميل مكرر
6. قناة طلب الاسترداد

بعدها → كتابة الكود.

---

## الحالة الحالية

- **المرحلة ١:** ⏳ لسه ما بدأت. جاهزة للتنفيذ بمجرد إشارتك.
- **المرحلة ٢:** ⏳ تنتظر إغلاق ١ + قرار Q2.1.
- **المرحلة ٣:** ⏳ تنتظر إغلاق ٢ + قرارَي Q3.1 و Q3.2.

**السؤال:** نبدأ المرحلة ١ الآن؟
