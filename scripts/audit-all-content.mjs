// READ-ONLY: Full inventory of all content in DB (LandingSection + Plan + PriceSectionMeta).
// Zero writes. Safe on any DB.
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; })
);

const client = new MongoClient(env.DATABASE_URL);
await client.connect();
const db = client.db();
const dbName = env.DATABASE_URL.match(/\.net\/([^?]+)/)?.[1];

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log(`║  CONTENT INVENTORY · DB: ${dbName.padEnd(35)}║`);
console.log('╚══════════════════════════════════════════════════════════════╝\n');

// ═══ LandingSection ═══════════════════════════════════════════════
console.log('┌─ LandingSection (all sections) ───────────────────────────────');
const sections = await db.collection('LandingSection').find({}).toArray();
console.log(`│  Total sections: ${sections.length}\n`);
for (const s of sections) {
  console.log(`\n▸ SECTION: ${s.section}`);
  console.log(JSON.stringify(s.data, null, 2));
}

// ═══ Plan ═══════════════════════════════════════════════════════════
console.log('\n\n┌─ Plan (pricing plans, per country) ──────────────────────────');
const plans = await db.collection('Plan').find({}).sort({ country: 1, displayOrder: 1 }).toArray();
console.log(`│  Total plans: ${plans.length}\n`);
for (const p of plans) {
  console.log(`\n▸ [${p.country}] ${p.slug} · displayOrder=${p.displayOrder}`);
  console.log(`  name:          "${p.name}"`);
  console.log(`  tagline:       "${p.tagline}"`);
  console.log(`  priceMonthly:  ${p.priceMonthly}`);
  console.log(`  priceYearly:   ${p.priceYearly}`);
  console.log(`  articlesLabel: "${p.articlesLabel}"`);
  console.log(`  ctaText:       "${p.ctaText}"`);
  console.log(`  hook:          "${p.hook ?? ''}"`);
  console.log(`  badge:         "${p.badge ?? ''}"`);
  console.log(`  featuredBadge: "${p.featuredBadge ?? ''}"`);
  console.log(`  highlights:`);
  (p.highlights ?? []).forEach((h, i) => console.log(`    ${i + 1}. ${h}`));
}

// ═══ PriceSectionMeta ═══════════════════════════════════════════════
console.log('\n\n┌─ PriceSectionMeta (per country) ─────────────────────────────');
const metas = await db.collection('PriceSectionMeta').find({}).toArray();
console.log(`│  Total: ${metas.length}\n`);
for (const m of metas) {
  console.log(`\n▸ [${m.country}]`);
  console.log(`  announcement:    "${m.announcement ?? ''}"`);
  console.log(`  ctaHeadline:     "${m.ctaHeadline ?? ''}"`);
  console.log(`  ctaSubheadline:  "${m.ctaSubheadline ?? ''}"`);
  console.log(`  trustItems:      ${JSON.stringify(m.trustItems)}`);
  console.log(`  uiStrings:       ${JSON.stringify(m.uiStrings)}`);
}

// ═══ SiteSettings ═══════════════════════════════════════════════════
console.log('\n\n┌─ SiteSettings ─────────────────────────────────────────────');
const settings = await db.collection('SiteSettings').find({}).toArray();
for (const s of settings) {
  console.log(JSON.stringify(s, null, 2));
}

await client.close();
console.log('\n\n═══ END OF INVENTORY ═══');
