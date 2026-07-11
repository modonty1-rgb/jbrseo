/**
 * SHARED FEATURES CATALOG — single source of truth for plan features.
 *
 * Consumed by:
 *   - app/features/page.tsx           (comparison table)
 *   - app/components/landing/*        (pricing cards on landing/homepage — via getPlanKeyFeatures)
 *   - scripts/update-features-*.mjs   (dev + prod DB seed — still writes to LandingSection for future admin editing)
 *
 * Shape:
 *   rows: [
 *     { category: "..." }                                        // section separator
 *     { label: "...", values: [حضور, انطلاقة, زخم, ريادة] }     // feature row
 *   ]
 *
 * Values legend:
 *   "✓"          → included
 *   "—"          → not included
 *   "<free text>" → tier-specific value (e.g. "٤ حملات/شهر", "أسبوعي", "٧٢ ساعة")
 */

export const PLAN_SLUGS = ["presence", "starter", "growth", "scale"];

export const featuresCatalog = {
  rows: [
    // ═══ 🌐 الأساسيات (بنية النشر) ═══
    { category: "🌐 الأساسيات (بنية النشر)" },
    { label: "📄 صفحة عميل عامة (بديل موقع إلكتروني)", values: ["✓", "✓", "✓", "✓"] },
    { label: "🌐 نشر على منصة مدونتي",                     values: ["✓", "✓", "✓", "✓"] },
    { label: "📱 سوشال ميديا مدونتي",                      values: ["—", "✓", "✓", "✓"] },
    { label: "🛡️ شارة «موثّق» + بيانات قانونية",         values: ["✓", "✓", "✓", "✓"] },

    // ═══ ✍️ إنتاج المحتوى ═══
    { category: "✍️ إنتاج المحتوى" },
    { label: "🔍 بحث الكلمات المفتاحية",                    values: ["أساسي", "موسّع", "تنافسي", "إستراتيجي"] },
    { label: "🎨 تصميم صور احترافية + بطاقات المشاركة",    values: ["✓", "✓", "✓", "✓"] },
    { label: "✅ موافقتك قبل نشر كل مقال",                  values: ["✓", "✓", "✓", "✓"] },
    { label: "⚡ سرعة تجهيز المقال جاهز لمراجعتك",         values: ["٧-١٠ أيام", "٥-٧ أيام", "٣-٥ أيام", "٤٨-٧٢ ساعة"] },

    // ═══ 👥 اكتساب العملاء ═══
    { category: "👥 اكتساب العملاء" },
    { label: "📅 نظام حجوزات «احجز الآن» (للمحتوى الحساس)", values: ["—", "—", "✓", "✓"] },
    { label: "🌍 رابط خارجي لموقعك (للمتاجر والمواقع العادية)", values: ["—", "—", "✓", "✓"] },
    { label: "💬 زر واتساب في صفحة العميل (تواصل مباشر)",   values: ["✓", "✓", "✓", "✓"] },
    { label: "❓ سؤال مباشر تحت كل مقال (يرد عليه العميل)", values: ["✓", "✓", "✓", "✓"] },
    { label: "⭐ آراء وتقييمات العملاء",                    values: ["قراءة فقط", "+ رد", "+ رد", "+ رد"] },
    { label: "📧 حملات إيميل ماركتنق (عروض/تنبيهات لعملائك)", values: ["—", "—", "٤ حملات/شهر", "٨ حملات/شهر"] },

    // ═══ 📈 التحليل والتنبيهات ═══
    { category: "📈 التحليل والتنبيهات" },
    { label: "📊 تقارير مباشرة في اللوحة",                 values: ["أساسي", "كامل", "كامل", "كامل"] },
    { label: "🔔 تنبيهات تيليجرام",                         values: ["٥ من ٢٣", "٢٣ كاملة", "٢٣ كاملة", "٢٣ كاملة"] },
    { label: "🔎 صلاحية وصول لـ Google Search Console",     values: ["—", "—", "—", "✓"] },

    // ═══ 🚀 التقنيات المتقدمة ═══
    { category: "🚀 التقنيات المتقدمة" },
    { label: "🤖 تجهيز فني كامل للمقال (يفهمه قوقل ويظهره)", values: ["✓", "✓", "✓", "✓"] },
    { label: "🧠 محتواك جاهز للذكاء الاصطناعي", values: ["—", "—", "✓", "✓"] },
    { label: "⚕️ توثيق مؤهلات الكاتب (طبي · مالي · قانوني)", values: ["—", "—", "✓", "✓"] },

    // ═══ 🎧 الخدمة والدعم ═══
    { category: "🎧 الخدمة والدعم" },
    { label: "⏱️ مدة الرد على استفساراتك",                  values: ["٧٢ ساعة", "٤٨ ساعة", "٢٤ ساعة", "٤ ساعات"] },
    { label: "👤 مدير حساب مخصص",                            values: ["—", "—", "—", "✓"] },
    { label: "📅 جلسة استراتيجية مع مدير الحساب",           values: ["—", "—", "—", "ربع سنوية"] },
  ],
};

/**
 * Return top-N features for a given plan (for landing pricing cards).
 * Skips category rows and rows where the plan value is "—" (not included).
 * For "✓" it returns the raw label; for tier-specific values it returns "label: value".
 */
export function getPlanKeyFeatures(slug, limit = 6) {
  const idx = PLAN_SLUGS.indexOf(slug);
  if (idx < 0) return [];

  const out = [];
  for (const row of featuresCatalog.rows) {
    if (!row.label || !row.values) continue;
    const v = row.values[idx];
    if (!v || v === "—") continue;
    out.push(v === "✓" ? row.label : `${row.label}: ${v}`);
    if (out.length >= limit) break;
  }
  return out;
}

/**
 * Return the "why-upgrade" story for a plan — features that DIFFER from the tier below.
 * Answers the buyer's question: "why should I pay more than the previous tier?"
 *
 *   - Entry tier (no lower tier) → falls back to top-N base features (getPlanKeyFeatures).
 *   - Higher tier → each row where THIS tier's value differs from the tier below:
 *       * prev "—" + mine "✓"         → new feature (return label)
 *       * prev "—" + mine "<text>"    → new feature with value (return "label: value")
 *       * prev "<text>" + mine "<text2>" → upgrade (return "label: prev → mine")
 *       * equal values → skipped (no differentiation)
 */
export function getPlanDifferentiators(slug, limit = 5) {
  const idx = PLAN_SLUGS.indexOf(slug);
  if (idx <= 0) return getPlanKeyFeatures(slug, limit);

  const prevIdx = idx - 1;
  const out = [];
  for (const row of featuresCatalog.rows) {
    if (!row.label || !row.values) continue;
    const mine = row.values[idx];
    const prev = row.values[prevIdx];
    if (!mine || mine === "—") continue;
    if (prev === mine) continue;

    if (prev === "—" || prev === undefined) {
      out.push(mine === "✓" ? row.label : `${row.label}: ${mine}`);
    } else {
      out.push(`${row.label}: ${prev} → ${mine}`);
    }
    if (out.length >= limit) break;
  }
  return out;
}

// Legacy alias so existing update scripts keep working during the transition.
export const featuresComparisonData = featuresCatalog;
