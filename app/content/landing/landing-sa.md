# landing-sa.ts — What each object does & where it’s used

This file describes each top-level object in `landingSA` in the **same order as the public site**, starting from the layout. The **(site) layout** provides `content` and `staticLanding` to Header and Footer; the homepage merges `content.sectionImages` into `staticLanding` for section components.

---

## Layout — every public page

The [app/(site)/layout.tsx](app/(site)/layout.tsx) renders: wrapper → **LandingHeader** → **main** (`{children}`) → **Footer** → ChatWidget. Header and Footer receive `content` and `staticLanding` from the layout.

### header

Global site nav: nav links (href, label), CTA label, seats (for the announcement bar), announcement prefix/suffix, and book CTA.

**Used on:** Every public site page, in **LandingHeader** (desktop nav, CTA button, announcement bar, seats). Header reads `staticLanding.header` and `staticLanding.hero.ctaLink` for the CTA link; logo comes from `content.landingImages`.

### footer

Site footer: tagline, short desc, WhatsApp label and link, main links, legal links, brand name, and copyright.

**Used on:** Every public site page, in **Footer** (logos from `content.landingImages`). **Hero** (homepage only) uses `footer.tagline` inside **HeroSlogan**.

---

## Homepage main (inside `<main>`)

On the homepage, [app/(site)/page.tsx](app/(site)/page.tsx) renders sections in this order inside `main`. Section components receive `mergedStaticLanding` (staticLanding with `content.sectionImages` merged in).

### hero

Above-the-fold block: H1 lines, subheadline, proof badge, objection/answer benefits, main CTA, trust bullets, stats, seats counter, social line, and CTA link. Can have an optional `sectionImage` (overridden by DB if set).

**Used on:** Homepage, inside main: **Hero** (section 1). Uses `staticLanding.hero` and `staticLanding.footer.tagline`; images from `content.landingImages` / `content.sectionImages`.

### whyNow

“لماذا الآن” section: eyebrow, two title lines, subtitle, a cost timeline (month, label, desc, value, icon, severity), reason cards (icon, title, body), and CTA text, button, link, highlight, plus `daysTarget`. Optional `sectionImage`.

**Used on:** Homepage, inside main: **WhyNow** and **WhyNowInteractive** (section 2).

### howItWorks

“الطريقة” section: eyebrow, title, subtitle, numbered steps (num, icon, title, line, tag), CTA link and label, and a guarantee line. Optional `sectionImage`.

**Used on:** Homepage, inside main: **HowItWorks** (section 3).

### outcomes

“النتائج” section: eyebrow, title, subtitle, outcome cards (icon, metric, title, line, token), CTA link and label, badge text, and a message + highlight line. Optional `sectionImage`.

**Used on:** Homepage, inside main: **Outcomes** and **OutcomeCard** (section 4).

### socialProof

“الشهادات” section: eyebrow, title, subtitle, list of testimonials (name, role, company, quote, metric, avatarImg, stars, tag), and a founding line. In SA the object doesn’t set `sectionImage`, but the section can still get one from DB.

**Used on:** Homepage, inside main: **SocialProof** (tabs, carousel, cards) (section 5).

### pricing

Full pricing block: ANNOUNCEMENT banner, HERO (socialProof, headline lines, subheadline), PLANS (the Plan[] array), TRUST_ITEMS, BOTTOM_CTA, and UI (all labels, billing copy, dialect strings, etc.).

**Used on:** Homepage, inside main: **ModontyPricing** (section 6, `#pricing`). Also on the **/pricing** page. The homepage passes `getStaticLanding("SA").pricing` and `getStaticLanding("EG").pricing` (both countries for the locale toggle). The same `pricing.PLANS` is used to build the **teaser** plans via `staticPlansToPricingPlans` in `lib/getLandingContent`.

### faq

“الأسئلة” section: eyebrow, title, subtitle, list of faqs (q, a, tag), CTA label and button, and WhatsApp link. Optional `sectionImage`.

**Used on:** Homepage, inside main: **FAQ** and **FAQAccordion** (section 7).

### finalCta

Last CTA block: eyebrow, two title lines, subtitle, seats (total/taken), benefits list, CTA label and link, and WhatsApp label and link. Optional `sectionImage`.

**Used on:** Homepage, inside main: **FinalCTA** (section 8).

---

## Other pages: /pricing

### pricingPage

Copy for the pricing route: title, description, h1, and intro text. Used for meta and the page’s own heading and intro.

**Used on:** **/pricing** only — in `generateMetadata()` (title, description) and for the page heading and intro. The same **pricing** object (SA/EG) drives the pricing block on that page too.

---

## Section order on homepage (inside main)

Order **inside main** on the homepage. Header is above main and footer is below main on every page.

1. Hero  
2. Why Now  
3. How It Works  
4. Outcomes  
5. Social Proof  
6. Pricing (`#pricing`)  
7. FAQ  
8. Final CTA  

---

## Notes

- **sectionImage:** Any section object can have `sectionImage`. The DB (SiteSettings images) overrides it in `getLandingContent`; the merged result is what components receive from `(site)/page.tsx`.
- **Country:** For SA traffic, `getStaticLanding("SA")` returns `landingSA`; for EG, `landingEG`. Layout and homepage use `getCountryFromHeaders(headers)` to choose.
- **Layout** ([app/(site)/layout.tsx](app/(site)/layout.tsx)) fetches `content` and `staticLanding` and passes them to Header and Footer; the homepage fetches again and merges section images into `staticLanding` for section components.
