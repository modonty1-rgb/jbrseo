# SEO Overhaul — Working Log

> **الهدف:** إعادة صياغة كل محتوى الموقع بأقوى keywords للسوق السعودي (organic traffic).
> **المرجعية:** senior SEO expert (10+ سنوات) · target market: السعودية · قنوات: البحث + الذكاء الاصطناعي.
> **القاعدة الذهبية:** لا تعديل قبل قراءة الكود + الـ DB وموافقة صريحة.
>
> **ملف حي — كل ما نلاقيه ينزل هنا. ما ننسى، ما نضيّع.**

**بدء:** 2026-07-10

---

## Phase 0 — تحديد الأدوات

**متاحة:**
- ✅ WebSearch (تقارير SEO علنية · مصادر ٢٠٢٦)
- ✅ Playwright (Google Trends KSA · Google.com.sa SERP · Answer The Public · Ubersuggest المجاني)
- ✅ Read/Grep/MongoDB scripts للـ audit

**غير متاحة الآن:**
- ❌ SEMrush MCP (يحتاج OAuth — Khalid ما عنده حساب)
- ❌ Ahrefs (ما عنده حساب)
- ❌ Search Console MCP
- ❌ Google Trends API مباشر

**Trade-off:** بدون SEMrush/Ahrefs → اتّجاهات دقيقة لكن مو أرقام volume دقيقة. نعتمد على SERP الفعلي + تقارير ٢٠٢٦ العلنية.

---

## Phase 1a — DB Content Inventory

**Source:** `modonty_dev` · run via `scripts/audit-all-content.mjs` · **read-only**

**النتيجة:** `18 LandingSection + 8 Plans + 2 PriceSectionMeta + 1 SiteSettings`

### الـ 18 LandingSection

| # | section | نوعه | Status | ملاحظات |
|:-:|---|---|:-:|---|
| 1 | **seo** | meta title + description | 🔴 SEO-critical | يذكر «جوجل بلا إعلانات» · description محدّث اليوم (يحوي `{clientCount}` placeholder) |
| 2 | **hero** | H1 + H2 + trust bar + trustBarClients | 🔴 SEO-critical | H1 = «ابنِ حضورك على جوجل الحين» · «+١٢٠ شركة سعودية» رقم جامد · `trustBarClients` legacy (نظام جديد يقرأ من مدونتي) |
| 3 | **header** | bannerText | 🟡 support | «منافسك يبني حضوره على جوجل الحين» |
| 4 | **whyNow** | title + subtitle + 3 costs | 🟡 support | narrative تكلفة التأخير |
| 5 | **howItWorks** | 3 steps | 🟡 support | اشترك → استمارة → استلام شهري |
| 6 | **outcomes** | 4 KPIs + badge | 🟡 support | +3700% · 3× · 90 يوم · 60% أقل |
| 7 | **socialProof** | eyebrow + title + 2 testimonials | 🟢 low | ⚠️ subtitle = «تجارب مبكرة» → يوحي بشركة ناشئة |
| 8 | **faq** | 10 Qs | 🔴 SEO-critical | People Also Ask + Featured Snippet potential |
| 9 | **finalCta** | title + subtitle + wa | 🟡 support | «حضور لا وعود» |
| 10 | **footer** | tagline + desc | 🟡 support | «حضور لا وعود» |
| 11 | **ctaLabel** | ctaLabel | ✅ done | «دعنا نبني حضورك» (محدّث اليوم) |
| 12 | **pricing** | legacy JSON PLANS | 🟠 duplicate | نفس محتوى Plan model — نتجاهله |
| 13 | **pricingPage** | title + description + h1 + intro | 🔴 SEO-critical | صفحة تحويل تجارية |
| 14 | **team** | 12 members | 🟢 low | أسماء + أدوار — لا تلمس |
| 15 | **about** | 15+ fields (mission · story · values · fitFor · legalInfo · cta) | 🔴 SEO-critical | صفحة كاملة |
| 16 | **privacy** | legal | 🟢 leave | قانوني — لا تلمس |
| 17 | **terms** | legal | 🟢 leave | قانوني — لا تلمس |
| 18 | **socialLinks** | URLs | 🟢 leave | لا نص |

### الـ 8 Plans (Plan model)

**per country (SA + EG) × 4 tiers:** presence · starter · growth · scale

| حقل | SEO-critical? | ملاحظات |
|---|:-:|---|
| `name` | 🟢 | حضور · الانطلاقة · الزخم · الريادة |
| `tagline` | 🟡 | تعريف الباقة — يظهر في card |
| `hook` | 🟡 | يظهر بجانب السعر |
| `articlesLabel` | 🟢 | 1 مقال · 4 مقالات · 8 مقالات · 12 مقال |
| `ctaText` | ✅ done | «ابدأ بـ{اسم الباقة}» (محدّث اليوم) |
| `highlights[]` | 🟡 | 6 مزايا لكل باقة — يستحق تحسين |

### الـ 2 PriceSectionMeta (SA + EG)

| حقل | SEO-critical? | ملاحظات |
|---|:-:|---|
| `announcement` | 🟡 | إعلان أعلى الأسعار |
| `ctaHeadline` | 🟡 | «منافسك ينشر الحين — وأنت؟» |
| `ctaSubheadline` | 🟡 | «+١٢٠ نشاط تجاري…» — رقم جامد |
| `trustItems[]` | 🟢 | icons + labels |
| `uiStrings` | 🟢 | ~30 مصطلح UI — لا SEO impact |

---

## Phase 1b — Hardcoded Content in Code

| Path | ماذا | حرج؟ |
|---|---|:-:|
| `app/[country]/(marketingShell)/page.tsx:30` | `HOME_SA_DESCRIPTION_FALLBACK` — meta description لو DB فارغ | 🔴 |
| `app/features/page.tsx:11-13` | `TITLE` + `DESCRIPTION` — صفحة /features كاملة | 🔴 |
| `app/[country]/(marketingShell)/pricing/page.tsx:23-26` | `SA_PRICING_TITLE_ABSOLUTE` + `SA_PRICING_DESCRIPTION` | 🔴 |
| `app/[country]/(marketingShell)/pricing/page.tsx:28-34` | `PRICING_PAGE_FALLBACK` (title, description, h1, intro) | 🔴 |
| `app/[country]/signup/page.tsx` | يستخدم `cta: p.ctaText \|\| "ابدأ الحين"` | 🟡 |
| `app/content/landing.ts` | ثابت `cta: "ابدأ الآن"` × 4 | 🟢 |

**قاعدة:** بعد الـ overhaul، fallbacks الكود لازم تكون **متوافقة** مع نمط الـ DB الجديد.

---

## Phase 1c — اكتشافات مهمة (issues + insights)

### أخطاء واقعية

1. **`socialProof.subtitle` = «تجارب مبكرة من شركات آمنت بالفكرة من الأول»**
   يوحي إن JBRSEO/مدونتي (شركة جبر الجنوبية) ناشئة (early stage) → يقلّل الثقة عند العميل السعودي (يفضّل شركة راسخة).

2. **hero.proof = «+١٢٠ شركة سعودية بدأت تجيب عملاء…»**
   رقم **جامد** — يتقادم. نفس مشكلة `{clientCount}` اللي حللناها في SEO description. لازم يستخدم template.

3. **PriceSectionMeta.ctaSubheadline = «+١٢٠ نشاط تجاري…»**
   نفس المشكلة — رقم جامد ثاني.

### مخاطر SEO

4. **الـ hero يذكر «جوجل» ٣ مرات في الصفحة الرئيسية:**
   - h1Line1: «ابنِ حضورك على جوجل الحين»
   - sub: «فريقنا يكتب محتوى سيو احترافي… جوجل يجيبلك عملاء»
   - proof: «بدأت تجيب عملاء من جوجل»
   Khalid طلب توسيع المحتوى ليشمل «البحث + الذكاء الاصطناعي» — عنده حق (SEO 2026 = AEO + GEO).

5. **الـ hero.trust يذكر «١٤ يوم ضمان استرجاع»** بينما `faq` يذكر نفس الشي — تكرار OK، لكن نتأكد إن جميع الوعود موحّدة.

6. **الـ H1 في hero = سطران** (h1Line1 + h1Line2):
   - "ابنِ حضورك على جوجل الحين"
   - "بدون إعلانات • بدون فريق داخلي"
   الـ h1Line2 مو H1 حقيقي — يشتّت التركيز. يوصى بـ H1 واحد قوي.

7. **الـ FAQ ما فيه schema.org FAQ markup** (يحتاج فحص) — Featured Snippet potential مفقود.

### تكرار في الـ DB

8. **`LandingSection.section="pricing"` مكرّر مع Plan model** — نفس المحتوى (name, price, cta, highlights). الـ pricing section يمكن حذفه/تجاهله.

9. **`hero.trustBarClients` legacy** — قسم Trust الجديد يقرأ من مدونتي مباشرة. الحقل موجود في DB لكن مو مستخدم في الكود بعد الـ refactor اليوم.

### ما تم اليوم (background)

10. **الـ CTA موحّد:** «دعنا نبني حضورك» — من `DEFAULT_CTA_LABEL` in `lib/site-settings.types.ts`
11. **الـ Plans ctaText:** «ابدأ بـ{اسم الباقة}» لكل باقة
12. **الـ SEO description:** template مع `{clientCount}` — interpolates live

---

## Phase 2 — SEO Research (COMPLETED)

### 2a — WebSearch: صناعة SEO في السعودية ٢٠٢٦

**المصادر:**
- [Semrush KSA agencies list](https://agencies.semrush.com/list/seo/saudi-arabia/)
- [Clutch.co KSA rankings](https://clutch.co/sa/seo-firms)
- [Digital Wasfa 2026 report](https://digitalwasfa.com/top-7-seo-strategies-that-work-for-saudi-arabia-businesses-in-2026/)
- [Ijjad AEO Saudi playbook](https://www.ijjad.com/answer-engine-optimization-for-jordan-saudi-businesses)

**نتائج جوهرية:**

**A. حجم السوق + التسعير:**
- شركات السيو السعودية تتقاضى ١,٧٠٠–٧,٧٠٠ ريال/شهر
- **مقارنة JBRSEO:** starter 499 ريال · growth 1,299 · scale 2,999
- **الاستنتاج:** JBRSEO **دراماتيكياً أرخص** — نقطة بيع قوية (خصوصاً مع باقة `presence` 110 ريال — ما فيه منافس بهذا السعر)

**B. سعر المقال الواحد عند المنافسين:**
- بعض المنافسين يبيعون مقال واحد بـ 950 ريال (253$)
- **JBRSEO growth:** 8 مقالات بـ 1,299 ريال = **~162 ريال/مقال** = **٦× أرخص**

**C. GCC AI Engine Mix (٢٠٢٦):**
| Engine | Share |
|---|---|
| ChatGPT | 42% |
| Google AI Overviews | 28% |
| Perplexity | 14% |
| Gemini | 9% |
| Claude | 7% |

**D. الفارق الحرج: 70٪ من البحث اليومي يحدث خارج جوجل التقليدي** (YouTube · ChatGPT · TikTok)
→ الرسالة الحالية «جوجل جوجل جوجل» فاتها هذا التحوّل

**E. 8 تعديلات إقليمية للـ AEO في السعودية:**
1. محتوى ثنائي (عربي + إنجليزي)
2. تنسيق البحث الصوتي
3. ذكر Mada / STC Pay / HyperPay كـ entity signals
4. سياق Vision 2030
5. الامتثال لـ ZATCA
6. تخطيط ذكي لموسم رمضان
7. ذكر المنافسين المحليين بالاسم
8. صفحات للمدن (الرياض · جدة · الدمام)

**F. الفرصة المهمَلة:** Arabic FAQ + Arabic Google Business Profile + Arabic LocalBusiness schema — قلّة المنافسين يعملونها

---

### 2b — Playwright SERP: `خدمات سيو في السعودية` (Google.com.sa)

**السنابشوت:** `.playwright-mcp/serp-khadamat-seo.md`

**Top-Of-SERP: Google AI Overview** (نبذة باستخدام الذكاء الاصطناعي)
- يستشهد بـ `masardigital.com.sa`
- يقسّم خدمات السيو إلى ٣ أنواع: **تقني · داخلي · خارجي**
- يعرض جدول: نوع الخدمة × الهدف × المدة الزمنية (١–٢ شهر للتقني)
- **الاستنتاج:** لو المحتوى يتّبع نفس التصنيف (٣ أنواع + جدول) → فرصة يستشهد بنا الـ AI Overview

**Top-10 Organic Results:**
| # | Domain | Title Pattern |
|:-:|---|---|
| 1 | `is.net.sa` | أفضل شركة سيو (SEO) في السعودية **لتصدر نتائج البحث** \| IS |
| 2 | `serajj.sa` | أفضل شركة سيو في السعودية: **دليلك الشامل** لاختيار شركة SEO |
| 3 | `masardigital.com.sa` | خدمة تحسين محركات البحث SEO \| **اطلب تحليل مجاني لموقعك الآن** |
| 4 | `swaed.sa` | **أفضل** شركة سيو في السعودية |
| 5 | `wizfreelance.com` | **أفضل** شركة سيو في السعودية |
| 6 | `itc.com.sa` | خدمة تحسين محركات البحث (SEO) في السعودية **والخليج** |
| 7 | `almasader.sa` | **افضل** شركة سيو في السعودية |
| 8 | `fkretk.com` | **أفضل** شركة سيو في السعودية **لعام 2026** \| خدمات SEO احترافية |
| 9 | `pajill.com` | **أفضل** شركة سيو في السعودية \| خدمات SEO **للشركات والمتاجر** |

**أنماط مشتركة (patterns تكرّرت):**
- **٨/٩ يبدأون بـ "أفضل"** — الكلمة السحرية للسوق السعودي (يفضّل الأفضل)
- **٧/٩ يستخدمون "شركة"** (مو "خدمة") — كلمة أقوى في السوق السعودي
- **"في السعودية"** (مو "بالسعودية") — الصياغة الصحيحة (كل النتائج)
- **٣/٩ يذكرون سنة (2026)** — freshness signal
- **٢/٩ يذكرون جمهورين (شركات + متاجر)** — تخصيص
- **CTAs:** «تحليل مجاني» · «دليلك الشامل» · «لتصدر البحث»

**Related searches (نمو):**
- أفضل شركة سيو في السعودية
- افضل شركة سيو
- شركات seo في مصر

**People Also Ask:** يظهر ("أسئلة أخرى") — فرصة FAQ schema

---

### 2c — Google Trends KSA + 2d — Answer The Public

**قرار (توفير وقت):** Data من Phase 2a + 2b كافية لصياغة استراتيجية قوية. Google Trends + AtP نستخدمها لو احتجنا تدقيق keyword معيّن لاحقاً.

---

### Keywords النهائية (بعد التحليل)

**🎯 Primary target (H1 + Title):**
- `أفضل شركة سيو في السعودية` — SERP-dominant
- `خدمات سيو في السعودية` — commercial intent
- `شركة سيو للشركات والمتاجر` — audience-scoped

**🎯 Product-specific (JBRSEO unique):**
- `اشتراك سيو شهري` — differentiator (منافسين ما عندهم)
- `كتابة محتوى سيو` — service description
- `مقالات سيو احترافية شهرية` — long-tail
- `سيو + ذكاء اصطناعي` — 2026 differentiator

**🎯 AEO/GEO (النية الجديدة):**
- `الظهور في ChatGPT` — trending
- `تحسين محركات الذكاء الاصطناعي`
- `AEO بالعربي`
- `محتوى يستشهد به ChatGPT`

**🎯 Local (Vision 2030 aligned):**
- `شركة سيو الرياض / جدة / الدمام`
- `سيو للأنشطة السعودية`
- `سيو للعيادات / المتاجر / الشركات`

**🎯 Informational (FAQ + PAA):**
- `كيف أظهر في جوجل`
- `كم يكلف السيو في السعودية`
- `متى أشوف نتائج السيو`
- `ما الفرق بين السيو الداخلي والخارجي`
- `كيف أبني حضور رقمي`

---

## Phase 3 — Content Strategy (READY FOR APPROVAL)

### ٣ ركائز رسالية (3 messaging pillars)

بعد تحليل السوق، القصة تُبنى على ٣ ركائز — كل قطعة محتوى في الموقع تخدم واحدة على الأقل:

**١. الاشتراك (Subscription differentiator)**
- المنافسون يبيعون **مقال واحد بـ 950 ريال**. JBRSEO **اشتراك شهري من 110 ريال**.
- Frame: «توقّف تدفع لكل مقال — اشترك واسترح»
- Keywords: `اشتراك سيو شهري` · `مقالات سيو شهرية` · `سيو بالاشتراك`

**٢. البحث + الذكاء الاصطناعي (2026 dual channel)**
- 70٪ من البحث اليومي خارج جوجل التقليدي (ChatGPT 42٪ · AI Overviews 28٪)
- Frame: «نظهرك في محركات البحث والذكاء الاصطناعي»
- Keywords: `AEO بالعربي` · `الظهور في ChatGPT` · `سيو للذكاء الاصطناعي`

**٣. الشراكة السعودية الطويلة (Local trust)**
- سياق Vision 2030 · دفع Mada/STC Pay · محتوى عربي فصيح + سعودي
- Frame: «شركاء سعوديون يفهمون سوقك»
- Keywords: `شركة سيو سعودية` · `سيو للشركات السعودية` · `سيو الرياض/جدة`

---

### Keyword Mapping (كل قسم → keyword رئيسي)

| Section | Primary Keyword | Secondary |
|---|---|---|
| `seo` (title/desc) | أفضل شركة سيو في السعودية | اشتراك محتوى شهري · للبحث والذكاء الاصطناعي |
| `hero` H1 | اشتراك محتوى سيو شهري للسوق السعودي | للبحث والذكاء الاصطناعي |
| `hero` sub | فريق سيو سعودي محترف | كتابة + نشر + تحسين |
| `whyNow` | تكلفة تأخير السيو | فرص ضائعة كل شهر |
| `howItWorks` | كيف يعمل اشتراك السيو | 3 خطوات · اشترك · استلم |
| `outcomes` | نتائج السيو الحقيقية | زيارات عضوية · عملاء مؤهّلون |
| `faq` (10 Qs) | (كل سؤال ← keyword منفصل — PAA optimization) | see below |
| `finalCta` | ابدأ حضورك الرقمي في السعودية | — |
| `pricingPage` | أسعار خدمات سيو في السعودية | اشتراك شهري من 110 ريال |
| `Plans` (per plan tagline+hook) | (per tier: presence · انطلاقة · زخم · ريادة) | — |

---

### 🔴 Tier 1 — جدول «قبل / بعد» (SEO-critical fields)

#### 1. `LandingSection.section="seo"` — meta title + description

**قبل (title):**
```
خدمات سيو بالسعودية — أحصل علي عملاء من جوجل بلا إعلانات
```

**بعد (title) — الخيار الأول (recommended):**
```
أفضل شركة سيو في السعودية · اشتراك محتوى شهري للبحث و AI | JBRSEO
```

**بعد — البدائل:**
- «شركة سيو للشركات والمتاجر في السعودية · اشتراك شهري من 110 ريال | JBRSEO»
- «اشتراك سيو شهري احترافي · للبحث والذكاء الاصطناعي في السعودية | JBRSEO»

**قبل (description):**
```
محتوى شهري احترافي يبني حضورك في محركات البحث والذكاء الاصطناعي. {clientCount} علامة تجارية تعتمد علينا لصناعة حضورها الرقمي.
```

**بعد (description) — تعديل طفيف:**
```
اشتراك محتوى سيو شهري للسوق السعودي — نكتب وننشر ونحسّن للبحث والذكاء الاصطناعي. {clientCount} علامة تجارية تعتمد علينا.
```

**Rationale:** يبدأ بالكلمة المفتاحية · يذكر المنتج (اشتراك) · يحدّد السوق (السعودي) · فعل نشط (نكتب/ننشر/نحسّن) · يذكر AI · social proof

---

#### 2. `LandingSection.section="hero"` — H1 + H2 + sub

**قبل:**
```
h1Line1: "ابنِ حضورك على جوجل الحين"
h1Line2: "بدون إعلانات • بدون فريق داخلي"
sub:     "فريقنا يكتب محتوى سيو احترافي ينشر على موقعك — جوجل يجيبلك عملاء جاهزين للشراء كل يوم وأنت ما تتعب في شيء."
proof:   "+١٢٠ شركة سعودية بدأت تجيب عملاء من جوجل — امتى دورك؟"
```

**بعد — الخيار الأول (recommended):**
```
h1Line1: "شركاء سعوديون في البحث والذكاء الاصطناعي"
h1Line2: "اشتراك محتوى شهري · بدون إعلانات · بدون فريق داخلي"
sub:     "فريق سعودي يكتب وينشر ويحسّن محتواك للبحث و ChatGPT و Perplexity — أنت تركّز على البيع."
proof:   "{clientCount} علامة تجارية سعودية تنمو معنا — امتى دورك؟"
```

**بعد — البديل الأقصر:**
```
h1Line1: "اشتراك محتوى سيو شهري للسوق السعودي"
h1Line2: "للبحث والذكاء الاصطناعي · بدون إعلانات"
sub:     "نكتب، ننشر، ونحسّن محتواك في جوجل و ChatGPT — {clientCount} علامة تجارية تعتمد علينا."
proof:   "من الرياض إلى الدمام — علامات تجارية تنمو معنا كل شهر"
```

**Rationale:**
- H1 يستهدف keyword قوي (اشتراك سيو شهري)
- يذكر AI صراحة → differentiation
- الـ proof يستخدم `{clientCount}` بدل رقم جامد
- «شركاء سعوديون» يبني الثقة المحلية

---

#### 3. `LandingSection.section="faq"` — 10 Qs (PAA optimization)

**التحسينات (نعيد صياغة الأسئلة لتطابق ما يبحث عنه الناس فعلاً):**

| # | قبل | بعد | لماذا |
|:-:|---|---|---|
| 1 | «كم يستغرق ظهور النتائج؟» | **«متى أشوف نتائج السيو؟»** | يطابق pattern الـ PAA السعودي |
| 2 | «ماذا يشمل الاشتراك؟» | **«ماذا يشمل اشتراك السيو الشهري؟»** | يضيف keyword «اشتراك سيو شهري» |
| 3 | «هل يمكنني الإلغاء أو التعديل لاحقاً؟» | **«هل يمكنني إلغاء اشتراك السيو أو تعديله؟»** | نفس المعلومة + keyword |
| 4 | «لمن تقدم هذه الخدمة؟» | **«لمن تناسب خدمات سيو JBRSEO؟ (شركات · متاجر · عيادات)»** | يطابق البحث + entity tags |
| 5 | «كيف يكون السعر؟» | **«كم تكلفة السيو في السعودية؟ (خطط من 110 ريال)»** | PAA + سعر لجذب Featured Snippet |
| 6 | «أبي أرقّي خطتي أو أنزّلها…» | (يبقى) | مرن OK |
| 7 | «لو قررت أوقف الاشتراك — وش يصير بمحتواي؟» | (يبقى) | ownership signal — trust |
| 8 | «هل يوجد التزام طويل المدى؟» | (يبقى) | نص فيه «6 أشهر مجانية» — قيم |
| 9 | «كيف يتم تجهيز المقالات؟» | **«كيف يعمل اشتراك المحتوى الشهري؟ (٣ خطوات)»** | matches "كيف يعمل" pattern |
| 10 | «هل الخدمة مناسبة للنشاطات السعودية والخليجية؟» | **«هل خدمة السيو مناسبة للسوق السعودي والخليجي؟»** | keyword |

**سؤال جديد يُقترح (NEW #11):**
> **«كيف يظهر موقعي في ChatGPT و Perplexity؟»**
> — يستهدف AEO keyword جديد + entity signals + featured snippet potential

---

#### 4. `LandingSection.section="pricingPage"` — title + description + h1 + intro

**قبل:**
```
title:       (empty — يستخدم fallback من كود)
description: (empty — يستخدم fallback من كود)
```

**بعد (DB values):**
```
title:       "أسعار خدمات السيو في السعودية · اشتراك شهري من 110 ريال | JBRSEO"
description: "اختر خطة اشتراك سيو شهري تناسب نشاطك — من الحضور إلى الريادة. جميع الخطط تشمل كتابة ونشر وتحسين للبحث والذكاء الاصطناعي."
h1:          "خطط اشتراك السيو الشهري"
intro:       "٤ خطط شهرية بدون التزام طويل. الاشتراك السنوي = ٦ أشهر مجانية."
```

---

#### 5. Code fallbacks (3 files)

**`app/[country]/(marketingShell)/page.tsx:30`:**
```ts
// قبل:
const HOME_SA_DESCRIPTION_FALLBACK =
  "مدونتي — منصة المحتوى العربي. مقالات تتصدر جوجل، صفحة شركتك في الشبكة، وقاعدة Leads مصنّفة — بدون كتابة حرف واحد. ابدأ مجاناً بدون بطاقة ائتمان.";

// بعد:
const HOME_SA_DESCRIPTION_FALLBACK =
  "اشتراك محتوى سيو شهري للسوق السعودي — نكتب وننشر ونحسّن للبحث والذكاء الاصطناعي. من 110 ريال شهرياً.";
```

**`app/features/page.tsx:11-13`:**
```ts
// قبل:
const TITLE = "كل المزايا — مدوّنتي";
const DESCRIPTION = "الدليل الكامل لكل ما تحصل عليه: لوحة التحكم، صفحتك العامة، مقالاتك، التصاميم والإنتاج، 23 تنبيه تيليجرام، وأسعار الباقات.";

// بعد:
const TITLE = "مزايا اشتراك السيو الشهري | JBRSEO";
const DESCRIPTION = "كل ما تحصل عليه في اشتراك JBRSEO الشهري: كتابة محتوى سيو + نشر + تحسين للبحث والذكاء الاصطناعي + لوحة تحكم + تنبيهات فورية.";
```

**`app/[country]/(marketingShell)/pricing/page.tsx:23-26`:**
```ts
// قبل:
const SA_PRICING_TITLE_ABSOLUTE = "أسعار خدمة السيو العربي — اختر خطتك وابدأ | مدونتي";
const SA_PRICING_DESCRIPTION = "اكتشف خطط أسعار مدونتي لخدمة السيو بالعربي…";

// بعد:
const SA_PRICING_TITLE_ABSOLUTE = "أسعار خدمات سيو في السعودية · اشتراك شهري من 110 ريال | JBRSEO";
const SA_PRICING_DESCRIPTION = "خطط اشتراك سيو شهري للشركات والمتاجر السعودية — نكتب وننشر ونحسّن للبحث و ChatGPT. اختر خطتك وابدأ.";
```

---

### 🟡 Tier 2 — بعد Tier 1 (draft ready if approved)

- `whyNow` — إعادة صياغة لتكلفة التأخير مع لمحة عن التخلّف عن AI
- `howItWorks` — 3 خطوات، إضافة sub «تحسين للبحث + AI»
- `outcomes` — الرقم `+٣٧٠٠٪` جامد — يحتاج تحويل template أو حذف
- `finalCta` — استبدال «حضور لا وعود» بـ CTA أقوى تحويلي
- `footer` — نفس فكرة `finalCta`
- `plans` × 8 — تحسين `tagline` + `hook` per plan

---

### 🟢 Tier 3 — Optional (later)

- `team` · `about` · `privacy` · `terms` — لا حاجة الآن

---

## Phase 4 — Execute (waiting approval)

### الترتيب المقترح للتنفيذ

**Step 1 — DB (Tier 1):**
- سكربت واحد يحدّث ٤ حقول DB في dev فقط:
  1. `LandingSection.section="seo"` → title + description جديد
  2. `LandingSection.section="hero"` → h1Line1/h1Line2/sub/proof
  3. `LandingSection.section="faq"` → 10 أسئلة معاد صياغتها + سؤال ChatGPT
  4. `LandingSection.section="pricingPage"` → title/description/h1/intro
- **safety guard:** يرفض التشغيل لو DB ≠ modonty_dev

**Step 2 — Code fallbacks (3 files):**
- تحديث الـ 3 fallback strings في:
  - `app/[country]/(marketingShell)/page.tsx:30`
  - `app/features/page.tsx:11-13`
  - `app/[country]/(marketingShell)/pricing/page.tsx:23-26`

**Step 3 — Verify:**
- Playwright: افتح `localhost:3000/sa` → التقاط snapshot
- تحقّق H1 + meta description + FAQ + pricing title
- كل التبويبات تعرض المحتوى الجديد

**Step 4 — Log:**
- تحديث `SESSION-LOG.md` + هذا الـ SEO-OVERHAUL-LOG بما تم

### بعد Tier 1 → Tier 2 (إذا وافق)

- سكربت ثانٍ لتحديث `whyNow`, `howItWorks`, `outcomes`, `finalCta`, `footer`, `Plans × 8`
- Verify نفس الطريقة

### Prod DB parity

- الـ dev DB جاهزة بعد Step 1. لتطبيقها على prod:
  1. أضف `MODONTY_PROD_DATABASE_URL` في Vercel (لو ما كان)
  2. عدّل السكربتات — احذف الـ safety guard (بعد review)، أو استخدم `/admin` UI مباشرة

---

## Open Decisions (تحتاج قرار Khalid)

1. **نطاق الشغل:** Tier 1 كامل (٥ حقول) أم `seo + hero + faq` فقط؟
2. **AEO/GEO:** نستهدف الظهور في ChatGPT/Perplexity كـ target قناة، أم نركّز على Google فقط؟
3. **الـ dynamic numbers:** نبني template pattern (زي `{clientCount}`) لباقي الأرقام الجامدة (`+١٢٠ شركة`، `+٣٧٠٠٪`)؟
4. **الـ H1 في hero:** نوحّده في سطر واحد قوي أم نبقيه سطرين؟

---

## Log — تحديثات اليوم

| ساعة | ماذا | ملاحظة |
|---|---|---|
| Phase 0 | اتفاق أدوات | بدون SEMrush/Ahrefs — WebSearch + Playwright + audit مباشر |
| Phase 1a | audit الـ DB | 18 sections + 8 plans + 2 meta — 932 سطر محتوى موثّق في `scratchpad/content-inventory.txt` |
| Phase 1b | grep الكود | 3 hardcoded fallbacks حرجة |
| Phase 1c | كشف 12 issue | 3 أرقام جامدة + 3 مخاطر SEO + تكرار في الـ DB |
| **الحين** | **إنشاء هذا الـ log** | جاهز للاستمرار |

---

## Next Step

**⏸️ متوقّف بانتظار قرار Khalid** على الـ 4 open decisions أعلاه.
بعد القرار → Phase 2 (SEO research).
