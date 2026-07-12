/**
 * Read-only: dump current legal strings from dev DB before we mutate.
 * Run: node scripts/inspect-legal-current.mjs
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";

const line = readFileSync(".env.local", "utf8")
  .split("\n")
  .find((l) => l.trim().startsWith("DATABASE_URL="));
const url = line.split("=").slice(1).join("=").trim().replace(/^"(.*)"$/, "$1");
if (!url.includes("modonty_dev")) {
  throw new Error(`REFUSING: not dev → ${url.split("@")[1]?.split("?")[0]}`);
}
console.log(`✅ ${url.split("@")[1]?.split("?")[0]}\n`);
const prisma = new PrismaClient({ datasources: { db: { url } } });

const rows = await prisma.landingSection.findMany({
  where: { section: { in: ["privacy", "terms", "about"] } },
});

for (const row of rows) {
  console.log(`\n═══ ${row.section} ═══`);
  const s = JSON.stringify(row.data);
  const patterns = [
    /شركة [^\s،.·)(]+ [^\s،.·)(]+(?:\s+[^\s،.·)(]+)?/g,
    /السجل التجاري[^\n]{0,30}/g,
    /الرقم الموحّد[^\n]{0,30}/g,
    /٤٠٣٠[٠-٩]+/g,
    /7036024383/g,
  ];
  for (const re of patterns) {
    const matches = s.match(re);
    if (matches) {
      const uniq = [...new Set(matches)];
      uniq.forEach((m) => console.log(`  · ${m}`));
    }
  }
  if (row.section === "about" && row.data?.legalInfo) {
    console.log("  legalInfo:", JSON.stringify(row.data.legalInfo, null, 2));
  }
}

await prisma.$disconnect();
