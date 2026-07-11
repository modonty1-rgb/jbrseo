// WRITE: SEO description uses {clientCount} placeholder — code interpolates live.
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

const NEW = 'محتوى شهري احترافي يبني حضورك في محركات البحث والذكاء الاصطناعي. {clientCount} علامة تجارية تعتمد علينا لصناعة حضورها الرقمي.';

const client = new MongoClient(url);
await client.connect();
const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('BEFORE:', JSON.stringify(before?.data?.description));

const res = await db.collection('LandingSection').updateOne(
  { section: 'seo' },
  { $set: { 'data.description': NEW, updatedAt: new Date() } },
);
console.log('matched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('AFTER: ', JSON.stringify(after?.data?.description));

await client.close();
