# تقرير فني شامل: إصلاح مشاكل فهرسة jbrseo.com

**التاريخ**: 23 أبريل 2026
**الموقع**: https://www.jbrseo.com
**الإطار**: Next.js 15 / Vercel
**الحالة الحالية**: 1 صفحة مفهرسة / 14 معروفة

---

## 1. ملخص المشاكل في Google Search Console

| # | المشكلة | عدد الصفحات | الأولوية |
|---|---------|------------|---------|
| 1 | Redirect error (`/eg`) | 1 | عالية |
| 2 | Duplicate canonical (`/sa`) | 1 | عالية |
| 3 | Discovered - not indexed | 8 | متوسطة |
| 4 | Crawled - not indexed (Next.js assets) | 3 | منخفضة |

---

## 2. المشكلة الجوهرية: التعامل مع الإصدارين المصري والسعودي

### التشخيص

`/eg` و `/sa` نفس الصفحة بمحتوى مختلف (مصري مقابل سعودي). المشاكل الحالية:

1. **`/eg` — Redirect error**: الصفحة إما تعمل redirect loop أو تعيد التحويل على صفحة غير قابلة للزحف
2. **`/sa` — Duplicate canonical**: الصفحة تعلن canonical لنفسها لكن Google يرى أن هناك صفحة "أصلية" أخرى تطابقها (على الأرجح الصفحة الرئيسية `/` أو نسخة أخرى)

### السبب الجذري

Google لا يعرف أن هذه نسخ مترجمة/مختلفة جغرافياً لأنه **لا توجد إشارة hreflang** في الكود. فيرى الصفحات متشابهة في الهيكل ويعتبرها مكررة.

### الحل الصحيح: استخدام hreflang (ليس canonical)

**قاعدة ذهبية**: لا تستخدم canonical لحل مشكلة التكرار بين النسخ المحلية. canonical يخبر Google "هذه النسخة الرسمية الوحيدة"، بينما hreflang يخبره "هذه نسخ متعددة لمناطق مختلفة".

---

## 3. الكود المطلوب في Next.js 15

### 3.1 إضافة hreflang في كل صفحة محلية

**الملف**: `app/[locale]/page.tsx` أو الصفحات المحلية المشابهة

```typescript
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const baseUrl = "https://www.jbrseo.com";

  return {
    title: locale === "eg" ? "..." : locale === "sa" ? "..." : "JbrSEO",
    description: "...",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "ar-EG": `${baseUrl}/eg`,
        "ar-SA": `${baseUrl}/sa`,
        "x-default": `${baseUrl}`,
      },
    },
  };
}
```

**الشرح**:
- `canonical` يشير لنفس الصفحة (self-canonical) — كل نسخة هي الأصل لمنطقتها
- `languages` يحدد النسخ البديلة لكل منطقة بصيغة BCP 47 (`ar-EG` للمصري، `ar-SA` للسعودي)
- `x-default` للزوار من مناطق غير محددة

### 3.2 إضافة hreflang للصفحات الفرعية (pricing, signup)

```typescript
// app/[locale]/pricing/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://www.jbrseo.com";

  return {
    alternates: {
      canonical: `${baseUrl}/${locale}/pricing`,
      languages: {
        "ar-EG": `${baseUrl}/eg/pricing`,
        "ar-SA": `${baseUrl}/sa/pricing`,
        "x-default": `${baseUrl}/pricing`,
      },
    },
    // ... باقي الـ metadata
  };
}
```

كرّر نفس النمط لكل صفحة داخلية: `signup`, `about`, `team`, إلخ.

### 3.3 فحص Middleware (سبب محتمل لـ Redirect error على /eg)

**الملف**: `middleware.ts`

افتحه وتأكد من الآتي:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ❌ خطأ شائع: redirect loop
  // إذا كان لديك كود مثل هذا، احذفه
  // if (pathname === "/eg") {
  //   return NextResponse.redirect(new URL("/eg/home", request.url));
  // }

  // ✅ الصحيح: لا تعمل redirect على الصفحات الرئيسية للمنطقة
  // اترك /eg و /sa يعرضان صفحاتهما مباشرة
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // تجنّب الـ middleware للملفات الثابتة
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
```

**المشكلة الشائعة**: إذا كان middleware يعمل redirect من `/eg` إلى مكان ثانٍ ثم يعود لـ `/eg`، Google يرى redirect loop.

**طريقة الفحص**:
1. افتح Chrome DevTools → Network
2. ادخل https://www.jbrseo.com/eg
3. تحقّق من عدد الـ redirects (301/307/308)
4. إذا شفت أكثر من redirect أو دورة، المشكلة في middleware

### 3.4 إضافة محتوى فريد لكل نسخة (مهم جداً)

السبب اللي يخلّي Google يعتبرهم مكررين مو بس غياب hreflang، بل **تشابه المحتوى**. لازم تكون النسختين مختلفتين فعلياً:

**أمثلة على التمييز**:

| العنصر | النسخة المصرية (/eg) | النسخة السعودية (/sa) |
|--------|---------------------|----------------------|
| العملة | جنيه مصري (ج.م) | ريال سعودي (ر.س) |
| الأسعار | 500 ج.م/شهر | 70 ر.س/شهر |
| رقم الهاتف | +20 1x xxxx | +966 5x xxxx |
| الشهادات/العملاء | عملاء من مصر فقط | عملاء من السعودية فقط |
| اللهجة | مصرية (ازيك، ايه رأيك) | خليجية (كيفك، وش رأيك) |
| العناوين (H1) | فرق في العنوان الرئيسي | فرق في العنوان الرئيسي |
| الـ FAQ | أسئلة خاصة بالسوق المصري | أسئلة خاصة بالسوق السعودي |

### 3.5 تحديث Sitemap بالـ alternates

**الملف**: `app/sitemap.ts`

```typescript
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.jbrseo.com";

  const mainPages = ["", "/pricing", "/signup", "/about", "/team"];

  const result: MetadataRoute.Sitemap = [];

  mainPages.forEach((path) => {
    // النسخة الافتراضية
    result.push({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 1.0 : 0.8,
      alternates: {
        languages: {
          "ar-EG": `${baseUrl}/eg${path}`,
          "ar-SA": `${baseUrl}/sa${path}`,
        },
      },
    });

    // النسخة المصرية
    result.push({
      url: `${baseUrl}/eg${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 0.9 : 0.7,
      alternates: {
        languages: {
          "ar-EG": `${baseUrl}/eg${path}`,
          "ar-SA": `${baseUrl}/sa${path}`,
          "x-default": `${baseUrl}${path}`,
        },
      },
    });

    // النسخة السعودية
    result.push({
      url: `${baseUrl}/sa${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: path === "" ? 0.9 : 0.7,
      alternates: {
        languages: {
          "ar-EG": `${baseUrl}/eg${path}`,
          "ar-SA": `${baseUrl}/sa${path}`,
          "x-default": `${baseUrl}${path}`,
        },
      },
    });
  });

  return result;
}
```

### 3.6 تحديث robots.txt

**الملف**: `app/robots.ts`

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/_next/static/",   // ملفات framework (تظهر كـ "Crawled - not indexed")
          "/api/",             // API routes
          "/admin/",           // لوحة الإدارة
          "/*.json$",          // ملفات JSON داخلية
        ],
      },
    ],
    sitemap: "https://www.jbrseo.com/sitemap.xml",
    host: "https://www.jbrseo.com",
  };
}
```

---

## 4. خطة التنفيذ الموصى بها

### المرحلة 1: الإصلاحات الأساسية (اليوم)

- [ ] تحديث كل صفحة محلية بـ `generateMetadata` مع `languages` alternates
- [ ] فحص middleware والتأكد من عدم وجود redirect loops لـ `/eg`
- [ ] تحديث `sitemap.ts` ليشمل alternates
- [ ] تحديث `robots.ts` لحجب `/_next/static/`
- [ ] نشر التغييرات على Vercel

### المرحلة 2: التمييز في المحتوى (خلال أسبوع)

- [ ] مراجعة جميع صفحات `/eg` و `/sa` وتمييز المحتوى:
  - العملات والأسعار
  - اللهجة وطريقة الكلام
  - أرقام التواصل
  - العملاء والشهادات
  - الأسئلة الشائعة
- [ ] إضافة 200-500 كلمة محتوى فريد لكل نسخة

### المرحلة 3: طلب الفهرسة (بعد النشر)

- [ ] في GSC: Inspect URL → تحقق من الصفحات الأساسية
- [ ] اضغط "Request indexing" لكل صفحة مهمة
- [ ] قدّم sitemap.xml المحدّث
- [ ] انتظر 3-7 أيام للرؤية

### المرحلة 4: المتابعة (أسبوعياً)

- [ ] راقب تقرير Page Indexing في GSC
- [ ] راقب Performance لمعرفة كلمات البحث
- [ ] اضبط المحتوى بناءً على البيانات

---

## 5. اختبارات بعد التنفيذ

### 5.1 اختبار hreflang

بعد النشر، افتح:
```
view-source:https://www.jbrseo.com/eg
```

ابحث عن:
```html
<link rel="alternate" hrefLang="ar-EG" href="https://www.jbrseo.com/eg" />
<link rel="alternate" hrefLang="ar-SA" href="https://www.jbrseo.com/sa" />
<link rel="alternate" hrefLang="x-default" href="https://www.jbrseo.com" />
<link rel="canonical" href="https://www.jbrseo.com/eg" />
```

### 5.2 اختبار الـ redirects

```bash
curl -I https://www.jbrseo.com/eg
# يفترض تشوف: HTTP/2 200 (ليس 307 أو 308 أو 301)

curl -I https://www.jbrseo.com
# يفترض تشوف: HTTP/2 308 → https://www.jbrseo.com (أو نسخة www)
```

### 5.3 التحقق من Google Search Console

- Validate Fix لكل من "Redirect error" و "Duplicate canonical"
- متابعة التقارير أسبوعياً

---

## 6. أخطاء شائعة تجنّبها

1. ❌ **لا تستخدم canonical لتوجيه `/eg` إلى `/sa` أو العكس** — هذا يلغي النسخة التي توجّه منها
2. ❌ **لا تضع hreflang بدون self-reference** — كل صفحة لازم تشير لنفسها أيضاً في الـ languages
3. ❌ **لا تستخدم `ar` فقط** — استخدم `ar-EG` و `ar-SA` (الرمز الكامل BCP 47)
4. ❌ **لا تنسى `x-default`** — للزوار من مناطق أخرى
5. ❌ **لا تختلف اللغة في عناوين HTTP بدون hreflang** — لازم الاثنين معاً

---

## 7. المصادر الرسمية

- [Next.js 15 - generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js 15 - Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [Google - Localized versions of your pages (hreflang)](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google - Managing multi-regional sites](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
- [Google - Canonicalization](https://developers.google.com/search/docs/crawling-indexing/canonicalization)

---

## 8. ملخص تنفيذي (TL;DR)

1. **المشكلة الأم**: غياب hreflang لكن وجود نسختين متشابهتين → Google يعتبرهم مكررين
2. **الحل الأساسي**: أضف `languages` في `alternates` بكل صفحة محلية
3. **لا تستخدم canonical للتوجيه بين النسخ** — كل صفحة self-canonical
4. **ميّز المحتوى الفعلي** بين النسختين (عملة، لهجة، أرقام، عملاء)
5. **أصلح middleware** لضمان عدم وجود redirect loop على `/eg`
6. **حدّث sitemap** مع alternates
7. **بعد النشر**: طلب إعادة الفهرسة عبر URL Inspection + Validate Fix

بمجرد تطبيق هذه الإصلاحات، يُتوقع أن ترى:
- `/eg` و `/sa` مفهرستين في خلال 2-4 أسابيع
- الصفحات الـ 8 الأخرى تُفهرس تدريجياً بعد طلب الفهرسة
- اختفاء مشكلة "Duplicate canonical" بعد ظهور hreflang في الصفحات
- اختفاء "Redirect error" بعد إصلاح middleware
