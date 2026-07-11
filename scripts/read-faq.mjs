#!/usr/bin/env node
/** Read current FAQ section from DB (guarded to dev). Read-only. */

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

try {
  const row = await prisma.landingSection.findUnique({ where: { section: "faq" } });
  if (!row) {
    console.log("No FAQ row in DB.");
  } else {
    console.log(JSON.stringify(row.data, null, 2));
  }
} finally {
  await prisma.$disconnect();
}
