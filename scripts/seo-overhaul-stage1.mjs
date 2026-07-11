// Stage 1 · C-01 + C-02 : SEO section (title + description)
import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => { const [k, ...r] = l.split('='); return [k.trim(), r.join('=').trim().replace(/^"|"$/g, '')]; }));

const url = env.DATABASE_URL;
if ((url.match(/\.net\/([^?]+)/)?.[1]) !== 'modonty_dev') {
  console.error('SAFETY GUARD: modonty_dev only'); process.exit(1);
}

const NEW_TITLE = 'أفضل شركة سيو في السعودية · اشتراك محتوى شهري للبحث و AI | JBRSEO';
const NEW_DESC = 'اشتراك محتوى سيو شهري للسوق السعودي — نكتب وننشر ونحسّن للبحث والذكاء الاصطناعي. {clientCount} علامة تجارية تعتمد علينا.';

const client = new MongoClient(url);
await client.connect();
const db = client.db();

const before = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('BEFORE title:', JSON.stringify(before?.data?.title));
console.log('BEFORE desc: ', JSON.stringify(before?.data?.description));

const res = await db.collection('LandingSection').updateOne(
  { section: 'seo' },
  { $set: { 'data.title': NEW_TITLE, 'data.description': NEW_DESC, updatedAt: new Date() } },
);
console.log('\nmatched:', res.matchedCount, 'modified:', res.modifiedCount);

const after = await db.collection('LandingSection').findOne({ section: 'seo' });
console.log('\nAFTER title:', JSON.stringify(after?.data?.title));
console.log('AFTER desc: ', JSON.stringify(after?.data?.description));

await client.close();
