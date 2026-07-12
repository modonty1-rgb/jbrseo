/**
 * Second-pass fix — the terms.definitions body contains inner quotes
 * ("جبر سيو" as a defined term), which JSON.stringify escapes as \"...\"
 * so the first pass didn't match. Handled here with the correct escaped form.
 *
 * Run: node scripts/fix-legal-entity-definitions.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

function loadDevUrl() {
  const content = readFileSync(".env.local", "utf8");
  const line = content
    .split("\n")
    .find((l) => l.trim().startsWith("DATABASE_URL="));
  if (!line) throw new Error("DATABASE_URL not found in .env.local");
  const url = line
    .split("=")
    .slice(1)
    .join("=")
    .trim()
    .replace(/^"(.*)"$/, "$1");
  if (!url.includes("modonty_dev")) {
    throw new Error(
      `REFUSING: DATABASE_URL not modonty_dev → ${url.split("@")[1]?.split("?")[0]}`,
    );
  }
  return url;
}

const url = loadDevUrl();
console.log(`✅ Targeting: ${url.split("@")[1]?.split("?")[0]}\n`);

const prisma = new PrismaClient({ datasources: { db: { url } } });

// The definition bullet uses inner quotes. Stored in DB as JSON.stringify → \"…\"
// Match the escaped form + replace with the corrected escaped form.
const FROM = '- **\\"جبر سيو\\"** = الشركة المُشغّلة (شركتنا) — تعمل كبوابة اشتراك ودفع للمنصة.';
const TO = '- **\\"جبر الجنوبية\\"** = الشركة المُشغّلة (شركتنا) — تدير بوابة الدفع JBRSEO للاشتراك في منصة مدونتي.';

const rows = await prisma.landingSection.findMany({ where: { section: "terms" } });
console.log(`📖 Loaded ${rows.length} terms row(s)\n`);

let hits = 0;
for (const row of rows) {
  const json = JSON.stringify(row.data);
  if (!json.includes(FROM)) {
    console.log(`   ⊘ id ${row.id} — no match`);
    continue;
  }
  const patched = json.split(FROM).join(TO);
  await prisma.landingSection.update({
    where: { id: row.id },
    data: { data: JSON.parse(patched) },
  });
  hits++;
  console.log(`   ✏ id ${row.id} — terms.definitions updated`);
}

console.log(`\n✅ Done. ${hits} row(s) updated.`);
await prisma.$disconnect();
