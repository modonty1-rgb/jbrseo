# Hardcoded Text Audit — Landing Page
> النصوص الباقية فعلياً في الكود بعد تنظيف الـ dead code
> آخر تحديث: 2026-04-22

---

## الرموز

| الرمز | المعنى |
|-------|--------|
| ✅ **LIVE** | مرئي للزائر دائماً |
| ⚙️ **CONDITIONAL** | يظهر بشرط (موبايل / تفاعل / screen reader) |
| 🛡️ **FALLBACK** | كود دفاعي — يظهر فقط لو الـ DB فاضي |

---

## 1. Hero

### [hero/Hero.tsx](app/components/landing/hero/Hero.tsx)
| | النص |
|-|------|
| ✅ | `"ابدأ مجاناً — بدون بطاقة ←"` |
| ✅ | `"✓ بدون بطاقة · ✓ ١٤ يوم ضمان كامل"` |

### [hero/HeroBrandTag.tsx](app/components/landing/hero/HeroBrandTag.tsx)
| | النص |
|-|------|
| ✅ | `"مدونتي — أقوى موظف مبيعات عندك"` |
| ✅ | `"منصة سعودية تصنع الفرق"` |
| ✅ | `"ترتيب جوجل"` |
| ✅ | `"+٣٨٠٪ زيارات"` |

### [hero/HeroTrustBar.tsx](app/components/landing/hero/HeroTrustBar.tsx)
| | النص | ملاحظة |
|-|------|---------|
| 🛡️ | `"آفاق للاستشارات"` · `"زوايا العقارية"` · `"عيادات النور"` · `"منصة إدراك"` · `"رحلاتي للسياحة"` · `"نخبة المحاسبين"` | fallback لو DB فاضي |
| 🛡️ | `"يثق بنا +١٢٠ نشاط تجاري في السعودية ومصر"` | fallback لو DB فاضي |

---

## 2. Calculator

### [Calculator/calculatorCopy.ts](app/components/landing/Calculator/calculatorCopy.ts)
| | النص |
|-|------|
| ✅ | `"قبل السعر: احسب تكلفة البديل"` |
| ✅ | `"كم يكلّفك البديل فعلاً؟"` |
| ✅ | `"نسبة التوفير المحتملة: "` |
| ✅ | `"❌ بدون مدونتي"` |
| ✅ | `"إجمالي رواتب الفريق حسب السلايدرز"` |
| ✅ | `"✓ مع مدونتي"` |
| ✅ | `"اشتراك مدونتي ثابت شهرياً وسنوياً"` |
| ✅ | `"✓ مشمول"` |
| ✅ | `"حجم التوفير مع مدونتي"` |
| ✅ | `"الفرق (التوفير)"` |
| ✅ | `"كاتب محتوى SEO"` · `"مصمم جرافيك"` · `"متخصص SEO"` · `"مدير سوشال ميديا"` · `"مونتير / منتج فيديو"` · `"مطور مواقع"` |
| ✅ | `"اضبط رواتب فريقك الحالي أو المتوقع"` |
| ✅ | `"🔒 بياناتك ملكك دائماً"` · `"💬 دعم عربي ١٠٠٪"` · `"↩️ ضمان ١٤ يوم"` · `"⚡ نشر خلال ٧٢ ساعة"` |
| ✅ | `"مقالات SEO احترافية"` · `"تصميم وصفحة خاصة"` · `"تهيئة محركات البحث"` · `"ترويج ٨ منصات اجتماعية"` · `"إنتاج ريلز شهرياً"` · `"صفحة شركة (بدون مطور)"` · `"نشر وإدارة كاملة"` |
| ✅ | `"إدارة وتنسيق"` · `"+ وقتك"` |
| ✅ | `"شوف جزء مما ستحصل عليه مع مدونتي ←"` (secondaryCta) |

### [Calculator/IntroBlock.tsx](app/components/landing/Calculator/IntroBlock.tsx)
| | النص |
|-|------|
| ✅ | `"عشان تظهر في جوجل وتبني أصل رقمي قوي، غالبًا تحتاج فريق كامل..."` |

---

## 3. How It Works

### [HowItWorks/HowItWorksCTA.tsx](app/components/landing/HowItWorks/HowItWorksCTA.tsx)
| | النص |
|-|------|
| ✅ | `"شوف كيف يعمل بالتفصيل ←"` |

---

## 4. Outcomes

### [Outcomes/Outcomes.tsx](app/components/landing/Outcomes/Outcomes.tsx)
| | النص |
|-|------|
| ✅ | `"اكتشف كل ما تحصل عليه"` |

---

## 5. FAQ

### [FAQ/FAQ.tsx](app/components/landing/FAQ/FAQ.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ✅ | `"الأسئلة الشائعة"` | fallback title |
| ✅ | `"تحدث معنا على واتساب"` | |
| 🛡️ | `LEGACY_FAQ_H2` (غير مرئي) | migration guard — مقارنة داخلية فقط |

---

## 6. Social Proof

### [SocialProof/SocialProofCard.tsx](app/components/landing/SocialProof/SocialProofCard.tsx)
| | النص |
|-|------|
| ✅ | `"زيارة الموقع"` |

---

## 7. Pricing

### [price-section/PlanCard.tsx](app/components/landing/price-section/PlanCard.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ⚙️ | `"تفاصيل السعر"` | مخفي — يظهر عند تفاعل |
| ⚙️ | `"عرض كل المميزات"` | toggle — يظهر لو highlights > 3 |
| ⚙️ | `"إخفاء التفاصيل"` | toggle — يظهر بعد الضغط |
| ✅ | `"شوف كل ما تشمله الخطة ←"` | |

### [price-section/PriceSectionHeader.tsx](app/components/landing/price-section/PriceSectionHeader.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ⚙️ | `"طريقة الدفع"` | aria-label فقط (screen readers) |

---

## 8. Final CTA

### [FinalCTA/FinalCTAButtons.tsx](app/components/landing/FinalCTA/FinalCTAButtons.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ✅ | `"أو"` | desktop |
| ⚙️ | `"— أو —"` | mobile فقط |

---

## 9. Exit Intent Popup

### [ExitIntentPopup.tsx](app/components/landing/ExitIntentPopup.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ⚙️ | `"💰  السعر مرتفع عليّ"` · `"🤔  لسه أفكر"` · `"💬  أبي أتكلم مع أحد أولاً"` · `"⏰  مش وقتي الحين"` | exit intent فقط |
| ⚙️ | `"✋ لحظة قبل ما تروح"` · `"خذ مقالك الأول — مجاناً"` | exit intent فقط |
| ⚙️ | `"فريقنا يكتب لك مقال كامل محسّن لجوجل خلال ٧ أيام — بدون بطاقة ائتمان وبدون التزام."` | exit intent فقط |
| ⚙️ | `"مقال احترافي كامل مجاناً"` · `"صفحة شركتك على الشبكة فوراً"` · `"ضمان استرداد ١٤ يوم"` | exit intent فقط |
| ⚙️ | `"ابدأ مجاناً — بدون بطاقة"` · `"تحدث معنا على واتساب"` · `"لا شكراً، سأكمل بدون محتوى"` | exit intent فقط |
| ⚙️ | `"ثانية واحدة بس 🙏"` · `"ليش ما اشتركت؟"` · `"رأيك يساعدنا نتحسن — ضغطة واحدة وخلاص."` | micro-survey |
| ⚙️ | `"تخطي"` · `"شكراً على رأيك!"` · `"سنعمل على التحسين بناءً على ملاحظاتك."` | micro-survey |

---

## 10. Sticky Mobile CTA

### [StickyMobileCTA.tsx](app/components/landing/StickyMobileCTA.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ✅ | `"ابدأ مجاناً"` | |
| ⚙️ | `"تواصل عبر واتساب"` | aria-label |

---

## 11. Header

### [header/LandingHeader.tsx](app/components/layout/header/LandingHeader.tsx)
| | النص | ملاحظة |
|-|------|---------|
| ✅ | `"شوف الأسعار"` | يظهر لو pricingHref يحتوي #pricing |
| ✅ | `"ابدأ مجاناً — بدون بطاقة"` | DEFAULT_CTA للـ header |

### [layout.tsx](app/%5Bcountry%5D/(marketingShell)/layout.tsx)
| | النص |
|-|------|
| ✅ | `"ابدأ مجاناً — بدون بطاقة ←"` (navPrimaryCtaLabel) |

---

## 12. Footer

### [footer/Footer.tsx](app/components/layout/footer/Footer.tsx)
| | النص |
|-|------|
| ✅ | `"© جميع الحقوق محفوظة — JBRSEO"` |
| ✅ | `"روابط سريعة"` |
| ✅ | `"تابعنا"` |
| ✅ | `"مدعوم بـ"` |

---

## 13. Shared

### [shared/BankTrustBadge.tsx](app/components/shared/BankTrustBadge.tsx)
| | النص |
|-|------|
| ✅ | `"الدفع الآمن عبر"` |

---

## 14. Page File

### [page.tsx](app/%5Bcountry%5D/(marketingShell)/page.tsx)
| | النص |
|-|------|
| ✅ | `"شوف الأسعار والخطة المناسبة"` |
| ✅ | `"ابدأ مجاناً — بدون بطاقة"` |
| ✅ | `"ابدأ الحين — ١٤ يوم ضمان كامل ✅"` |

---

## ملخص

| | العدد |
|-|-------|
| ✅ LIVE | ~48 نص |
| ⚙️ CONDITIONAL | ~20 نص (popup / toggles / mobile / aria) |
| 🛡️ FALLBACK | 8 نصوص (DB fallbacks + migration guard) |
