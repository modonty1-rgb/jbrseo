#!/usr/bin/env node
/**
 * Fix false-claim contradictions between marketing copy and /terms:
 *   1. hero.trust[1] = "ضمان استرجاع ١٤ يوم" contradicts new /terms "لا استرجاع أموال".
 *      → Replace with the real, everywhere-else offer: "٦ شهور هدية على السنوي".
 *   2. FAQ Q17 answer ends without any Modonty subscription push — talks only about SEO
 *      as an industry. Per Khalid's rule: every answer nudges toward اشتراك مدونتي.
 *
 * Runs against WHICHEVER DB is in the env — pass DB_TARGET=dev|prod to select.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const target = process.env.DB_TARGET === "prod" ? "prod" : "dev";
const confirm = process.argv.includes("--confirm=YES");

const envFile = target === "prod" ? ".env" : ".env.local";
const envRaw = readFileSync(path.resolve(here, "..", envFile), "utf8");
const url = envRaw.match(/^DATABASE_URL\s*=\s*"([^"]+)"/m)?.[1] ?? "";
const dbName = url.match(/mongodb\+srv:\/\/[^/]+\/([^?]+)/)?.[1] ?? "";

const expectedDb = target === "prod" ? "modonty" : "modonty_dev";
if (dbName !== expectedDb) {
  console.error(`❌ Refusing: DB is "${dbName}", expected "${expectedDb}" (target=${target}).`);
  process.exit(2);
}

console.log(`Target:  ${dbName} (${target})`);
console.log(`Mode:    ${confirm ? "🚨 WRITE" : "🔍 DRY-RUN"}`);
console.log("");

process.env.DATABASE_URL = url;
const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient();

try {
  // ─── FIX 1: hero.trust ──────────────────────────────────
  const hero = await prisma.landingSection.findFirst({ where: { section: "hero" } });
  if (hero) {
    const data = hero.data ?? {};
    const trust = Array.isArray(data.trust) ? [...data.trust] : [];
    const before = [...trust];
    const idx = trust.findIndex((t) => /استرجاع/.test(t));
    if (idx >= 0) {
      trust[idx] = "٦ شهور هدية على السنوي";
      console.log(`FIX 1 (hero.trust):`);
      console.log(`  BEFORE: ${JSON.stringify(before)}`);
      console.log(`  AFTER:  ${JSON.stringify(trust)}`);
      if (confirm) {
        await prisma.landingSection.update({
          where: { section: "hero" },
          data: { data: { ...data, trust } },
        });
      }
    } else {
      console.log(`FIX 1 (hero.trust): no استرجاع claim found — skipping.`);
      console.log(`  Current: ${JSON.stringify(trust)}`);
    }
    console.log("");
  }

  // ─── FIX 2: FAQ Q17 CTA ─────────────────────────────────
  const faq = await prisma.landingSection.findFirst({ where: { section: "faq" } });
  if (faq) {
    const data = faq.data ?? {};
    const faqs = Array.isArray(data.faqs) ? [...data.faqs] : [];
    const q17 = faqs[16];
    if (q17 && !q17.a.includes("اشتراك مدونتي")) {
      const cta =
        "\n\n**تفاصيل تقنية معقدة؟** ما تحتاج تدخل فيها — اشتراك مدونتي يتولّى السيو + AEO عن نشاطك كامل.";
      const newA = q17.a + cta;
      console.log(`FIX 2 (FAQ Q17):`);
      console.log(`  BEFORE (last 60): ...${q17.a.slice(-60)}`);
      console.log(`  APPENDING: ${cta.slice(0, 100)}...`);
      faqs[16] = { ...q17, a: newA };
      if (confirm) {
        await prisma.landingSection.update({
          where: { section: "faq" },
          data: { data: { ...data, faqs } },
        });
      }
    } else if (q17?.a.includes("اشتراك مدونتي")) {
      console.log(`FIX 2 (FAQ Q17): already has "اشتراك مدونتي" CTA — skipping.`);
    } else {
      console.log(`FIX 2 (FAQ Q17): Q17 not found — skipping.`);
    }
    console.log("");
  }

  if (!confirm) {
    console.log("🔍 Dry-run — re-run with --confirm=YES to write.");
  } else {
    console.log("✅ Fixes applied.");
  }
} finally {
  await prisma.$disconnect();
}
