/**
 * One-time fix: upsert EG seo section with correct canonical URL.
 * Before: no EG seo override → canonical falls back to https://www.jbrseo.com (wrong)
 * After:  canonical = https://www.jbrseo.com/eg
 *
 * Run: node scripts/fix-eg-canonical.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.landingSection.upsert({
    where: { country_section: { country: "EG", section: "seo" } },
    create: {
      country: "EG",
      section: "seo",
      data: { canonical: "https://www.jbrseo.com/eg" },
    },
    update: {
      data: { canonical: "https://www.jbrseo.com/eg" },
    },
  });

  console.log("Done:", JSON.stringify(result, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
