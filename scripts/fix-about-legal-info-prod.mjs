/**
 * PRODUCTION mirror of fix-about-legal-info.mjs
 * Requires PROD_DATABASE_URL env var. Refuses without it or if it's dev.
 *
 * Run:
 *   $env:PROD_DATABASE_URL="mongodb+srv://...modonty?..."
 *   node scripts/fix-about-legal-info-prod.mjs
 */
import { PrismaClient } from "@prisma/client";

const url = process.env.PROD_DATABASE_URL;
if (!url) throw new Error("PROD_DATABASE_URL not set");
if (url.includes("modonty_dev")) throw new Error("URL is dev, not prod. Aborting.");
if (!url.includes("/modonty?")) {
  throw new Error(`URL does not target modonty DB: ${url.split("@")[1]?.split("?")[0]}`);
}

console.log(`⚠️  TARGETING PRODUCTION: ${url.split("@")[1]?.split("?")[0]}`);
console.log(`⏳ Starting in 5s — Ctrl+C to abort NOW.\n`);
await new Promise((r) => setTimeout(r, 5000));

const prisma = new PrismaClient({ datasources: { db: { url } } });
const row = await prisma.landingSection.findFirst({ where: { section: "about" } });
if (!row) throw new Error("No 'about' row in PROD LandingSection");

const before = row.data?.legalInfo ?? {};
console.log("BEFORE:");
console.log(`  legalName: ${before.legalName ?? "(missing)"}`);
console.log(`  phone:     ${before.phone ?? "(missing)"}`);

const nextData = {
  ...row.data,
  legalInfo: {
    ...before,
    legalName: "شركة جبر الجنوبية",
    phone: "",
  },
};

await prisma.landingSection.update({
  where: { id: row.id },
  data: { data: nextData },
});

console.log("\nAFTER:");
console.log(`  legalName: ${nextData.legalInfo.legalName}`);
console.log(`  phone:     "${nextData.legalInfo.phone}"`);
console.log("\n✅ PROD updated.");
await prisma.$disconnect();
