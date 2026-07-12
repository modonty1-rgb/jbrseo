/**
 * PROD MIRROR of fix-legal-name-full.mjs + fix-about-note.mjs merged.
 * Run manually AFTER dev is verified and code is pushed.
 *
 *   1. "الجبرة الجنوبية" → "جبر الجنوبية"           (privacy, terms, about)
 *   2. "السجل التجاري ٤٠٣٠٥٦٠٤٦٠" → "الرقم الموحّد 7036024383"
 *   3. about.legalInfo.legalName → "شركة جبر الجنوبية"
 *   4. about.legalInfo.crNumber  → "7036024383"
 *   5. about.legalInfo.note      → rewritten to reference الرقم الوطني الموحّد
 *
 * SAFETY: reads from .env, refuses unless URL contains 'modonty' AND NOT 'modonty_dev'.
 * Run: node scripts/fix-legal-name-full-prod.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadProdUrl() {
  const line = readFileSync(".env", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL not in .env");
  const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
  if (url.includes("modonty_dev")) {
    throw new Error(`REFUSING: this looks like DEV → ${url.split("@")[1]?.split("?")[0]}`);
  }
  if (!url.includes("/modonty?")) {
    throw new Error(`REFUSING: URL does not target /modonty → ${url.split("@")[1]}`);
  }
  return url;
}

const url = loadProdUrl();
console.log(`⚠ Targeting PRODUCTION: ${url.split("@")[1]?.split("?")[0]}\n`);
const prisma = new PrismaClient({ datasources: { db: { url } } });

const TEXT_REPLACEMENTS = [
  { from: "الجبرة الجنوبية", to: "جبر الجنوبية", label: "company name" },
  {
    from: "السجل التجاري ٤٠٣٠٥٦٠٤٦٠",
    to: "الرقم الموحّد 7036024383",
    label: "identifier",
  },
];

const NEW_NOTE =
  "يمكن التحقق من بيانات الشركة عبر الرقم الوطني الموحّد المذكور من خلال المنصة الوطنية للسجلات التجارية في المملكة العربية السعودية.";

const rows = await prisma.landingSection.findMany({
  where: { section: { in: ["privacy", "terms", "about"] } },
});
console.log(`📖 rows loaded: ${rows.length}\n`);

let totalHits = 0;
for (const row of rows) {
  let json = JSON.stringify(row.data);
  const hits = [];
  for (const { from, to, label } of TEXT_REPLACEMENTS) {
    const count = json.split(from).length - 1;
    if (count > 0) {
      json = json.split(from).join(to);
      hits.push(`${label} ×${count}`);
      totalHits += count;
    }
  }
  let nextData = JSON.parse(json);

  if (row.section === "about" && nextData?.legalInfo) {
    const before = { ...nextData.legalInfo };
    nextData = {
      ...nextData,
      legalInfo: {
        ...nextData.legalInfo,
        legalName: "شركة جبر الجنوبية",
        crNumber: "7036024383",
        note: NEW_NOTE,
      },
    };
    if (before.legalName !== nextData.legalInfo.legalName) hits.push("legalInfo.legalName");
    if (before.crNumber !== nextData.legalInfo.crNumber) hits.push("legalInfo.crNumber");
    if (before.note !== nextData.legalInfo.note) hits.push("legalInfo.note");
  }

  if (!hits.length) {
    console.log(`   ⊘ ${row.section} — no change`);
    continue;
  }
  await prisma.landingSection.update({
    where: { id: row.id },
    data: { data: nextData },
  });
  console.log(`   ✏ ${row.section} — ${hits.join(", ")}`);
}

console.log(`\n✅ PROD done. Total text hits: ${totalHits}`);
await prisma.$disconnect();
