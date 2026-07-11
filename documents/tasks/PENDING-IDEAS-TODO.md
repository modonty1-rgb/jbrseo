# Pending Ideas / TODO — jbrseo.com

> Append-only. Newest at top.

---

## 2026-07-10 — Looker Studio · قبل الـ Production Push

- [ ] **تعديل تقرير Looker Studio ليطابق Impact Bar** — الأرقام الحين مختلفة (شريطنا SINCE=2025-01-01 بينما Looker افتراضي "last 12 months"). لو العميل ضغط زر Google شاف أرقام أقل من شريطنا = فقدان مصداقية. الخطوات الكاملة موثّقة في [`LOOKER-STUDIO-SETUP.md`](./LOOKER-STUDIO-SETUP.md) — ٧ خطوات · دقيقتان · يحتاج حساب Google المالك للتقرير.

---

## 2026-06-15 — Post `/preview` → `/sa` migration

- [ ] **نقل ملفات `app/preview/[country]/*.tsx` إلى موقعها النهائي** — `app/[country]/(marketingShell)/_components/` مع إزالة prefix `Preview` (مثل `PreviewNavbar` → `Navbar`). حالياً الـ /sa والـ /eg يستوردون من مسار `/preview/...` وهذا غير سليم على المدى الطويل.

- [ ] **حذف مجلد `app/preview/`** — بعد نقل الملفات. خلاص ما له داعي.

- [ ] **بناء صفحة `/features` جديدة** — حالياً الـ nav يشير `/features` لكن الصفحة قديمة. مهم لأن تقرير Hotjar أبلغ rage clicks في `/features` (المستخدمون لقوا `<label>` بدون handler).

- [ ] **بناء signup form جديد** — `/signup` لازم يتحسن مع الـ design system الجديد.

- [ ] **حذف المكونات القديمة من landing** — بعد نقل /preview، المكونات القديمة (Hero, HowItWorks, Outcomes, SocialProof, TeamSection, FAQ, FinalCTA, StickyMobileCTA, ExitIntentPopup, LandingHeader، إلخ) في `app/components/landing/` صارت ميتة (إلا اللي يستخدمها /pricing مثل LandingHeader). نتأكد من callers قبل الحذف.

- [ ] **إضافة `aria-labelledby` + stable `id` على sections** — Hotjar #5: الـ DOM دلالي لكن sections كثيرة بدون `id` ثابت لـ analytics + a11y.

- [ ] **إصلاح metadata الـ /eg** — العنوان الحالي للـ /eg يطلع "خدمات سيو بالسعودية..." (نفس الـ /sa) — يحتاج EG-specific copy في الـ DB seo override.

- [ ] **DB content fix**:
  - `howItWorks.steps[1].title = "استمارة استقبال 1"` — في "1" زيادة، تصلحه من admin

---

## 2026-06-14

- [ ] **FloatingContact (زر WhatsApp عائم)** — موجود في `/sa` وغير منقول لـ `/preview`. زر دائري ٥٦px (لون `#25D366`) يطل بعد scroll ≥ ٢٠٠px، الزاوية اليسرى السفلى. **شرط:** ما يصدم مع StickyMobileCTA على الموبايل (نسّق الـ z-index والـ bottom offsets).

- [ ] **LandingJsonLd (SEO structured data)** — موجود في `/sa` بـ Organization + FAQPage + BreadcrumbList JSON-LD، غير منقول لـ `/preview`. مهم لـ Google rich snippets. غير مرئي (zero visual). يستحق ينضاف قبل ما `/preview` يستبدل `/sa`.

- [ ] **StickyMobileCTA** — شريط ثابت أسفل شاشة الموبايل، زر WhatsApp + زر signup. ينظهر بعد scroll ≥ ١٠٠px. مهم لأن ٧٠٪+ من ترافيك المنطقة موبايل و الـ CTA الرئيسي يختفي مع scroll.

- [ ] **ExitIntentPopup** — modal يطل عند خروج الزائر (mouse leave على desktop / scroll up سريع على موبايل) مع عرض/تخفيض. يصطاد الزائر المتردد. **يحتاج logic + اختبار حقيقي قبل الاعتماد** (ممكن يزعج لو timing غلط).

- [ ] **حذف outcomes section بالكامل** — ما موجود في `/preview` الجديد (الـ `id="outcomes"` مجرد anchor على whyNow). يشمل:
  - `app/admin/(dashboard)/content/OutcomesSectionForm.tsx`
  - `updateOutcomesSection` action في `app/actions/content-sections.ts`
  - case في `app/admin/(dashboard)/content/[section]/page.tsx`
  - entry في `SECTIONS_NAV_ITEMS` (`_config.ts`)
  - مفاتيح من `CONTENT_KEYS` (action + page)
  - النوع `outcomes` في `StaticLanding` type (لو ما في مكون قديم بيستخدمه)
  - DB row للـ section `"outcomes"` في `LandingSection`
  - **شرط:** بعد ما `/sa` و `/eg` القديمين يتحذفوا أو يتحولوا على `/preview`
