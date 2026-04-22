# SEO TODO — jbrseo.com
> آخر تحديث: 2026-04-22

---

## الأولوية: 🔴 حرجة

### ✅ 1. `fetchPriority="high"` + `loading="eager"` على صورة الـ Hero
**الملف:** `app/components/landing/hero/HeroBrandTag.tsx`
**تم:** أضفنا `fetchPriority="high"` و`loading="eager"` للشعار فوق الـ fold.
**ملاحظة:** `priority` كانت legacy فقط — الطريقة الصحيحة في Next.js v16 هي `fetchPriority`.

---

### ✅ 2. Metadata كاملة لصفحة Features
**الملف:** `app/(site)/features/page.tsx`
**تم:** أضفنا `robots`، `canonical`، `openGraph`، `twitter`، `hreflang`.

---

## الأولوية: 🟡 متوسطة

### ✅ 3. `robots` صريح لصفحة Terms
**الملف:** `app/(site)/terms/page.tsx`
**تم:** أضفنا `PUBLIC_INDEX_FOLLOW_ROBOTS` مثل باقي الصفحات.

---

### ✅ 4. صلح رقم الهاتف placeholder في JSON-LD
**الملف:** `app/components/shared/LandingJsonLd.tsx`
**تم:** حذفنا الـ placeholder الثابت — الرقم الآن يجي من `content.siteSettings?.phone` فقط لو موجود.

---

### ✅ 5. `HOME_SA_DESCRIPTION` من CMS بدل hardcoded
**الملف:** `app/[country]/(marketingShell)/page.tsx`
**تم:** الكود الآن يقرأ `s.description` من الـ CMS أولاً، ويرجع للـ fallback لو فاضي.

---

### ✅ 6. LocalBusiness Schema
**الملف:** `app/components/shared/LandingJsonLd.tsx`
**تم:** أضفنا `LocalBusiness` schema مع عنوان حسب الدولة (SA/EG).

---

## الأولوية: 🟢 منخفضة

### ⏳ 7. AggregateRating Schema
**الملف:** `app/components/shared/LandingJsonLd.tsx`
**المشكلة:** لا يوجد تقييم على Organization — تفوت فرصة rich snippets (نجوم في نتائج البحث).
**الشرط:** يحتاج بيانات تقييم حقيقية (عدد مراجعات + متوسط النجوم) من الـ CMS أو DB.
**الأثر:** Rich Snippets / CTR

---

## ملخص

| الحالة | # | المهمة | الأثر | الملف |
|--------|---|--------|-------|-------|
| ✅ | 1 | `fetchPriority` + `loading="eager"` على Hero | 🔴 LCP | `HeroBrandTag.tsx` |
| ✅ | 2 | Metadata كاملة لـ Features | 🔴 Indexing | `features/page.tsx` |
| ✅ | 3 | `robots` لـ Terms | 🟡 Consistency | `terms/page.tsx` |
| ✅ | 4 | رقم الهاتف في JSON-LD من CMS | 🟡 Schema | `LandingJsonLd.tsx` |
| ✅ | 5 | `HOME_SA_DESCRIPTION` → CMS | 🟡 Ops | `page.tsx` |
| ✅ | 6 | LocalBusiness schema | 🟢 Local SEO | `LandingJsonLd.tsx` |
| ⏳ | 7 | AggregateRating schema | 🟢 Rich Snippets | `LandingJsonLd.tsx` |
