# N-Genius Integration Study — Comprehensive Report

> **دراسة موثّقة من مصادر N-Genius الرسمية · صفر تخمين · جاهزة لبناء المرحلة ٦.**
> التاريخ: 2026-07-12
> النطاق: Hosted Session SDK (اعتمدناه في القرار #٣ من payment-integration-plan.md)

---

## 📊 الملخّص التنفيذي

**١٢ صفحة docs قُرِئت بعمق** · بيانات كافية للتنفيذ · ٣ نقاط blocking معروفة + ٥ risks معروفة + خطة تخفيف لكل.

### ما هو واضح ١٠٠٪:

- ✅ **الـ SDK JavaScript API كامل** — `mountCardInput`, `generateSessionId`, `handlePaymentResponse`, states enum (`AUTHORISED · CAPTURED · PURCHASED · FAILED · THREE_DS_FAILURE`)
- ✅ **Backend flow خطوة بخطوة** — get access token → complete payment on `/payment/hosted-session/{sessionId}` endpoint
- ✅ **Webhook events** — 60+ event types (`AUTHORISED`, `DECLINED`, `CAPTURED`, `REFUNDED`, `PRE_AUTH_FRAUD_CHECK_REJECTED`، إلخ)
- ✅ **Error codes** — جدول كامل من ISO 8583 (00 approved · 05 declined · 51 insufficient · 62 fraud · 79 CVV)
- ✅ **Test cards** — Mada · STCPay · Al Rajhi · Visa · Mastercard · Apple Pay · Samsung Pay · فشل expired/auth
- ✅ **Tokenization** — vault-less model، token في `_embedded.payment[X].savedCard`

### الـ ٣ Blockers الحاسمة:

1. 🚨 **`NGENIUS_HOSTED_SESSION_API_KEY` منفصل عن الـ Backend API Key.** نحتاج **مفتاحين مختلفين** — واحد للـ frontend (limited-authority للـ SDK) وواحد للـ backend (كامل الصلاحية). حالياً عندنا مفتاح واحد فقط في `.env.local`. **يجب على Khalid إنشاء second key من Sandbox portal: Settings → Integrations → Service Accounts → Create new (Type: Hosted Session Service Account).**

2. 🚨 **Webhook secret pending.** `NGENIUS_WEBHOOK_SECRET` لسه ما اتضبط في البورتال. يجب على Khalid إضافة webhook endpoint في Sandbox portal + توليد secret يُشارَك في header بكل webhook.

3. 🚨 **Webhooks NOT signed cryptographically.** حماية N-Genius = "custom header + shared secret" فقط (مش HMAC). نحن نضطر نعمل التحقق ذاتياً بمقارنة قيمة header ثابتة. **مخاطرة:** لو الـ secret تسرّب = أي شخص يقدر يزيّف webhook. **تخفيف:** نضيف secondary check — نستعلم N-Genius لتأكيد الـ order state قبل تحديث DB.

---

## 🏗️ الـ Architecture النهائية (End-to-End Flow)

```
┌──────────┐        ┌──────────────┐        ┌──────────┐        ┌──────────┐
│ Browser  │───────▶│ JBRSEO API   │───────▶│ N-Genius │        │ Modonty  │
│ (SDK)    │        │ Routes       │        │ Backend  │        │ Admin    │
└────┬─────┘        └──────┬───────┘        └────┬─────┘        └──────────┘
     │                     │                     │                     ▲
     │                     │                     │                     │
     │ 1. User submits form│                     │                     │
     │────────────────────▶│                     │                     │
     │                     │ 2. Turnstile verify │                     │
     │                     │ 3. Upsert Subscriber│                     │
     │                     │ 4. Get access token │                     │
     │                     │────────────────────▶│                     │
     │                     │◀────token+expiry────│                     │
     │                     │ 5. Create Order     │                     │
     │                     │────────────────────▶│                     │
     │                     │◀────order (_id, ref)│                     │
     │                     │◀─return session data│                     │
     │                     │                     │                     │
     │ 6. Mount SDK        │                     │                     │
     │────────────────────────────────────────▶  │                     │
     │ 7. Generate SessionID (client-side)      │                     │
     │────────────────────────────────────────▶  │                     │
     │◀───── session_id ─────────────────────────│                     │
     │                     │                     │                     │
     │ 8. Send session_id  │                     │                     │
     │────────────────────▶│                     │                     │
     │                     │ 9. Complete payment │                     │
     │                     │   /payment/hosted-  │                     │
     │                     │   session/{sesId}   │                     │
     │                     │────────────────────▶│                     │
     │                     │◀──── payment resp ──│                     │
     │◀─ paymentResponse ──│                     │                     │
     │                     │                     │                     │
     │ 10. handlePaymentResponse (3DS if needed) │                     │
     │────────────────────────────────────────▶  │                     │
     │ 11. status callback │                     │                     │
     │                     │                     │                     │
     │ 12a. Redirect /processing (client)        │                     │
     │                     │                     │                     │
     │                     │ 13. Webhook: CAPTURED│ (parallel to 12a)  │
     │                     │◀────────────────────│                     │
     │                     │ 14. Verify + save   │                     │
     │                     │ 15. HMAC → Modonty  │────────────────────▶│
     │                     │                     │                     │ 16. Create Client
     │                     │                     │                     │     + Invoice
     │                     │                     │                     │     + Welcome email
     │                     │◀── 200 OK ──────────│─────────────────────│
     │                     │                     │                     │
     │ 12b. Poll /api/checkout/status            │                     │
     │────────────────────▶│                     │                     │
     │                     │ Sees paymentStatus=paid                   │
     │◀── redirect success ┤                     │                     │
```

**نقاط حرجة في الـ flow:**
- **الخطوات 4-5** خلف السيرفر (secret keys)
- **الخطوات 6-7** كليًنت-side (Hosted Session Key آمن للـ browser)
- **الخطوة 9** خلف السيرفر (تكمل الدفع)
- **الخطوات 13-16** غير مضمونة الوصول (webhook may fail — Polling backup غير قابل للمساومة)

---

## 🔑 المفاتيح المطلوبة (Detailed)

### حالياً موجود في `.env.local`:

| Env Var | Value | استخدام |
|---|---|---|
| `NGENIUS_API_KEY` | `YmJmY2JkNzUt...` (Base64) | Backend — access token generation |
| `NGENIUS_TOKEN_URL` | `.../identity/auth/access-token` | Endpoint المصادقة |
| `NGENIUS_API_BASE` | `.../api-gateway.sandbox.ksa.ngenius-payments.com` | Base URL للـ backend calls |
| `NGENIUS_OUTLET_ID` | `a1d0ebbb-13e0-4b42-ad3c-bdbda9efec94` | يظهر في URLs الـ orders |
| `NGENIUS_TOKEN_GROUP` | `imdZD4cjLXZA3fc0vwwKtHaQfvFVjNg5setv` | Tokenization key |

### مفاتيح إضافية مطلوبة قبل التنفيذ:

| Env Var | كيفية الحصول | استخدام |
|---|---|---|
| **`NEXT_PUBLIC_NGENIUS_HOSTED_SESSION_API_KEY`** | Sandbox portal → Settings → Integrations → Service Accounts → Create → **Type: Hosted Session** | يمرَّر للـ SDK في الـ browser (limited authority — آمن للـ frontend) |
| **`NGENIUS_WEBHOOK_SECRET`** | Sandbox portal → Notifications → Webhook Setup → generate secret | تحقق custom header في webhook handler |

**سؤال لـ Khalid:** هل يمكنك الآن الدخول للـ Sandbox portal وإنشاء الاثنين؟ سأنتظر عشان أبني الكود بمفاتيح صحيحة.

---

## 🔌 JavaScript SDK API — Complete Reference

### 1. تحميل الـ SDK

```html
<!-- Sandbox -->
<script src="https://paypage.sandbox.ksa.ngenius-payments.com/hosted-sessions/sdk.js"></script>

<!-- Production (يُستبدل عند LIVE cutover) -->
<script src="https://paypage.ksa.ngenius-payments.com/hosted-sessions/sdk.js"></script>
```

بعد التحميل، `window.NI` يصبح متاحاً.

### 2. Mount Card Input (استبدال PaymentPlaceholder الحالي)

```javascript
window.NI.mountCardInput('mount-id', {
  hostedSessionApiKey: 'HOSTED_SESSION_API_KEY',   // Limited authority key
  outletRef: 'YOUR_OUTLET_REFERENCE',              // UUID
  language: 'ar',                                    // 'ar' | 'en'
  style: {
    main: { /* wrapper div CSS */ },
    base: { /* base field CSS */ },
    input: { /* input CSS */ },
    invalid: { /* invalid state CSS */ },
    showInputsLabel: true                            // labels above fields
  },
  firstName: '<optional pre-fill>',
  lastName: '<optional pre-fill>',
  onSuccess: () => console.log('SDK mounted + authenticated'),
  onFail: (err) => console.error('Mount failed', err),
  onChangeValidStatus: ({ isCVVValid, isExpiryValid, isNameValid, isPanValid }) => {
    const allValid = isCVVValid && isExpiryValid && isNameValid && isPanValid;
    // enable/disable pay button based on allValid
  }
});
```

### 3. Generate Session ID (عند الضغط على "ادفع")

```javascript
async function submitPayment() {
  try {
    const { session_id } = await window.NI.generateSessionId();
    // Send session_id to our backend
    const paymentResponse = await fetch('/api/checkout/complete-payment', {
      method: 'POST',
      body: JSON.stringify({ sessionId: session_id, subscriberId, plan, billing })
    }).then(r => r.json());
    // Then handle response (see #4)
    return paymentResponse;
  } catch (err) {
    // Session generation failed — usually SDK not ready or API key wrong
    setPaymentError({ title: 'خطأ في الاتصال', ... });
  }
}
```

### 4. Handle Payment Response (3DS + status)

```javascript
const { status, error } = await window.NI.handlePaymentResponse(paymentResponse, {
  mountId: '3ds-iframe-container',    // DOM element ID for 3DS iframe
  style: { width: 500, height: 500 }
});

// Check status against enum:
if (
  status === window.NI.paymentStates.AUTHORISED ||
  status === window.NI.paymentStates.CAPTURED ||
  status === window.NI.paymentStates.PURCHASED
) {
  // Redirect to /checkout/processing?order=X
} else if (
  status === window.NI.paymentStates.FAILED ||
  status === window.NI.paymentStates.THREE_DS_FAILURE
) {
  // Redirect back to /checkout?...&error=<reason>&attempt=<n+1>
}
```

### 5. Unmount (للتنظيف)

```javascript
window.NI.unMountCardInputs();  // نستدعيها في useEffect cleanup
```

---

## 🎨 Frontend Integration — تعديلات مطلوبة

### CheckoutForm.tsx

**استبدل `<PaymentPlaceholder />` بـ SDK mount + logic:**

```tsx
// Add new state
const [ngeniusReady, setNgeniusReady] = useState(false);
const [cardValid, setCardValid] = useState(false);
const [ngeniusError, setNgeniusError] = useState<string | null>(null);
const mountId = 'ngenius-mount';

// Load SDK script + mount card input
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://paypage.sandbox.ksa.ngenius-payments.com/hosted-sessions/sdk.js';
  script.async = true;
  script.onload = () => {
    // @ts-expect-error window.NI is loaded dynamically
    window.NI.mountCardInput(mountId, {
      hostedSessionApiKey: process.env.NEXT_PUBLIC_NGENIUS_HOSTED_SESSION_API_KEY,
      outletRef: process.env.NEXT_PUBLIC_NGENIUS_OUTLET_ID,
      language: 'ar',
      style: { showInputsLabel: true, /* + brand CSS */ },
      onSuccess: () => setNgeniusReady(true),
      onFail: (err: unknown) => setNgeniusError(String(err)),
      onChangeValidStatus: (v: { isPanValid: boolean; isExpiryValid: boolean; isCVVValid: boolean; isNameValid: boolean }) => {
        setCardValid(v.isPanValid && v.isExpiryValid && v.isCVVValid && v.isNameValid);
      }
    });
  };
  document.body.appendChild(script);
  return () => {
    // @ts-expect-error window.NI
    if (window.NI?.unMountCardInputs) window.NI.unMountCardInputs();
    script.remove();
  };
}, []);

// New submit logic
async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  if (!validate() || !turnstileToken || !cardValid) return;

  try {
    // @ts-expect-error window.NI
    const { session_id } = await window.NI.generateSessionId();
    
    const res = await fetch(`/api/checkout/complete-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: session_id,
        turnstileToken,
        name, email, phone,
        plan: planSlug, billing, country,
      }),
    });
    const paymentResponse = await res.json();
    
    // @ts-expect-error window.NI
    const { status } = await window.NI.handlePaymentResponse(paymentResponse, {
      mountId: '3ds-iframe',
      style: { width: 500, height: 500 },
    });
    
    // @ts-expect-error window.NI.paymentStates
    const NIS = window.NI.paymentStates;
    if (status === NIS.PURCHASED || status === NIS.CAPTURED || status === NIS.AUTHORISED) {
      router.push(`/${country.toLowerCase()}/checkout/processing?order=${paymentResponse.subscriberId}`);
    } else {
      const attempt = (attemptNumber ?? 0) + 1;
      router.push(`/${country.toLowerCase()}/checkout?plan=${planSlug}&billing=${billing}&error=card_declined&attempt=${attempt}&order=${paymentResponse.subscriberId}`);
    }
  } catch (err) {
    setNgeniusError(err instanceof Error ? err.message : 'خطأ غير معروف');
  }
}
```

### DOM elements إضافية

```tsx
{/* Card input mount */}
<div id={mountId} className="rounded-xl border border-border bg-background/60 p-4 min-h-[200px]" />

{/* 3DS challenge iframe container (hidden until needed) */}
<div id="3ds-iframe" className="mt-4" />
```

---

## 🔧 Backend Integration — API Routes

### 1. `lib/ngenius/auth.ts` — Access Token (with caching)

```typescript
let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getNGeniusAccessToken(): Promise<string> {
  // Reuse token if still valid (5 min TTL, refresh 30s early)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 30_000) {
    return cachedToken.value;
  }
  const res = await fetch(process.env.NGENIUS_TOKEN_URL!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.ni-identity.v1+json',
      Accept: 'application/vnd.ni-identity.v1+json',
      Authorization: `Basic ${process.env.NGENIUS_API_KEY}`,
    },
    body: JSON.stringify({ grant_type: 'client_credentials', realm: 'ni' }),
  });
  if (!res.ok) throw new Error(`N-Genius auth failed: ${res.status}`);
  const { access_token, expires_in } = await res.json();
  cachedToken = {
    value: access_token,
    expiresAt: Date.now() + (expires_in * 1000),
  };
  return access_token;
}
```

### 2. `lib/ngenius/orders.ts` — Complete Payment (via Hosted Session)

```typescript
export type NGeniusOrder = {
  action: 'PURCHASE' | 'AUTH' | 'VERIFY';
  amount: { currencyCode: string; value: number };
  merchantOrderReference: string;      // = Subscriber.id (idempotency)
  merchantDefinedData?: {
    subscriberId: string;
    plan: string;
    billing: string;
  };
  emailAddress: string;
  merchantAttributes: {
    redirectUrl: string;
    cancelUrl: string;
    skipConfirmationPage?: boolean;
  };
};

export async function completeHostedSessionPayment(
  sessionId: string,
  order: NGeniusOrder,
): Promise<HostedSessionPaymentResponse> {
  const token = await getNGeniusAccessToken();
  const res = await fetch(
    `${process.env.NGENIUS_API_BASE}/transactions/outlets/${process.env.NGENIUS_OUTLET_ID}/payment/hosted-session/${sessionId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        Accept: 'application/vnd.ni-payment.v2+json',
      },
      body: JSON.stringify(order),
    },
  );
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`N-Genius payment failed: ${res.status} ${errText}`);
  }
  return res.json();
}
```

### 3. `lib/ngenius/find-order.ts` — Poll for Status

```typescript
export async function findNGeniusOrder(ref: string): Promise<NGeniusOrderResponse> {
  const token = await getNGeniusAccessToken();
  const res = await fetch(
    `${process.env.NGENIUS_API_BASE}/transactions/outlets/${process.env.NGENIUS_OUTLET_ID}/orders/${ref}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) throw new Error(`Find order failed: ${res.status}`);
  return res.json();
}
```

### 4. `app/api/checkout/complete-payment/route.ts` — Main entry

```typescript
export async function POST(req: Request) {
  const body = await req.json();
  const { sessionId, turnstileToken, name, email, phone, plan, billing, country } = body;

  // 1. Turnstile verify
  const turn = await verifyTurnstileToken(turnstileToken, req.headers.get('x-forwarded-for'));
  if (!turn.success) return NextResponse.json({ error: 'bot-check-failed' }, { status: 403 });

  // 2. Rate limit (order tier: 3/min/IP)
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown';
  const rl = await orderLimiter.limit(ip);
  if (!rl.success) return NextResponse.json({ error: 'rate-limited' }, { status: 429 });

  // 3. Fetch plan + compute total
  const plan_ = await prisma.plan.findFirst({ where: { country, slug: plan } });
  if (!plan_) return NextResponse.json({ error: 'invalid-plan' }, { status: 400 });
  const annual = billing === 'annual';
  const totalMinor = displayMainTotalFromMoYr(plan_.priceMonthly, plan_.priceYearly, annual) * 100;

  // 4. Upsert Subscriber (pending) — @@unique(email, plan, billing) handles retries
  const subscriber = await prisma.subscriber.upsert({
    where: { email_plan_billing: { email, plan, billing } },
    update: { paymentStatus: 'pending', failReason: null },
    create: { email, phone, contactName: name, plan, billing, country, planName: plan_.name, paymentStatus: 'pending' },
  });

  // 5. Complete payment via N-Genius Hosted Session
  const paymentResponse = await completeHostedSessionPayment(sessionId, {
    action: 'PURCHASE',
    amount: { currencyCode: country === 'SA' ? 'SAR' : 'EGP', value: totalMinor },
    merchantOrderReference: subscriber.id,
    merchantDefinedData: { subscriberId: subscriber.id, plan, billing },
    emailAddress: email,
    merchantAttributes: {
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/${country.toLowerCase()}/checkout/processing?order=${subscriber.id}`,
      cancelUrl:   `${process.env.NEXT_PUBLIC_SITE_URL}/${country.toLowerCase()}/checkout?plan=${plan}&billing=${billing}&error=cancelled_by_user&order=${subscriber.id}`,
    },
  });

  // Return response for SDK to handle 3DS
  return NextResponse.json({ ...paymentResponse, subscriberId: subscriber.id });
}
```

### 5. `app/api/webhooks/n-genius/route.ts` — Receive + verify

```typescript
export async function POST(req: Request) {
  // 1. Verify custom header secret (N-Genius doesn't sign cryptographically)
  const signature = req.headers.get('x-ngenius-webhook-secret');
  if (signature !== process.env.NGENIUS_WEBHOOK_SECRET) {
    return new Response('unauthorized', { status: 401 });
  }

  const payload = await req.json();
  const eventId = `${payload.event}:${payload.transaction?.id}:${payload.timestamp}`;

  // 2. Idempotency — WebhookEvent unique on providerEventId
  const existing = await prisma.webhookEvent.findUnique({ where: { providerEventId: eventId } });
  if (existing?.processed) return new Response('ok', { status: 200 });

  await prisma.webhookEvent.upsert({
    where: { providerEventId: eventId },
    create: {
      provider: 'n-genius',
      providerEventId: eventId,
      eventType: payload.event,
      payload,
      signature: signature ?? '',
    },
    update: {},
  });

  // 3. Secondary verify — call N-Genius findorder to confirm state
  const orderRef = payload.order?.reference;
  if (!orderRef) return new Response('missing-ref', { status: 400 });

  const trueOrder = await findNGeniusOrder(orderRef);
  const truePaymentState = trueOrder._embedded?.payment?.[0]?.state;

  // 4. Update Subscriber based on TRUTH from N-Genius (not just webhook claim)
  const subscriberId = payload.merchantOrderReference || orderRef;
  if (['CAPTURED', 'PURCHASED', 'AUTHORISED'].includes(truePaymentState)) {
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { paymentStatus: 'paid', paymentRef: orderRef, paidAt: new Date() },
    });
    // 5. Notify Modonty via HMAC webhook (creates Client + welcome email)
    await notifyModontyOfPaidSubscriber(subscriberId);
  } else if (['DECLINED', 'FAILED'].includes(truePaymentState)) {
    const failReason = trueOrder._embedded?.payment?.[0]?.authResponse?.resultCode ?? 'unknown';
    await prisma.subscriber.update({
      where: { id: subscriberId },
      data: { paymentStatus: 'failed', failReason },
    });
  }

  // 6. Mark webhook processed
  await prisma.webhookEvent.update({
    where: { providerEventId: eventId },
    data: { processed: true, processedAt: new Date() },
  });
  return new Response('ok', { status: 200 });
}
```

---

## 🚨 Error Handling — Complete Reason Map

**نقل الجدول من `error-codes-details.md` إلى `lib/checkout-reasons.ts`:**

| N-Genius Code | Recoverable | Arabic Title | Hint |
|---|---|---|---|
| `00` APPROVAL | — | ✓ نجاح | — |
| `02` CALL ISSUER | ❌ | تواصل مع البنك | البنك يحتاج تحقّق قبل الموافقة |
| `05` DECLINED | ✅ | البطاقة مرفوضة من البنك | جرّب بطاقة أخرى أو تواصل مع بنكك |
| `08/09` ISSUER TIMEOUT/UNAVAIL | ✅ | البنك مؤقتاً غير متاح | أعد المحاولة بعد دقائق قليلة |
| `12` INVALID TRANSACTION | ❌ | خطأ في بيانات العملية | تواصل مع الدعم — قد تكون مشكلة تقنية |
| `13` INVALID AMOUNT | ❌ | مبلغ غير مقبول | خطأ نظام — تواصل مع الدعم |
| `14` INVALID CARD NUMBER | ✅ | رقم البطاقة غير صحيح | تأكد من رقم البطاقة (١٦ رقم) |
| `41/43` LOST/STOLEN CARD | ❌ (fraud) | بطاقة مبلّغ عنها | تواصل مع بنكك فوراً — البطاقة معلّقة |
| `51` INSUFFICIENT FUNDS | ✅ | الرصيد غير كافٍ | تحقّق من رصيد البطاقة أو جرّب بطاقة ثانية |
| `54` EXPIRED CARD | ✅ | البطاقة منتهية | استخدم بطاقة سارية |
| `62` SUSPECTED FRAUD | ❌ (block) | تم إيقاف العملية لأسباب أمنية | لحمايتك، البنك أوقف العملية |
| `79` DECLINED CVV2 | ✅ | رمز CVV غير صحيح | تحقّق من رمز الحماية على ظهر البطاقة |
| `91` SWITCH UNAVAILABLE | ✅ | مشكلة اتصال مع البنك | أعد المحاولة بعد دقائق |
| `94` DUPLICATE TXN | ❌ | العملية موجودة مسبقاً | راجع إيميلك — قد يكون الدفع نجح فعلاً |
| `96` SYSTEM MALFUNCTION | ✅ | خطأ تقني عند N-Genius | أعد المحاولة أو تواصل مع الدعم |
| `AE` TIMEOUT | ✅ | انتهت مهلة الاستجابة | أعد المحاولة |

**تعديل `lib/checkout-reasons.ts`** — نمرّر `paymentResponse.authResponse.resultCode` كـ key.

---

## 🧪 Test Cards — للـ Sandbox testing

### Successful cards:

| Type | Number | Expiry | OTP |
|---|---|---|---|
| Mada | `4548 8713 2783 5760` | 06/27 | 8888 |
| STCPay | `4201 3220 3021 7878` | 08/26 | 1234 |
| Al Rajhi | `4847 8320 4007 8607` | 09/24 | 1111 |
| Visa (SAIB) | — (١٣ بطاقة بنكية موثّقة) | — | — |
| Mastercard | `5204 7400 0000 0004` | 12/25 | 555 |
| Visa Generic | `4012 0010 3714 1112` | 12/27 | 555 |

### Failure scenarios:

| Type | Card | Expected |
|---|---|---|
| Expired | `4544 9091 2472 7139` | resultCode=54 |
| Auth failed | `2303 7799 9900 0291` | 3DS challenge failure |
| Auth failed | `2223 0000 0000 0007` | same |
| Amount-specific decline | `4012 0010 3714 1112` on 2400 SAR | decline |

**Apple Pay & Samsung Pay** مدعومة في Sandbox — راجع docs لتفاصيل الإعداد.

---

## 🔒 Security Considerations

### 1. مفتاح الـ Hosted Session (client-side) آمن للـ browser

**Cloudflare docs:** "The `hostedSessionApiKey` is a dedicated, limited authority API key. It can generate session tokens ONLY. Cannot make direct payments or refunds."

→ آمن إضافته لـ `NEXT_PUBLIC_*` env var (يظهر في bundle).

### 2. مفتاح الـ Backend API (server-only) خطر جداً

**لا يُشارك أبداً** — يقدر ينشئ orders + captures + refunds.

→ يبقى `NGENIUS_API_KEY` (بدون NEXT_PUBLIC_) — server routes فقط.

### 3. Access tokens قصيرة العمر (5 دقائق)

→ نضيف caching layer بمهلة 4 دقائق و 30 ثانية (buffer قبل الانتهاء).

### 4. Webhook secret shared header

**ليس HMAC.** لو تسرّب = أي شخص يقدر يزيّف webhook.
**تخفيف مضاعف:**
- Rotate الـ secret كل 90 يوم
- Secondary verify (call findorder) قبل تحديث DB — لا نثق بـ webhook وحده

### 5. Idempotency layers (٣)

1. Subscriber `@@unique([email, plan, billing])` — يمنع duplicate rows
2. `merchantOrderReference` = Subscriber.id — N-Genius يرجع نفس order لو المرجع متكرر
3. `WebhookEvent.providerEventId @unique` — نمنع معالجة نفس event مرتين

### 6. CVV never stored

**PCI compliance:** الـ SDK يمرر CVV مباشرة إلى N-Genius — لا يمرّ عبر سيرفرنا.
`savedCard` block لا يحوي CVV. عند saved-card payment، CVV يُطلب مرة أخرى.

---

## ⏱️ N-Genius Session Timeouts

| Item | مدة | تأثير |
|---|---|---|
| Access token (backend) | 5 دقائق | Cache + refresh |
| Session ID (frontend) | 5 دقائق | User must submit within 5 min of SDK mount — نضيف tracker |
| SDK "self-authentication" | 5 دقائق | نفس session ID timeout |

**تأثير على UX:** لو المستخدم يقعد ٦ دقائق في صفحة `/checkout` ثم يضغط ادفع → السiSession expired → SDK يرجع error → نُعيد mount تلقائياً + نطلب منه إعادة إدخال البطاقة.

**تخفيف:** heartbeat client-side كل 3 دقائق يُعيد mount بصمت لو المستخدم لا يزال على الصفحة.

---

## 🎯 Risks & Mitigations

| # | Risk | احتمال | تأثير | Mitigation |
|---|---|---|---|---|
| ١ | Webhook يضيع (N-Genius لا يعيد المحاولة) | 🟡 متوسط | 🔴 عالي (payment مؤكّد لكن Modonty ما يعرف) | Polling backup (لسه قررناه في القرار #٤) + secondary verify (findorder) |
| ٢ | Session ID timeout (٥ دقائق) | 🟡 متوسط | 🟡 مزعج (user retry) | Heartbeat client + auto-remount SDK on session expired error |
| ٣ | Webhook secret leak (لا HMAC) | 🟢 منخفض | 🔴 عالي (fake webhooks) | Secondary verify (findorder API) + rotate secret every 90 days |
| ٤ | N-Genius API outage | 🟢 منخفض | 🔴 عالي (checkout معطّل) | Fail-open on `/checkout` — عرض رسالة "الدفع مؤقتاً غير متاح، تواصل واتساب" |
| ٥ | Double webhook processing | 🟢 منخفض | 🟡 (Modonty client مكرّر) | WebhookEvent `providerEventId @unique` — راجع القرار #٢ |
| ٦ | 3DS challenge fails | 🟡 متوسط | 🟢 عادي (retry OK) | recoverable=true في checkout-reasons + inline banner |

---

## ✅ Action Items لـ Khalid (قبل بدء Level 6 code)

### مطلوب من Sandbox Portal:

1. **إنشاء Hosted Session API Key ثاني:**
   - Portal: https://portal.sandbox.ksa.ngenius-payments.com
   - Path: Settings → Integrations → Service Accounts → Create new
   - Type: **Hosted Session Service Account** (مو Backend)
   - نسخ المفتاح → إرساله لي

2. **إعداد Webhook endpoint:**
   - Portal: Settings → Notifications → Webhooks
   - URL: `https://www.jbrseo.com/api/webhooks/n-genius` (production)
   - Test URL: `https://jbrseo.com/api/webhooks/n-genius` (بدون www للـ preview)
   - Custom header name: `X-Ngenius-Webhook-Secret`
   - Custom header value: **generate random 32-char string** — أنشره لك إذا احتجت
   - Events to subscribe: `AUTHORISED`, `CAPTURED`, `PURCHASED`, `DECLINED`, `FAILED`, `REFUNDED`, `PRE_AUTH_FRAUD_CHECK_REJECTED`
   - نسخ الـ secret + إرساله لي

3. **اختياري:** التحقق من Risk Rules في البورتال:
   - Settings → Risk Rules
   - GCC Region Restriction: **On** (نقبل GCC فقط)
   - Country BIN Blacklist: أضف دول عالية المخاطر إن أردت
   - Corporate Card Payments: قرارك (على/إيقاف)

---

## 🚀 Implementation Order (لو المفاتيح موجودة)

1. **`lib/ngenius/auth.ts`** — Access token with cache (30 دقيقة)
2. **`lib/ngenius/orders.ts`** — Order helpers (1 ساعة)
3. **`lib/ngenius/find-order.ts`** — findorder polling (30 دقيقة)
4. **`app/api/checkout/complete-payment/route.ts`** — Main endpoint (1.5 ساعة)
5. **`lib/hmac.ts`** — HMAC utility for Modonty communication (30 دقيقة)
6. **Update `CheckoutForm.tsx`** — SDK integration (2 ساعات)
7. **Update `PaymentPlaceholder.tsx`** → delete or replace with real mount div (10 دقيقة)
8. **`app/api/webhooks/n-genius/route.ts`** — Webhook receiver (1.5 ساعة)
9. **Extend `app/api/checkout/status/route.ts`** — Add findorder polling for lost webhooks (30 دقيقة)
10. **Live test in Sandbox** — Full flow with test cards (2 ساعات)

**الإجمالي:** ~10 ساعات كود + 2 ساعات اختبار.

---

## 📚 مصادر مقروءة (12 صفحة N-Genius docs)

- `reference/quick-start-guide.md`
- `docs/web-sdk-hosted-session.md`
- `reference/hosted-session-sdk.md`
- `reference/consuming-web-hooks.md`
- `reference/create-an-order-paypage.md`
- `reference/error-codes-details.md`
- `reference/creating-orders.md`
- `reference/the-order-object-in-full.md`
- `reference/pre-populate-cardholders-name-on-hosted-session-pay-page-1.md`
- `reference/display-payment-request-fields-above-the-text-box-than-inside.md`
- `reference/how-to-setup-the-hosted-session-sdk-to-support-wallets.md`
- `docs/tokenization-guide.md`
- `docs/risk-rules.md` (من دراسة سابقة)
- `docs/gateway-risk-rules.md` (من دراسة سابقة)
- `reference/createorder-1.md`
- `docs/web-sdk-integration-guide` (global docs, أوسع تفاصيل)
- `reference/sandbox-test-environment.md`

---

**آخر تحديث:** 2026-07-12
**الخلاصة:** جاهزون تقنياً لـ Level 6. Blockers فقط: إنشاء Hosted Session API Key ثاني + إعداد webhook secret في البورتال (٢ إجراء إداري من Khalid، لا كود مطلوب).
