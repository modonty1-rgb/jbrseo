#!/usr/bin/env node
/**
 * DEV: Update finalCta LandingSection.
 * Fixes: (1) remove "ومبيعاتك" sales promise from title2; (2) shorten wa button.
 * Guarded to modonty_dev.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

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

const newData = {
  title1: "حضور لا وعود",
  title2: "انطلق اليوم بمحتوى احترافي يبني حضورك الرقمي",
  subtitle: "انضم لأوائل الشركات التي تختار المحتوى طريقاً للنمو — لا الإعلانات",
  wa: "كلّمنا على واتساب",
};

try {
  const before = await prisma.landingSection.findUnique({ where: { section: "finalCta" } });
  console.log("Before:", JSON.stringify(before?.data, null, 2));

  await prisma.landingSection.upsert({
    where: { section: "finalCta" },
    create: { section: "finalCta", data: newData },
    update: { data: newData },
  });

  const after = await prisma.landingSection.findUnique({ where: { section: "finalCta" } });
  console.log("\nAfter:", JSON.stringify(after?.data, null, 2));
  console.log("\n✅ finalCta updated.");
} finally {
  await prisma.$disconnect();
}
