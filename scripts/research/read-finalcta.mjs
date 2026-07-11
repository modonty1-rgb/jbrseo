#!/usr/bin/env node
/** Read-only: dump finalCta LandingSection from dev DB. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const here = path.dirname(fileURLToPath(import.meta.url));
const envRaw = readFileSync(path.resolve(here, "..", "..", ".env.local"), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";
if (dbName !== "modonty_dev") { console.error(`❌ dbName is "${dbName}", expected modonty_dev`); process.exit(2); }
process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();
const row = await prisma.landingSection.findUnique({ where: { section: "finalCta" } });
console.log(JSON.stringify(row?.data ?? "NULL", null, 2));
await prisma.$disconnect();
