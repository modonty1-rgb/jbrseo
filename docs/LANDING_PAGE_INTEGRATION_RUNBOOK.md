# How to Integrate Modonty Into the Current Landing Page (Senior Runbook)

**Input:** [LANDING_PAGE_CLEAN_PLAN.md](./LANDING_PAGE_CLEAN_PLAN.md)  
**Target:** [app/content/home.ts](app/content/home.ts) — single source of truth. Components stay as-is unless a new block is needed.

---

## Order of Work

Do edits in this order so the page story stays consistent and you can verify section by section.

1. Hero  
2. Services  
3. Pricing  
4. Features  
5. About  
6. BEM  
7. Contact / Final CTA (copy only; no form change)

---

## Step 1 — Hero (`hero`)

**File:** `app/content/home.ts`

| Key | Current | New (integrate Modonty) |
|-----|---------|--------------------------|
| `eyebrow` | شراكة تسويقية مستدامة | الوكيل الحصري لمدونتي في السعودية |
| `title` | دع عملاءك يطرقون بابك | (keep or) دع عملاءك يطرقون بابك — محتوى جاهز، لا كتابة |
| `body` | نبني أصولاً رقمية... | نبني أصولاً رقمية تخلق تدفقاً ثابتاً من العملاء. عبر «مدونتي» تحصل على مقالات شهرية محسّنة لـ SEO تنشر على منصة قوية وتربط بموقعك. ادفع 12 شهراً واحصل على 18 شهراً تسليم. |
| `pills[0]` | أصول رقمية دائمة / قنوات... | ادفع 12، احصل على 18 / 6 أشهر إضافية مجاناً |
| `pills[1]` | تحسين مستمر / مراجعة... | (keep) تحسين مستمر / مراجعة أداء وتعديلات دورية |
| `pills[2]` | رؤية قائمة على الأرقام... | (keep) رؤية قائمة على الأرقام / قرارات مبنية على data |
| `cta` | احجز استشارتك الآن | (keep) |
| `ctaSub` | جلسة استكشاف مجانية... | (keep) |

**Check:** Hero shows "الوكيل الحصري لمدونتي" and "ادفع 12، احصل على 18". Single CTA.

---

## Step 2 — Services (`servicesOverview`)

**File:** `app/content/home.ts`

| Key | Action |
|-----|--------|
| `items` | Replace or reorder so the first item is Modonty + Console. Example first item: "محتوى شهري جاهز عبر «مدونتي» — مدونة مركزية قوية + لوحة عميل لمراجعة المقالات والأرقام." |
| | Keep 2–3 other items (إعلانات، تحويل، تقارير) so the list doesn’t shrink. |

**Check:** First scroll after Hero clearly mentions مدونتي and لوحة عميل.

---

## Step 3 — Pricing (`pricingSection`)

**File:** `app/content/home.ts`

| Key | Action |
|-----|--------|
| `headline` or new key | Add a line above or beside the plans: "عرض القيمة: 18 شهر تسليم مقابل 12 شهر دفع — 6 أشهر إضافية مجاناً." If the component doesn’t have a slot, use `headline` or `body` and prepend this sentence. |
| `plans` | Keep. Optional: add one bullet in the first plan’s `features`: "18 شهر تسليم مقابل 12 شهر دفع." |
| `testimonials` | Keep as-is. |

**Check:** "18 شهر مقابل 12" is visible in the pricing block.

---

## Step 4 — Features (`featuresGrid`)

**File:** `app/content/home.ts`

| Key | Current | New (Modonty) |
|-----|---------|----------------|
| `cards[0]` | رؤية واضحة للأرقام / لوحة متابعة... | رؤية واضحة للأرقام / لوحة عميل + أرقامك في Google Analytics. شفافية كاملة لكل زيارة وتحويل. |
| `cards[1]` | تنفيذ بدون إزعاج... | لا تكتب، اعتمد فقط / نكتب المحتوى ونحسّنه. دورك الوحيد: المراجعة والاعتماد من لوحة واحدة. |
| `cards[2]` | تحسين مستمر... | (keep) |
| `cards[3]` | تواصل واحد واضح... | (keep) |
| `twoCol[0]` | شراكة طويلة لا حملة... | (keep) |
| `twoCol[1]` | تسويق مرتبط بالأعمال... | استمارة استقبال شاملة / أكثر من 100 سؤال لفهم علامتك وجمهورك. نكتب بلسانك، محسّن لـ Google. |

**Check:** One card = Zero-Touch (اعتمد فقط)، one = Glass Box (لوحة + Analytics)، one twoCol = DNA Intake (100+ سؤال).

---

## Step 5 — About (`aboutAgency1`)

**File:** `app/content/home.ts`

| Key | Action |
|-----|--------|
| `body` | Prepend or replace first sentence with: "نحن الوكيل الحصري لـ «مدونتي» في السعودية." Then keep the rest of the value prop (حضور رقمي، استراتيجية، محتوى). |
| `features` | Optional: add "الوكيل الحصري لمدونتي في السعودية" as first feature, or leave in body only. |

**Check:** About section states exclusive agent clearly.

---

## Step 6 — BEM (`bemSection`)

**File:** `app/content/home.ts`

| Key | Current | New (Modonty flow) |
|-----|---------|---------------------|
| `list[0]` | تحليل وضعك الرقمي الحالي | استمارة استقبال شاملة (أكثر من 100 سؤال) لفهم علامتك وأهدافك |
| `list[1]` | تحديد فرص النمو... | استلام مقالات شهرية جاهزة — مراجعة واعتماد من لوحة واحدة |
| `list[2]` | خطة تنفيذ قابلة للقياس... | متابعة الأرقام والتحويلات عبر لوحة العميل و Google Analytics |
| `body` | نبدأ بفهم نموذج أرباحك... | (optional) Add: "مع «مدونتي» تحصل على محتوى ينشر على منصة قوية ويربط بموقعك." |

**Check:** BEM reads as: استمارة → استلام مقالات → اعتماد → متابعة أرقام.

---

## Step 7 — Contact & Final CTA (`companyContact`, `finalCta`)

**File:** `app/content/home.ts`

| Key | Action |
|-----|--------|
| `companyContact.contactBody` | Optional: add "نربطك بنظام «مدونتي»: محتوى شهري جاهز، لوحة عميل، وشفافية كاملة." |
| `finalCta.cta1` | Keep "احجز استشارتك الآن". |
| `finalCta.body` | Optional: add one line on 18-for-12 or exclusive agent. |

**Check:** Same primary CTA as Hero; no new competing CTAs.

---

## Component Changes (Only If Needed)

- **PricingSection:** If there is no text slot for "18 شهر مقابل 12"، add a `valueProposition` (or reuse `headline`) in `home.ts` and ensure the component renders it (e.g. above the plans).  
- **Hero / FeaturesGrid / BEMSection:** No structural change required; they already read from `home.ts`.  
- **No new sections** unless you later add a dedicated "لماذا مدونتي؟" block.

---

## Verification Checklist (After Edits)

- [ ] Hero: eyebrow = الوكيل الحصري لمدونتي؛ one pill = ادفع 12، احصل على 18؛ body mentions Modonty + 18-for-12.
- [ ] Services: first item mentions مدونتي + لوحة عميل.
- [ ] Pricing: "18 شهر تسليم مقابل 12 شهر دفع" visible.
- [ ] Features: one card = اعتمد فقط؛ one = لوحة + Analytics؛ one twoCol = 100+ سؤال.
- [ ] About: "الوكيل الحصري لمدونتي" in body (or first feature).
- [ ] BEM: list = استمارة → مقالات شهرية → اعتماد → أرقام.
- [ ] Single primary CTA across the page; contact/final CTA unchanged in intent.

---

## Rollback

All content lives in `app/content/home.ts`. To revert, restore the previous `hero`, `servicesOverview`, `pricingSection`, `featuresGrid`, `aboutAgency1`, `bemSection` (and optional contact/finalCta) from version control.
