/**
 * Fix legal entity references across LandingSection rows.
 *
 *   ❌ Old: "شركة جبر سيو" / "جبر سيو" (Arabized brand name)
 *   ✅ New: "شركة جبر الجنوبية" (the actual registered company)
 *          + JBRSEO stays as Latin brand mark.
 *
 * Affected sections (SA + EG):
 *   - privacy.intro
 *   - terms.intro
 *   - terms.sections[definitions].body
 *   - terms.sections[billing].body
 *
 * SAFETY:
 *   1. Reads DATABASE_URL from .env.local EXPLICITLY (Prisma's default is .env
 *      which currently points at PROD — this script refuses that).
 *   2. Refuses to run unless URL contains 'modonty_dev'.
 *   3. Prints DB name + every string replacement performed.
 *   4. Prod is NOT touched — use scripts/fix-legal-entity-name-prod.mjs
 *      (mirror script) after dev is verified.
 *
 * Run: node scripts/fix-legal-entity-name.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────
// SAFETY: load DATABASE_URL explicitly from .env.local, verify dev.
// ─────────────────────────────────────────────────────────────────
function loadDevUrl() {
  const content = readFileSync(".env.local", "utf8");
  const line = content
    .split("\n")
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) {
    throw new Error("DATABASE_URL not found in .env.local — aborting.");
  }
  const raw = line.split("=").slice(1).join("=").trim();
  const url = raw.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
  if (!url.includes("modonty_dev")) {
    const dbName = url.split("@")[1]?.split("?")[0] ?? "(unknown)";
    throw new Error(
      `REFUSING TO RUN: DATABASE_URL does not contain 'modonty_dev'.\n` +
        `Got: ${dbName}\n` +
        `This script is for DEV ONLY. Use fix-legal-entity-name-prod.mjs for prod.`,
    );
  }
  return url;
}

const DEV_URL = loadDevUrl();
const dbName = DEV_URL.split("@")[1]?.split("?")[0] ?? "(unknown)";
console.log(`✅ Safety check passed — targeting: ${dbName}\n`);

const prisma = new PrismaClient({
  datasources: { db: { url: DEV_URL } },
});

// ─────────────────────────────────────────────────────────────────
// String replacements (exact, whole strings — no regex surprises).
// ─────────────────────────────────────────────────────────────────
const REPLACEMENTS = [
  {
    from: "نحن شركة جبر سيو (السجل التجاري ٤٠٣٠٥٦٠٤٦٠) — نُشغّل منصة مدونتي.",
    to: "نحن شركة جبر الجنوبية (السجل التجاري ٤٠٣٠٥٦٠٤٦٠) — نُشغّل منصة مدونتي عبر بوابة JBRSEO.",
    label: "privacy.intro",
  },
  {
    from: "(تُشغّلها شركة جبر سيو · السجل التجاري ٤٠٣٠٥٦٠٤٦٠)",
    to: "(تُشغّلها شركة جبر الجنوبية · السجل التجاري ٤٠٣٠٥٦٠٤٦٠)",
    label: "terms.intro",
  },
  {
    from: '**"جبر سيو"** = الشركة المُشغّلة (شركتنا) — تعمل كبوابة اشتراك ودفع للمنصة.',
    to: '**"جبر الجنوبية"** = الشركة المُشغّلة (شركتنا) — تدير بوابة الدفع JBRSEO للاشتراك في منصة مدونتي.',
    label: "terms.definitions",
  },
  {
    from: "**جبر سيو (jbrseo.com) = بوابة الدفع فقط.**",
    to: "**JBRSEO (jbrseo.com) = بوابة الدفع التابعة لشركة جبر الجنوبية.**",
    label: "terms.billing",
  },
];

async function main() {
  // Affected section keys — narrow scope, don't scan everything.
  const rows = await prisma.landingSection.findMany({
    where: { section: { in: ["privacy", "terms"] } },
  });

  console.log(`📖 Loaded ${rows.length} LandingSection row(s):\n`);
  for (const r of rows) console.log(`   · ${r.country}/${r.section} (id ${r.id})`);
  console.log();

  let totalReplacements = 0;

  for (const row of rows) {
    let json = JSON.stringify(row.data);
    let rowChanged = false;
    const rowHits = [];

    for (const { from, to, label } of REPLACEMENTS) {
      if (json.includes(from)) {
        json = json.split(from).join(to);
        rowHits.push(label);
        rowChanged = true;
        totalReplacements++;
      }
    }

    if (!rowChanged) {
      console.log(`   ⊘ ${row.country}/${row.section} — no match, skipped`);
      continue;
    }

    await prisma.landingSection.update({
      where: { id: row.id },
      data: { data: JSON.parse(json) },
    });
    console.log(`   ✏ ${row.country}/${row.section} — updated (${rowHits.join(", ")})`);
  }

  console.log(`\n✅ Done. Total string replacements: ${totalReplacements}`);
  if (totalReplacements === 0) {
    console.log(
      "⚠️  Zero replacements — either already fixed or the strings don't match exactly.",
    );
  }
}

main()
  .catch((e) => {
    console.error("\n❌ Script failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
