/**
 * One-off: copy Plan rows from local dev DB → production DB.
 *
 * Why: prod DB (`modonty`) has 0 Plan rows, so /sa and /eg pricing renders empty.
 * Local dev DB (`modonty_dev`) has the 8 plans we want live.
 *
 * USAGE:
 *   1. Read the script. Confirm you trust what it does.
 *   2. Set the SOURCE_URL and TARGET_URL env vars (script refuses any other source).
 *   3. Set `CONFIRM_PROD_WRITE=YES` to actually write (default is dry-run preview).
 *
 * Example (PowerShell):
 *   $env:SOURCE_URL="mongodb+srv://…/modonty_dev?…"
 *   $env:TARGET_URL="mongodb+srv://…/modonty?…"
 *   $env:CONFIRM_PROD_WRITE="YES"
 *   pnpm exec tsx scripts/copy-plans-local-to-prod.ts
 *
 * Safety:
 *   - Source URL MUST end with `/modonty_dev` (or contain `_dev`).
 *   - Target URL MUST end with `/modonty` (real prod DB name).
 *   - Refuses to run if you forget either, or if they're identical.
 *   - Without `CONFIRM_PROD_WRITE=YES` it only prints what it WOULD copy.
 *   - Upserts by (country, slug) — re-running is idempotent.
 *   - With `PRUNE_ORPHANS=YES`, deletes target rows whose (country, slug) isn't in source.
 *     Without this flag, never deletes.
 */

import { PrismaClient } from "@prisma/client";

const SOURCE_URL = process.env.SOURCE_URL;
const TARGET_URL = process.env.TARGET_URL;
const CONFIRM = process.env.CONFIRM_PROD_WRITE === "YES";
const PRUNE = process.env.PRUNE_ORPHANS === "YES";

function dbNameFromUrl(url: string): string {
  const match = url.match(/\/([^/?]+)(\?|$)/);
  return match ? match[1] : "(unknown)";
}

function abort(msg: string): never {
  console.error(`\n❌ ABORT: ${msg}\n`);
  process.exit(1);
}

if (!SOURCE_URL) abort("SOURCE_URL env var is required (the LOCAL dev DB URL).");
if (!TARGET_URL) abort("TARGET_URL env var is required (the PRODUCTION DB URL).");
if (SOURCE_URL === TARGET_URL) abort("SOURCE_URL and TARGET_URL are identical — refusing.");

const sourceDb = dbNameFromUrl(SOURCE_URL);
const targetDb = dbNameFromUrl(TARGET_URL);

if (!sourceDb.includes("_dev")) {
  abort(`SOURCE DB name "${sourceDb}" does not contain "_dev" — refusing (this script only copies FROM a dev DB).`);
}
if (targetDb !== "modonty") {
  abort(`TARGET DB name "${targetDb}" is not "modonty" — refusing (this script only writes to the production DB named "modonty").`);
}

console.log("=".repeat(60));
console.log("Plan copy script");
console.log("=".repeat(60));
console.log(`  FROM (source / read):   DB = ${sourceDb}`);
console.log(`  TO   (target / write):  DB = ${targetDb}`);
console.log(`  Mode:                   ${CONFIRM ? "🟥 LIVE WRITE" : "🟩 DRY RUN (no writes)"}`);
console.log(`  Prune orphans:          ${PRUNE ? "YES (delete target rows missing from source)" : "no"}`);
console.log("=".repeat(60));

async function main() {
  const source = new PrismaClient({ datasources: { db: { url: SOURCE_URL! } } });
  const target = new PrismaClient({ datasources: { db: { url: TARGET_URL! } } });

  try {
    const sourcePlans = await source.plan.findMany({
      orderBy: [{ country: "asc" }, { displayOrder: "asc" }],
    });
    console.log(`\nFound ${sourcePlans.length} plans in source.`);

    const targetBefore = await target.plan.count();
    console.log(`Target currently has ${targetBefore} plans.\n`);

    for (const plan of sourcePlans) {
      const action = CONFIRM ? "UPSERT" : "WOULD UPSERT";
      console.log(`  ${action}: ${plan.country} / ${plan.slug.padEnd(10)} | ${plan.name.padEnd(15)} | ${plan.priceMonthly}/mo`);

      if (CONFIRM) {
        await target.plan.upsert({
          where: { country_slug: { country: plan.country, slug: plan.slug } },
          create: {
            country: plan.country,
            slug: plan.slug,
            visible: plan.visible,
            displayOrder: plan.displayOrder,
            name: plan.name,
            tagline: plan.tagline,
            priceMonthly: plan.priceMonthly,
            priceYearly: plan.priceYearly,
            articlesLabel: plan.articlesLabel,
            ctaText: plan.ctaText,
            hook: plan.hook,
            highlights: plan.highlights,
            badge: plan.badge,
            featuredBadge: plan.featuredBadge,
          },
          update: {
            visible: plan.visible,
            displayOrder: plan.displayOrder,
            name: plan.name,
            tagline: plan.tagline,
            priceMonthly: plan.priceMonthly,
            priceYearly: plan.priceYearly,
            articlesLabel: plan.articlesLabel,
            ctaText: plan.ctaText,
            hook: plan.hook,
            highlights: plan.highlights,
            badge: plan.badge,
            featuredBadge: plan.featuredBadge,
          },
        });
      }
    }

    if (PRUNE) {
      const sourceKeys = new Set(sourcePlans.map(p => `${p.country}/${p.slug}`));
      const targetPlans = await target.plan.findMany({ select: { id: true, country: true, slug: true, name: true } });
      const orphans = targetPlans.filter(t => !sourceKeys.has(`${t.country}/${t.slug}`));
      console.log(`\nFound ${orphans.length} orphan rows in target (not present in source):`);
      for (const o of orphans) {
        const action = CONFIRM ? "DELETE" : "WOULD DELETE";
        console.log(`  ${action}: ${o.country} / ${o.slug} | ${o.name}`);
        if (CONFIRM) {
          await target.plan.delete({ where: { id: o.id } });
        }
      }
    }

    const targetAfter = CONFIRM ? await target.plan.count() : targetBefore;
    console.log(`\nTarget now has ${targetAfter} plans.`);

    if (!CONFIRM) {
      console.log("\n🟩 Dry run complete — no changes written.");
      console.log("   To run for real, set CONFIRM_PROD_WRITE=YES and re-run.");
    } else {
      console.log("\n✅ Live write complete.");
      console.log("   Verify: open https://jbrseo.com/sa and check the pricing section.");
    }
  } finally {
    await source.$disconnect();
    await target.$disconnect();
  }
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
