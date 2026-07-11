// READ-ONLY: audit Plan.ctaText + LandingSection seo before writing
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
console.log('DB:', env.DATABASE_URL.match(/\.net\/([^?]+)/)?.[1]);

console.log('\n=== Plans ===');
const plans = await db.collection('Plan').find({}).project({ name: 1, slug: 1, country: 1, ctaText: 1 }).toArray();
plans.forEach(p => console.log(`  [${p.country}] ${p.slug} · name="${p.name}" · ctaText="${p.ctaText ?? '(empty)'}"`));

console.log('\n=== SEO section ===');
const seo = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('  data:', JSON.stringify(seo?.data, null, 2));

await client.close();
