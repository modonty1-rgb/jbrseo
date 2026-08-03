// Fast landing-content editor — writes directly to the LandingSection table
// (one row per section, `data` = JSON). Much faster than the admin UI.
//
// SAFETY: prints the target DB name first + a before/after diff per section.
// Preview without writing:  DRY_RUN=1 DATABASE_URL="<url>" node scripts/edit-landing.mjs
// Apply:                             DATABASE_URL="<url>" node scripts/edit-landing.mjs
//
// Each edit reads the current section JSON, runs `apply(data)` to mutate it,
// and upserts the whole object back. Fill EDITS per run.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const dbUrl = process.env.DATABASE_URL || "";
const dbName = dbUrl.split("/").pop()?.split("?")[0] || "UNKNOWN";
const DRY = process.env.DRY_RUN === "1";

console.log(`=== edit-landing · ${DRY ? "DRY RUN (no write)" : "WRITE"} · DB: ${dbName} ===`);

// ─────────────────────────────────────────────────────────────────────────
// EDITS — define what to change (one entry per section). `apply` receives a
// deep clone of the current section data and returns the modified object.
// ─────────────────────────────────────────────────────────────────────────
const EDITS = [
  // {
  //   section: "socialProof",
  //   apply: (d) => {
  //     d.testimonials[0].quote = "…";
  //     return d;
  //   },
  // },
];

if (EDITS.length === 0) {
  // No edits defined → inspect mode: dump every section so you can see paths.
  const rows = await prisma.landingSection.findMany();
  console.log(`\n(no EDITS defined — inspect mode, ${rows.length} sections)\n`);
  for (const r of rows) {
    console.log(`── ${r.section} ──`);
    console.log(JSON.stringify(r.data));
    console.log("");
  }
} else {
  for (const { section, apply } of EDITS) {
    const row = await prisma.landingSection.findUnique({ where: { section } });
    const before = row?.data ?? {};
    const after = apply(structuredClone(before));
    console.log(`\n── ${section} ──`);
    console.log("BEFORE:", JSON.stringify(before));
    console.log("AFTER :", JSON.stringify(after));
    if (!DRY) {
      await prisma.landingSection.upsert({
        where: { section },
        create: { section, data: after },
        update: { data: after },
      });
      console.log("✅ written");
    }
  }
}

await prisma.$disconnect();
console.log(DRY ? "\n(dry run — nothing written)" : "\n✅ done");
