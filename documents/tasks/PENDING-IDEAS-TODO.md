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

- [ ] **🔴 تحقّق: قسم الريلز في مدونتي (معلَن قبل الإطلاق)** — أُضيف بند «فيديوهاتك في قسم الريلز على مدونتي» لباقتَي **الزخم** و**الريادة** في `lib/plan-card-content.ts` بتاريخ 2026-08-11، والقسم **لم يكن مُطلقاً بعد** — خالد قال يشتغل خلال يومين، وقرّر نشر البند الآن بعد ما نُبّه أنه وعد على صفحة يُدفع منها.
  - **الموعد المتوقع:** 2026-08-13.
  - **لو تأخّر:** احذف البندين معاً (معلَّمان بتعليق `⚠️ Announced ahead of launch` في نفس الملف).
  - **لو أُطلق:** احذف هذا البند من القائمة وأزل تعليق التحذير من الكود.

- [ ] **🟡 تعارض رقمي: «فيديو شهرياً» في القاعدة مقابل «طلّات» في الكرت** — رُصد 2026-08-11 أثناء مراجعة قسم الأسعار.
  - **القاعدة** (`Plan.highlights`): الزخم «٢ فيديو شهرياً (بدل ١)» · الريادة «٣ فيديو شهرياً (بدل ٢)» · الانطلاقة «١ فيديو شهرياً».
  - **الكرت** (`lib/plan-card-content.ts` → `reelsPerMonth`): الانطلاقة ٤ · الزخم ٨ · الريادة ١٢ طلّة شهرياً.
  - **المشكلة:** لو «الطلّة» تشمل فيديو، فالصفحة الواحدة تعطي رقمين مختلفين لنفس الشي (٢ مقابل ٨). العميل يقدر يستشهد بأيّهما.
  - **الحل المطلوب — قرار خالد:** (أ) توحيد الرقمين · (ب) توضيح أن الطلّة (صورة **أو** فيديو) غير الفيديو المُنتَج، وفصل الرقمين صراحةً في النصّين.
  - **حيث تُعدَّل:** أرقام الطلّات في `lib/plan-card-content.ts`؛ نص الفيديو في `Plan.highlights` بقاعدة البيانات (يحتاج سكربت dev + prod).

- [ ] **🟢 تكرار التسليم لـ«تقرير شامل لموقعك»** — بند الريادة في `lib/plan-card-content.ts` ما يذكر كل متى يُسلَّم التقرير (مرة عند الاشتراك؟ شهري؟). تُرك بلا تحديد عمداً حتى يقرّر خالد.

- [ ] **🟡 حقول `finalCta` غير مستخدمة في القاعدة** — رُصد 2026-08-11 أثناء مراجعة قسم الـ Final CTA.
  - `FinalCtaSection.tsx` يقرأ `title1` · `title2` · `subtitle` · `wa` فقط. ثلاثة حقول مكتوبة في القاعدة ومهملة:
  - **`eyebrow`** = «احجز مكانك قبل ما المنافسة تزيد» — نصّ جاهز بلا مكان يعرضه. إمّا يُعرض أو يُحذف من القاعدة.
  - **`seats`** = `{ total: 150, taken: 90 }` — عدّاد مقاعد. **لم يُستخدم عمداً:** رقم ثابت في القاعدة يُعرض كـ«ندرة» هو ادّعاء غير قابل للتحقّق، وأول زائر يرجع بعد أسبوع يلقاه ما تحرّك. لو يُراد فعلاً، لازم يُشتقّ من عدد اشتراكات حقيقي.
  - **`benefits`** = `["من غير بطاقة ائتمان", "ضمان استرداد ١٤ يوم"]` — **الأول كاذب** (الـ checkout يطلب بطاقة)، والثاني يُسقط شرط السياسة الحقيقي «لو ما فعّلنا حسابك». استُبدلا بـ`hero.trust[0]` حرفياً. **يُفضَّل حذف المصفوفة من القاعدة** حتى لا يعيد أحد استخدامها لاحقاً.
