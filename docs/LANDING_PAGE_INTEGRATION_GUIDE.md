# Landing Page Integration Guide: Modonty Power Points + Best Practices

**Roles:** Senior UI/UX, Marketing Manager, Business Developer  
**Sources:** [JBRSEO_LANDING_PAGE_STRATEGY.md](./JBRSEO_LANDING_PAGE_STRATEGY.md), [MODONTY_BUSINESS_MODEL_GUIDELINES.md](./MODONTY_BUSINESS_MODEL_GUIDELINES.md), Unbounce/LeadPages/HubSpot landing page best practices, and current JBRSEO codebase.

---

## 1. Lead-Gen Best Practices (Summary)

Apply these consistently across the page:

| Practice | Application on JBRSEO |
|----------|------------------------|
| **Single conversion goal** | One primary CTA: "احجز استشارتك" (Book consultation). Secondary: "تواصل معنا". Remove or reduce links that take users away from the lead path. |
| **Message match** | Hero + first scroll must match ad/social message: "الوكيل الحصري لمدونتي" + "18 شهر مقابل 12". |
| **CTA above the fold** | Primary CTA visible in Hero without scrolling (already in [Hero.tsx](app/components/Hero.tsx)). Keep it; ensure it’s one clear button. |
| **CTA within 2 scrolls** | Repeat CTA in CompanyContact and FinalCTA (already present). Add one more mid-page if the page gets long (e.g. after Pricing or Features). |
| **Directional cues** | Use arrows, scroll hints, or visual flow (e.g. "كيف نعمل" steps) so the eye moves toward the next section and eventually to the CTA. |
| **Show product in action** | Use a screenshot or simple graphic of the Client Console / Modonty.com article to show "Glass Box" and "Authority" in action. |
| **Authentic social proof** | Testimonials with real names, roles, and metrics (already in `pricingSection.testimonials`). Add "مدونتي" or "أكثر من 120 شريكاً" in Hero if accurate. |
| **Clear, benefit-led copy** | Headlines = benefit or outcome. Body = short paragraphs + bullets. Address pain then solution. |
| **Mobile-first, fast** | Keep sections lightweight; avoid heavy images above the fold. Test LCP/CLS. |
| **Reduce form friction** | Contact = short form (name, phone, message). For "استشارة": consider 2-step (contact first → thank-you + optional calendar). |

---

## 2. Mapping Power Points to Sections and Content

Current structure ([LandingPage.tsx](app/components/LandingPage.tsx)):

`Hero → ServicesOverview → PricingSection → FeaturesGrid → AboutAgency1 → BEMSection → OverviewSection → CompanyContact → BlogSection → FinalCTA → Footer`

Recommended mapping of **Power Points** to sections and content keys in [home.ts](app/content/home.ts):

| Power Point | Section | Content key / change |
|-------------|---------|----------------------|
| **Exclusive Agent** | Hero | `hero.eyebrow`: e.g. "الوكيل الحصري لمدونتي في السعودية". `hero.title`: strong benefit (e.g. "دع عملاءك يطرقون بابك" or "أصول رقمية دائمة بدون كتابة"). |
| **18-Month Lever** | Hero + Pricing | Hero: one of `hero.pills` = "ادفع 12 شهراً، احصل على 18 شهراً". Pricing: add a clear "عرض القيمة" line and/or a badge "6 أشهر إضافية مجاناً". |
| **Authority Engine** | ServicesOverview or new "Why Modonty" | Reframe services around "مدونة مركزية قوية" and "محتواك ينشر على منصة ذات سلطة". Optional: small subsection "لماذا مدونتي؟" with Authority + link juice. |
| **Zero-Touch Promise** | FeaturesGrid + BEMSection | One feature card: "لا تكتب. نكتب نحن. أنت تعتمد فقط." BEM list item: "استلام مقالات جاهزة شهرياً — اعتماد أو طلب تعديلات من لوحة واحدة." |
| **Glass Box Transparency** | FeaturesGrid + optional visual | One feature card: "شفافية كاملة: لوحة عميل وأرقامك في Google Analytics". Consider a small Console screenshot or icon in Hero or this section. |
| **DNA Intake** | BEMSection or AboutAgency1 | One step or bullet: "استمارة استقبال دقيقة (أكثر من 100 سؤال) لضمان محتوى بلسان علامتك." Frame as "نفهمك قبل أن نكتب". |

---

## 3. Section-by-Section Integration Plan

### 3.1 Hero ([Hero.tsx](app/components/Hero.tsx), [home.ts](app/content/home.ts) `hero`)

- **Eyebrow:** State exclusivity. Example: `"الوكيل الحصري لمدونتي في السعودية"` or `"شراكة تسويقية مستدامة — الوكيل الحصري لمدونتي"`.
- **Title:** Keep benefit-led. Current "دع عملاءك يطرقون بابك" is strong; optional add subline referencing "محتوى جاهز، لا كتابة".
- **Body:** One short sentence on Modonty: e.g. "مقالات شهرية محسّنة لـ SEO تنشر على منصة قوية، وتصل إلى موقعك. ادفع 12 شهراً واحصل على 18 شهراً من التسليم."
- **Pills:** Replace or add one pill: e.g. "ادفع 12، احصل على 18" with sub "6 أشهر إضافية مجاناً". Keep other two as operational/trust (e.g. أصول رقمية، رؤية قائمة على الأرقام).
- **CTA:** Single primary: "احجز استشارتك الآن" → `/contact`. No competing CTAs in Hero.
- **UI/UX:** CTA above the fold; enough contrast; optional subtle arrow or scroll hint below Hero.

### 3.2 ServicesOverview ([home.ts](app/content/home.ts) `servicesOverview`)

- Reframe items to reflect Modonty: e.g. "محتوى شهري جاهز (مدونتي)"، "تحسين ظهورك على محركات البحث عبر منصة ذات سلطة"، "لوحة عميل لمتابعة المقالات والأرقام".
- **Authority Engine:** Add one line in title or first item: "محتواك ينشر على مدونة مركزية قوية (مدونتي) لظهور أسرع وروابط أفضل لموقعك."

### 3.3 PricingSection ([home.ts](app/content/home.ts) `pricingSection`, [PricingSection.tsx](app/components/PricingSection.tsx))

- **18-Month Lever:** Add visible value line: e.g. "عرض حصري: اشتراك سنوي = 18 شهر تسليم (6 أشهر مجاناً)."
- Plans: Align with Modonty tiers if you’re selling them (Basic 2 مقال، Standard 4، Pro 8، Premium 12). Otherwise keep current retainer/performance framing but add the "18 for 12" as the main offer hook.
- **Social proof:** Keep testimonials; ensure they feel real (name, role, metric). Optionally add "أكثر من 120 شريكاً" if true.
- **CTA:** Ensure one clear CTA in this section (e.g. "احجز استشارتك" or "اختر الباقة") that goes to contact or a simple form.

### 3.4 FeaturesGrid ([home.ts](app/content/home.ts) `featuresGrid`)

- Map **Zero-Touch** to one card: "تنفيذ بدون إزعاج" → "لا تكتب. نكتب نحن. أنت تعتمد فقط من لوحة واحدة."
- Map **Glass Box** to one card: "رؤية واضحة للأرقام" → "لوحة عميل + أرقامك في Google Analytics. شفافية كاملة."
- Map **DNA Intake** in `twoCol` or a new bullet: "استمارة استقبال دقيقة (أكثر من 100 سؤال) لضمان محتوى بلسان علامتك."
- **UI/UX:** Optional: small illustration or screenshot of Console/dashboard next to the "رؤية واضحة" card.

### 3.5 AboutAgency1

- Short line: "نحن الوكيل الحصري لمدونتي في السعودية — نربطك بنظام محتوى شهري جاهز ومحسّن لـ SEO."

### 3.6 BEMSection ("كيف نعمل معك")

- **Zero-Touch in steps:** e.g. "استلام مقالات جاهزة شهرياً — مراجعة واعتماد من لوحة واحدة."
- **DNA Intake:** "استمارة استقبال شاملة لفهم علامتك وجمهورك وأهدافك."

### 3.7 CompanyContact + FinalCTA

- **Single goal:** Both sections drive to the same action: book a consultation (or submit short contact form).
- **Copy:** Emphasize "استشارة اكتشاف" and "خطة أول 90 يوماً" to reduce perceived commitment.
- **Form:** Keep short (name, phone, message or "نوع الطلب"). Optional: privacy line + thank-you page after submit.

### 3.8 Navigation and Distractions

- **Best practice:** Minimize links that take users off the page. Keep Header nav minimal; anchor links (من نحن، الخدمات، الاستثمار، القيمة) are fine as they keep users on the same page and support the story.
- Avoid unnecessary footer links that don’t support trust or conversion (تواصل، سياسة الخصوصية، الأسئلة الشائعة are OK).

---

## 4. Content Keys to Add or Edit in `home.ts`

| Key | Suggested value (Arabic) |
|-----|---------------------------|
| `hero.eyebrow` | "الوكيل الحصري لمدونتي في السعودية" or combine with "شراكة تسويقية مستدامة" |
| `hero.pills` (one item) | title: "ادفع 12، احصل على 18" — sub: "6 أشهر إضافية مجاناً" |
| `hero.body` | Include one sentence on 18-for-12 and "محتوى جاهز على منصة قوية" |
| `servicesOverview.items` | At least one item explicitly about "مدونة مركزية (مدونتي)" and "لوحة عميل" |
| `pricingSection` | Add `valueProposition` or headline: "عرض حصري: 18 شهر تسليم مقابل 12 شهر دفع" |
| `featuresGrid.cards` | One card = Zero-Touch (اعتمد فقط)، one = Glass Box (لوحة عميل + Analytics) |
| `featuresGrid.twoCol` or list | One block = DNA Intake (استمارة 100+ سؤال) |
| `aboutAgency1.body` or features | One line on "الوكيل الحصري لمدونتي" |
| `bemSection.list` | Items for "استلام مقالات شهرية"، "اعتماد من لوحة واحدة"، "استمارة استقبال شاملة" |

---

## 5. UI/UX Checklist

- [ ] Hero: one primary CTA above the fold; eyebrow states "الوكيل الحصري لمدونتي".
- [ ] "18 for 12" visible in Hero (pill or body) and in Pricing.
- [ ] Authority Blog explained in one sentence in Services or a dedicated short block.
- [ ] Zero-Touch and Glass Box each have a dedicated feature card.
- [ ] DNA Intake (100+ سؤال) mentioned in BEM or Features.
- [ ] At least two CTAs to contact/consultation (Hero + CompanyContact or FinalCTA); one more mid-page if needed.
- [ ] Testimonials with name, role, and metric; no generic "عميل راضٍ".
- [ ] Mobile: CTA tappable, text readable, no horizontal scroll.
- [ ] No competing primary CTAs; secondary actions (e.g. المدونة) are clearly secondary.

---

## 6. References

- **Strategy:** [JBRSEO_LANDING_PAGE_STRATEGY.md](./JBRSEO_LANDING_PAGE_STRATEGY.md) — six Power Points.
- **Product detail:** [MODONTY_BUSINESS_MODEL_GUIDELINES.md](./MODONTY_BUSINESS_MODEL_GUIDELINES.md) — tiers, console, intake, transparency.
- **Best practices:** Unbounce landing page best practices (message match, CTA above fold, directional cues, show product, remove distractions, social proof, clear copy, speed, mobile). Lead gen: short forms, thank-you page, privacy link.

---

*Use this guide to update [app/content/home.ts](app/content/home.ts) and, if needed, [Hero](app/components/Hero.tsx), [PricingSection](app/components/PricingSection.tsx), [FeaturesGrid](app/components/FeaturesGrid.tsx), and [BEMSection](app/components/BEMSection.tsx) so the landing page integrates Modonty Power Points and follows lead-gen best practices.*
