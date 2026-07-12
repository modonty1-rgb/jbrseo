/**
 * FINAL legal-entity correction (DEV DB) — aligned to the actual CR certificate.
 *
 * Certificate authority (public/trust/jabr-cr-certificate.png):
 *   Registered:  "شركة جبر الجنوبية للمقاولات"
 *   Unified No:  7036024383
 * Marketing decision (Khalid): drop "للمقاولات" from public copy to avoid
 *   confusing customers ("you sell tech but you're a contractor?").
 * Public-facing legal name:  "شركة جبر الجنوبية"
 *
 * Current DEV DB state (verified via inspect-legal-current.mjs):
 *   privacy.intro / terms.intro : "شركة الجبرة الجنوبية"  +  CR "٤٠٣٠٥٦٠٤٦٠"
 *   about.legalInfo             : legalName = "شركة الجبرة الجنوبية", crNumber = "4030560460"
 *
 * This script:
 *   1. Text replace: "الجبرة الجنوبية" → "جبر الجنوبية"          (privacy, terms, about)
 *   2. Text replace: "السجل التجاري ٤٠٣٠٥٦٠٤٦٠" → "الرقم الموحّد 7036024383"
 *   3. about.legalInfo.legalName → "شركة جبر الجنوبية"
 *   4. about.legalInfo.crNumber  → "7036024383"
 *
 * SAFETY: DEV only — refuses if URL doesn't contain 'modonty_dev'.
 * Run: node scripts/fix-legal-name-full.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadDevUrl() {
  const line = readFileSync(".env.local", "utf8")
    .split("\n")
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL not in .env.local");
  const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
  if (!url.includes("modonty_dev")) {
    throw new Error(`REFUSING: not dev → ${url.split("@")[1]?.split("?")[0]}`);
  }
  return url;
}

const url = loadDevUrl();
console.log(`✅ Targeting: ${url.split("@")[1]?.split("?")[0]}\n`);
const prisma = new PrismaClient({ datasources: { db: { url } } });

const TEXT_REPLACEMENTS = [
  { from: "الجبرة الجنوبية", to: "جبر الجنوبية", label: "company name" },
  {
    from: "السجل التجاري ٤٠٣٠٥٦٠٤٦٠",
    to: "الرقم الموحّد 7036024383",
    label: "identifier",
  },
];

const sectionRows = await prisma.landingSection.findMany({
  where: { section: { in: ["privacy", "terms", "about"] } },
});
console.log(`📖 rows loaded: ${sectionRows.length}\n`);

let totalHits = 0;
for (const row of sectionRows) {
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
      },
    };
    if (before.legalName !== nextData.legalInfo.legalName) hits.push("legalInfo.legalName");
    if (before.crNumber !== nextData.legalInfo.crNumber) hits.push("legalInfo.crNumber");
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

console.log(`\n✅ Done. Total text hits: ${totalHits}`);
await prisma.$disconnect();
