/**
 * Replace "إلغاء في أي وقت" / "تلغي امتى ما تحب" with "رفع الباقة بضغطة زر"
 * inside the hero section override (SA + EG) in MongoDB.
 *
 * Run: node scripts/fix-hero-cancel-phrase.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REPLACEMENTS = {
  SA: { from: "إلغاء في أي وقت", to: "رفع الباقة بضغطة زر" },
  EG: { from: "تلغي امتى ما تحب", to: "ترقّي الباقة بضغطة زر" },
};

async function main() {
  const rows = await prisma.landingSection.findMany({ where: { section: "hero" } });
  for (const row of rows) {
    const { from, to } = REPLACEMENTS[row.country] ?? {};
    if (!from) continue;
    const json = JSON.stringify(row.data);
    if (!json.includes(from)) {
      console.log(`[${row.country}] no match for "${from}" — skipping`);
      continue;
    }
    const replaced = JSON.parse(json.split(from).join(to));
    await prisma.landingSection.update({
      where: { id: row.id },
      data: { data: replaced },
    });
    console.log(`[${row.country}] hero updated: "${from}" → "${to}"`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
