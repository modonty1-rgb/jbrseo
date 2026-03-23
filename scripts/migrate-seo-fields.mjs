/**
 * One-time migration: strips dead SEO fields from LandingSection documents.
 * Before: data had 15 fields (ogTitle, ogDescription, twitterTitle, etc.)
 * After:  data has 5 fields only: title, description, canonical, ogImage, ogLocale
 *
 * Run: node scripts/migrate-seo-fields.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.landingSection.findMany({
    where: { section: "seo" },
  });

  if (rows.length === 0) {
    console.log("No seo rows found — nothing to migrate.");
    return;
  }

  for (const row of rows) {
    const data = row.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      console.log(`Skipping row ${row.id} (unexpected data shape).`);
      continue;
    }

    const d = data;
    const slimmed = {
      title:       typeof d.title === "string"       ? d.title       : "",
      description: typeof d.description === "string" ? d.description : "",
      canonical:   typeof d.canonical === "string"   ? d.canonical   : "",
      ogImage:     typeof d.ogImage === "string"     ? d.ogImage     : "",
      ogLocale:    typeof d.ogLocale === "string"    ? d.ogLocale    : (row.country === "EG" ? "ar_EG" : "ar_SA"),
    };

    await prisma.landingSection.update({
      where: { id: row.id },
      data: { data: slimmed },
    });

    console.log(`Migrated [${row.country}] — kept: ${JSON.stringify(slimmed)}`);
  }

  console.log(`Done. Migrated ${rows.length} row(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
