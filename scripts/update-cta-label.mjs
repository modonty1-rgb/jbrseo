// WRITE: update ctaLabel in DEV DB to the new honest hook.
// Prod DB must be updated separately via admin UI: /admin/content/hero
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n').filter(l => l.includes('='))
    .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; })
);

const url = env.DATABASE_URL;
const dbName = url.match(/\.net\/([^?]+)/)?.[1];
if (dbName !== 'modonty_dev') {
  console.error(`SAFETY GUARD: this script only runs on modonty_dev — refusing to update ${dbName}`);
  process.exit(1);
}

const NEW_CTA = 'ابدأ حضورك — بدون بطاقة';

const client = new MongoClient(url);
await client.connect();
const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'ctaLabel' });
console.log('BEFORE:', JSON.stringify(before?.data));

const result = await db.collection('LandingSection').updateOne(
  { section: 'ctaLabel' },
  { $set: { 'data.ctaLabel': NEW_CTA, updatedAt: new Date() } },
);
console.log('matched:', result.matchedCount, 'modified:', result.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'ctaLabel' });
console.log('AFTER: ', JSON.stringify(after?.data));

await client.close();
