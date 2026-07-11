#!/usr/bin/env node
/**
 * DEV: Upsert featuresComparison LandingSection.
 * Data source: scripts/research/features-comparison-data.mjs
 * Guarded to modonty_dev.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { featuresCatalog as featuresComparisonData } from "../lib/features-catalog.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", ".env.local"), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

if (dbName !== "modonty_dev") {
  console.error(`❌ Refusing: DB is "${dbName}", expected "modonty_dev".`);
  process.exit(2);
}

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "featuresComparison" } });
  console.log(`Before: ${before?.data ? "exists" : "missing"}`);

  await prisma.landingSection.upsert({
    where: { section: "featuresComparison" },
    create: { section: "featuresComparison", data: featuresComparisonData },
    update: { data: featuresComparisonData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "featuresComparison" } });
  console.log(`After:  ${after?.data?.rows?.length ?? 0} comparison rows`);
  console.log("\n✅ featuresComparison updated.");
} finally {
  await prisma.$disconnect();
}
