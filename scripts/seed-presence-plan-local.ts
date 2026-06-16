/**
 * One-off LOCAL ONLY: replace `free` plan with new `presence` plan ("حضور").
 *
 * Safety: refuses to run unless DATABASE_URL points to a dev DB (contains "_dev").
 */

import { PrismaClient } from "@prisma/client";

const DATABASE_URL = process.env.DATABASE_URL;

function abort(msg: string): never {
  console.error(`\n❌ ABORT: ${msg}\n`);
  process.exit(1);
}

if (!DATABASE_URL) abort("DATABASE_URL is required.");
if (!DATABASE_URL.includes("_dev")) abort(`DATABASE_URL "${DATABASE_URL.replace(/:[^@]+@/, ":***@").slice(0, 80)}" does not contain "_dev" — refusing (this script writes to local dev DB only).`);

console.log("Writing to:", DATABASE_URL.replace(/:[^@]+@/, ":***@").slice(0, 100));

const HIGHLIGHTS_SA = [
  "مقال شهري كامل نكتبه عن نشاطك من أول يوم",
  "صفحة تعريفية لنشاطك محسّنة لجوجل",
  "رابط خاص فيك تشاركه مع أي عميل أو شريك",
  "مقالك ينتشر تلقائياً على منصتين بدون ما تتعب",
  "شوف كم واحد قرأ مقالك هذا الأسبوع",
  "فريق الدعم موجود يجاوب على أي سؤال عندك",
];

const HIGHLIGHTS_EG = [
  "مقال شهري كامل بنكتبه عن نشاطك من أول يوم",
  "صفحة تعريفية لنشاطك متحسّنة لجوجل",
  "لينك خاص بيك تشاركه مع أي عميل أو شريك",
  "مقالك بينتشر أوتوماتيك على منصتين من غير ما تتعب",
  "شوف كام واحد قرأ مقالك الأسبوع ده",
  "فريق الدعم موجود يرد على أي سؤال عندك",
];

async function main() {
  const p = new PrismaClient();
  try {
    // 1. Delete old `free` plans
    const del = await p.plan.deleteMany({ where: { slug: "free" } });
    console.log(`Deleted ${del.count} free plan rows.`);

    // 2. Upsert new `presence` plans
    await p.plan.upsert({
      where: { country_slug: { country: "SA", slug: "presence" } },
      create: {
        country: "SA",
        slug: "presence",
        visible: true,
        displayOrder: 0,
        name: "حضور",
        tagline: "أقل تكلفة لظهور حقيقي على جوجل — بدون التزام طويل",
        priceMonthly: 110,
        priceYearly: 110,
        articlesLabel: "١ مقال شهرياً",
        ctaText: "ابدأ الحين",
        hook: null,
        highlights: HIGHLIGHTS_SA,
        badge: null,
        featuredBadge: null,
      },
      update: {
        visible: true,
        displayOrder: 0,
        name: "حضور",
        tagline: "أقل تكلفة لظهور حقيقي على جوجل — بدون التزام طويل",
        priceMonthly: 110,
        priceYearly: 110,
        articlesLabel: "١ مقال شهرياً",
        ctaText: "ابدأ الحين",
        hook: null,
        highlights: HIGHLIGHTS_SA,
        badge: null,
        featuredBadge: null,
      },
    });

    await p.plan.upsert({
      where: { country_slug: { country: "EG", slug: "presence" } },
      create: {
        country: "EG",
        slug: "presence",
        visible: true,
        displayOrder: 0,
        name: "حضور",
        tagline: "أقل تكلفة لظهور حقيقي على جوجل — من غير التزام طويل",
        priceMonthly: 1100,
        priceYearly: 1100,
        articlesLabel: "١ مقال شهرياً",
        ctaText: "ابدأ الحين",
        hook: null,
        highlights: HIGHLIGHTS_EG,
        badge: null,
        featuredBadge: null,
      },
      update: {
        visible: true,
        displayOrder: 0,
        name: "حضور",
        tagline: "أقل تكلفة لظهور حقيقي على جوجل — من غير التزام طويل",
        priceMonthly: 1100,
        priceYearly: 1100,
        articlesLabel: "١ مقال شهرياً",
        ctaText: "ابدأ الحين",
        hook: null,
        highlights: HIGHLIGHTS_EG,
        badge: null,
        featuredBadge: null,
      },
    });

    console.log("✅ Upserted SA + EG presence (حضور) plans.");

    // 3. Print final state
    const all = await p.plan.findMany({
      orderBy: [{ country: "asc" }, { displayOrder: "asc" }],
      select: { country: true, slug: true, name: true, priceMonthly: true, priceYearly: true, ctaText: true },
    });
    console.log("\nFinal plans in local DB:");
    for (const x of all) {
      console.log(`  ${x.country} / ${x.slug.padEnd(10)} | ${x.name.padEnd(12)} | m=${x.priceMonthly} y=${x.priceYearly}  | CTA: ${x.ctaText}`);
    }
  } finally {
    await p.$disconnect();
  }
}

main().catch((e) => { console.error("ERROR:", e); process.exit(1); });
