# Looker Studio Report · مطابقة الأرقام مع Impact Bar

## 🎯 لماذا هذا الملف؟

على `/sa` أضفنا **Modonty Impact Bar** يعرض أرقام GA4 لايف (مثال: 85,425 الأثر الرقمي).
كذلك أضفنا **زرّين للتحقق** تحته:
- 📊 التحاليل التفصيلية → `https://www.modonty.com/analytics`
- [G] تقرير Google الرسمي → `https://datastudio.google.com/s/nBnyGkiUdGw`

**المشكلة:** تقرير Looker Studio يعرض افتراضياً "last 12 months" (مدى أقصر) → الأرقام على Google تظهر أصغر من شريطنا:

| المقياس | شريطنا (SINCE=2025-01-01) | Looker Studio (افتراضي) |
|---|---:|---:|
| Sessions | 17,359 | 15.4K |
| Total users | 12,560 | 11.8K |
| Views | 9,938 | 6.3K |
| Event count | 57,201 | 43.6K |

**العميل لو شاف اختلاف = فقدان مصداقية.**

## ✅ الحل (نتّبعه قبل الـ Production Push)

**نغيّر Looker Studio ليطابق كودنا** (تراكمياً منذ `2025-01-01`).

### الخطوات (٧ خطوات · دقيقتان):

**١.** افتح التقرير بحساب Google المالك:
```
https://datastudio.google.com/s/nBnyGkiUdGw
```

**٢.** اضغط زر **"Edit"** أعلى يمين الصفحة.

**٣.** فوق التقرير، اضغط على مربّع **Date Range**.

**٤.** من القائمة اليمنى → **"Default date range"** → اختر **"Custom"**.

**٥.** حدّد المدى:
- **Start date:** `Jan 1, 2025`
- **End date:** `Today`

**٦.** اضغط **"View"** أعلى يمين (يخرج من وضع التعديل · حفظ تلقائي).

**٧.** تحقّق:
افتح التقرير في متصفّح Incognito. لازم تشوف:
- Sessions ≈ 17.4K
- Total users ≈ 12.5K
- Views ≈ 9.9K

لو الأرقام كبرت = المطابقة صارت ✅

## 🔗 الروابط المستخدمة على JBRSEO

- `/sa` → Impact Bar → زر Google → يفتح Looker Studio
- `/sa` → Impact Bar → زر التحاليل → يفتح `modonty.com/analytics`

## ⚠️ ملاحظات

- **صلاحية التعديل:** المستخدم الحالي لازم يكون مالك التقرير على Google Drive.
- **بدائل لو ما نقدر نعدّل Looker:** غيّر `SINCE` في `lib/analytics/ga4.ts` من `"2025-01-01"` إلى `"365daysAgo"` (يطابق افتراض Looker).
- **الاختلاف الطفيف (~5%):** Google يعالج البيانات مع تأخير 12-24 ساعة. اختلاف ٥٪ بين المصدرين مقبول ومتوقّع.

## 📅 تاريخ الإضافة

2026-07-10 — Khalid + Claude
