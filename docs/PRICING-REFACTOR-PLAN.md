# Pricing Refactor Plan — المرجع الرئيسي للعمل

> **القاعدة الذهبية:** لا يُلمس الـ DB الإنتاج حتى يكتمل الاختبار على dev DB ويُوافق المستخدم.
>
> **استراتيجية العمل:** نبني الـ admin أولاً ١٠٠٪، نتأكد منه قائماً بذاته، ثم نربطه بالـ homepage.
>
> آخر تحديث: 2026-05-10

---

## ١. القرارات المعتمدة (١١ قرار)

| # | القرار | الاختيار |
|---|--------|----------|
| ١ | الألوان والستايل | hardcoded في الكود حسب slug (محمي من الأدمن) |
| ٢ | عدد highlights | مرن (`String[]`) |
| ٣ | sections (التفاصيل التوسعية) | تُشال من الكرت الآن، تأتي مع صفحة التفاصيل لاحقاً |
| ٤أ | الـ Promo | لكل خطة، اختياري، الأدمن يتحكم به من الـ backend |
| ٤ب | heroImage | لكل خطة، اختياري، للصفحة التفصيلية المستقبلية |
| ٥ | شارة الـ featured | string اختياري (الأدمن يكتب النص) |
| ٦ | عدد الخطط | ٤ ثابتة: `free`, `starter`, `growth`, `scale` |
| ٧ | بيئة العمل | `modonty_dev` على Atlas (نفس cluster، DB مختلف) |
| ٨ | حقل `name` | يبقى `name` (اسم العرض العربي) |
| ٩ | حقل `slug` | يبقى — معرّف تقني ثابت ضروري للستايل والـ URLs |
| ١٠ | حقل `guarantee` | **محذوف** من الـ schema (لا حاجة له) |
| ١١ | حقل `articlesLabel` | يبقى `String` مرن (الأدمن يكتب أي صيغة) |

---

## ٢. الـ Schema النهائي

### Plan Model

```prisma
model Plan {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  
  // ─── التحكم ─────────────────────────────
  country         String                          // "SA" | "EG"
  slug            String                          // "free" | "starter" | "growth" | "scale"
  visible         Boolean  @default(true)
  displayOrder    Int
  
  // ─── المحتوى الأساسي ────────────────────
  name            String
  tagline         String   @default("")
  
  priceMonthly    Int      @default(0)
  priceYearly     Int      @default(0)
  
  articlesLabel   String   @default("")            // نص حر — "٨ مقالات / شهر" أو "١ مقال هدية"
  
  ctaText         String   @default("")
  
  highlights      String[]                          // عدد مرن من النقاط
  
  // ─── الشارات ──────────────────────────────
  badge           String?
  featuredBadge   String?
  
  // ─── الـ Promo (موسمي، اختياري) ─────────────
  promoActive     Boolean  @default(false)
  promoLabel      String   @default("")
  promoTitle      String   @default("")
  promoSubtitle   String   @default("")
  
  // ─── الصفحة التفصيلية المستقبلية ────────────
  heroImage       String   @default("")
  
  // ─── التتبع ──────────────────────────────
  updatedAt       DateTime @updatedAt
  
  @@unique([country, slug])
  @@index([country, displayOrder])
}
```

### PriceSectionMeta Model

> **مبدأ ملزم:** كل نص عربي يراه الزائر يبقى DB-driven لاختلاف اللهجات (SA vs EG). لا hardcoding للنصوص.

```prisma
model PriceSectionMeta {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  country         String   @unique
  
  // ─── الإعلان أعلى القسم ──────────────────────
  announcement    String   @default("")             // "ادفع ١٢ شهراً واحصل على ١٨"
  
  // ─── الـ CTA السفلي ─────────────────────────
  ctaHeadline     String   @default("")             // "منافسك ينشر الحين — وأنت؟"
  ctaSubheadline  String   @default("")             // "+١٢٠ نشاط تجاري قرروا..."
  ctaPrimaryBtn   String   @default("")             // "ابدأ الحين — ١٤ يوم ضمان كامل ✅"
  ctaSecondaryBtn String   @default("")             // "كلّمنا على واتساب"
  ctaFootnote     String   @default("")             // "بدون بطاقة ائتمان · ضمان ١٤ يوم"
  
  // ─── العناصر المركّبة (JSON — لأنها arrays/objects) ─────
  trustItems      Json     @default("[]")           // [{icon: "🔒", label: "تشفير كامل"}, ...]
  uiStrings       Json     @default("{}")           // {monthly: "شهري", yearly: "سنوي", perMonth: "/ شهر", ...}
  
  updatedAt       DateTime @updatedAt
}
```

**كل النصوص في DB**، الأدمن يقدر يعدّل أي نص بلهجة بلده.

**عدد الحقول:** ٦ حقل scalar + ٢ JSON (للـ arrays/objects)

### الستايل الـ hardcoded (`lib/plan-styles.ts`)

```typescript
export const PLAN_STYLES = {
  free:    { accent: "#64748b", accentBg: "#f1f5f9",                 ctaStyle: "ghost",    badgeGold: false },
  starter: { accent: "#2563eb", accentBg: "#eff6ff",                 ctaStyle: "blue",     badgeGold: false },
  growth:  { accent: "#a78bfa", accentBg: "rgba(167,139,250,0.18)",  ctaStyle: "featured", badgeGold: false },
  scale:   { accent: "#d97706", accentBg: "#fffbeb",                 ctaStyle: "gold",     badgeGold: true  },
} as const;
```

**النتيجة المتوقعة في DB:**
- `Plan` collection: ٨ rows (٤ × ٢ بلد)
- `PriceSectionMeta` collection: ٢ rows (١ × ٢ بلد)

---

## ٣. خطة التنفيذ — TODO List

> **الترتيب الجديد:** Admin أولاً، Homepage بعدين.

### ✅ Phase A — Dev DB Setup (مكتمل)

- [x] إنشاء `.env.local` يشير لـ `modonty_dev`
- [x] تثبيت `dotenv-cli`
- [x] إضافة scripts `dev:db:*` في `package.json`
- [x] التحقق من اتصال صحيح لـ `modonty_dev`

---

### ✅ Phase B — Schema + Migration (مكتمل على dev)

#### B1 — تعديل `prisma/schema.prisma` ✅
- [x] إضافة `Plan` model — `prisma/schema.prisma:61` (مطابق للـ schema المعتمد)
- [x] إضافة `PriceSectionMeta` model — `prisma/schema.prisma:98` (مطابق)
- [x] `pnpm prisma:generate` (تم — الـ client يولّد `prisma.plan` و `prisma.priceSectionMeta` بنجاح)
- [x] `pnpm dev:db:push` (الـ collections موجودة على `modonty_dev`)

#### B2 — Seed بيانات أولية لـ `modonty_dev` ✅
- [x] سكربت `scripts/seed-pricing-on-dev.ts` (TS بدلاً من mjs، يستخدم `tsx`)
- [x] script `dev:db:seed-pricing` في `package.json:23`
- [x] **تم التحقق على dev DB في 2026-05-10:**
  - `Plan`: **٨ rows** ✅ (SA: free/starter/growth/scale + EG: free/starter/growth/scale)
  - `PriceSectionMeta`: **٢ rows** ✅ (SA + EG، كل واحد فيه ٥ trustItems و ٢٣ uiKeys)
  - `LandingSection { section: "pricing" }` لا يزال موجوداً (rollback safety net) ✅

---

### Phase C — Admin UI (٥ من ٦ مكتمل)

> **الهدف:** الأدمن يقدر يدير الخطط ١٠٠٪ بدون أي ربط مع الواجهة الرئيسية. اختبار قائم بذاته.

#### C1 — Server Actions للـ Plan ✅
- [x] `app/actions/pricing.ts` (مكتمل + إضافات):
  - [x] `getAllPlans(country)` — يقرأ مرتب بـ displayOrder
  - [x] `getPlan(country, slug)` — قراءة فردية (إضافة منطقية للـ edit page)
  - [x] `togglePlanVisibility(country, slug)` — يقلب `visible` فقط (مع isAdmin guard)
  - [x] `togglePlanPromo(country, slug)` — يقلب `promoActive` فقط (مع isAdmin guard)
  - [x] `reorderPlans(country, slugs[])` — `$transaction` لتحديث الـ displayOrder
  - [x] `updatePlan(country, slug, patch)` — partial update (يتجاهل `undefined` فقط)
  - [x] `updatePlanFromForm` — wrapper للـ FormData (إضافة)
  - [x] revalidate: `landing-${country}` tag + paths (`/admin/pricing`, `/sa`, `/sa/pricing`، الخ)

#### C2 — Server Actions للـ PriceSectionMeta ✅
- [x] `app/actions/pricing-meta.ts`:
  - [x] `getMeta(country)` — يقرأ row واحد (يُنشئه فارغاً لو غير موجود)
  - [x] `updateMeta(country, patch)` — `upsert` partial
  - [x] `updateMetaFromForm` — wrapper للـ FormData
  - [x] revalidate نفس الـ tags/paths

#### C3 — صفحة Admin الرئيسية للأسعار ✅
- [x] `app/admin/(dashboard)/pricing/page.tsx`:
  - جدول ٤ خطط (ترتيب، slug، اسم، سعر شهري/سنوي، شارة)
  - `VisibilityToggle` (optimistic) + `PromoToggle` (optimistic) + `ReorderArrows` (▲▼)
  - زر "تعديل" → `/admin/pricing/[slug]?country=…`
  - زر "إعدادات قسم الأسعار" → `/admin/pricing/meta?country=…`
  - `AdminCountryPill` يبدّل بين SA/EG

#### C4 — صفحة تعديل خطة فردية ✅
- [x] `app/admin/(dashboard)/pricing/[slug]/page.tsx` + `PlanEditForm.tsx`:
  - فورم يغطي كل الحقول الـ ١٥: name, tagline, priceMonthly, priceYearly, articlesLabel, ctaText, highlights (مرن add/remove), badge, featuredBadge, promo (active+label+title+subtitle), heroImage, visible toggle
  - حفظ بـ `useTransition` + feedback (✓ / ❌)
  - `notFound()` للـ slugs غير المسموحة
- ⚠️ **انحراف عن الخطة:** الزر باستخدام sticky bar عادي بدلاً من `UnsavedChangesBar مع pointer-events-none`. عملياً يشتغل، لكن ما يكتشف "غير محفوظ" — يحفظ كل مرة. (يستحق تحسين لاحق لو احتجناه)

#### C5 — صفحة تعديل PriceSectionMeta ✅
- [x] `app/admin/(dashboard)/pricing/meta/page.tsx` + `MetaEditForm.tsx`:
  - announcement, ctaHeadline/sub/PrimaryBtn/SecondaryBtn/Footnote
  - trustItems (table مرن مع icon + label لكل صف)
  - uiStrings (key/value editor مرن — أفضل من JSON editor خام)

#### ✅ C6 — اختبار شامل للـ Admin (مكتمل 2026-05-10 عبر Playwright على dev)
- [x] **T1** إخفاء/إظهار خطة → `SA/free.visible: true→false→true` (قُرئت من DB)
- [x] **T3** تعديل سعر `growth.priceMonthly: 1299→1399→1299` — تأكدنا من snapshot كامل قبل/بعد: باقي الـ ١٤ حقل كما هي (highlights ٦، tagline، featuredBadge، الكل سليم) ✓
- [x] **T4** highlights add → ٦→٧، delete → ٧→٦ (محفوظ في DB)
- [x] **T2** Promo toggle: `growth.promoActive: false→true→false`
- [x] **T5** SA→EG: الجدول عرض أسعار EG الصحيحة (١٬٤٩٩ / ٣٬٩٩٩ / ٨٬٩٩٩) ≠ SA (٤٩٩ / ١٬٢٩٩ / ٢٬٩٩٩). روابط التعديل `?country=EG` صحيحة
- [x] **T6** Reorder: `growth` تحرّك من displayOrder=3→2 ثم رجع 3 (`$transaction` شغّال)
- [x] **T7 (bonus)** Meta page (EG): announcement باللهجة المصرية، ٥ trustItems، ٢٣ uiKeys محمّلة من DB
- [x] **0 console errors** خلال كل الجلسة (٥ warnings فقط — Cloudinary aspect-ratio، غير متعلّقة بالأسعار)
- [x] **توقف هنا** للمراجعة قبل Phase D ✋

---

### ☐ Phase D — ربط الـ Homepage بالـ Plan model الجديد

> **يبدأ فقط بعد إكمال Phase C وموافقة المستخدم.**

#### D1 — Read path جديد (٢ ساعة)
- [ ] `lib/pricing.ts`:
  ```typescript
  export async function getPricingForFront(country: SupportedCountry) {
    const [plans, meta] = await Promise.all([
      prisma.plan.findMany({ where: { country, visible: true }, orderBy: { displayOrder: "asc" } }),
      prisma.pricingPageMeta.findUnique({ where: { country } }),
    ]);
    return { plans, meta };
  }
  ```
- [ ] adapter يحوّل `{ plans, meta }` للـ shape القديم `PricingContent` (compatibility shim مؤقت)
- [ ] `getLandingContent` يستخدم `getPricingForFront` بدل قراءة من `LandingSection`

#### D2 — تحديث الـ Component (٣ ساعات)
- [ ] `app/components/landing/price-section/price-section.tsx`: يستلم `Plan[]` بدلاً من `PLANS[]`
- [ ] `PlanCard.tsx`: يستلم Plan single + PLAN_STYLES lookup حسب slug
- [ ] دمج الـ promo: لو `promoActive=true` يعرض الشريط + alert box
- [ ] إزالة قسم "تفاصيل أكتر" من الكرت (sections لم تعد موجودة)
- [ ] إضافة زر "اعرف أكثر" يشير لـ `/[country]/plans/[slug]` (placeholder URL — الصفحة لاحقاً)

#### D3 — اختبار الواجهة على dev (ساعة)
- [ ] الصفحة الرئيسية تعرض ٤ خطط لـ SA
- [ ] الصفحة الرئيسية تعرض ٤ خطط لـ EG
- [ ] إخفاء خطة من admin → الواجهة تعرض ٣ خطط فقط
- [ ] تشغيل promo على خطة → الكرت يعرض الشريط/الـ alert
- [ ] تعديل سعر من admin → revalidate → الواجهة تعكس التغيير
- [ ] الكاليكوليتر (Calculator) يقرأ featured plan بشكل صحيح
- [ ] صفحة `/sa/pricing` و `/eg/pricing` تعملان

---

### ☐ Phase E — تنظيف dev (ساعة)

- [ ] حذف `LandingSection { section: "pricing" }` من `modonty_dev` (للبلدين)
- [ ] إزالة `"pricing"` من `SECTION_KEYS` في `lib/landing-sections.ts`
- [ ] حذف `PricingSectionForm.tsx` القديم
- [ ] إزالة الـ adapter shim من Phase D1 (الـ component يستلم الـ shape الجديد مباشرة)
- [ ] حذف types قديمة لـ pricing من `app/content/landing/types.ts` لو موجودة

---

### ☐ Phase F — Migration Plan لـ Production

> **يُكتب بالتفصيل بعد إكمال Phases A-E والتحقق منها.**

#### ملخص الفكرة (للتخطيط الآن فقط)
- [ ] احتياط `modonty` كامل (Atlas backup snapshot)
- [ ] تشغيل سكربت seed على prod (نفس Phase B2 لكن على prod DATABASE_URL)
- [ ] Vercel deploy للكود الجديد
- [ ] فحص فوري: الصفحات تعرض، الأدمن يعمل، GA4 events
- [ ] حذف `LandingSection { section: "pricing" }` من prod (بعد التأكد من الجديد)
- [ ] في حال خطأ: rollback عبر استعادة snapshot + revert الكود

---

## ٤. الزمن المتوقع

| Phase | المدة | ملاحظات |
|-------|------|---------|
| A — Dev DB | ✅ مكتمل | — |
| B — Schema + Migration | ٢-٣ ساعات | — |
| C — Admin UI | ١.٥ يوم | الأولوية الآن |
| D — Connect Homepage | يوم | بعد إكمال C وموافقة |
| E — تنظيف | ساعة | — |
| F — Prod Migration | ٢-٣ ساعات | بعد إكمال E |

**الإجمالي:** ~ ٣ أيام عمل + ساعات الانتظار/الاختبار.

---

## ٥. سجل المخاطر

| الخطر | الاحتمال | الأثر | التخفيف |
|------|----------|------|---------|
| لمس prod DB بالخطأ | منخفض | كارثي | كل scripts تستخدم `dotenv -e .env.local` |
| Prisma generate يفشل (DLL locked) | متوسط | منخفض | إيقاف node processes أولاً |
| فقد بيانات أثناء migration | منخفض | متوسط | السكربتات لا تحذف، فقط تكتب — Phase E حذف منفصل بعد التأكد |
| الـ static fallback يصير stale | منخفض | منخفض | يبقى كآمان فقط — DB يصير authoritative |
| Vercel cache بعد deploy | متوسط | متوسط | revalidatePath + hard refresh |

---

## ٦. ملفات مرجعية

- هذا الملف: `docs/PRICING-REFACTOR-PLAN.md`
- المرجع الأكبر: `docs/DB-REFACTOR-PLAN.md`
- Schema: `prisma/schema.prisma`
- DB inspector: `scripts/inspect-db.mjs`
- Static fallback: `app/content/landing/landing-sa.ts`, `landing-eg.ts`
- Read path الحالي: `lib/getLandingContent.ts`
- Admin form الحالي (سيُحذف): `app/admin/(dashboard)/content/PricingSectionForm.tsx`
- Component الفرونت: `app/components/landing/price-section/price-section.tsx`, `PlanCard.tsx`
- Calculator: `app/components/landing/Calculator/Calculator.tsx` (يقرأ featured plan price)

---

## ٧. حالة التقدم

| Phase | Step | الحالة | تاريخ الإنجاز |
|-------|------|--------|---------------|
| A | A1-A4 — Dev DB Setup | ✅ مكتمل | 2026-05-07 |
| B | B1 — Schema | ✅ مكتمل | 2026-05-10 |
| B | B2 — Seed | ✅ مكتمل (٨ Plan + ٢ Meta على dev) | 2026-05-10 |
| C | C1 — Plan actions | ✅ مكتمل | 2026-05-10 |
| C | C2 — Meta actions | ✅ مكتمل | 2026-05-10 |
| C | C3 — Admin pricing page | ✅ مكتمل | 2026-05-10 |
| C | C4 — Edit plan page | ✅ مكتمل (مع انحراف صغير عن UnsavedChangesBar) | 2026-05-10 |
| C | C5 — Edit meta page | ✅ مكتمل | 2026-05-10 |
| C | C6 — Admin testing | ✅ مكتمل (٧ سيناريوهات نجحت) | 2026-05-10 |
| D | D1 — Read path | ☐ pending | — |
| D | D2 — Component update | ☐ pending | — |
| D | D3 — Frontend testing | ☐ pending | — |
| E | E — Cleanup dev | ☐ pending | — |
| F | F — Prod migration | ☐ blocked | — |

---

## ٨. القاعدة الذهبية المطلقة

١. كل التغييرات على dev DB أولاً (`modonty_dev`).
٢. الأدمن يعمل ١٠٠٪ standalone قبل ربط الـ homepage.
٣. لا migration لـ prod حتى موافقة المستخدم على dev بشكل كامل.
٤. كل سكربت يبدأ بـ `dotenv -e .env.local` (مستحيل يلمس prod بالخطأ).
