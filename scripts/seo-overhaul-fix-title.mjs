// Fix: remove "| JBRSEO" from DB title (Next.js template appends it automatically)
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));
const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') { console.error('SAFETY GUARD'); process.exit(1); }

const client = new MongoClient(url); await client.connect(); const db = client.db();

await db.collection('LandingSection').updateOne(
  { section: 'seo' },
  { $set: { 'data.title': 'أفضل شركة سيو في السعودية · اشتراك محتوى شهري للبحث و AI', updatedAt: new Date() } },
);
await db.collection('LandingSection').updateOne(
  { section: 'pricingPage' },
  { $set: { 'data.title': 'أسعار خدمات السيو في السعودية · اشتراك شهري من 110 ريال', updatedAt: new Date() } },
);
const seo = await db.collection('LandingSection').findOne({ section: 'seo' });
const pp = await db.collection('LandingSection').findOne({ section: 'pricingPage' });
console.log('seo.title:', JSON.stringify(seo?.data?.title));
console.log('pricingPage.title:', JSON.stringify(pp?.data?.title));

await client.close();
