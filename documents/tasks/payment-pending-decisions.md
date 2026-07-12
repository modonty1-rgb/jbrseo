# قرارات رحلة الدفع — الحالة النهائية

> **آخر تحديث: 2026-07-12** — كل القرارات الستّة مقفولة. جاهزون لبناء Stage 3.

---

## القرارات المقفولة (٦/٦)

### ✅ القرار #١ — مكان بيانات النموذج قبل الدفع

**النهج:** `Subscriber` model في JBRSEO (يُعاد استعمال الجدول الموجود) + `Client` model في Modonty (يُنشأ فقط بعد الدفع الناجح).

**الآلية:**
```
form submit → JBRSEO Subscriber row (paymentStatus=pending)
    ↓ (Payment ينجح)
    ├─→ Update Subscriber.paymentStatus=paid
    └─→ HMAC webhook → Modonty ينشئ Client + welcome email
    ↓ (Payment يفشل)
    └─→ Update Subscriber.paymentStatus=failed + failReason
```

**Schema tweaks على Subscriber:**
- إضافة: `paymentStatus` (enum: pending/paid/failed/abandoned/refunded), `paymentRef` (N-Genius transaction ID), `paidAt`, `failReason`
- `@@unique([email, plan, billing])` — يمنع تكرار الصفوف؛ upsert بدل insert

**السبب:** فصل واضح لحدود البيانات (payment في JBRSEO · product access في Modonty). يعيد استخدام schema موجود. صفر coupling وقت الـ checkout.

---

### ✅ القرار #٢ — Idempotency (منع الخصم المضاعف)

**النهج:** ٣ طبقات دفاع:

| الطبقة | الآلية |
|---|---|
| ١. Form Submit | Subscriber `@@unique(email, plan, billing)` → upsert بدل insert |
| ٢. N-Genius Order Create | نستخدم `merchantOrderReference` كمفتاح فريد (alphanumeric + hyphens) — يُبنى من hash(subscriberId + timestamp). N-Genius يُرجع نفس الجلسة لو المرجع متكرّر |
| ٣. Webhook Processing | جدول `WebhookEvent` جديد (id · provider · providerEventId @unique · payload · receivedAt) — يمنع معالجة نفس الحدث مرتين |

**+ حماية UX:** زر "ادفع" disabled بعد أول ضغطة (client-side فقط، ليس أمان).

**Note:** N-Genius يوفّر `paymentAttempts=5` كحد أقصى داخلياً (حماية إضافية مجانية).

---

### ✅ القرار #٣ — Rate Limiting

**النهج:** **Upstash Redis** (مجاني حتى ١٠K request/يوم).

**السبب:** N-Genius Risk Module يبلوك BINs/دول/إيميلات فقط — **لا velocity checks ولا IP-based blocking**. يعني بوت يقدر يجرّب ١٠٠ بطاقة حقيقية بدون رفض. نحن مسؤولون ١٠٠٪ عن الحماية.

**الإعدادات المقترحة:**
- Landing browsing: 30 req/دقيقة/IP (زي الحالي)
- `/checkout` submit: **5 محاولات/١٠ دقائق/IP** (أشد)
- N-Genius order create: **3 محاولات/دقيقة/IP** (أشد الشدة)

**الحزمة:** `@upstash/ratelimit` (SDK رسمي، 3 أسطر كود).

---

### ✅ القرار #٤ — Order Pending Timeout

**النهج:** **Lazy check + N-Genius `findorder` polling — بدون cron.**

**الآلية:**
```
لو Subscriber عنده paymentStatus=pending + طلب دفع جديد للإيميل نفسه:
  ├─ عمر الصف < ٣٠ دقيقة → "لديك دفع معلّق، أكمله" + رابط للجلسة
  └─ عمر الصف > ٣٠ دقيقة → استدعاء N-Genius: GET /orders/{ourRef}
       ├─ N-Genius يقول pending/none → نحدّث DB إلى abandoned، نسمح بمحاولة جديدة
       └─ N-Genius يقول captured → استرجعنا webhook ضائع، نُنشئ Client في Modonty يدوياً + نحدّث DB إلى paid
```

**الفوائد:**
- ✅ صفر cron / background jobs
- ✅ يحلّ مشكلة webhook الضائع (N-Genius **لا يعيد المحاولة** — موثّق في دوكسهم)
- ✅ N-Genius يبقى مصدر الحقيقة للحالة

**Trade-off:** صفوف pending قديمة جداً لا يتفاعل معها أحد قد تظل في التقارير. حل: زر يدوي في admin "نظّف القديم" (اختياري).

---

### ✅ القرار #٥ — إيميل مكرّر (نفس الشخص يدفع مرة ثانية)

**النهج:** **فحص واحد فقط** قبل قبول الـ submit — هل عميل نشط في Modonty؟

**الآلية:**
```
GET /api/clients/lookup?email=X  (Modonty API — مع fail-open)
   نشط → 📱 رسالة: "لديك اشتراك نشط — للتغيير أو الترقية، تواصل مع الفريق التقني عبر واتساب" + زر
   لا  → ✅ يستمر الدفع طبيعي
```

**Fail-open:** لو Modonty API عندها outage → نسمح بالدفع (لا نبلوك المستخدم بسبب خطأ عندنا).

**كل الحالات الأخرى** (pending, failed, expired, race condition) → يُسمح بالمرور. N-Genius `merchantOrderReference` يحمي من الدبل تلقائياً. الحالة النادرة (١ في ٥٠٠) = تذكرة دعم يدوياً.

---

### ✅ القرار #٦ — سياسة الفوترة (تحوّل جوهري)

**النهج:** **"التزام بالتسليم"** — تمديد اشتراك مجاني عند التأخّر، بدل استرداد نقدي.

**الصياغة:**

> **"التزام بالتسليم — إذا لم نُنشئ حسابك خلال ٧٢ ساعة من الدفع، نمدّد اشتراكك بدون تكلفة إضافية حتى نُسلّم."**

**قناة الطلب:** واتساب فقط. Deep-link مع رسالة معبأة مسبقاً في `/billing-policy`.

**لماذا هذا التحوّل (من الاسترداد النقدي):**
- ✅ يفي بالالتزام القانوني (نظام التجارة الإلكترونية، المادة ٥)
- ✅ حماية من chargebacks
- ✅ **صفر تدفّق نقدي خارج** (لا مال يعود)
- ✅ **صفر حافز للاستغلال** (لا مال = لا "أبغى فلوسي")
- ✅ verifiable (Client موجود في Modonty = تسليم تم)

**تفاصيل كاملة:** [`project_refund_policy.md`](../../../../.claude/projects/c--Users-w2nad-Desktop-dreamToApp-JBRSEO-jbrseo-com/memory/project_refund_policy.md)

---

## تعديلات جانبية على مدونتي (Stage 3)

- `Client.email @unique` في Prisma schema
- استبدال `admin123` بمولّد كلمات سر عشوائية (`nanoid` أو مشابه)
- بناء endpoint استقبال HMAC في `modonty/app/api/admin/checkout-webhook/route.ts`
- بناء endpoint lookup في `modonty/app/api/clients/lookup?email=X` (للفحص من JBRSEO)
- قالب welcome email في Resend (يشمل بيانات الدخول + سياسة التزام التسليم)
- زر "استرداد/تمديد" في Modonty admin (يستدعي N-Genius refund API + يحدّث حالة الاشتراك)

---

## تعديلات UI text (تُطبَّق في Stage 3)

النصوص الحالية على prod تقول "استرداد ١٤ يوم مضمون". هذي تُحدَّث في Stage 3 لتصبح **"التزام بالتسليم ٧٢ ساعة"**:

| المكان | من | إلى |
|---|---|---|
| Landing hero.trust في DB | استرداد ١٤ يوم مضمون | ⏱️ التزام بالتسليم ٧٢ ساعة |
| CheckoutSummary badge | استرداد ١٤ يوم مضمون | ⏱️ التزام بالتسليم ٧٢ ساعة |
| CheckoutForm badge أسفل زر الدفع | استرداد ١٤ يوم مضمون — إذا لم نلتزم بإعداد حسابك | التزام بالتسليم — نُنشئ حسابك خلال ٧٢ ساعة أو نمدّد اشتراكك مجاناً |
| Terms checkbox link | سياسة الاسترداد ١٤ يوم | سياسة الفوترة |
| `/billing-policy` page | (لم تُنشأ بعد) | صفحة التزام التسليم كاملة |

---

## الحالة العامة

- ✅ **٦/٦ قرارات مقفولة** (2026-07-12)
- ✅ Stage 1 + 2 مطبّق ومنشور على prod (commit `dd801fe`)
- 🔜 **Stage 3 جاهزة للبدء** — بناء N-Genius integration + Success/Failed pages + `/billing-policy` + Order webhook + Modonty integration
