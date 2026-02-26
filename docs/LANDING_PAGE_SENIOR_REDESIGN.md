# Landing Page Senior Redesign — Add, Remove, Merge

**Principle:** Optimize for one goal — consultation leads. Restructure sections; don't just fill existing slots.

---

## New Section Flow

```
Hero → Why Modonty → How It Works → Pricing → Proof → Contact → Final CTA → Footer
```

---

## What We Do

| Action | Section | Reason |
|--------|---------|--------|
| **Keep** | Hero | Above-fold hook. Add exclusive agent + 18-for-12. |
| **Add** | Why Modonty | New block: 4–6 power points (Authority, 18-for-12, Zero-Touch, Transparency, DNA Intake, Exclusive Agent). Replaces scattered Features/Services. |
| **Merge** | How It Works | Combine BEM + Services into one flow: اشترك → استمارة → استلام مقالات → اعتماد → نتائج. Single "كيف نعمل" section. |
| **Keep** | Pricing | Add 18-for-12 value line. Keep plans + testimonials. |
| **Merge** | Proof | OverviewSection stats + Pricing testimonials → one Proof block (أرقام + شهادات). |
| **Remove** | BlogSection | Distracts from lead gen. Move blog to nav/footer or separate page. |
| **Remove** | OverviewSection | Stats merge into Proof. |
| **Remove** | FeaturesGrid | Replaced by Why Modonty. |
| **Remove** | ServicesOverview | Merged into How It Works. |
| **Merge** | About | One line in Hero or a thin "من نحن" strip. No full section. |
| **Keep** | CompanyContact | Primary lead form. |
| **Keep** | FinalCTA | Repeat CTA. |
| **Keep** | Footer | Minimal links. |

---

## New Structure (7 Sections)

| # | Section | Content | Component |
|---|---------|---------|------------|
| 1 | **Hero** | Eyebrow: الوكيل الحصري لمدونتي. Title + body + pills (18-for-12). CTA. | Hero (existing) |
| 2 | **Why Modonty** | 4–6 cards: Authority, 18-for-12, Zero-Touch, Transparency, DNA Intake, Exclusive Agent | New: WhyModonty |
| 3 | **How It Works** | 4 steps: اشترك → استمارة 100+ سؤال → استلام مقالات شهرية → اعتماد من لوحة | New: HowItWorks (merge BEM + Services) |
| 4 | **Pricing** | Value line: 18 شهر مقابل 12. Plans (Modonty tiers or retainer). | PricingSection (existing) |
| 5 | **Proof** | Stat (276 / 120+) + 3 testimonials. | New: ProofSection (merge Overview + testimonials) |
| 6 | **Contact** | استشارة 30 دقيقة. Short form. CTA. | CompanyContact (existing) |
| 7 | **Final CTA** | Repeat: احجز استشارتك. | FinalCTA (existing) |

---

## Content Keys (home.ts) — New Shape

```ts
// REMOVE or deprecate: servicesOverview, featuresGrid, aboutAgency1, bemSection, overviewSection, blogSection

// ADD:
export const whyModonty = {
  eyebrow: "لماذا مدونتي؟",
  title: "قوة ومرونة تخدم عملك",
  cards: [
    { title: "ادفع 12، احصل على 18", body: "6 أشهر إضافية مجاناً. لا وكالة تقدمها." },
    { title: "مدونة مركزية قوية", body: "محتواك ينشر على منصة ذات سلطة. ظهور أسرع وروابط أفضل." },
    { title: "لا تكتب، اعتمد فقط", body: "نكتب ونحسّن. دورك: المراجعة والاعتماد من لوحة واحدة." },
    { title: "شفافية كاملة", body: "لوحة عميل + أرقامك في Google Analytics. كل زيارة وتحويل." },
    { title: "استمارة 100+ سؤال", body: "نفهم علامتك وجمهورك. نكتب بلسانك، محسّن لـ Google." },
    { title: "الوكيل الحصري في السعودية", body: "JBRSEO — البوابة الوحيدة لمدونتي محلياً." },
  ],
};

export const howItWorks = {
  eyebrow: "كيف نعمل",
  title: "من الاستمارة إلى النتائج في 4 خطوات",
  steps: [
    { num: 1, title: "اشترك", body: "اختر الباقة المناسبة (2–12 مقال/شهر)." },
    { num: 2, title: "استمارة استقبال", body: "أكثر من 100 سؤال لفهم علامتك وأهدافك." },
    { num: 3, title: "استلام مقالات شهرية", body: "محتوى جاهز محسّن لـ SEO. ينشر على مدونتي." },
    { num: 4, title: "اعتمد واتبع", body: "مراجعة من لوحة واحدة. أرقامك في Analytics." },
  ],
};

export const proofSection = {
  eyebrow: "أرقام وشهادات",
  title: "شركاء يثقون بنا",
  stat: "120+",
  statLabel: "شريك نشط",
  testimonials: [ /* from pricingSection, keep 3 */ ],
};
```

---

## LandingPage.tsx — New Order

```tsx
<main>
  <Hero />
  <RevealOnScroll><WhyModonty /></RevealOnScroll>
  <RevealOnScroll><HowItWorks /></RevealOnScroll>
  <RevealOnScroll><PricingSection /></RevealOnScroll>
  <RevealOnScroll><ProofSection /></RevealOnScroll>
  <RevealOnScroll><CompanyContact /></RevealOnScroll>
  <RevealOnScroll><FinalCTA /></RevealOnScroll>
  <Footer />
</main>
```

**Removed:** ServicesOverview, FeaturesGrid, AboutAgency1, BEMSection, OverviewSection, BlogSection.

---

## Implementation Order

1. **home.ts** — Add `whyModonty`, `howItWorks`, `proofSection`. Update `hero`. Keep `pricingSection` (add value line). Deprecate or remove old keys.
2. **WhyModonty.tsx** — New component. 4–6 cards grid.
3. **HowItWorks.tsx** — New component. 4 steps (numbered).
4. **ProofSection.tsx** — New component. Stat + testimonials (reuse PricingSection testimonials or extract).
5. **PricingSection.tsx** — Add `valueProposition` or `headline` for "18 شهر مقابل 12" if not in hero.
6. **LandingPage.tsx** — Replace section order; remove old imports.
7. **Nav** — Update anchors: #why-modonty, #how-it-works, #pricing, #proof, #contact. Remove #services, #feature, #about if no longer used.

---

## Rollback

All changes are in: `home.ts`, new components (WhyModonty, HowItWorks, ProofSection), `LandingPage.tsx`, `Header.tsx` (nav if changed). Revert via git.

---

## Done When

- [ ] Hero: الوكيل الحصري + ادفع 12 احصل على 18.
- [ ] Why Modonty: 4–6 power points visible.
- [ ] How It Works: 4 steps (اشترك → استمارة → استلام → اعتماد).
- [ ] Pricing: 18-for-12 value line. Plans + testimonials.
- [ ] Proof: Stat + 3 testimonials.
- [ ] No Blog, Overview, Features, Services, About, BEM as standalone sections.
- [ ] Single primary CTA across the page.
