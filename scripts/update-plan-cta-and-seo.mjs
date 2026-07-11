// WRITE: per-plan ctaText + SEO description in DEV DB only.
// Prod DB is updated via admin UI (/admin/pricing and /admin/settings/seo).
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; })
);

const url = env.DATABASE_URL;
const dbName = url.match(/\.net\/([^?]+)/)?.[1];
if (dbName !== 'modonty_dev') {
  console.error(`SAFETY GUARD: only modonty_dev — refusing ${dbName}`);
  process.exit(1);
}

// Per-plan CTA — each plan gets its own action-oriented text tied to the plan name.
const NEW_PLAN_CTA_BY_SLUG = {
  presence: 'ابدأ بالحضور',
  starter:  'ابدأ بالانطلاقة',
  growth:   'ابدأ بالزخم',
  scale:    'ابدأ بالريادة',
};

const NEW_SEO_DESCRIPTION =
  'محتوى شهري احترافي يبني حضورك في محركات البحث والذكاء الاصطناعي. ٢٦ علامة تجارية تعتمد علينا لصناعة حضورها الرقمي.';

const client = new MongoClient(url);
await client.connect();
const db = client.db();

// ── 1. Plan.ctaText per plan (both SA + EG) ────────────────────────
console.log('=== Plans (before) ===');
const before = await db.collection('Plan').find({}).project({ country: 1, slug: 1, name: 1, ctaText: 1 }).toArray();
before.forEach(p => console.log(`  [${p.country}] ${p.slug} · "${p.name}" → "${p.ctaText ?? ''}"`));

let planMatched = 0, planModified = 0;
for (const [slug, newCta] of Object.entries(NEW_PLAN_CTA_BY_SLUG)) {
  const r = await db.collection('Plan').updateMany(
    { slug },
    { $set: { ctaText: newCta, updatedAt: new Date() } },
  );
  planMatched += r.matchedCount;
  planModified += r.modifiedCount;
}
console.log(`\nplan updates: matched=${planMatched} modified=${planModified}`);

console.log('\n=== Plans (after) ===');
const after = await db.collection('Plan').find({}).project({ country: 1, slug: 1, name: 1, ctaText: 1 }).toArray();
after.forEach(p => console.log(`  [${p.country}] ${p.slug} · "${p.name}" → "${p.ctaText ?? ''}"`));

// ── 2. LandingSection.section="seo" description ────────────────────
console.log('\n=== SEO (before) ===');
const seoBefore = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('  description:', JSON.stringify(seoBefore?.data?.description));

const seoRes = await db.collection('LandingSection').updateOne(
  { section: 'seo' },
  { $set: { 'data.description': NEW_SEO_DESCRIPTION, updatedAt: new Date() } },
);
console.log(`\nseo update: matched=${seoRes.matchedCount} modified=${seoRes.modifiedCount}`);

const seoAfter = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('\n=== SEO (after) ===');
console.log('  description:', JSON.stringify(seoAfter?.data?.description));

await client.close();
