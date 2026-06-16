/**
 * Inspect ALL data currently in MongoDB.
 * No assumptions from static fallback files — only what's actually persisted.
 *
 * Run: node scripts/inspect-db.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function describe(value, depth = 0, maxDepth = 6) {
  if (depth > maxDepth) return { type: "(too-deep)" };
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) {
    return {
      type: "array",
      length: value.length,
      sample: value.length > 0 ? describe(value[0], depth + 1, maxDepth) : null,
    };
  }
  if (typeof value === "object") {
    const out = { type: "object", keys: {} };
    for (const k of Object.keys(value)) {
      out.keys[k] = describe(value[k], depth + 1, maxDepth);
    }
    return out;
  }
  if (typeof value === "string") {
    return { type: "string", length: value.length, preview: value.slice(0, 60) };
  }
  return { type: typeof value, value };
}

function indent(n) {
  return "  ".repeat(n);
}

function printShape(shape, depth = 0) {
  if (!shape) return;
  if (shape.type === "object") {
    for (const [k, v] of Object.entries(shape.keys)) {
      const summary =
        v.type === "string"
          ? `string(${v.length})`
          : v.type === "array"
            ? `array(${v.length})`
            : v.type === "object"
              ? `object{${Object.keys(v.keys).length}}`
              : v.type;
      console.log(`${indent(depth)}- ${k}: ${summary}${v.type === "string" && v.preview ? ` "${v.preview}${v.length > 60 ? "…" : ""}"` : ""}`);
      if (v.type === "object" || v.type === "array") {
        printShape(v.type === "array" ? (v.sample ?? null) : v, depth + 1);
      }
    }
  } else if (shape.type === "array" && shape.sample) {
    console.log(`${indent(depth)}[0]:`);
    printShape(shape.sample, depth + 1);
  }
}

async function main() {
  console.log("\n████████████████████████████████████████████████████████");
  console.log("████  jbrseo.com — DATABASE INSPECTION REPORT       ████");
  console.log("████████████████████████████████████████████████████████\n");

  // 1. SiteSettings
  const settings = await prisma.siteSettings.findMany();
  console.log("══════════════════════════════════════════");
  console.log(`▶ SiteSettings  (${settings.length} rows)`);
  console.log("══════════════════════════════════════════");
  for (const s of settings) {
    console.log(`  id: ${s.id}`);
    console.log(`  gtmId: "${s.gtmId}"`);
    console.log(`  whatsappNumber: "${s.whatsappNumber}"`);
    console.log(`  updatedAt: ${s.updatedAt.toISOString()}`);
  }
  if (settings.length === 0) console.log("  (empty)");

  // 2. Subscriber count + breakdown
  console.log("\n══════════════════════════════════════════");
  console.log("▶ Subscriber");
  console.log("══════════════════════════════════════════");
  const totalSubs = await prisma.subscriber.count();
  const subsByCountry = await prisma.subscriber.groupBy({
    by: ["country"],
    _count: true,
  });
  console.log(`  total: ${totalSubs}`);
  for (const r of subsByCountry) console.log(`    ${r.country}: ${r._count}`);

  // 3. ExitReason count + breakdown
  console.log("\n══════════════════════════════════════════");
  console.log("▶ ExitReason");
  console.log("══════════════════════════════════════════");
  const totalExit = await prisma.exitReason.count();
  const exitByReason = await prisma.exitReason.groupBy({
    by: ["reason"],
    _count: true,
    orderBy: { _count: { reason: "desc" } },
  });
  console.log(`  total: ${totalExit}`);
  for (const r of exitByReason) console.log(`    ${r.reason}: ${r._count}`);

  // 4. LandingSection — full shape per (country, section)
  console.log("\n══════════════════════════════════════════");
  console.log("▶ LandingSection — full shape");
  console.log("══════════════════════════════════════════");
  const all = await prisma.landingSection.findMany({
    orderBy: [{ section: "asc" }, { country: "asc" }],
  });

  // Group by section
  const bySection = {};
  for (const r of all) {
    bySection[r.section] = bySection[r.section] || [];
    bySection[r.section].push(r);
  }

  for (const [section, rows] of Object.entries(bySection)) {
    console.log("\n────────────────────────────────────────────");
    console.log(`◉ section = "${section}"  (${rows.length} country rows)`);
    console.log("────────────────────────────────────────────");
    for (const r of rows) {
      const sizeBytes = JSON.stringify(r.data).length;
      console.log(`\n  ┌── country: ${r.country}`);
      console.log(`  │   updatedAt: ${r.updatedAt.toISOString()}`);
      console.log(`  │   size: ${sizeBytes} bytes`);
      console.log(`  └── shape:`);
      const shape = describe(r.data);
      printShape(shape, 2);
    }

    // Schema drift detection: compare keys across countries
    if (rows.length === 2) {
      const [a, b] = rows;
      const keysA = new Set(Object.keys(a.data || {}));
      const keysB = new Set(Object.keys(b.data || {}));
      const onlyInA = [...keysA].filter((k) => !keysB.has(k));
      const onlyInB = [...keysB].filter((k) => !keysA.has(k));
      if (onlyInA.length || onlyInB.length) {
        console.log(`\n  ⚠ DRIFT detected for "${section}":`);
        if (onlyInA.length) console.log(`    only in ${a.country}: ${onlyInA.join(", ")}`);
        if (onlyInB.length) console.log(`    only in ${b.country}: ${onlyInB.join(", ")}`);
      }
    } else if (rows.length === 1) {
      console.log(`\n  ⚠ MISSING the other country for "${section}" — only ${rows[0].country} has data.`);
    }
  }

  // 5. Summary
  console.log("\n\n████████████████████████████████████████████████████████");
  console.log("████  SUMMARY                                      ████");
  console.log("████████████████████████████████████████████████████████");
  console.log(`  • SiteSettings rows:    ${settings.length}`);
  console.log(`  • Subscriber rows:      ${totalSubs}`);
  console.log(`  • ExitReason rows:      ${totalExit}`);
  console.log(`  • LandingSection rows:  ${all.length}`);
  console.log(`  • Distinct sections:    ${Object.keys(bySection).length}`);

  const sectionsWithBothCountries = Object.entries(bySection).filter(([, rows]) => rows.length === 2);
  const sectionsOneCountryOnly = Object.entries(bySection).filter(([, rows]) => rows.length === 1);
  console.log(`  • Sections in BOTH SA+EG: ${sectionsWithBothCountries.length}`);
  console.log(`  • Sections in ONE country only: ${sectionsOneCountryOnly.length}`);
  if (sectionsOneCountryOnly.length) {
    console.log("    →", sectionsOneCountryOnly.map(([s, r]) => `${s}(${r[0].country})`).join(", "));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
