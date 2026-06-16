# خطة إعادة هيكلة الـ Database — المرجع الرئيسي

> **هذا الملف هو المرجع الذي نشتغل عليه**. أي تعديل على schema الـ DB أو على إدارة محتوى الـ landing يجب أن يرجع هنا أولاً.
>
> آخر تحديث: 2026-05-07

---

## ١. الوضع الحالي (مبني على فحص DB فعلي، لا من ملفات static)

### الـ Schema الحالي
```prisma
model LandingSection {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  country   String                   // "SA" | "EG"
  section   String                   // "hero" | "pricing" | ...
  data      Json                     // ← payload كامل بدون فحص
  updatedAt DateTime @updatedAt
  @@unique([country, section])
}
```

### تقرير DB الفعلي (`scripts/inspect-db.mjs`)
- **17 row** في `LandingSection` عبر **11 section**
- **6 sections فيها البلدين (SA + EG):** `hero`, `team`, `socialProof`, `whyNow`, `seo`, `socialLinks`
- **5 sections في بلد واحد فقط (SA ينقصها):** `pricing`, `faq`, `footer`, `header`, `ctaLabel`

### الأحجام (للسياق)
| Section | الحجم | تقييم |
|---------|-------|-------|
| pricing (EG) | 7.4KB | كبير جداً — 4 خطط، UI ٢٣ مفتاح |
| team | 4.0–4.4KB | كبير — مصفوفتان |
| faq (EG) | 2.1KB | متوسط — 10 Q&A |
| hero | 1.8KB | متوسط |
| socialProof | 1.4KB | متوسط |
| whyNow | 1.4KB | متوسط |
| seo | 41B–294B | صغير — strings فقط |
| socialLinks | 199B–350B | صغير — URLs فقط |
| footer, header, ctaLabel | 39B–118B | صغير جداً — 1-2 strings |

### الـ Drift المكتشف
- **`seo`:** SA فيه `title, description, canonical, ogImage, ogLocale` (5 حقول) — EG فيه `canonical` فقط (1 حقل). السبب: EG كُتب من سكربت يدوي `fix-eg-canonical.mjs`، مش من الفورم.
- **`socialLinks`:** SA فيه 6 حسابات (FB, IG, LinkedIn, X, YouTube, TikTok) — EG فيه 3 (FB, IG, TikTok).

### المشاكل الجذرية
1. **لا validation على مستوى DB** → أي bug في فورم يكتب shape غلط، الـ read path ينكسر بصمت.
2. **حفظ section يدوس على الـ object كامل** → تعدّل حقل واحد، تخسر كل الحقول الأخرى لو الفورم ما أرسلها.
3. **JSON غير مُكتَب في TypeScript** → الـ types في الكود تختلف عن الـ data في DB.
4. **Logic الـ merge متناثر** بين `mergeStaticWithOverrides` و`mergeLandingSeo`.

---

## ٢. الفلسفة المعتمدة

اقتراح "table per section" تم رفضه لأنه:
- ١٦ جدول × CRUD × admin form = boilerplate ضخم
- pricing/team/faq فيها مصفوفات متشعّبة → تحتاج إما FK chains (غير مدعوم بصلابة في MongoDB) أو تبقى JSON
- مش يحلّ السبب الجذري (غياب validation)

**الحل المعتمد: نهج هجين**
- الحقول البسيطة (scalar settings) → typed columns في `CountryProfile` model جديد
- المحتوى الغني (rich nested content) → يبقى `LandingSection.data: Json` مع طبقة Zod validation
- Partial-update في الفورمات (يرسل diff فقط، الـ action يدمج في JS)

---

## ٣. الـ Phases — المرجع التنفيذي

### ☐ Phase 1 — Backfill SA الناقصة (ROI فوري، بدون تغيير schema)

**الهدف:** كل section يكون عنده row لكل بلد، نخرج من حالة "DB غير مكتمل".

**Sections الناقصة في SA:** `pricing`, `faq`, `footer`, `header`, `ctaLabel`

**التنفيذ:**
- [ ] سكربت `scripts/backfill-sa.mjs` يقرأ من `landing-sa.ts` static ويكتب للـ DB
- [ ] OR ينسخ من EG ويعدّل اللهجة (إذا أردنا توحيد المحتوى)
- [ ] فحص بعد التشغيل: كل section عنده 2 rows (SA + EG)
- [ ] commit + push

**المدة المتوقعة:** يوم واحد
**المخاطر:** منخفضة — كتابة فقط، لا تغيير في الكود

**الملاحظات:**
- `landing-sa.ts` فيه القيم السعودية الصحيحة، استخدمه كمصدر
- لما نخلّص، static fallback يبقى كـ "آخر ملاذ" لكن DB يصير المرجع الوحيد عملياً

---

### ☐ Phase 2 — `CountryProfile` model للـ settings الصغيرة

**الهدف:** نقل الحقول scalar الـ ٥ من `LandingSection.data: Json` إلى أعمدة typed.

**Sections المنقولة:** `seo`, `socialLinks`, `ctaLabel`, `header`, `footer`

**الـ Schema المقترح:**
```prisma
model CountryProfile {
  id              String   @id @default(auto()) @map("_id") @db.ObjectId
  country         String   @unique         // "SA" | "EG"

  // SEO
  seoTitle        String   @default("")
  seoDescription  String   @default("")
  seoCanonical    String   @default("")
  seoOgImage      String   @default("")
  seoOgLocale     String   @default("ar_SA")

  // Social links
  facebook        String   @default("")
  instagram       String   @default("")
  tiktok          String   @default("")
  twitterX        String   @default("")
  linkedin        String   @default("")
  youtube         String   @default("")

  // Misc strings
  ctaLabel        String   @default("")
  bannerText      String   @default("")
  footerTagline   String   @default("")
  footerDesc      String   @default("")

  updatedAt       DateTime @updatedAt
}
```

**التنفيذ:**
- [ ] إضافة `CountryProfile` للـ schema.prisma
- [ ] `npx prisma generate` (مع إيقاف dev server أولاً)
- [ ] سكربت migration `scripts/migrate-to-country-profile.mjs`:
  - يقرأ rows seo/socialLinks/ctaLabel/header/footer من `LandingSection`
  - يكتبها كأعمدة في `CountryProfile`
  - **لا يحذف** الـ rows القديمة (آمان)
- [ ] تحديث الـ read paths:
  - `getLandingContent` يقرأ من `CountryProfile` بدل `getLandingSectionOverride`
  - `lib/seo-meta.ts` يقرأ من `CountryProfile.seoCanonical` إلخ
- [ ] تحديث الـ admin forms (5 forms):
  - `SeoForm` → يحدّث `CountryProfile` بـ partial update
  - `SocialLinksForm` → نفس الشيء
  - `CtaLabelForm`, `HeaderForm`, `FooterForm` → نفس الشيء
- [ ] فحص شامل: الصفحات تعرض القيم الصحيحة، الفورمات تحفظ
- [ ] **بعد التأكد:** حذف rows seo/socialLinks/ctaLabel/header/footer من `LandingSection`
- [ ] إزالة الـ keys من `SECTION_KEYS` في `lib/landing-sections.ts`

**المدة المتوقعة:** يومين
**المخاطر:** متوسطة — نلامس admin forms، نحتاج اختبار E2E

---

### ☐ Phase 3 — Zod validation للـ rich sections (نبدأ بـ `pricing`)

**الهدف:** القضاء على الـ shape drift في sections الكبيرة، تفعيل partial-update.

**Sections في النطاق:** `pricing`, `team`, `faq`, `hero`, `whyNow`, `socialProof`

**النمط المعتمد:**
```typescript
// lib/sections/pricing.schema.ts
import { z } from "zod";

const PlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.object({ mo: z.number(), yr: z.number() }),
  featured: z.boolean(),
  // ...
});

export const PricingSchema = z.object({
  ANNOUNCEMENT: z.string(),
  PLANS: z.array(PlanSchema).min(1).max(6),
  TRUST_ITEMS: z.array(TrustItemSchema),
  BOTTOM_CTA: BottomCtaSchema,
  UI: UISchema,
});

export type Pricing = z.infer<typeof PricingSchema>;
```

**Read path:**
```typescript
export async function getPricing(country: SupportedCountry): Promise<Pricing | null> {
  const row = await prisma.landingSection.findUnique({...});
  if (!row) return null;
  const parsed = PricingSchema.safeParse(row.data);
  if (!parsed.success) {
    // log + fall back to static
    console.error("[pricing] invalid DB shape:", parsed.error);
    return null;
  }
  return parsed.data;
}
```

**Write path (partial update):**
```typescript
export async function patchPricingField(
  country: SupportedCountry,
  patch: Partial<Pricing>,
) {
  const existing = await prisma.landingSection.findUnique({...});
  const merged = { ...(existing?.data ?? {}), ...patch };
  const validated = PricingSchema.parse(merged);  // throws if bad
  await prisma.landingSection.upsert({
    where: { country_section: { country, section: "pricing" } },
    create: { country, section: "pricing", data: validated },
    update: { data: validated },
  });
}
```

**التنفيذ (لكل section):**
- [ ] إنشاء Zod schema في `lib/sections/<name>.schema.ts`
- [ ] استبدال `getLandingSectionOverride` بـ `get<SectionName>` المحدد
- [ ] استبدال `upsertLandingSection` للقسم بـ `patch<SectionName>` يقبل partial
- [ ] تحديث الـ admin form ليرسل diff فقط
- [ ] اختبار: حفظ حقل واحد ما يدوس على الباقي
- [ ] commit + push

**ترتيب الـ sections (حسب الألم):**
1. **pricing** — الأكبر والأكثر ألماً
2. **team** — مصفوفات متشعّبة
3. **faq** — مصفوفة Q&A
4. **hero** — متوسط
5. **whyNow** — متوسط
6. **socialProof** — متوسط

**المدة المتوقعة:** يومين لـ pricing، يومين لـ team، يوم لكل واحد من الباقين = ~9 أيام إجمالاً
**المخاطر:** متوسطة — الـ Zod schemas يجب أن تطابق shape الـ DB الفعلي ١٠٠٪، أي خطأ يكسر الصفحة الإنتاج

---

### ☐ Phase 4 — تنظيف وتوحيد

**بعد ما تخلص Phase 1-3:**
- [ ] حذف `STATIC_ONLY_KEYS` و `SETTINGS_ONLY_KEYS` من `lib/landing-sections.ts` (تصير غير مستخدمة)
- [ ] حذف `mergeStaticWithOverrides` و `mergeLandingSeo` (استبدلها Zod merging)
- [ ] الـ static fallback في `landing-sa.ts` و `landing-eg.ts`:
  - يبقى كـ "ultimate fallback" لو DB غير متاح أصلاً
  - لكن لا يُستخدم للـ merge — DB يصير authoritative
- [ ] توثيق نهائي: `docs/CONTENT-MANAGEMENT-GUIDE.md` يشرح كيف يضيف developer جديد section جديد

**المدة المتوقعة:** يوم واحد
**المخاطر:** منخفضة — تنظيف فقط

---

## ٤. مبادئ المرجعية (للالتزام بها في كل phase)

1. **DB هو المصدر الوحيد للـ content.** الـ static fallback = آخر ملاذ فقط (لو DB unreachable).
2. **كل قراءة مُحقَّقة بـ Zod.** أي shape غلط في DB يُكتشف فوراً ويُسجَّل، الصفحة ما تنكسر.
3. **كل كتابة مُحقَّقة بـ Zod.** لا يصل أي shape غلط للـ DB أصلاً.
4. **Partial update ضروري.** أي فورم يحفظ فقط الحقول التي عدّلها، لا يدوس على الباقي.
5. **التغيير في خطوة واحدة لا يكسر مكان آخر.** الـ types من Zod = نقطة truth واحدة لـ form + read + DB.
6. **MongoDB-idiomatic.** نستفيد من embedded subdocuments للـ rich content، ولا نحاول تقليد SQL.

---

## ٥. أسئلة مفتوحة (للنقاش لاحقاً)

- [ ] هل نريد **versioning** للسكشنات (إمكانية الرجوع لنسخة قديمة)؟ — مفيد للأخطاء البشرية
- [ ] هل نريد **draft / published** للسكشنات (مسودة قبل النشر)؟ — مفيد للحملات الموسمية
- [ ] هل نريد **scheduled changes** (تعديل ينطلق بتاريخ محدد)؟ — مفيد لعروض عيد الأضحى وغيرها
- [ ] هل نضيف **audit log** لكل تعديل (من، متى، إيش)؟ — مفيد للحوكمة

---

## ٦. سجل القرارات (Decision Log)

| التاريخ | القرار | السبب |
|---------|--------|-------|
| 2026-05-07 | رفض اقتراح "table per section" | boilerplate ضخم، لا يحلّ السبب الجذري، غير MongoDB-idiomatic |
| 2026-05-07 | اعتماد نهج هجين (CountryProfile + Zod على LandingSection) | يحلّ ٩٠٪ من الألم بـ ١٠٪ من المجهود |
| 2026-05-07 | البدء بـ Phase 1 (Backfill SA) | ROI فوري، صفر مخاطر |

---

## ٧. حالة التقدم

| Phase | الحالة | تاريخ البدء | تاريخ الانتهاء | ملاحظات |
|-------|--------|-------------|----------------|---------|
| 1 — Backfill SA | ☐ pending | — | — | — |
| 2 — CountryProfile | ☐ pending | — | — | يعتمد على Phase 1 |
| 3 — Zod للـ rich sections | ☐ pending | — | — | يعتمد على Phase 2 |
| 4 — تنظيف وتوحيد | ☐ pending | — | — | يعتمد على Phase 3 |

---

## ٨. ملفات مرجعية ذات صلة

- `prisma/schema.prisma` — schema الحالي
- `lib/landing-sections.ts` — read/write للـ LandingSection
- `lib/getLandingContent.ts` — orchestrator يدمج static + DB
- `app/content/landing/landing-sa.ts` — static fallback السعودي
- `app/content/landing/landing-eg.ts` — static fallback المصري
- `app/content/landing/types.ts` — TypeScript types الحالية
- `scripts/inspect-db.mjs` — سكربت فحص DB (يعطي تقرير شامل)
- `app/admin/(dashboard)/components/SeoForm.tsx` — مثال admin form
- `app/actions/landing.ts` — server actions للحفظ
