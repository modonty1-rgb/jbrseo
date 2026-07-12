/**
 * PRODUCTION mirror of scripts/fix-legal-entity-name.mjs + fix-legal-entity-definitions.mjs
 *
 * ⚠️ MANUAL RUN — Khalid runs this on the prod DB AFTER dev is verified.
 * Requires env var PROD_DATABASE_URL to be set at invocation time.
 *
 * Run:
 *   PROD_DATABASE_URL="mongodb+srv://...modonty?..." node scripts/fix-legal-entity-name-prod.mjs
 *
 * Or on Windows PowerShell:
 *   $env:PROD_DATABASE_URL="mongodb+srv://...modonty?..."
 *   node scripts/fix-legal-entity-name-prod.mjs
 *
 * SAFETY:
 *   1. Refuses if PROD_DATABASE_URL not set.
 *   2. Refuses if URL contains 'modonty_dev' (protect against copy-paste error).
 *   3. Requires the URL to end with 'modonty?' or contain '/modonty?' explicitly.
 *   4. Prints DB name + waits 5 seconds before writing — press Ctrl+C to abort.
 */
import { PrismaClient } from "@prisma/client";

const url = process.env.PROD_DATABASE_URL;
if (!url) {
  throw new Error(
    "PROD_DATABASE_URL not set. Export it before running:\n" +
      '  $env:PROD_DATABASE_URL="mongodb+srv://...modonty?..."',
  );
}
if (url.includes("modonty_dev")) {
  throw new Error("URL contains 'modonty_dev' — this is a PROD script. Aborting.");
}
if (!url.includes("/modonty?")) {
  throw new Error(
    `URL does not target the 'modonty' database. Got: ${url.split("@")[1]?.split("?")[0]}`,
  );
}

const dbName = url.split("@")[1]?.split("?")[0] ?? "(unknown)";
console.log(`⚠️  TARGETING PRODUCTION: ${dbName}`);
console.log(`⏳ Starting in 5 seconds — Ctrl+C to abort NOW.\n`);
await new Promise((r) => setTimeout(r, 5000));

const prisma = new PrismaClient({ datasources: { db: { url } } });

// Same replacements as dev — both plain and inner-quote-escaped forms.
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
    from: '- **\\"جبر سيو\\"** = الشركة المُشغّلة (شركتنا) — تعمل كبوابة اشتراك ودفع للمنصة.',
    to: '- **\\"جبر الجنوبية\\"** = الشركة المُشغّلة (شركتنا) — تدير بوابة الدفع JBRSEO للاشتراك في منصة مدونتي.',
    label: "terms.definitions",
  },
  {
    from: "**جبر سيو (jbrseo.com) = بوابة الدفع فقط.**",
    to: "**JBRSEO (jbrseo.com) = بوابة الدفع التابعة لشركة جبر الجنوبية.**",
    label: "terms.billing",
  },
];

const rows = await prisma.landingSection.findMany({
  where: { section: { in: ["privacy", "terms"] } },
});
console.log(`📖 Loaded ${rows.length} row(s):`);
for (const r of rows) console.log(`   · ${r.section} (id ${r.id})`);
console.log();

let total = 0;
for (const row of rows) {
  let json = JSON.stringify(row.data);
  let changed = false;
  const hits = [];
  for (const { from, to, label } of REPLACEMENTS) {
    if (json.includes(from)) {
      json = json.split(from).join(to);
      hits.push(label);
      changed = true;
      total++;
    }
  }
  if (!changed) {
    console.log(`   ⊘ ${row.section} — no match`);
    continue;
  }
  await prisma.landingSection.update({
    where: { id: row.id },
    data: { data: JSON.parse(json) },
  });
  console.log(`   ✏ ${row.section} — updated (${hits.join(", ")})`);
}

console.log(`\n✅ PROD updated. Total replacements: ${total}`);
await prisma.$disconnect();
