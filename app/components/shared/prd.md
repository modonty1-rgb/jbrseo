# MASTER PRD — modonty.com Landing Page
# Scroll Animations + SEO + Performance + Accessibility
# Version: 2.0 | نسخ هذا الملف كاملاً في Cursor Chat

---

## السياق

مشروع Next.js App Router — TypeScript + Tailwind CSS v4.
اتجاه RTL — عربي — سوقين: `/sa` سعودي + `/eg` مصري.
الهدف: تحسين PageSpeed + SEO + استبدال framer-motion في الـ landing page.

## القاعدة الذهبية

> قبل تعديل أي ملف — اقرأه أولاً. لا تكتب من الذاكرة.

---

## تحذيرات مهمة قبل البدء

```
⚠️  لا تحذف framer-motion من package.json — قد تستخدمه صفحات أخرى
⚠️  لا تضيف "use client" لـ SectionReveal.tsx — يجب أن يبقى Server Component
⚠️  لا تمس CSS Variables الموجودة في globals.css — أضف فقط في النهاية
⚠️  الـ Hero دائماً variant="none" — لضمان LCP جيد
⚠️  dynamic imports فقط للـ components التي below the fold
⚠️  لا تغيّر أسماء exports الموجودة — SectionReveal + StaggerReveal + StaggerItem
```

---

# المهام (نفّذها بالترتيب الدقيق)

---

## ═══ المهمة 1 — Font Optimization ═══
**الملف: `app/layout.tsx`**

### لماذا؟
`@import` من Google Fonts في CSS = render-blocking request = LCP بطيء.
`next/font` ينزّل الـ font محلياً ويضمن `font-display: swap` تلقائياً.

### الخطوات

**1a. احذف من `styles/globals.css` أي سطر يشبه:**
```css
@import url('https://fonts.googleapis.com/css2?family=Tajawal...');
```

**1b. في `app/layout.tsx` أضف في الأعلى:**
```tsx
import { Tajawal } from "next/font/google";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
  preload: true,
  variable: "--font-tajawal",
});
```

**1c. على الـ `<html>` element أضف:**
```tsx
<html lang="ar" dir="rtl" className={tajawal.variable}>
```

**1d. في `globals.css` غيّر font-family:**
```css
/* من */
font-family: 'Tajawal', sans-serif;
/* إلى */
font-family: var(--font-tajawal), system-ui, sans-serif;
```

---

## ═══ المهمة 2 — SEO Metadata ═══
**الملف: `app/[country]/page.tsx`**

### لماذا؟
بدون metadata = Google لا يعرف ما تقدمه = ranking ضعيف.

### الكود

أضف هذه الدالة **قبل** الـ default export في `page.tsx`:

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { country: "sa" | "eg" };
}): Promise<Metadata> {
  const isSA = params.country === "sa";

  return {
    title: {
      default: isSA
        ? "مدونتي | منصة التسويق بالمحتوى للأعمال السعودية"
        : "مدونتي | منصة التسويق بالمحتوى للأعمال المصرية",
      template: "%s | مدونتي",
    },
    description: isSA
      ? "محتوى مكتوب ومنشور ومحسّن لمحركات البحث كل شهر. انضم لأكثر من ١٢٠ شركة سعودية تحصل على عملاء جدد بدون إعلانات."
      : "محتوى مكتوب ومنشور ومحسّن لمحركات البحث كل شهر. انضم لأكثر من ١٢٠ شركة مصرية تحصل على عملاء جدد بدون إعلانات.",
    keywords: isSA
      ? ["تسويق بالمحتوى", "SEO بالعربي", "كتابة مقالات", "تسويق رقمي السعودية"]
      : ["تسويق بالمحتوى", "SEO بالعربي", "كتابة مقالات", "تسويق رقمي مصر"],
    alternates: {
      canonical: `https://modonty.com/${params.country}`,
      languages: {
        "ar-SA": "https://modonty.com/sa",
        "ar-EG": "https://modonty.com/eg",
      },
    },
    openGraph: {
      type: "website",
      locale: isSA ? "ar_SA" : "ar_EG",
      url: `https://modonty.com/${params.country}`,
      siteName: "مدونتي",
      title: "مدونتي | محتوى يجلب عملاء حقيقيين",
      description: "حضور لا وعود — مقالات مكتوبة ومنشورة ومحسّنة كل شهر",
      images: [
        {
          url: `https://modonty.com/og-${params.country}.png`,
          width: 1200,
          height: 630,
          alt: "مدونتي — منصة التسويق بالمحتوى",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "مدونتي | محتوى يجلب عملاء حقيقيين",
      description: "حضور لا وعود — مقالات مكتوبة ومنشورة ومحسّنة كل شهر",
      images: [`https://modonty.com/og-${params.country}.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
```

---

## ═══ المهمة 3 — Sitemap + Robots ═══

### 3a. أنشئ ملف جديد `app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://modonty.com/sa",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://modonty.com/eg",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
```

### 3b. أنشئ ملف جديد `app/robots.ts`

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/"],
    },
    sitemap: "https://modonty.com/sitemap.xml",
  };
}
```

---

## ═══ المهمة 4 — JSON-LD Structured Data ═══
**ملف جديد: `components/LandingJsonLd.tsx`**

### لماذا؟
JSON-LD يساعد Google على فهم نشاطك — يظهر في Rich Results.
هذا Server Component — لا JavaScript في الـ browser.

```tsx
// components/LandingJsonLd.tsx
// ✅ Server Component — لا "use client"

type Props = { country: "sa" | "eg" };

export function LandingJsonLd({ country }: Props) {
  const isSA = country === "sa";

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "مدونتي",
      url: "https://modonty.com",
      logo: "https://modonty.com/logo.png",
      description: "منصة التسويق بالمحتوى للأعمال العربية",
      areaServed: isSA
        ? { "@type": "Country", name: "Saudi Arabia" }
        : { "@type": "Country", name: "Egypt" },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "خدمة التسويق بالمحتوى",
      provider: { "@type": "Organization", name: "مدونتي" },
      description: "كتابة ونشر وترويج المقالات لنشاطك التجاري",
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: isSA ? "SAR" : "EGP",
        lowPrice: isSA ? "299" : "199",
        offerCount: "4",
      },
      areaServed: isSA ? "SA" : "EG",
      inLanguage: "ar",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "هل يمكنني الترقية أو التخفيض بين الخطط؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "نعم في أي وقت. الفرق يُحتسب بشكل تناسبي دون رسوم إضافية.",
          },
        },
        {
          "@type": "Question",
          name: "هل هناك عقد أو التزام طويل الأمد؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "لا. جميع الخطط شهرية دون التزامات مع ضمان استرجاع ١٤ يوماً.",
          },
        },
        {
          "@type": "Question",
          name: "كيف يتم كتابة المقالات؟",
          acceptedAnswer: {
            "@type": "Answer",
            text: "فريقنا يتولى كل شيء: البحث، الكتابة، التصميم، النشر، والترويج.",
          },
        },
      ],
    },
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
```

---

## ═══ المهمة 5 — CSS Animations ═══
**الملف: `styles/globals.css`**

### أضف في النهاية تماماً — لا تمس ما قبله

```css
/* ════════════════════════════════════════════════════════
   SectionReveal — CSS Animations
   لا تعدّل CSS Variables الموجودة فوق
   ════════════════════════════════════════════════════════ */

/* ── Keyframes ──────────────────────────────────────── */
@keyframes reveal-blur-in {
  from { opacity: 0; filter: blur(12px); transform: translateY(18px); }
  to   { opacity: 1; filter: blur(0px);  transform: translateY(0); }
}
@keyframes reveal-fade-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes reveal-slide-rtl {
  from { opacity: 0; transform: translateX(56px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes reveal-scale-pop {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes reveal-stagger {
  from { opacity: 0; filter: blur(8px); transform: translateY(28px); }
  to   { opacity: 1; filter: blur(0px); transform: translateY(0); }
}

/* ── Hidden state (before viewport) ─────────────────── */
[data-reveal]             { opacity: 0; will-change: transform, opacity; }
[data-reveal="blur-in"]   { filter: blur(12px); transform: translateY(18px); }
[data-reveal="fade-up"]   { transform: translateY(40px); }
[data-reveal="slide-rtl"] { transform: translateX(56px); }
[data-reveal="scale-pop"] { transform: scale(0.92); }
.si {
  opacity: 0;
  filter: blur(8px);
  transform: translateY(28px);
  will-change: transform, opacity;
}

/* ── Visible state (after IntersectionObserver) ──────── */
[data-reveal="blur-in"][data-v] {
  animation: reveal-blur-in 0.65s cubic-bezier(0.25, 0.1, 0.25, 1) var(--d, 0ms) both;
}
[data-reveal="fade-up"][data-v] {
  animation: reveal-fade-up 0.60s cubic-bezier(0.25, 0.1, 0.25, 1) var(--d, 0ms) both;
}
[data-reveal="slide-rtl"][data-v] {
  animation: reveal-slide-rtl 0.55s cubic-bezier(0.22, 1, 0.36, 1) var(--d, 0ms) both;
}
[data-reveal="scale-pop"][data-v] {
  animation: reveal-scale-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) var(--d, 0ms) both;
}
.si[data-v] {
  animation: reveal-stagger 0.50s cubic-bezier(0.25, 0.1, 0.25, 1) var(--d, 0ms) both;
}

/* ── Cleanup GPU memory after animation ──────────────── */
[data-v] { will-change: auto; }

/* ── Accessibility: focus visible ───────────────────── */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* ── Reduced motion ──────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  [data-reveal], .si {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    animation: none !important;
    will-change: auto !important;
  }
}
```

---

## ═══ المهمة 6 — استبدال SectionReveal.tsx ═══
**الملف: `components/SectionReveal.tsx`**

### استبدل الملف كاملاً بهذا الكود

```tsx
// components/SectionReveal.tsx
// ✅ Server Component — لا "use client"، لا framer-motion
// كل المحتوى في الـ DOM دائماً = SEO ✅ = PageSpeed ✅

import type { CSSProperties, ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────

type AnimVariant = "blur-in" | "fade-up" | "slide-rtl" | "scale-pop" | "none";

type SectionRevealProps = {
  children:            ReactNode;
  /** نوع الـ animation — الافتراضي blur-in */
  variant?:            AnimVariant;
  /** تأخير بالمللي ثانية */
  delay?:              number;
  /** رقم السكشن كديكور خلفي */
  sectionNumber?:      number;
  showSectionCounter?: boolean;
  className?:          string;
  as?:                 "div" | "section" | "article" | "aside";
};

type StaggerRevealProps = {
  children:   ReactNode;
  className?: string;
  /** تأخير بين كل item بالمللي ثانية — الافتراضي 90 */
  itemDelay?: number;
  as?:        "div" | "ul" | "ol" | "section";
};

type StaggerItemProps = {
  children:   ReactNode;
  className?: string;
};

// ── SectionReveal ──────────────────────────────────────────────────

export function SectionReveal({
  children,
  variant = "blur-in",
  delay = 0,
  sectionNumber,
  showSectionCounter,
  className = "",
  as: Tag = "div",
}: SectionRevealProps) {
  if (variant === "none") {
    return <Tag className={`relative ${className}`}>{children}</Tag>;
  }

  return (
    <Tag
      className={`relative ${className}`}
      data-reveal={variant}
      style={delay > 0 ? ({ "--d": `${delay}ms` } as CSSProperties) : undefined}
    >
      {showSectionCounter && sectionNumber != null && (
        <span
          aria-hidden="true"
          className="
            pointer-events-none select-none
            absolute -top-6 end-4 z-0
            font-black leading-none tabular-nums
            text-[8rem] text-foreground/[0.04]
            sm:text-[11rem] lg:text-[14rem]
          "
        >
          {String(sectionNumber).padStart(2, "0")}
        </span>
      )}
      {children}
    </Tag>
  );
}

// ── StaggerReveal ──────────────────────────────────────────────────

export function StaggerReveal({
  children,
  className = "",
  itemDelay = 90,
  as: Tag = "div",
}: StaggerRevealProps) {
  return (
    <Tag
      className={`stagger-root ${className}`}
      data-stagger-delay={itemDelay}
    >
      {children}
    </Tag>
  );
}

// ── StaggerItem ────────────────────────────────────────────────────

export function StaggerItem({ children, className = "" }: StaggerItemProps) {
  return <div className={`si ${className}`}>{children}</div>;
}
```

---

## ═══ المهمة 7 — إنشاء RevealObserver.tsx ═══
**ملف جديد: `components/RevealObserver.tsx`**

```tsx
// components/RevealObserver.tsx
// ✅ الملف الوحيد بـ "use client" في هذا النظام
// يُضاف مرة واحدة فقط في layout.tsx
// حجمه: ~600 bytes بعد minification

"use client";
import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    // ── 1. SectionReveal observer ──────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-v", "");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // ── 2. StaggerReveal observer ───────────────────────
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const root  = entry.target as HTMLElement;
          const delay = Number(root.dataset.staggerDelay ?? 90);
          root.querySelectorAll<HTMLElement>(".si").forEach((item, i) => {
            item.style.setProperty("--d", `${i * delay}ms`);
            item.setAttribute("data-v", "");
          });
          staggerObserver.unobserve(root);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    // ── 3. Observe all existing elements ───────────────
    const observeAll = () => {
      document
        .querySelectorAll<HTMLElement>("[data-reveal]:not([data-v])")
        .forEach((el) => revealObserver.observe(el));

      document
        .querySelectorAll<HTMLElement>(".stagger-root:not([data-obs])")
        .forEach((el) => {
          el.setAttribute("data-obs", "");
          staggerObserver.observe(el);
        });
    };

    observeAll();

    // ── 4. Watch for dynamically added content ─────────
    const mutationObserver = new MutationObserver(observeAll);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      staggerObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
```

---

## ═══ المهمة 8 — تعديل app/layout.tsx ═══

أضف هذه التغييرات الثلاثة:

```tsx
import { RevealObserver } from "@/components/RevealObserver";
// + Tajawal import من المهمة 1

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body>

        {/* Accessibility: skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4
            focus:right-4 focus:z-[9999] focus:bg-accent focus:text-white
            focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
        >
          انتقل للمحتوى الرئيسي
        </a>

        {children}

        {/* Observer يجب أن يكون في نهاية الـ body */}
        <RevealObserver />

      </body>
    </html>
  );
}
```

---

## ═══ المهمة 9 — تعديل app/[country]/page.tsx ═══

### 9a. التعديلات على الـ imports

```tsx
// أضف هذه imports
import dynamic from "next/dynamic";
import type { CSSProperties } from "react";
import { SectionReveal, StaggerReveal, StaggerItem } from "@/components/SectionReveal";
import { LandingJsonLd } from "@/components/LandingJsonLd";

// Hero + WhyNow يُحمّلان دائماً (قريبين من الـ fold)
import { Hero }    from "@/components/Hero";
import { WhyNow }  from "@/components/WhyNow";
import { HowItWorks } from "@/components/HowItWorks";
import { Outcomes }   from "@/components/Outcomes";

// Heavy components — lazy load (below the fold)
const SocialProof = dynamic(
  () => import("@/components/SocialProof").then((m) => ({ default: m.SocialProof }))
);
const Pricing = dynamic(
  () => import("@/components/Pricing").then((m) => ({ default: m.Pricing }))
);
const FAQ = dynamic(
  () => import("@/components/FAQ").then((m) => ({ default: m.FAQ }))
);
const FinalCTA = dynamic(
  () => import("@/components/FinalCTA").then((m) => ({ default: m.FinalCTA }))
);
```

### 9b. الـ JSX — استبدل هيكل الصفحة

```tsx
export default function LandingPage({
  params,
}: {
  params: { country: "sa" | "eg" };
}) {
  const content = getLandingContent(params.country);

  return (
    <main id="main-content">

      {/* ── Hero: بدون animation — above the fold ── */}
      <SectionReveal variant="none">
        <Hero content={content} />
      </SectionReveal>

      {/* ── WhyNow ── */}
      <SectionReveal variant="blur-in">
        <WhyNow content={content} />
      </SectionReveal>

      {/* ── HowItWorks ── */}
      <SectionReveal variant="blur-in">
        <HowItWorks content={content} />
      </SectionReveal>

      {/* ── Outcomes ── */}
      <SectionReveal variant="blur-in">
        <Outcomes content={content} />
      </SectionReveal>

      {/* ── SocialProof ── */}
      <SectionReveal variant="fade-up">
        <SocialProof content={content} />
      </SectionReveal>

      {/* ── Pricing ── */}
      <SectionReveal variant="fade-up" delay={80}>
        <Pricing />
      </SectionReveal>

      {/* ── FAQ ── */}
      <SectionReveal variant="blur-in">
        <FAQ content={content} />
      </SectionReveal>

      {/* ── FinalCTA ── */}
      <SectionReveal variant="blur-in">
        <FinalCTA content={content} />
      </SectionReveal>

      {/* ── Structured Data ── */}
      <LandingJsonLd country={params.country} />

    </main>
  );
}
```

---

## ═══ المهمة 10 — تعديلات داخلية على الـ Components ═══

### 10a. `components/HowItWorks.tsx`

ابحث عن الـ `.map()` الذي يُنتج خطوات العملية واستبدل الـ wrapper بـ:

```tsx
import type { CSSProperties } from "react";

// داخل الـ map
{steps.map((step, index) => (
  <div
    key={step.id}
    data-reveal="slide-rtl"
    style={{ "--d": `${index * 120}ms` } as CSSProperties}
  >
    {/* محتوى الـ step كما هو */}
  </div>
))}
```

### 10b. `components/FAQ.tsx`

```tsx
import type { CSSProperties } from "react";

// داخل الـ map
{faqs.map((faq, index) => (
  <div
    key={faq.id}
    data-reveal="slide-rtl"
    style={{ "--d": `${index * 80}ms` } as CSSProperties}
  >
    {/* FAQItem كما هو */}
  </div>
))}
```

أيضاً في `FAQItem` — تأكد من وجود ARIA attributes:
```tsx
<button
  aria-expanded={isOpen}
  aria-controls={`faq-answer-${faq.id}`}
  onClick={() => setIsOpen(!isOpen)}
>
  {faq.question}
</button>
<div
  id={`faq-answer-${faq.id}`}
  hidden={!isOpen}
  role="region"
>
  {faq.answer}
</div>
```

### 10c. `components/Outcomes.tsx`

```tsx
import type { CSSProperties } from "react";

// داخل الـ map للأرقام
{stats.map((stat, index) => (
  <div
    key={stat.id}
    data-reveal="scale-pop"
    style={{ "--d": `${index * 90}ms` } as CSSProperties}
  >
    {/* محتوى الـ stat كما هو */}
  </div>
))}
```

### 10d. `components/SocialProof.tsx`

```tsx
// للـ testimonials cards — استخدم StaggerReveal
import { StaggerReveal, StaggerItem } from "@/components/SectionReveal";

<StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6" itemDelay={100}>
  {testimonials.map((t) => (
    <StaggerItem key={t.id}>
      {/* TestimonialCard كما هو */}
    </StaggerItem>
  ))}
</StaggerReveal>
```

### 10e. `components/Hero.tsx`

تأكد من هذه النقاط:
```tsx
// ✅ العنوان الرئيسي يجب أن يكون h1 وليس h2
<h1>{content.hero.title}</h1>

// ✅ لو في صورة في الـ Hero
<Image
  src={content.hero.image}
  alt={content.hero.imageAlt}
  priority          // ← مهم جداً للـ LCP
  fetchPriority="high"
  width={800}
  height={600}
/>
```

---

## ═══ المهمة 11 — حذف framer-motion من الـ Landing Components ═══

ابحث في كل ملف داخل `components/` عن هذه الـ imports:

```
import { LazyMotion, m, domAnimation, useReducedMotion } from "framer-motion"
import { motion } from "framer-motion"
import { m } from "framer-motion"
```

لكل ملف يحتوي عليها:
1. احذف الـ import
2. استبدل `<m.div>` أو `<motion.div>` بـ `<div>`
3. احذف أي props خاصة بـ framer مثل `initial`, `animate`, `whileInView`, `variants`, `transition`
4. الـ animation الآن تحصل عبر `data-reveal` attribute كما في المهام السابقة

**ملاحظة:** لو وجدت framer-motion في صفحات أخرى غير الـ landing page — لا تمسّها.

---

## ═══ التحقق من النجاح ═══

بعد الانتهاء، تحقق من التالي:

### تحقق 1 — لا framer في الـ landing
```bash
grep -r "framer-motion" components/ --include="*.tsx"
# يجب أن تكون النتيجة فارغة أو محدودة في non-landing components
```

### تحقق 2 — data-reveal موجود في الـ HTML
```bash
# افتح المتصفح → View Page Source → ابحث عن:
data-reveal
# يجب أن تجد الـ attribute على الـ sections
```

### تحقق 3 — JSON-LD موجود
```bash
# View Page Source → ابحث عن:
application/ld+json
# يجب أن تجد 3 scripts
```

### تحقق 4 — الـ Fonts
```bash
# Network tab في DevTools → ابحث عن fonts.googleapis.com
# يجب أن تكون الـ fonts تُحمّل من نفس domain (/_next/static/media/)
# وليس من Google
```

---

## ═══ ملخص الملفات ═══

| الملف | الإجراء | الأولوية |
|---|---|---|
| `styles/globals.css` | أضف CSS في النهاية | 🔴 مطلوب |
| `components/SectionReveal.tsx` | استبدل كاملاً | 🔴 مطلوب |
| `components/RevealObserver.tsx` | أنشئ جديد | 🔴 مطلوب |
| `app/layout.tsx` | أضف Font + Observer + Skip link | 🔴 مطلوب |
| `app/[country]/page.tsx` | أضف Metadata + JsonLd + Animations | 🔴 مطلوب |
| `app/sitemap.ts` | أنشئ جديد | 🟡 مهم |
| `app/robots.ts` | أنشئ جديد | 🟡 مهم |
| `components/LandingJsonLd.tsx` | أنشئ جديد | 🟡 مهم |
| `components/HowItWorks.tsx` | أضف data-reveal | 🟡 مهم |
| `components/FAQ.tsx` | أضف data-reveal + ARIA | 🟡 مهم |
| `components/Outcomes.tsx` | أضف data-reveal | 🟡 مهم |
| `components/SocialProof.tsx` | استخدم StaggerReveal | 🟢 تحسين |
| `components/Hero.tsx` | تأكد h1 + priority image | 🟢 تحسين |

---

## ═══ Checklist النهائي ═══

```
SEO
[ ] generateMetadata() في page.tsx
[ ] OG Image 1200×630 موجود في /public
[ ] JSON-LD (Organization + Service + FAQ)
[ ] Canonical URLs + hreflang
[ ] sitemap.ts + robots.ts
[ ] H1 واحد فقط في كل صفحة (Hero فقط)
[ ] alt text وصفي على كل الصور

Performance
[ ] Fonts من next/font لا @import
[ ] Hero = variant="none" (LCP)
[ ] priority على Hero image
[ ] dynamic imports للـ heavy components
[ ] لا framer-motion في الـ landing components

Animations
[ ] globals.css يحتوي @keyframes
[ ] SectionReveal.tsx بدون framer
[ ] RevealObserver.tsx موجود في layout.tsx
[ ] HowItWorks + FAQ + Outcomes تستخدم data-reveal

Accessibility
[ ] Skip to content link
[ ] focus-visible styles
[ ] FAQ aria-expanded + aria-controls
[ ] أيقونات زخرفية aria-hidden="true"
```